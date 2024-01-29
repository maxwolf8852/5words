package handlers

import (
	database "max.com/max/server/pkg/database/sqlc"
)

type Handler struct {
	q *database.Queries
}

func NewHandler(db *database.Queries) *Handler {
	return &Handler{
		q: db,
	}
}
