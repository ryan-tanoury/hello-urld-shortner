package setup

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestGetAllURLS(t *testing.T) {
	request := httptest.NewRequest("GET", "/api/v1/get-urls", nil)

	query := request.URL.Query()
	request.URL.RawQuery = query.Encode()

	record := httptest.NewRecorder()
	result := record.Result()

	if result.StatusCode != http.StatusOK {
		t.Errorf("`%v` failed, got %v, expected %v", "TestGetAllURLS", result.StatusCode, http.StatusOK)
	}
}

func TestGetURL(t *testing.T) {
	req := httptest.NewRequest("GET", "/api/v1/get-url/:id", nil)

	q := req.URL.Query()
	q.Add(":id", "5")

	req.URL.RawQuery = q.Encode()
	record := httptest.NewRecorder()
	result := record.Result()

	if result.StatusCode != http.StatusOK {
		t.Errorf("`%v` failed, got %v, expected %v", "TestGetURL", result.StatusCode, http.StatusOK)
	}
}

func TestCreateURL(t *testing.T) {
	req := httptest.NewRequest("POST", "/api/v1/create-url", strings.NewReader("mainUrl=mainurl.com&shortUrl=shorturl"))
	req.Header.Set("Content-Type", "application/json")

	record := httptest.NewRecorder()
	result := record.Result()

	if result.StatusCode != http.StatusOK {
		t.Errorf("`%v` failed, got %v, expected %v", "TestCreateURL", result.StatusCode, http.StatusOK)
	}
}

func TestUpdateURL(t *testing.T) {
	req := httptest.NewRequest("POST", "/api/v1/update-url", strings.NewReader("mainUrl=newMainUrl.com&shortUrl=newShortUrl"))
	req.Header.Set("Content-Type", "application/json")

	record := httptest.NewRecorder()
	result := record.Result()

	if result.StatusCode != http.StatusOK {
		t.Errorf("`%v` failed, got %v, expected %v", "TestUpdateURL", result.StatusCode, http.StatusOK)
	}
}

func TestDeleteURL(t *testing.T) {
	req := httptest.NewRequest("DELETE", "/api/v1/delete-url/:id", nil)

	q := req.URL.Query()
	q.Add(":id", "5")

	req.URL.RawQuery = q.Encode()
	record := httptest.NewRecorder()
	result := record.Result()

	if result.StatusCode != http.StatusOK {
		t.Errorf("`%v` failed, got %v, expected %v", "TestDeleteURL", result.StatusCode, http.StatusOK)
	}
}
