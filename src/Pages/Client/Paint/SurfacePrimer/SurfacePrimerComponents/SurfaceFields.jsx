import moment from 'moment';
import React, { useEffect, useState } from 'react'

const SurfaceFields = ({ is_inspection, paintData, handleSurfaceData, validateSurfaceData, edit_data, filteredWeather = [], lockedDate }) => {
    const [surface, setSurface] = useState({
        originalStatus: '',
        metalCondition: '',
        metalRustGrade: '',
        paintSystemNo: '',
        blastingDate: '',

        blastingMethod: '',
        prepStandard: '',
        abrasive_type: '',
        surfaceProfile: '',
        dustLevel: '',
        saltTest: '',
        actualSurfaceProfile: '',
        saltTestReading: '',

        primerPaint: '',
        appMethod: '',
        primerDate: '',
        paintManufacturer: '',
        dftRange: '',
        time: '',
        paintBatchBase: '',
        manufactureDate: '',
        shelfLife: '',
        paintBatchHardner: '',
        remark: '',
        qc_remarks: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let updatedSurface = { ...surface };
        if (edit_data) {
            updatedSurface = {
                ...updatedSurface,
                originalStatus: edit_data.original_status || '',
                metalCondition: edit_data.metal_condition || '',
                metalRustGrade: edit_data.metal_rust_grade || '',
                blastingDate: edit_data.blasting_date ? moment(edit_data.blasting_date).format('YYYY-MM-DD') : '',
                blastingMethod: edit_data.blasting_method || '',
                abrasive_type: edit_data.abrasive_type || '',
                dustLevel: edit_data.dust_level || '',
                primerDate: edit_data.primer_date ? moment(edit_data.primer_date).format('YYYY-MM-DD') : '',
                time: edit_data.time || '',
                paintBatchBase: edit_data.paint_batch_base || '',
                manufactureDate: edit_data.manufacture_date ? moment(edit_data.manufacture_date).format('YYYY-MM-DD') : '',
                shelfLife: edit_data.shelf_life || '',
                paintBatchHardner: edit_data.paint_batch_hardner || '',
                remark: edit_data.remarks || edit_data.offer_notes || '',
                qc_remarks: edit_data?.qc_notes,
                actualSurfaceProfile: edit_data?.actual_surface_profile,
                saltTestReading: edit_data?.salt_test_reading,
            };
        }

        if (paintData) {
            updatedSurface = {
                ...updatedSurface,
                paintSystemNo: paintData.paint_system_no || '',
                prepStandard: paintData.surface_preparation || '',
                surfaceProfile: paintData.profile_requirement || '',
                saltTest: paintData.salt_test || '',
                primerPaint: paintData.prime_paint || '',
                appMethod: paintData.primer_app_method || '',
                paintManufacturer: paintData.paint_manufacturer?.name || '',
                dftRange: paintData.primer_dft_range || '',
            };
        }

        setSurface(updatedSurface);
    }, [edit_data, paintData]);

    useEffect(() => {
        if (filteredWeather?.length > 0) {
            let blastingDate = '';
            let primerDate = '';
            filteredWeather.forEach(item => {
                if (item.type === "Blasting / Surf. Prep.") {
                    blastingDate = item.date;
                }
                if (item.type === "Primer Application") {
                    primerDate = item.date;
                }
            });
            setSurface(prevState => ({
                ...prevState,
                blastingDate,
                primerDate
            }));
        }
    }, [filteredWeather]);

    useEffect(() => {
        handleSurfaceData(surface);
    }, [surface, handleSurfaceData]);

    const handleChange = (e) => {
        setSurface({ ...surface, [e.target.name]: e.target.value });
    };

    const validateSurface = () => {
        const newErrors = {};

        if (!surface.originalStatus) {
            newErrors.originalStatus = 'Please enter original status';
        }
        if (!surface.metalCondition) {
            newErrors.metalCondition = 'Please enter metal condition';
        }
        if (!surface.metalRustGrade) {
            newErrors.metalRustGrade = 'Please enter metal rust grade';
        }
        if (!surface.blastingDate) {
            newErrors.blastingDate = 'Please enter blasting date';
        }
        if (!surface.blastingMethod) {
            newErrors.blastingMethod = 'Please enter blasting method';
        }
        if (!surface.abrasive_type) {
            newErrors.abrasive_type = 'Please enter abrasive type';
        }
        if (!surface.dustLevel) {
            newErrors.dustLevel = 'Please enter dust level';
        }
        if (!surface.time) {
            newErrors.time = 'Please enter time';
        }
        if (!surface.paintBatchBase) {
            newErrors.paintBatchBase = 'Please enter paint batch no. (base)';
        }
        if (!surface.paintBatchHardner) {
            newErrors.paintBatchHardner = 'Please enter paint batch no. (hardner)';
        }
        if (!surface.manufactureDate) {
            newErrors.manufactureDate = 'Please select manufacturer date';
        }
        if (!surface.shelfLife) {
            newErrors.shelfLife = 'Please enter shelf life';
        }
        if (!surface.primerDate) {
            newErrors.primerDate = 'Please select primer date';
        }

        if (is_inspection) {
            if (!surface.actualSurfaceProfile) {
                newErrors.actualSurfaceProfile = 'Please enter actual surface profile';
            }
            if (!surface.saltTestReading) {
                newErrors.saltTestReading = 'Please enter salt test reading';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        validateSurfaceData.current = validateSurface;
    }, [surface])

    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <h4>Surface Condition</h4>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Original Status <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control' value={surface.originalStatus}
                                            name='originalStatus' onChange={handleChange} readOnly={is_inspection} />
                                        {errors.originalStatus && (
                                            <div className="error">{errors.originalStatus}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Metal Condition <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control' onChange={handleChange}
                                            value={surface.metalCondition} name='metalCondition' readOnly={is_inspection} />
                                        {errors.metalCondition && (
                                            <div className="error">{errors.metalCondition}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Metal Rust Grade <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control' onChange={handleChange}
                                            value={surface.metalRustGrade} name='metalRustGrade' readOnly={is_inspection} />
                                        {errors.metalRustGrade && (
                                            <div className="error">{errors.metalRustGrade}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint System No. </label>
                                        <input type='text' className='form-control' onChange={handleChange}
                                            value={surface.paintSystemNo} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Blasting Date <span className="login-danger">*</span></label>
                                        <input type='date' className='form-control' onChange={handleChange}
                                            name='blastingDate' value={surface.blastingDate} readOnly={is_inspection}
                                            max={new Date().toISOString().split("T")[0]} />
                                        {errors.blastingDate && (
                                            <div className="error">{errors.blastingDate}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <h4>Surface Preparation</h4>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Blasting Method <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control' value={surface.blastingMethod}
                                            name='blastingMethod' onChange={handleChange} readOnly={is_inspection} />
                                        {errors.blastingMethod && (
                                            <div className="error">{errors.blastingMethod}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Prep. Standard</label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.prepStandard} name='prepStandard' readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Abrasive Type <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            name='abrasive_type' value={surface.abrasive_type} readOnly={is_inspection} />
                                        {errors.abrasive_type && (
                                            <div className="error">{errors.abrasive_type}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Surface Profile Requirement</label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.surfaceProfile} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Dust Level <span className="login-danger">*</span></label>
                                        <input type='text' className='form-control' onChange={handleChange}
                                            name='dustLevel' value={surface.dustLevel} readOnly={is_inspection} />
                                        {errors.dustLevel && (
                                            <div className="error">{errors.dustLevel}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Salt Test Required</label>
                                        <input className='form-control' onChange={handleChange}
                                            value={surface?.saltTest} readOnly={is_inspection} />
                                    </div>
                                </div>
                                {is_inspection && (
                                    <div className="col-md-4">
                                        <div className="input-block local-forms">
                                            <label>Actual Surface Profile <span className="login-danger">*</span></label>
                                            <input className='form-control' type='text' onChange={handleChange}
                                                name='actualSurfaceProfile' value={surface?.actualSurfaceProfile} />
                                            {errors.actualSurfaceProfile && (
                                                <div className="error">{errors.actualSurfaceProfile}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {is_inspection && (
                                    <div className="col-md-4">
                                        <div className="input-block local-forms">
                                            <label>Salt Test Reading <span className="login-danger">*</span></label>
                                            <input className='form-control' type='text' onChange={handleChange}
                                                value={surface.saltTestReading} name='saltTestReading' />
                                            {errors.saltTestReading && (
                                                <div className="error">{errors.saltTestReading}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <h4>Primer Coating</h4>
                            <div className="row mt-4">
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Primer Paint/Shade </label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.primerPaint} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>App. Method </label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.appMethod} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Primer Date <span className="login-danger">*</span></label>
                                        <input type='date' className='form-control' onChange={handleChange}
                                            value={surface.primerDate} name='primerDate' readOnly={is_inspection}
                                            max={new Date().toISOString().split("T")[0]} />
                                        {errors.primerDate && (
                                            <div className="error">{errors.primerDate}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Manufacture </label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.paintManufacturer} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>DFT Range </label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.dftRange} readOnly={is_inspection} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Hard Dry Time <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.time} name='time' readOnly={is_inspection} />
                                        {errors.time && (
                                            <div className="error">{errors.time}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Batch No. (BASE) <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.paintBatchBase} name='paintBatchBase' readOnly={is_inspection} />
                                        {errors.paintBatchBase && (
                                            <div className="error">{errors.paintBatchBase}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Manufacture Date <span className="login-danger">*</span></label>
                                        <input className='form-control' type='date' onChange={handleChange}
                                            value={surface.manufactureDate} name='manufactureDate' readOnly={is_inspection}
                                            // min={lockedDate}
                                            max={new Date().toISOString().split("T")[0]} />
                                        {errors.manufactureDate && (
                                            <div className="error">{errors.manufactureDate}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Shelf Life <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.shelfLife} name='shelfLife' readOnly={is_inspection} />
                                        {errors.shelfLife && (
                                            <div className="error">{errors.shelfLife}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-block local-forms">
                                        <label>Paint Batch No. (Hardner) <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            value={surface.paintBatchHardner} name='paintBatchHardner' readOnly={is_inspection} />
                                        {errors.paintBatchHardner && (
                                            <div className="error">{errors.paintBatchHardner}</div>
                                        )}
                                    </div>
                                </div>


                                <div className='col-12'>
                                    <div className="input-block local-forms">
                                        <label>Remarks </label>
                                        <textarea className='form-control' type='text' onChange={handleChange}
                                            value={surface.remark} name='remark' readOnly={is_inspection} />
                                    </div>
                                </div>


                                {is_inspection && (
                                    <div className="col-12">
                                        <div className="input-block local-forms">
                                            <label>Inspection Remarks </label>
                                            <textarea className='form-control' type='text' onChange={handleChange}
                                                value={surface.qc_remarks} name='qc_remarks' />
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

export default SurfaceFields