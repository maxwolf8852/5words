package handlers

import (
	"fmt"
	"slices"
	"unicode/utf8"

	"github.com/gofiber/fiber/v2"
	database "max.com/max/server/pkg/database/sqlc"
)

type LetterColor int

const (
	STATE_WRONG LetterColor = iota
	STATE_NOT_POSITION
	STATE_SUCCESS
)

type ColoredLetter struct {
	Color  LetterColor `json:"color"`
	Letter rune        `json:"letter"`
}

type Attempt struct {
	Attempt   int             `json:"attempt"`
	Completed bool            `json:"completed"`
	Word      []ColoredLetter `json:"word"`
}

type StatusResponse struct {
	Attempts    []Attempt `json:"attempts"`
	Coins       int64     `json:"coins"`
	CorrectWord string    `json:"correct_word"`
}

func InWord(r rune, indx int, word string) LetterColor {
	var color LetterColor = STATE_WRONG
	i := 0
	for _, r1 := range word {
		if r == r1 && color != STATE_SUCCESS {
			if i == indx {
				color = STATE_SUCCESS
			} else {
				color = STATE_NOT_POSITION
			}
		}
		i++
	}

	return color
}

func PaintAttempt(id int, realWord, userWord string) Attempt {
	out := Attempt{Attempt: id}
	if userWord == realWord {
		out.Completed = true
	}

	out.Word = make([]ColoredLetter, utf8.RuneCountInString(userWord))
	j := 0
	for _, r := range userWord {
		color := InWord(r, j, realWord)
		out.Word[j] = ColoredLetter{Letter: r, Color: color}
		j++
	}

	return out
}

func (h *Handler) Status(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(int64)

	ctx := c.Context()

	fmt.Println(userId)

	info, err := h.q.UserInfo(ctx, userId)

	if err != nil {
		return err
	}

	curWordId, err := h.q.CurrentWord(ctx)

	if err != nil {
		return err
	}

	curWord, err := h.q.GetWord(ctx, curWordId)

	if err != nil {
		return err
	}

	attempts, err := h.q.UserAttempts(ctx, database.UserAttemptsParams{UserID: userId, WordID: curWordId})
	if err != nil {
		return err
	}

	// h.q.

	fmt.Println(attempts, curWord)

	words := make([]Attempt, len(attempts))

	guessed := false

	for i, attempt := range attempts {
		if curWord == attempt.UserWord {
			guessed = true
		}
		words[i] = PaintAttempt(int(attempt.ID), curWord, attempt.UserWord)
	}

	sr := StatusResponse{Attempts: words, Coins: info.Coins}

	if len(attempts) == 6 || guessed {
		sr.CorrectWord = curWord
	}

	return c.JSON(sr)
}

func (h *Handler) Attempt(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(int64)
	word := c.Params("word", "")

	if utf8.RuneCountInString(word) != 5 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "incorrect word"})
	}

	ctx := c.Context()
	

	wfRows, err := h.q.WordFreq(ctx, database.WordFreqParams{UserID: userId, Limit: 3})
	if err != nil {

		return err
	}

	fmt.Println(userId, word)

	curWordId, err := h.q.CurrentWord(ctx)
	if err != nil {
		return err
	}

	curWord, err := h.q.GetWord(ctx, curWordId)
	if err != nil {
		return err
	}

	if slices.ContainsFunc(wfRows, func(row database.WordFreqRow) bool { return (row.UserWord == word) && (word != curWord) }) {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "wordfreq"})
	}

	if comp, err := h.q.CheckCompleted(ctx, database.CheckCompletedParams{UserID: userId, ID: curWordId}); err != nil || comp.(bool) {
		return err
	}

	wordId, err := h.q.WordId(ctx, word)

	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "incorrect word"})
	}

	fmt.Println(wordId)

	attempts, err := h.q.UserAttempts(ctx, database.UserAttemptsParams{UserID: userId, WordID: curWordId})
	if err != nil {
		return err
	}

	if len(attempts) > 5 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "incorrect word"})
	}

	for _, att := range attempts {
		if att.UserWord == word {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "incorrect word"})
		}
	}

	id, err := h.q.RegisterAttempt(ctx, database.RegisterAttemptParams{UserID: userId, WordID: curWordId, UserWord: word})

	if err != nil {
		return err
	}

	attempts, err = h.q.UserAttempts(ctx, database.UserAttemptsParams{UserID: userId, WordID: curWordId})
	if err != nil {
		return err
	}

	completed := false

	for _, attempt := range attempts {

		if attempt.UserWord == curWord {
			completed = true
			break
		}
	}

	if completed {
		err := h.q.AddCoins(ctx, database.AddCoinsParams{ID: userId, Coins: int64(7 - len(attempts))})
		if err != nil {
			return err
		}
	}

	return c.JSON(fiber.Map{"id": id})
}

type StatisticsStruct struct {
	Count     int `json:"count"`
	Completed int `json:"completed"`
}

type WordFreq struct {
	Word  string `json:"word"`
	Count int    `json:"count"`
}

type StatisticsResponse struct {
	Attempts  StatisticsStruct `json:"attempts"`
	Words     StatisticsStruct `json:"words"`
	WordFreqs []WordFreq       `json:"word_freqs"`
}

func (h *Handler) Statistics(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(int64)
	ctx := c.Context()

	wfRows, err := h.q.WordFreq(ctx, database.WordFreqParams{UserID: userId, Limit: 6})
	if err != nil {

		return err
	}

	//fmt.Println(wfRows)

	ca, err := h.q.CountAttempts(ctx, userId)

	if err != nil {
		return err
	}

	completedAttCount, err := h.q.CompletedAttempts(ctx, userId)

	if err != nil {
		return err
	}

	completedCountWords, err := h.q.CountCompleted(ctx, userId)

	if err != nil {
		return err
	}

	out := StatisticsResponse{}

	for _, row := range wfRows {
		out.WordFreqs = append(out.WordFreqs, WordFreq{Word: row.UserWord, Count: int(row.WordCount)})
	}

	out.Attempts.Completed = int(completedAttCount)
	out.Attempts.Count = int(ca.AtemptCount)
	out.Words.Count = int(ca.WordCount)
	out.Words.Completed = int(completedCountWords)

	return c.JSON(out)
}

func (h *Handler) History(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(int64)
	ctx := c.Context()

	rows, err := h.q.History(ctx, userId)
	if err != nil {
		return err
	}

	words := map[string][]Attempt{}

	for _, row := range rows {
		words[row.RealWord] = append(words[row.RealWord], PaintAttempt(int(row.ID), row.RealWord, row.UserWord))
		//fmt.Println(row, words[int(row.WordID)])
	}

	return c.JSON(words)
}
