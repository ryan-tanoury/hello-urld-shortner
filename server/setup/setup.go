package setup

import (
	"log"
	"server/model"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func GetAllURLS(ctx *fiber.Ctx) error {
	urls, err := model.GetAllURLS()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error finding all redirects",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(urls)
}

func GetURL(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error parsing id used in param",
			"error":   err.Error(),
		})
	}

	url, err := model.GetURL(id)
	if err != nil {
		ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Unable to find url",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(url)
}

func CreateURL(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var url model.Url_Short
	err := ctx.BodyParser(&url)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error creating url",
			"error":   err.Error(),
		})
	}

	err = model.CreateURL(url)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating URL",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(url)

}

func Setup() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "localhost",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	app.Get("/api/v1/get-urls", GetAllURLS)
	app.Post("/api/v1/create-url", CreateURL)

	log.Fatal(app.Listen(":3000"))
}
