package model

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var database *gorm.DB

type Url_D struct {
	Id                    uint64 `json:"id" gorm:"primaryKey"`
	Main_URL              string `json:"main_url" gorm:"type:text;not null"`
	Short_URL             string `json:"short_url" gorm:"unique;not null"`
	Short_URL_Usage_Count uint64 `json:"short_url_usage_count"`
	Date_Created          string `json:"date_created"`
	Expiration_Date       string `json:"expiration_date"`
}

func SetupDatabase() {
	dbConnectionString := "host=postgres user=postgres password=postgres database=postgres sslmode=disable"

	var err error
	database, err = gorm.Open(postgres.Open(dbConnectionString), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database - %s", dbConnectionString))
	}

	err = database.AutoMigrate(&Url_D{})
	if err != nil {
		panic(err)
	}
}
