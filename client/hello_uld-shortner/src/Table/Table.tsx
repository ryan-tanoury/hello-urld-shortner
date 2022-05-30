import React, { useEffect, useState } from 'react';
import './Table.css';
import TrashIcon from '../icons/trash.svg';
import EditIcon from '../icons/pencil.svg';
import ClipBoard from "../icons/clipboard.svg";
import * as api from "../api/api";
import UrlD from '../data/UrlD';
import Modal from '../Modals/Modal';

function Table(this: any) {
    const [urls, setUrls] = useState<UrlD[]>([]);

    const [showModal, setShowModal] = useState(false);

    const [modalData, setModalData] = useState({
        id: "",
        mainUrl: "",
        shortUrl: "",
        shortUrlUsageCount: 0,
        dateCreated: "",
        expirationDate: "",
        isEditModal: false
    })

    useEffect(() => {
        const getAllURls = async () => {
            let urlDs : UrlD[] = await api.getAllURLs()
            setUrls(urlDs)
        }
        getAllURls()
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

    const openEditModal = (id: string, mainUrl: string, shortUrl: string, shortUrlUsageCount: number, dateCreated: string, expirationDate: string) => {
        setModalData({id, mainUrl, shortUrl, shortUrlUsageCount, dateCreated, expirationDate, isEditModal: true })
        setShowModal(true)
    }

    const openCreateModal = () => {
        setModalData({
            id: "",
            mainUrl: "",
            shortUrl: "",
            shortUrlUsageCount: 0,
            dateCreated: "",
            expirationDate: "",
            isEditModal: false
        })
        setShowModal(true)
    }

    return (
        <div>
            <div className="top-of-table">
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={openCreateModal}>Create a Short URL</button>
            </div>
            <table className="table table-hover">
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
                                {/* <td>http://localhost:5000/r/{url.short_url}<div className="copyUrlButton"></div></td> */}
                                <td>{url.short_url}<img className="copyUrlButton" src={ClipBoard} alt="CopyClipboard" onClick={() => navigator.clipboard.writeText(url.short_url)} /></td>
                                <td>{url.short_url_usage_count}</td>
                                <td>{url.date_created}</td>
                                <td>{url.expiration_date}</td>
                                <td onClick={() => openEditModal(url.id!, url.main_url, url.short_url, url.short_url_usage_count!, url.date_created!, url.expiration_date!)}>
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
            { showModal && <Modal showModal={showModal} setShowModal={setShowModal} setUrls={setUrls} modalData={modalData} /> }
        </div>
    );
}

export default Table