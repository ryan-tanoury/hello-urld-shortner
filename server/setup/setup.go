package setup

import (
	"server/apis"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/r/:redirect", apis.RedirectToMainURL)

	app.Get("/api/v1/get-urls", apis.GetAllURLS)
	app.Get("/api/v1/get-url/:id", apis.GetURL)
	app.Post("/api/v1/create-url", apis.CreateURL)
	app.Patch("/api/v1/update-url/:id", apis.UpdateURL)
	app.Delete("api/v1/delete-url/:id", apis.DeleteURL)

}

func SetupAndRun() {
	app := fiber.New()

	SetupRoutes(app)

	app.Listen(":5000")
}
