import * as apis from "../api/api";
import UrlD from "../data/UrlD";

beforeEach(() => {
    fetchMock.resetMocks()
})

it("returns all the URLS", async () => {
    const responseBody = {
        "main_url": "https://mainUrl.com",
        "short_url": "shortURL",
        "short_url_usage_count": 0
    }

    fetchMock.mockResponseOnce(JSON.stringify(responseBody))

    const response = await apis.getAllURLs()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response).toStrictEqual(responseBody)
});


it("deletes the URL", async () => {
    const responseBody = {
        "message": "Successfully deleted url",
    }

    const fakeId = "182968916"

    fetchMock.mockResponseOnce(JSON.stringify(responseBody))

    const response = await apis.deleteURL(fakeId)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response).toStrictEqual(responseBody)
});

it("creates the URL", async () => {
    const requestBody : UrlD = {
        "main_url": "https://fakemainURL.com",
        "short_url": "fakeShortURL",
        "short_url_usage_count": 0
    }

    const responseBody = {
        "main_url": "https://fakemainURL.com",
        "short_url": "fakeShortURL",
        "short_url_usage_count": 0
    }

    fetchMock.mockResponseOnce(JSON.stringify(responseBody))

    const response = await apis.createURL(requestBody)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response).toStrictEqual(responseBody)
});

it("updates the URL", async () => {
    const requestBody : UrlD = {
        "main_url": "https://fakemainURL.com",
        "short_url": "fakeShortURL",
        "short_url_usage_count": 0
    }

    const responseBody = {
        "main_url": "https://fakemainURL.com",
        "short_url": "fakeShortURL",
        "short_url_usage_count": 0
    }

    fetchMock.mockResponseOnce(JSON.stringify(responseBody))

    const response = await apis.updateURL(requestBody)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response).toStrictEqual(responseBody)
});