package model

func GetAllURLS() ([]Url_D, error) {
	var urls []Url_D

	transaction := database.Find(&urls)
	if transaction.Error != nil {
		return []Url_D{}, transaction.Error
	}

	return urls, nil
}

func GetURL(id uint64) (Url_D, error) {
	var url Url_D

	transaction := database.Where("id = ?", id).First(&url)
	if transaction.Error != nil {
		return Url_D{}, transaction.Error
	}

	return url, nil
}

func CreateURL(url Url_D) error {
	transaction := database.Create(&url)
	return transaction.Error
}

func UpdateURL(url Url_D) error {
	transaction := database.Save(&url)
	return transaction.Error
}

func DeleteURL(id uint64) error {
	transaction := database.Unscoped().Delete(&Url_D{}, id)
	return transaction.Error
}

func FindByShortURL(url string) (Url_D, error) {
	var short_url Url_D
	transaction := database.Where("short_url = ?", url).First(&short_url)

	return short_url, transaction.Error
}
