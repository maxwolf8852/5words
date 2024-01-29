package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jackc/pgx/v5/pgxpool"
	"max.com/max/server/internal/handlers"
	"max.com/max/server/internal/middleware"
	database "max.com/max/server/pkg/database/sqlc"
	"max.com/max/server/pkg/utils"
)

type DBConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	Name     string
}

var DbHost = utils.GetDefEnv("DB_HOST", "db")
var DbPort = utils.GetDefEnv("DB_PORT", "5432")
var DbUser = utils.GetDefEnv("DB_USER", "maxadmin")
var DbPass = utils.GetDefEnv("DB_PASS", "max3101")
var DbName = utils.GetDefEnv("DB_NAME", "main")

func NewDBConfig() DBConfig {
	return DBConfig{
		Host:     DbHost,
		Port:     DbPort,
		Username: DbUser,
		Password: DbPass,
		Name:     DbName,
	}
}

func GenerateWordTask(ctx context.Context, q *database.Queries) {
	ticker := time.NewTicker(1 * time.Second)
	for {
		select {
		case <-ctx.Done():
			fmt.Println("context finished")
			return
		case <-ticker.C:
			if time.Now().Minute() == 59 {

			}
			wordId, err := q.CurrentWord(ctx)
			if err != nil {
				panic(err)
			}
			if wordId == -1 {
				fmt.Println("generating word...")
				err = q.GenerateWord(ctx)
				if err != nil {
					fmt.Println(err)
				}
			}
		}
	}
}

func main() {

	app := fiber.New(fiber.Config{
		AppName:      "Сервер",
		Prefork:      false,
		UnescapePath: true,
		BodyLimit:    4 * 1024 * 1024 * 1024, // 4GB limit
	})

	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowHeaders:     "",                  //"Authorization,X-Requested-With,X-Request-ID,X-HTTP-Method-Override,Upload-Length,Upload-Metadata,Upload-Offset,Tus-Version,Tus-Resumable,Tus-Max-Size,Tus-Extension,Content-Length,Content-Type,Origin,Referrer,User-Agent,Upload-Concat,Upload-Defer-Length,Upload-Metadata",
		AllowOrigins:     "http://45.9.41.50", // http://45.9.41.50 http://localhost:9999  http://192.168.1.68:9999 http://10.5.7.43:9999 http://127.0.0.1:9999" TODO set to avoid CORS errors http://10.5.7.43:9999 http://127.0.0.1:9999 http://192.168.1.68:9999
		AllowCredentials: true,
		AllowMethods:     "GET,POST,PUT,HEAD,OPTIONS,DELETE,PATCH",
	}))

	ctx := context.Background()

	config := NewDBConfig()

	conninfo := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=disable", config.Username, config.Password, config.Host, config.Port, config.Name)
	db, err := pgxpool.New(ctx, conninfo)
	if err != nil {
		panic(err)
	}

	q := database.New(db)

	handler := handlers.NewHandler(q)

	ctx, cancel := context.WithCancel(context.Background())

	defer cancel()

	data := utils.ReadTxtFile("./data/all_nouns.txt")

	fmt.Println(len(data))

	for _, row := range data {
		row = strings.Replace(row, "ё", "е", -1)
		for {
			err := q.AddWord(ctx, row)
			if err != nil {
				fmt.Println(err)
				time.Sleep(1 * time.Second)
			} else {
				break
			}
		}
	}

	go GenerateWordTask(ctx, q)

	//ws := app.Group("/ws")
	//ws.Get("/main", websocket.New(handler.WsMain))

	users := app.Group("/users")
	users.Post("/login", handler.Login)
	users.Get("/leaderboard", middleware.Cookie, handler.Leaderboard)

	words := app.Group("/words", middleware.Cookie)
	words.Get("/status", handler.Status)
	words.Get("/attempt/:word", handler.Attempt)
	words.Get("/history", handler.History)
	words.Get("/statistics", handler.Statistics)

	app.Listen("0.0.0.0:8435")
}
