package main

import (
	"server/model"
	"server/setup"
)

func main() {
	model.SetupDatabase()

	setup.Setup()
}
