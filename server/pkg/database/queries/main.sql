-- name: Login :one
SELECT id
FROM users
WHERE username = $1
    AND password_hash = $2;

-- name: UserInfo :one
SELECT id,
    username,
    created,
    coins
FROM users
WHERE id = $1;

-- name: UserAttempts :many
SELECT id,
    user_word
FROM user_attempts
WHERE user_id = $1 AND word_id =$2;

-- name: CurrentWord :one
SELECT current_word();

-- name: GetWord :one
SELECT word FROM all_words WHERE id=$1;

-- name: WordId :one
SELECT id FROM all_words WHERE word=$1;

-- name: AddWord :exec
INSERT INTO all_words (word) VALUES ($1) ON CONFLICT DO NOTHING;

-- name: GenerateWord :exec
SELECT generate_word();

-- name: CheckWord :one
SELECT id FROM all_words WHERE word=$1;

-- name: CheckCompleted :one
SELECT ((SELECT word from all_words aw WHERE aw.id=$2 LIMIT 1) IN (SELECT user_word FROM user_attempts WHERE user_id=$1 AND word_id=$2));

-- name: RegisterAttempt :one
INSERT INTO user_attempts (user_id, word_id, user_word) VALUES ($1, $2, $3) RETURNING id;

-- name: AddCoins :exec
UPDATE users SET coins=coins+$2 WHERE id=$1;

-- name: History :many
SELECT ua.id, ua.word_id, ua.user_word, (SELECT word FROM all_words aw WHERE aw.id=w5.word_id LIMIT 1) AS real_word FROM words_5 w5 JOIN user_attempts ua ON w5.word_id = ua.word_id WHERE ua.user_id=$1 AND w5.word_id <> current_uncompleted($1);

-- name: WordFreq :many
 SELECT user_word, COUNT(*) AS word_count FROM user_attempts WHERE user_id=$1 AND word_id <> current_uncompleted($1) GROUP BY user_word ORDER BY word_count DESC LIMIT $2;

-- name: CountAttempts :one
SELECT COUNT(*) AS atempt_count, COUNT(DISTINCT word_id) AS word_count FROM user_attempts WHERE user_id=$1 AND word_id <> current_uncompleted($1);

-- name: CountCompleted :one
SELECT COUNT(*) FROM user_attempts ua WHERE ua.user_id=$1 AND (SELECT word from all_words aw WHERE aw.id=ua.word_id LIMIT 1)=ua.user_word;

-- name: Users :many
SELECT id, username, interact, coins FROM users;

-- name: CompletedAttempts :one
SELECT COUNT(*) AS attempt_count FROM user_attempts ua WHERE ua.user_id=$1 AND ua.word_id <> current_uncompleted($1) AND check_completed($1, ua.word_id)=TRUE;