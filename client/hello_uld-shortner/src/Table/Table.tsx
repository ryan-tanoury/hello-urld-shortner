import React from 'react';
import './Table.css';
import TrashIcon from '../icons/trash.svg';
import EditIcon from '../icons/pencil.svg';

let list = ['Ryan', 'Olivia', 'Meggie']

function Table() {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Main URL</th>
                    <th scope="col">Short URL</th>
                    <th scope="col">Usage</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
            {list.map((l, index) => {
            return (
                <tr key={index}>
                    <td>{l}</td>
                    <td>{l}</td>
                    <td>{l}</td>
                    <td>{l}</td>
                    <td onClick={() => alert('Edit')}>
                        <img className="editButton" src={EditIcon} alt="Edit"/>
                    </td>
                    <td onClick={() => alert('Delete')}>
                        <img className="deleteButton" src={TrashIcon} alt="Delete"/>
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default Table