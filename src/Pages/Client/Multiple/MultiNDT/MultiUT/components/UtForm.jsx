import { Dropdown } from 'primereact/dropdown'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserProcedureMaster } from '../../../../../../Store/Store/Procedure/ProcedureMaster';
import moment from 'moment';

const UtForm = ({ data, utForm, error, handleChange2, ut, handleChange }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, []);

    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);
    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }));

    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Ultrasonic Test Clearance List Details</h4>
                                    </div>
                                </div>

                                <div className='row'>
                                    {data?.status !== 2 && (
                                        <div className="col-12 col-md-4 col-xl-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label>Magnetic Particle Testing Clearance No.</label>
                                                <input className='form-control' value={data?.test_inspect_no} readOnly />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms custom-select-wpr">
                                            <label>Magnetic Particle Testing Offer No.</label>
                                            <input className='form-control' value={data?.status === 2 ? data?.ndt_offer_no : data?.ndt_offer_no?.ndt_offer_no} readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className="input-block local-forms">
                                            <label>Test Date <span className="login-danger">*</span></label>
                                            <input className='form-control' type='date' name='testDate'
                                                value={utForm.testDate} onChange={handleChange2} readOnly={data?.status !== 2}
                                                max={new Date().toISOString().split("T")[0]} min={moment(data?.report_date).format("YYYY-MM-DD")}
                                            />
                                            <div className='error'>{error?.test_date_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className="input-block local-forms custom-select-wpr">
                                            <label> Procedure No. <span className="login-danger">*</span></label>
                                            <Dropdown
                                                options={procedureOptions}
                                                value={ut.procedure}
                                                onChange={(e) => handleChange(e, 'procedure')}
                                                filter className='w-100'
                                                placeholder="Select Procedure No."
                                                disabled={data?.status !== 2}
                                            />
                                            <div className='error'>{error?.procedure_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className="input-block local-forms">
                                            <label>Acceptance Standard</label>
                                            <input className='form-control' type='text' name='accStandard'
                                                value={utForm.accStandard} onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.accStandard_err}</div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Test Details</h4>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Surface Condition </label>
                                            <input className='form-control' type='text' value={utForm.surface_condition}
                                                name='surface_condition' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.surface_condition_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Extent Of Examination </label>
                                            <input className='form-control' type='text' value={utForm.extent_examination}
                                                name='extent_examination' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.extent_examination_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Examination Stage</label>
                                            <input className='form-control' type='text' value={utForm.examination_stage}
                                                name='examination_stage' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.examination_stage_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Examination Surface</label>
                                            <input className='form-control' type='text' value={utForm.examination_surface}
                                                name='examination_surface' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.examination_surface_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Technique</label>
                                            <input className='form-control' type='text' value={utForm.technique}
                                                name='technique' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.technique_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Basic Cal. Block</label>
                                            <input className='form-control' type='text' value={utForm.basic_block}
                                                name='basic_block' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.basic_block_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Equipment Modal & Make</label>
                                            <input className='form-control' type='text' value={utForm.equipment_model}
                                                name='equipment_model' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.equipment_model_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Reference Block Id</label>
                                            <input className='form-control' type='text' value={utForm.ref_block}
                                                name='ref_block' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.ref_block_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Equipment No.</label>
                                            <input className='form-control' type='text' value={utForm.equipment_no}
                                                name='equipment_no' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.equipment_no_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Scanning Sensitivity Level</label>
                                            <input className='form-control' type='text' value={utForm.scan_level}
                                                name='scan_level' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.scan_level_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Couplaint</label>
                                            <input className='form-control' type='text' value={utForm.couplant}
                                                name='couplant' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.couplant_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Ref. Sensitivity Level</label>
                                            <input className='form-control' type='text' value={utForm.ref_level}
                                                name='ref_level' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.ref_level_err}</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Calibration Details</h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Search Unit SR. No.</label>
                                            <input className='form-control' type='text' value={utForm.search_unit}
                                                name='search_unit' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.search_unit_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Test Range</label>
                                            <input className='form-control' type='text' value={utForm.test_range}
                                                name='test_range' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.test_range_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Model</label>
                                            <input className='form-control' type='text' value={utForm.model}
                                                name='model' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.model_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Ref. DB</label>
                                            <input className='form-control' type='text' value={utForm.ref_db}
                                                name='ref_db' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.ref_db_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Wave Mode</label>
                                            <input className='form-control' type='text' value={utForm.wave_mode}
                                                name='wave_mode' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.wave_mode_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Trans. Corr.</label>
                                            <input className='form-control' type='text' value={utForm.trans_cor}
                                                name='trans_cor' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.trans_cor_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Freq.</label>
                                            <input className='form-control' type='text' value={utForm.freq}
                                                name='freq' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.freq_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Refer Angle</label>
                                            <input className='form-control' type='text' value={utForm.refer_angle}
                                                name='refer_angle' onChange={handleChange2} readOnly={data?.status !== 2} />
                                            <div className='error'>{error?.refer_angle_err}</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UtForm