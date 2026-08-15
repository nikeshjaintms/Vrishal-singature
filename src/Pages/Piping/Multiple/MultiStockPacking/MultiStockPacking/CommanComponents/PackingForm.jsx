import React, { useState } from 'react'

const PackingForm = ({ packingData, setPackingData, Errors, is_view }) => {

    const handlePackingData = (e) => {
        const { name, value } = e.target;
        setPackingData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Add Details</h4>
                                    </div>
                                </div>
                                {/* <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Physical Weight.<span className="login-danger">*</span></label>
                                        <input type='text'
                                            name='physical_weight'
                                            className='form-control'
                                            value={packingDeta.physical_weight}
                                            onChange={handlePackingData} />
                                        <div className='error'>{Errors.physical_weight}</div>
                                    </div>
                                </div> */}
                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Consignment No.<span className="login-danger">*</span></label>
                                        <input type='text'
                                            name='consignment_no'
                                            className='form-control'
                                            value={packingData.consignment_no}
                                            onChange={handlePackingData}
                                            readOnly={is_view}
                                            />
                                        <div className='error'>{Errors.consignment_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Dispatch Date<span className="login-danger">*</span></label>
                                        <input type='date'
                                            name='dispatch_date'
                                            className='form-control'
                                            value={packingData.dispatch_date.slice(0, 10) || ''} 
                                            onChange={handlePackingData}
                                            readOnly={is_view}
                                            />
                                        <div className='error'>{Errors.dispatch_date_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Destination.<span className="login-danger">*</span></label>
                                        <input type='text'
                                            name='destination'
                                            className='form-control'
                                            value={packingData.destination} 
                                            onChange={handlePackingData} 
                                            readOnly={is_view}
                                            />
                                        <div className='error'>{Errors.destination_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Truck No.<span className="login-danger">*</span></label>
                                        <input type='text'
                                            name='truck_no'
                                            className='form-control'
                                            value={packingData.truck_no}
                                            onChange={handlePackingData}
                                            readOnly={is_view}
                                            />
                                        <div className='error'>{Errors.truck_no_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>Driver Name & No.<span className="login-danger">*</span></label>
                                        <input type='text'
                                            name='driver_name'
                                            className='form-control'
                                            value={packingData.driver_name}
                                            onChange={handlePackingData}
                                            readOnly={is_view}
                                            />
                                        <div className='error'>{Errors.driverName_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>GSTIN.<span className="login-danger">*</span></label>
                                        <input type='text' className='form-control'
                                            name='gst_no'
                                            value={packingData.gst_no} readOnly
                                            onChange={handlePackingData} />
                                        <div className='error'>{Errors.gst_no_err}</div>
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4'>
                                    <div className='input-block local-forms'>
                                        <label>E-Way Bill.<span className="login-danger">*</span></label>
                                        <input type='text' className='form-control'
                                            name='eway_bill'
                                            value={packingData.eway_bill}
                                            onChange={handlePackingData}
                                            readOnly={is_view}
                                                 />
                                        <div className='error'>{Errors.eway_bill_err}</div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="input-block local-forms">
                                        <label>Remarks </label>
                                        <textarea className='form-control' onChange={handlePackingData} value={packingData?.remark} name='remark' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PackingForm