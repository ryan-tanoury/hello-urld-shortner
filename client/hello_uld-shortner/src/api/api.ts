import UrlD from "../data/UrlD";
import { UrlResponse } from "../data/UrlResponse";

const apiHost = process.env.PORT || "http://127.0.0.1:5000"
const apiVersion = "/api/v1/"
const apiHostVersion = apiHost + apiVersion

const getAllURLs = async () : Promise<UrlD[]> => {
    const response = await fetch(apiHostVersion + "get-urls");

    return await response.json()
}

const deleteURL = async (id : string) : Promise<UrlResponse> => {
    const response = await fetch(apiHostVersion + `delete-url/${id}`,
    {
        method: "DELETE"
    });

    return await response.json();
}

const createURL = async (urlD : UrlD) : Promise<UrlResponse> => {
    const response = await fetch(apiHostVersion + "create-url",
    {
        method: "POST",
        body: JSON.stringify(urlD),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

const updateURL = async (urlD : UrlD) : Promise<UrlResponse> => {
    const response = await fetch(apiHostVersion + `update-url/${urlD.id}`,
    {
        method: "PATCH",
        body: JSON.stringify(urlD),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export { 
    getAllURLs,
    deleteURL,
    createURL,
    updateURL
}