import React, { useState } from "react";
import * as api from "../api/api";
import UrlD from "../data/UrlD";
import { UrlResponse } from "../data/UrlResponse";
import "bootstrap/dist/css/bootstrap.css";

function Form(props : any) {

    const [mainUrl, setMainUrl] = useState(props.formData.mainUrl || "")

    const [shortUrl, setShortUrl] = useState(props.formData.shortUrl || "")

    const [expirationDate, setExpirationDate] = useState(props.formData.expirationDate || "")

    const [submitted, setSubmitted] = useState(false)

    const [isRandomGenerationChecked, setRandomGenerationChecked] = useState(false)

    const [error, SetError] = useState("")

    const handleCloseForm = () => {
        props.setShowForm(false)
    }

    const todaysDate : string = new Date().toLocaleDateString("en-CA");

    const generateRandomString = () : string => {
        let result = ""
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        const randomCharacterLength = 5
        const charactersLength = characters.length
        for ( var i = 0; i < randomCharacterLength; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleRandomGenerationCheckboxClick = (event : any) => {
        setRandomGenerationChecked(event.target.checked)

        let randomString = ""
        if (!isRandomGenerationChecked) {
            randomString = generateRandomString()
            setShortUrl(randomString)
            return
        }

        setShortUrl("")
        SetError("")
    }

    const handleSubmit = async (event : any) => {
        event.preventDefault()
        setSubmitted(true)
        if (!mainUrl && !shortUrl) {
            SetError("Invalid, please input a Main URL and Short URL.")
            return
        }

        if(!mainUrl) {
            SetError("Invalid, please input a Main URL.")
            return;
        }

        if(!shortUrl) {
            SetError("Invalid, please input a Short URL.")
            return;
        }

        let response : UrlResponse
        if (props.formData.isEditForm) {
            let urlD : UrlD = {
                id: props.formData.id,
                main_url: mainUrl,
                short_url: shortUrl,
                short_url_usage_count: props.formData.shortUrlUsageCount,
                date_created: props.formData.dateCreated,
                expiration_date: expirationDate
            }

            response = await api.updateURL(urlD)
        } else {
            let urlD : UrlD = {
                main_url: mainUrl,
                short_url: shortUrl,
                short_url_usage_count: 0,
                date_created: todaysDate,
                expiration_date: expirationDate ? expirationDate : ""
            }

            response = await api.createURL(urlD)
        }

        let isExpirationDateValid = expirationDate === "" ? true : expirationDate >= todaysDate

        if (!isExpirationDateValid) {
            SetError(`Expiration Date must be set AFTER today"s date. Please update the expiration date to be after: ${todaysDate}.`)
            return
        }

        if (response.error) {
            if (response.error.includes("duplicate")) {
                SetError("Unable to create/update URL because a short url with the same name already exists. Please use a different name.")
                return
            }
            SetError(response.message)
            return
        }

        handleCloseForm()

        let urlDs : UrlD[] = await api.getAllURLs()
        props.setUrls(urlDs)
    }

    const handleMainUrlInputChange = (event : any) => {
        event.preventDefault()
        setMainUrl(event.target.value)
        SetError("")
    }

    const handleShortUrlInputChange = (event : any) => {
        event.preventDefault()
        setShortUrl(event.target.value)
        SetError("")
        setRandomGenerationChecked(false)
    }

    const handleExpirationDateInputChange = (event : any) => {
        event.preventDefault()
        setExpirationDate(event.target.value)
        SetError("")
    }

    return (
        <div>
        {props.showForm &&
            <div className="form" tabIndex={-1} role="dialog">
            <div className="form-dialog" role="document">
                <div className="form-content">
                <div className="form-header">
                    <h5 className="form-title">{props.formData.isEditForm ? "Edit URL" : "Create URL"}</h5>
                    <button type="button" className="close" data-dismiss="form" aria-label="Close" onClick={handleCloseForm}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Main URL</span>
                            </div>
                            <input id="mainUrl" type="text" className="form-control" aria-label="Default" 
                                aria-describedby="inputGroup-sizing-default"
                                value={mainUrl}
                                onChange={handleMainUrlInputChange} />
                        </div>
                        {submitted && !mainUrl && <div className="alert alert-danger">Please enter a Main URL</div>}
                        <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Short URL</span>
                        </div>
                        <input id="shortUrl" type="text" className="form-control" aria-label="Default" 
                            aria-describedby="inputGroup-sizing-default"
                            value={shortUrl}
                            onChange={handleShortUrlInputChange}/>
                        <div className="form-check">
                            <input className="checkbox-style" type="checkbox" aria-label="Checkbox for random shortUrl generation"
                                    onChange={(event) => handleRandomGenerationCheckboxClick(event)} checked={isRandomGenerationChecked}/>
                            <span className="form-check-label" id="inputGroup-sizing-default">Generate a Random URL</span>
                        </div>
                        {submitted && !shortUrl && <div className="alert alert-danger">Please enter a Short URL</div>}
                        </div>
                        <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Expiration Date</span>
                        </div>
                        <input id="expirationDate" type="date" className="form-control" aria-label="Default" min={todaysDate}
                            aria-describedby="inputGroup-sizing-default"
                            value={expirationDate}
                            onChange={handleExpirationDateInputChange} />
                        </div>
                        {error && <div className="alert alert-danger">Error! {error}</div>}
                        <div className="form-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="form" onClick={handleCloseForm}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>}
        </div>
    )
}

export default Form