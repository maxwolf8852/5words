package handlers

import (
	"github.com/gofiber/fiber/v2"
	"max.com/max/server/pkg/auth"
	database "max.com/max/server/pkg/database/sqlc"
)

func (h *Handler) Login(c *fiber.Ctx) error {
	payload := struct {
		Username     string `json:"username"`
		PasswordHash string `json:"password"`
	}{}

	ctx := c.Context()

	if err := c.BodyParser(&payload); err != nil {
		return err
	}

	userId, err := h.q.Login(ctx, database.LoginParams{Username: payload.Username, PasswordHash: payload.PasswordHash})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString(err.Error())
	}

	token, err := auth.JwtCreate(userId, payload.Username)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.JSON(fiber.Map{"token": token})

}
