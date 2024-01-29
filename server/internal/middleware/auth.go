package middleware

import (
	"github.com/gofiber/fiber/v2"
	"max.com/max/server/pkg/auth"
)

func Cookie(c *fiber.Ctx) error {
	token := c.Cookies("token")

	userId, err := auth.JwtVerify(token)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).SendString(err.Error())
	}

	c.Locals("user_id", userId)

	return c.Next()
}
