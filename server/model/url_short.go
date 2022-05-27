package model

func GetAllURLS() ([]Url_Short, error) {
	var urls []Url_Short

	transaction := database.Find(&urls)
	if transaction.Error != nil {
		return []Url_Short{}, transaction.Error
	}

	return urls, nil
}

func GetURL(id uint64) (Url_Short, error) {
	var url Url_Short

	transaction := database.Where("id = ?", id).First(&url)
	if transaction.Error != nil {
		return Url_Short{}, transaction.Error
	}

	return url, nil
}

func CreateURL(url Url_Short) error {
	transaction := database.Create(&url)
	return transaction.Error
}

func UpdateURL(url Url_Short) error {
	transaction := database.Save(&url)
	return transaction.Error
}

func DeleteURL(id uint64) error {
	transaction := database.Unscoped().Delete(&Url_Short{}, id)
	return transaction.Error
}

func FindByShortURL(url string) (Url_Short, error) {
	var short_url Url_Short
	transaction := database.Where("short_url = ?", url).First(&short_url)

	return short_url, transaction.Error
}
