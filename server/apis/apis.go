package apis

import (
	"fmt"
	"server/model"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
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
			"message": "Error parsing id param",
			"error":   err.Error(),
		})
	}

	urlD, err := model.GetURL(id)
	if err != nil {
		ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error: url does not exist",
			"error":   err.Error(),
		})
	}

	isUrlExpired := determineUrlIsExpired(urlD, ctx)

	if isUrlExpired {
		err = model.DeleteURL(urlD.Id)
		if err != nil {
			ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Unable to find url",
				"error":   err.Error(),
			})
		}
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Url is expired! It has been deleted",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(urlD)
}

func CreateURL(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var urlD model.Url_D
	err := ctx.BodyParser(&urlD)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error: bad request body creating url",
			"error":   err.Error(),
		})
	}

	err = model.CreateURL(urlD)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error: creating url",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(urlD)
}

func UpdateURL(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var urlD model.Url_D
	err := ctx.BodyParser(&urlD)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error: bad request body updating url",
			"error":   err.Error(),
		})
	}

	err = model.UpdateURL(urlD)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error: updating url",
			"error":   err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(urlD)
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
	urlD, err := model.FindByShortURL(shortURL)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Short url not found",
			"error":   err.Error(),
		})
	}

	isUrlExpired := determineUrlIsExpired(urlD, ctx)

	if isUrlExpired {
		err = model.DeleteURL(urlD.Id)
		if err != nil {
			ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Unable to find url",
				"error":   err.Error(),
			})
		}
		return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Url is expired! It has been deleted",
		})
	}

	urlD.Short_URL_Usage_Count += 1
	err = model.UpdateURL(urlD)
	if err != nil {
		fmt.Printf("Error: updating usage count on url")
	}

	return ctx.Redirect(urlD.Main_URL, fiber.StatusTemporaryRedirect)
}

func determineUrlIsExpired(urlD model.Url_D, ctx *fiber.Ctx) bool {
	if urlD.Expiration_Date == "" {
		return false
	}
	todaysDate := time.Now().Format("2006-01-02")

	return todaysDate >= urlD.Expiration_Date
}
