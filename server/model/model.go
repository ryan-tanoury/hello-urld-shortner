package model

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var database *gorm.DB

type Url_Short struct {
	Id                    uint64 `json:"id" gorm:"primaryKey"`
	Main_URL              string `json:"main_url" gorm:"not null"`
	Short_URL             string `json:"short_url" gorm:"unique;not null"`
	Short_URL_Usage_Count uint64 `json:"short_url_usage_count"`
	Date_Created          string `json:"date_created"`
	Expiration_Date       string `json:"expiration_date"`
}

// docker run --name url_shortner_db -d -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=supersecretpassword postgres

func SetupDatabase() {
	// 172.17.0.2
	postgresConnectionInfo := fmt.Sprintf("host=localhost password=%s port=5432 sslmode=disable", os.Getenv("POSTGRES_PASSWORD"))

	var err error
	database, err = gorm.Open(postgres.Open(postgresConnectionInfo), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	err = database.AutoMigrate(&Url_Short{})
	if err != nil {
		panic(err)
	}
}
