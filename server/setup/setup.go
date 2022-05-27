package setup

import (
	"fmt"
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
			"message": "Error reading request body for creating url",
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

func UpdateURL(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var url model.Url_Short
	err := ctx.BodyParser(&url)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error reading request body for updating url",
			"error":   err.Error(),
		})
	}

	err = model.UpdateURL(url)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error updating url",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(url)
}

func DeleteURL(ctx *fiber.Ctx) error {
	id, err := strconv.ParseUint(ctx.Params("id"), 10, 64)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error parsing id used in param",
			"error":   err.Error(),
		})
	}

	err = model.DeleteURL(id)
	if err != nil {
		ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Unable to find url",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Successfully deleted url",
	})
}

func RedirectToMainURL(ctx *fiber.Ctx) error {
	shortURL := ctx.Params("redirect")
	mainURL, err := model.FindByShortURL(shortURL)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Short url not found",
			"error":   err.Error(),
		})
	}

	mainURL.Short_URL_Usage_Count += 1
	err = model.UpdateURL(mainURL)
	if err != nil {
		fmt.Printf("Error updating usage count on url")
	}

	return ctx.Redirect(mainURL.Main_URL, fiber.StatusTemporaryRedirect)
}

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: "localhost",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("redirect/:redirect", RedirectToMainURL)

	app.Get("/api/v1/get-urls", GetAllURLS)
	app.Get("/api/v1/get-url/:id", GetURL)
	app.Post("/api/v1/create-url", CreateURL)
	app.Patch("/api/v1/update-url/:id", UpdateURL)
	app.Delete("api/v1/delete-url/:id", DeleteURL)

}

func SetupAndRun() {
	app := fiber.New()

	SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
