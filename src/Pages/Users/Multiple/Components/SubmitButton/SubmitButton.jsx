import React from 'react'
import { useNavigate } from 'react-router-dom'

const SubmitButton = ({ finalReq = [], disable, handleSubmit, buttonName, isFd, handleStatusChange, link, data, showFd = false, is_dispatch = false, is_Surface=false, isMIO=false,  onChange, dispatch_site, isSelected }) => {

    const navigate = useNavigate();

    return (
        <div className='row'>
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        {showFd && (
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block select-gender">
                                    <label className="gen-label">Select Procedure <span className="login-danger">*</span></label>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" name="isFd"
                                                value="accept"
                                                className="form-check-input" checked={isFd === true}
                                                onChange={handleStatusChange} disabled={data?._id} />Final Dimension
                                        </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" name="isFd" value="reject"
                                                checked={isFd === false}
                                                onChange={handleStatusChange}
                                                className="form-check-input" disabled={data?._id} /> Fitup
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        {is_Surface && (
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block select-gender">
                                    <label className="gen-label">
                                        Release Type <span className="login-danger">*</span>
                                    </label>

                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input
                                                type="radio"
                                                name="releaseType"
                                                value="MIO"
                                                className="form-check-input"
                                                checked={isSelected === "MIO"}
                                                onChange={handleStatusChange}
                                                disabled={data?._id}
                                            />
                                            Release For MIO
                                        </label>
                                    </div>

                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input
                                                type="radio"
                                                name="releaseType"
                                                value="IRN"
                                                className="form-check-input"
                                                checked={isSelected === "IRN"}
                                                onChange={handleStatusChange}
                                                disabled={data?._id}
                                            />
                                            Release For IRN
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                         {isMIO && (
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block select-gender">
                                <label className="gen-label">
                                    Release Type <span className="login-danger">*</span>
                                </label>

                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                    <input
                                        type="radio"
                                        name="releaseType"
                                        value="FinalPaint"
                                        className="form-check-input"
                                        checked={isSelected === "FinalPaint"}
                                        onChange={handleStatusChange}
                                        disabled={data?._id}
                                    />
                                    Release For Final Coat & Paint
                                    </label>
                                </div>

                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                    <input
                                        type="radio"
                                        name="releaseType"
                                        value="IRN"
                                        className="form-check-input"
                                        checked={isSelected === "IRN"}
                                        onChange={handleStatusChange}
                                        disabled={data?._id}
                                    />
                                    Release For IRN
                                    </label>
                                </div>
                                </div>
                            </div>
                            )}
                        <div className="col-12 text-end">
                            <div className={is_dispatch ? "doctor-submit text-end d-flex justify-content-between" : "doctor-submit text-end "}>
                                {
                                    is_dispatch && (
                                        <input className='form-control w-25 mx-2' rows={1}
                                            type='text'
                                            value={dispatch_site} name='dispatch_site'
                                            placeholder='Dispatch Site'
                                            onChange={onChange} />
                                    )
                                }
                                {(finalReq?.length === 0 || finalReq === undefined) ? (
                                    <button type="button"
                                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>
                                        {disable ? 'Processing...' : buttonName}</button>
                                ) : (
                                    <button type="button" className="btn btn-primary submit-form me-2"
                                        onClick={() => navigate(link)}>Back</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubmitButton