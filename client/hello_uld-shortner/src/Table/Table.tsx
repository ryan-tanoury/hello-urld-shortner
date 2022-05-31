import React, { useEffect, useState } from 'react';
import './Table.css';
import TrashIcon from '../icons/trash.svg';
import EditIcon from '../icons/pencil.svg';
import ClipBoard from "../icons/clipboard.svg";
import * as api from "../api/api";
import UrlD from '../data/UrlD';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "../Form/Form";

function Table(this: any) {
    const [urls, setUrls] = useState<UrlD[]>([]);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        mainUrl: "",
        shortUrl: "",
        shortUrlUsageCount: 0,
        dateCreated: "",
        expirationDate: "",
        isEditForm: false
    })

    useEffect(() => {
        const getAllURLs = async () => {
            let urlDs : UrlD[] = await api.getAllURLs()
            setUrls(urlDs)
        }
        getAllURLs()
}, []);

    const handleDelete = async (id : string) => {
        // eslint-disable-next-line no-restricted-globals
        let continueDelete = confirm("Are you sure you want to delete this record?")

        let response;
        if (continueDelete) {
            response = await api.deleteURL(id)
        }

        if (!response) return

        let urlDs : UrlD[] = await api.getAllURLs()
        setUrls(urlDs)
    }

    const openEditForm = (id: string, mainUrl: string, shortUrl: string, shortUrlUsageCount: number, dateCreated: string, expirationDate: string) => {
        setFormData({id, mainUrl, shortUrl, shortUrlUsageCount, dateCreated, expirationDate, isEditForm: true })
        setShowForm(true)
    }

    const openCreateForm = () => {
        setFormData({
            id: "",
            mainUrl: "",
            shortUrl: "",
            shortUrlUsageCount: 0,
            dateCreated: "",
            expirationDate: "",
            isEditForm: false
        })
        setShowForm(true)
    }

    const handleCopy = (shortUrl : string) => {
        let copyText = `localhost:5000/r/${shortUrl}`
        navigator.clipboard.writeText(copyText)
    }

    return (
        <div>
            <div>
                <div className="top-of-table create-button">
                    <button type="button" className="btn btn-primary" data-dismiss="Form" onClick={openCreateForm}>Create a Short URL</button>
                </div>
                <table className="table table-hover table-margin">
                    <thead>
                        <tr>
                            <th scope="col">Main URL</th>
                            <th scope="col">Short URL</th>
                            <th scope="col">Usage</th>
                            <th scope="col">Date Created</th>
                            <th scope="col">Expiration date</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {urls.map((url) => {
                            return (
                                <tr key={url.id}>
                                    <th scope="row">{url.main_url}</th>
                                    <td>{url.short_url}<img className="copyUrlButton" src={ClipBoard} alt="CopyClipboard" onClick={() => handleCopy(url.short_url)} /></td>
                                    <td>{url.short_url_usage_count}</td>
                                    <td>{url.date_created}</td>
                                    <td>{url.expiration_date}</td>
                                    <td onClick={() => openEditForm(url.id!, url.main_url, url.short_url, url.short_url_usage_count!, url.date_created!, url.expiration_date!)}>
                                        <img className="editButton" src={EditIcon} alt="Edit"/>
                                    </td>
                                    <td onClick={() => handleDelete(url.id!)}>
                                        <img className="deleteButton" src={TrashIcon} alt="Delete"/>
                                    </td>
                                </tr>
                            )})
                        }
                    </tbody>
                </table>
            </div>
            {showForm && <Form showForm={showForm} setShowForm={setShowForm} setUrls={setUrls} formData={formData}/>}
        </div>
    );
}

export default Table