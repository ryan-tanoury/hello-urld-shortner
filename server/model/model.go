package model

import (
	"fmt"
	"os"

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
	// "host=%s port=%s user=%s password=%s dbname=%s sslmode=disable"
	// host=localhost user=postgres password=password dbname=db port=5432 sslmode=disable TimeZone=Asia/Shanghai
	// "host=0.0.0.0 user=postgres password=supersecretpassword dbname=urlShortner port=5432 sslmode=disable"
	// postgresConnectionInfo := fmt.Sprintf("host=172.17.0.2 password=%s port=5432 database=url_shortner sslmode=disable", os.Getenv("POSTGRES_PASSWORD"))
	// docker run --name app-db -d -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=testpassword postgres
	dbConnectionString := fmt.Sprintf("host=localhost password=%s port=5432 sslmode=disable", os.Getenv("POSTGRES_PASSWORD"))

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
