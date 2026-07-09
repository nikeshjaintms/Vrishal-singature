import moment from 'moment';
import React, { useEffect, useState } from 'react'

const MioPaintFields = ({ is_inspection, paintData, handleMioOffer, validateMioData, edit_data, filteredWeather = [], lockedDate }) => {

    console.log('paintData', paintData);

    const [errors, setErrors] = useState({});
    const [mio, setMio] = useState({
        mio_paint: '',
        mio_app: '',
        paint_manufacture: '',
        dft_range: '',

        mio_date: '',
        time: '',
        paint_batch_base: '',
        manufacture_date: '',
        shelf_life: '',
        paint_batch_hardner: '',
        note: '',
        qc_note: '',
    });
    useEffect(() => {
        let updatedMio = { ...mio };

        if (paintData) {
            updatedMio = {
                ...updatedMio,
                mio_paint: paintData?.mio_paint,
                mio_app: paintData?.mio_app_method,
                paint_manufacture: paintData?.paint_manufacturer,
                dft_range: paintData?.mio_dft_range,
            }
        }

        if (edit_data) {
            updatedMio = {
                ...updatedMio,
                mio_date: moment(edit_data?.mio_date).format('YYYY-MM-DD') || '',
                time: edit_data?.time || '',
                paint_batch_base: edit_data?.paint_batch_base || '',
                manufacture_date: moment(edit_data?.manufacture_date).format('YYYY-MM-DD') || '',
                shelf_life: edit_data?.shelf_life || '',
                paint_batch_hardner: edit_data?.paint_batch_hardner || '',
                note: edit_data?.offer_notes || '',
                qc_note: edit_data?.qc_notes || '',
            }
        }
        setMio(updatedMio);
    }, [edit_data, paintData]);

    useEffect(() => {
        if (filteredWeather?.length > 0) {
            let mio_date = '';
            filteredWeather.forEach(item => {
                if (item.type === "MIO Coat") {
                    mio_date = item.date;
                }
            });
            setMio(prevState => ({
                ...prevState,
                mio_date
            }));
        }
    }, [filteredWeather]);

    useEffect(() => {
        handleMioOffer(mio);
    }, [mio, handleMioOffer]);

    const handleChange = (e) => {
        setMio({ ...mio, [e.target.name]: e.target.value });
    }

    const validateMio = () => {
        const newErrors = {};
        if (!mio.mio_date) {
            newErrors.mio_date = 'Please select date';
        }
        if (!mio.time?.trim()) {
            newErrors.time = 'Please enter time';
        }
        if (!mio.shelf_life?.trim()) {
            newErrors.shelf_life = 'Please enter shelf life';
        }
        if (!mio.manufacture_date) {
            newErrors.manufacture_date = 'Please select manufacturer date';
        }
        if (!mio.paint_batch_base?.trim()) {
            newErrors.paint_batch_base = 'Please enter paint batch no (base)';
        }
        if (!mio.paint_batch_hardner?.trim()) {
            newErrors.paint_batch_hardner = 'Please enter paint batch no (harderner)';
        }
        // if (is_inspection) {
        //     if (!mio.note?.trim()) {
        //         newErrors.note = 'Please enter note';
        //     }
        // }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    useEffect(() => {
        validateMioData.current = validateMio;
    }, [mio]);

    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <h4>Intermediat / MIO Coating</h4>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>MIO Paint/Shade </label>
                                        <input className='form-control' value={mio.mio_paint} readOnly disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>App. Method </label>
                                        <input className='form-control' value={mio.mio_app} readOnly disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>MIO Date <span className="login-danger">*</span></label>
                                        <input type='date' className='form-control'
                                            onChange={handleChange} value={mio.mio_date} name='mio_date' readOnly={is_inspection}
                                            max={new Date().toISOString().split("T")[0]} />
                                        {errors.mio_date && (
                                            <div className="error">{errors.mio_date}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Manufacture </label>
                                        <input className='form-control' value={mio.paint_manufacture} readOnly disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label> DFT Range</label>
                                        <input className='form-control' value={mio.dft_range} readOnly disabled />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Hard Dry Time <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control'
                                            value={mio.time} name='time' onChange={handleChange} />
                                        {errors.time && (
                                            <div className="error">{errors.time}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Batch No. (BASE) <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            name='paint_batch_base' value={mio.paint_batch_base} readOnly={is_inspection} />
                                        {errors.paint_batch_base && (
                                            <div className="error">{errors.paint_batch_base}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Manufacture Date <span className="login-danger">*</span></label>
                                        <input type='date' className='form-control' onChange={handleChange}
                                            name='manufacture_date' value={mio.manufacture_date} readOnly={is_inspection}
                                            // min={lockedDate}
                                            max={new Date().toISOString().split("T")[0]} />
                                        {errors.manufacture_date && (
                                            <div className="error">{errors.manufacture_date}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Shelf Life <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            name='shelf_life' value={mio.shelf_life} readOnly={is_inspection} />
                                        {errors.shelf_life && (
                                            <div className="error">{errors.shelf_life}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Batch No. (HARDNER) <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            name='paint_batch_hardner' value={mio.paint_batch_hardner} readOnly={is_inspection} />
                                        {errors.paint_batch_hardner && (
                                            <div className="error">{errors.paint_batch_hardner}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="input-block local-forms">
                                        <label>Note</label>
                                        <textarea className='form-control' type='text' onChange={handleChange}
                                            name='note' value={mio.note} />
                                    </div>
                                </div>
                                {is_inspection && (
                                    <div className="col-12">
                                        <div className="input-block local-forms">
                                            <label>QC Note</label>
                                            <textarea className='form-control' type='text' onChange={handleChange}
                                                name='qc_note' value={mio.qc_note} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MioPaintFields;