import React, { useState } from "react";
import * as api from "../api/api";
import UrlD from "../data/UrlD";
import { UrlResponse } from "../data/UrlResponse";
import 'bootstrap/dist/css/bootstrap.css';

function Modal(props : any) {

    const [mainUrl, setMainUrl] = useState(props.modalData.mainUrl || "")

    const [shortUrl, setShortUrl] = useState(props.modalData.shortUrl || "")

    const [expirationDate, setExpirationDate] = useState(props.modalData.expirationDate || "")

    const [submitted, setSubmitted] = useState(false)

    const [isRandomGenerationChecked, setRandomGenerationChecked] = useState(false)

    const [error, SetError] = useState("")

    const handleCloseModal = () => {
        props.setShowModal(false)
    }

    const todaysDate : string = new Date().toLocaleDateString("en-CA");

    const generateRandomString = () : string => {
        let result = ""
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        let randomCharacterLength = 5
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
        if(!mainUrl) {
            SetError("Invalid, please input a Main URL.")
            return;
        }

        if(!shortUrl) {
            SetError("Invalid, please input a Short URL.")
            return;
        }

        let response : UrlResponse
        if (props.modalData.isEditModal) {
            let urlD : UrlD = {
                id: props.modalData.id,
                main_url: mainUrl,
                short_url: shortUrl,
                short_url_usage_count: props.modalData.shortUrlUsageCount,
                date_created: props.modalData.dateCreated,
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
            SetError(`Expiration Date must be set AFTER today's date. Please update the expiration date to be after: ${todaysDate}.`)
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

        handleCloseModal()

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
        {props.showModal &&
            <div className="modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{props.modalData.isEditModal ? "Edit URL" : "Create URL"}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
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
                        {submitted && !mainUrl && <span id='mainUrl-error'>Please enter a Main URL</span>}
                        <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Short URL</span>
                        </div>
                        <input id="shortUrl" type="text" className="form-control" aria-label="Default" 
                            aria-describedby="inputGroup-sizing-default"
                            value={shortUrl}
                            onChange={handleShortUrlInputChange}/>
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">Generate a Random URL</span>
                            <input type="checkbox" aria-label="Checkbox for random shortUrl generation"
                                onChange={(event) => handleRandomGenerationCheckboxClick(event)} checked={isRandomGenerationChecked}/>
                        </div>
                        {submitted && !shortUrl && <span id='mainUrl-error'>Please enter a Short URL</span>}
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
                        {error && <div className='error-message'>Error! {error}</div>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>}
        </div>
    )
}

export default Modal