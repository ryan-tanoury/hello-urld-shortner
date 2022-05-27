import React from 'react';
import Table from '../Table/Table';
import './Card.css';

function Card() {
    return (
    <div className="background">
        <div className="align-items-center justify-content-center">
            <div className="col-8 col-lg-4 col-xl-3">
                <div className="card">
                    <div className="card-body text-center">
                        <h4 className="card-title">Hello URLD Shortner</h4>
                        <Table />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Card