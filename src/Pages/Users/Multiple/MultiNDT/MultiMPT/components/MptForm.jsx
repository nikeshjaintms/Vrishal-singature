import moment from 'moment'
import React from 'react'

const MptForm = ({ data, mptForm, error, handleChange2 }) => {
    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Magnetic Particle Testing Clearance Details</h4>
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
                                        <div className='input-block local-forms'>
                                            <label>Test Date <span className="login-danger">*</span></label>
                                            <input type='date' className='form-control' value={mptForm.test_date} name='test_date'
                                                onChange={handleChange2} readOnly={data?.status !== 2}
                                                max={new Date().toISOString().split("T")[0]}
                                                min={moment(data?.report_date).format("YYYY-MM-DD")}
                                            />
                                            <div className='error'>{error?.test_date_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-8 col-xl-8'>
                                        <div className='input-block local-forms'>
                                            <label>Acceptance Standard</label>
                                            <input type='text' className='form-control' value={mptForm.acc_standard} name='acc_standard'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.acc_standard_err}</div>
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
                                            <label>Surface Condition</label>
                                            <input type='text' className='form-control' value={mptForm.surface_condition} name='surface_condition'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.surface_condition_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Extent Of Examination</label>
                                            <input type='text' className='form-control' value={mptForm.extent_examniation} name='extent_examniation'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.extent_examniation_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Examination Stage</label>
                                            <input type='text' className='form-control' value={mptForm.examination_stage} name='examination_stage'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.examination_stage_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Post Cleaning</label>
                                            <input type='text' className='form-control' value={mptForm.post_cleaning} name='post_cleaning'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.post_cleaning_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Technique</label>
                                            <input type='text' className='form-control' value={mptForm.technique} name='technique'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.technique_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Megnetization</label>
                                            <input type='text' className='form-control' value={mptForm.megnetization} name='megnetization'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.megnetization_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Lighting Equipment</label>
                                            <input type='text' className='form-control' value={mptForm.lighting_equipment} name='lighting_equipment'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.lighting_equipment_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Medium</label>
                                            <input type='text' className='form-control' value={mptForm.medium} name='medium'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.medium_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Lighting Intensity</label>
                                            <input type='text' className='form-control' value={mptForm.lighting_intensity} name='lighting_intensity'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.lighting_intensity_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Yoke Spacing</label>
                                            <input type='text' className='form-control' value={mptForm.yoke_spacing} name='yoke_spacing'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.yoke_spacing_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Particle</label>
                                            <input type='text' className='form-control' value={mptForm.particle} name='particle'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.particle_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Yoke Sr. No.</label>
                                            <input type='text' className='form-control' value={mptForm.yoke_no} name='yoke_no'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.yoke_no_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Yoke Make and Model</label>
                                            <input type='text' className='form-control' value={mptForm.yoke_model} name='yoke_model'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.yoke_model_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Particle Batch No.</label>
                                            <input type='text' className='form-control' value={mptForm.particle_batch} name='particle_batch'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.particle_batch_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Contrast</label>
                                            <input type='text' className='form-control' value={mptForm.contrast} name='contrast'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.contrast_err}</div>
                                    </div>
                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Contrast Batch No.</label>
                                            <input type='text' className='form-control' value={mptForm.contrast_batch} name='contrast_batch'
                                                onChange={handleChange2} readOnly={data?.status !== 2} />
                                        </div>
                                        <div className='error'>{error?.contrast_batch_err}</div>
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

export default MptForm