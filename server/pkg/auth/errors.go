package auth

import "errors"

var (
	ErrUserIdNotFound = errors.New("user_id not found")
	ErrUnauth         = errors.New("unauth")
)
