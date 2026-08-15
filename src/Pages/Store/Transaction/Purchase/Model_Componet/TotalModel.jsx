import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';

const TotalModel = ({ show, handleClose, Amount, Order_id, tag_number }) => {

    const [total, setTotal] = useState(0);
    const [remainder, setRemainder] = useState(Amount);

    useEffect(() => {
        if (show) {
            calculateSuggestion(Amount);
        }
    }, [show, Amount]);

    const handleTotalChange = (e) => {
        const value = parseFloat(e.target.value);
        setTotal(value);
        calculateRemainder(value);
    };

    const handleModalClose = () => {
        setRemainder(0);
        setTotal(0);
        handleClose();
    };

    const calculateSuggestion = (currentAmount) => {
        const remainderValue = parseFloat(currentAmount);
        setRemainder(remainderValue.toFixed(2));
        const fractionalPart = remainderValue - Math.floor(remainderValue);
        const suggestedValue = fractionalPart === 0 ? 0 : (1 - fractionalPart);
        setTotal((suggestedValue).toFixed(2));
    };

    const calculateRemainder = (totalValue) => {
        const remainderValue = parseFloat(Amount) + parseFloat(totalValue);
        setRemainder(remainderValue.toFixed(2));
    };

    const editNetAmount = () => {
        const myurl = `${V_URL}/user/update-ms-transaction`;
        const payload = {
            'id': Order_id,
            'tag_number': tag_number,
            'round_amount': total
        }
        axios({
            method: "put",
            url: myurl,
            data: payload,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        }).catch((error) => {
            toast.error("Something went wrong");
        });
        handleModalClose()
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleModalClose}
                size="sm" backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Total</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="input-block local-forms">
                                <label>Net Amount</label>
                                <input
                                    type='number'
                                    className="form-control"
                                    name="amount"
                                    value={Amount}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="input-block local-forms">
                                <label>Total</label>
                                <input
                                    type='number'
                                    className="form-control"
                                    name="total"
                                    value={total}
                                    onChange={handleTotalChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="input-block local-forms">
                                <label>Remainder (Net Amount + Total)</label>
                                <input
                                    type='number'
                                    className="form-control"
                                    name="remainder"
                                    value={remainder}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 text-end">
                        <button type="button" className="btn btn-primary ms-2" onClick={editNetAmount}>Save</button>
                    </div>
                </Modal.Body>
            </Modal >
        </>
    )
}
export default TotalModel;