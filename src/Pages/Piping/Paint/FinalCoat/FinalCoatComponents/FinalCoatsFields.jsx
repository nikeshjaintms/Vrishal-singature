import moment from 'moment';
import React, { useEffect, useState } from 'react'

const FinalCoatsFields = ({ is_inspection, paintData, handleFinalCoatOffer, validateFinalCoatData, edit_data, filteredWeather, lockedDate }) => {
    console.log("paintData", paintData);
    const [errors, setErrors] = useState({});
    const [finalCoat, setFinalCoat] = useState({
        final_paint: "",
        final_paint_app_method: "",
        paint_manufacture: "",
        final_paint_dft_range: "",

        final_date: "",
        time: "",
        paint_base: "",
        manufacture_date: "",
        shelf_life: "",
        paint_hardner: "",
        note: "",
        qc_note: ""
    });

    const handleChange = (e) => {
        setFinalCoat({ ...finalCoat, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        let updatedFinalCoat = { ...finalCoat };

        if (paintData) {
            updatedFinalCoat = {
                ...updatedFinalCoat,
                final_paint: paintData?.final_paint,
                final_paint_app_method: paintData?.final_paint_app_method,
                paint_manufacture: paintData?.paint_manufacture,
                final_paint_dft_range: paintData?.final_paint_dft_range,
            }
        }

        if (edit_data) {
            updatedFinalCoat = {
                ...updatedFinalCoat,
                final_date: moment(edit_data?.final_date).format('YYYY-MM-DD') || '',
                time: edit_data?.time || '',
                paint_base: edit_data?.paint_batch_base || '',
                paint_hardner: edit_data?.paint_batch_hardner || '',
                manufacture_date: moment(edit_data?.manufacture_date).format('YYYY-MM-DD') || '',
                shelf_life: edit_data?.shelf_life || '',
                note: edit_data?.notes || edit_data?.offer_notes || '',
            }
        }
        setFinalCoat(updatedFinalCoat);
    }, [edit_data, paintData]);

    useEffect(() => {
        if (filteredWeather?.length > 0) {
            let final_date = '';
            filteredWeather.forEach(item => {
                if (item.type === "Top Coat / Final") {
                    final_date = item.date;
                }
            });
            setFinalCoat(prevState => ({
                ...prevState,
                final_date
            }));
        }
    }, [filteredWeather]);

    useEffect(() => {
        handleFinalCoatOffer(finalCoat);
    }, [finalCoat, handleFinalCoatOffer]);

    const validateFinalCoat = () => {
        const newErrors = {};

        if (!finalCoat.final_date) {
            newErrors.final_date_err = 'Please select final date';
        }
        if (!finalCoat.manufacture_date) {
            newErrors.manufacture_date_err = 'Please select manufacture date';
        }
        if (!finalCoat.time) {
            newErrors.time_err = 'Please enter time';
        }
        if (!finalCoat.manufacture_date) {
            newErrors.manufacture_date_err = 'Please select manufacture date';
        }
        if (!finalCoat.paint_base) {
            newErrors.paint_base_err = 'Please enter paint batch (base)';
        }
        if (!finalCoat.paint_hardner) {
            newErrors.paint_hardner_err = 'Please enter paint batch (hardner)';
        }
        if (!finalCoat.shelf_life) {
            newErrors.shelf_life_err = 'Please enter shelf life';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    useEffect(() => {
        validateFinalCoatData.current = validateFinalCoat;
    }, [finalCoat]);

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <h4>Final / Top Coating</h4>
                        <div className="row mt-4">
                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Final Paint / Shade</label>
                                    <input className='form-control' type='text' value={finalCoat?.final_paint} disabled />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>App. Method </label>
                                    <input className='form-control' value={finalCoat.final_paint_app_method} disabled />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Final Date <span className="login-danger">*</span></label>
                                    <input type='date' className='form-control' value={finalCoat.final_date} name='final_date' onChange={handleChange} readOnly={is_inspection}
                                        max={new Date().toISOString().split("T")[0]} />
                                    {errors.final_date_err && (
                                        <div className="error">{errors.final_date_err}</div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Paint Manufacture </label>
                                    <input className='form-control' value={finalCoat?.paint_manufacture} disabled />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>DFT Range </label>
                                    <input className='form-control' value={finalCoat?.final_paint_dft_range} disabled />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Hard Dry Time <span className="login-danger">*</span></label>
                                    <input type='text' className='form-control' value={finalCoat?.time} onChange={handleChange} name='time' readOnly={is_inspection} />
                                    {errors.time_err && (
                                        <div className="error">{errors.time_err}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Paint Batch No. (Base) <span className="login-danger">*</span></label>
                                    <input className='form-control' type='text' value={finalCoat?.paint_base} name='paint_base' onChange={handleChange} readOnly={is_inspection} />
                                    {errors.paint_base_err && (
                                        <div className="error">{errors.paint_base_err}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Manufacture Date <span className="login-danger">*</span></label>
                                    <input className='form-control' type='date' onChange={handleChange} value={finalCoat?.manufacture_date}
                                        name='manufacture_date' readOnly={is_inspection}
                                        // min={lockedDate}
                                        max={new Date().toISOString().split("T")[0]} />
                                    {errors.manufacture_date_err && (
                                        <div className="error">{errors.manufacture_date_err}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Shelf Life <span className="login-danger">*</span></label>
                                    <input className='form-control' type='text' onChange={handleChange} value={finalCoat?.shelf_life} name='shelf_life' readOnly={is_inspection} />
                                    {errors.shelf_life_err && (
                                        <div className="error">{errors.shelf_life_err}</div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="input-block local-forms">
                                    <label>Paint Batch No.(Hardner) <span className="login-danger">*</span></label>
                                    <input className='form-control' onChange={handleChange} value={finalCoat?.paint_hardner} name='paint_hardner' readOnly={is_inspection} />
                                    {errors.paint_hardner_err && (
                                        <div className="error">{errors.paint_hardner_err}</div>
                                    )}
                                </div>
                            </div>
                            {
                                is_inspection ? <div className="col-12">
                                    <div className="input-block local-forms">
                                        <label>QC Note</label>
                                        <textarea className='form-control' onChange={handleChange} value={finalCoat?.qc_note} name='qc_note' readOnly={!is_inspection} />
                                    </div>
                                </div> : <div className="col-12">
                                    <div className="input-block local-forms">
                                        <label>Note</label>
                                        <textarea className='form-control' onChange={handleChange} value={finalCoat?.note} name='note' readOnly={is_inspection} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinalCoatsFields