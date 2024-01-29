package handlers

import (
	"sort"
	"time"

	"github.com/gofiber/fiber/v2"
)

type UserInfo struct {
	Username       string    `json:"username"`
	Interact       time.Time `json:"interact"`
	Coins          int       `json:"coins"`
	CompletedCount int       `json:"completed_count"`
	Rating         int       `json:"rating"`
	Me             bool      `json:"me"`
}

func (h *Handler) Leaderboard(c *fiber.Ctx) error {
	ctx := c.Context()

	userId := c.Locals("user_id").(int64)

	users, err := h.q.Users(ctx)

	if err != nil {
		return nil
	}

	uinfo := make([]UserInfo, len(users))

	for i, user := range users {
		uinfo[i].Coins = int(user.Coins)
		uinfo[i].Username = user.Username
		uinfo[i].Interact = user.Interact.Time
		// ca, err := h.q.CountAttempts(ctx, userId)

		// if err != nil {
		// 	continue
		// }

		completedAttCount, err := h.q.CompletedAttempts(ctx, user.ID)

		if err != nil {

			continue
		}

		completedCountWords, err := h.q.CountCompleted(ctx, user.ID)

		if err != nil {
			continue
		}

		uinfo[i].CompletedCount = int(completedCountWords)

		if completedCountWords == 0 {
			uinfo[i].Rating = 0
		} else {
			uinfo[i].Rating = int(completedCountWords*7 - completedAttCount)
		}
		// fmt.Println(uinfo[i], uinfo[i].Rating)
		if userId == user.ID {
			uinfo[i].Me = true
		}
	}

	sort.Slice(uinfo, func(i, j int) bool {
		return uinfo[i].Rating > uinfo[j].Rating
	})

	return c.JSON(uinfo)

}
