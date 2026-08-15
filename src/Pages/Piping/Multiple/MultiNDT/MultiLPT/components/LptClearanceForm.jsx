import React from 'react'

const LptClearanceForm = ({
    data,
    lptForm,
    developer,
    penetrant,
    cleaner,
    error,
    handleChange2,
    handleChangeDeveloper,
    handleChangePenetrant,
    handleChangeCleaner,
}) => {
console.log("lptForm", lptForm);
console.log("datra lpt cleance form",data);
console.log("developer",developer);
const isViewMode = data?.status !== 1;

    
    return (
        <>
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
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.surface_condition} name='surface_condition' onChange={handleChange2} />
                                            <div className='error'>{error?.surface_condition_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Surface Temp.</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.surface_temperature} name='surface_temperature' onChange={handleChange2} />
                                            <div className='error'>{error?.surface_temperature_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Examination Stage</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.examination_stage} name='examination_stage' onChange={handleChange2} />
                                            <div className='error'>{error?.examination_stage_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Technique</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.technique} name='technique' onChange={handleChange2} />
                                            <div className='error'>{error?.technique_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Lighting Equipment</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.lighting_equipment} name='lighting_equipment' onChange={handleChange2} />
                                            <div className='error'>{error?.lighting_equipment_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Lighting Intensity</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.lighting_intensity} name='lighting_intensity' onChange={handleChange2} />
                                            <div className='error'>{error?.lighting_intensity_err}</div>
                                        </div>
                                    </div>

                                    <div className='col-12 col-md-4 col-xl-4'>
                                        <div className='input-block local-forms'>
                                            <label>Extent Of Examination(%)</label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={lptForm.extent_examination} name='extent_examination' onChange={handleChange2} />
                                            <div className='error'>{error?.extent_examination_err}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-12 col-md-3 col-xl-3'>
                                        <div className='input-block local-forms'>
                                            <label>Type</label>
                                            <input type='text' className='form-control'  value={'Penetrant: Solvent Removable'} readOnly />
                                        </div>
                                    </div>
                                    <div className='col-12 col-md-3 col-xl-3'>
                                        <div className='input-block local-forms'>
                                            <label>Make </label>
                                            <input type='text' className='form-control' disabled={isViewMode}  value={penetrant.make} name='make' onChange={handleChangePenetrant} />
                                             <div className='error'>{error?.pen_make_err}</div>
                                        </div>
                                    </div>
                                   
                                    <div className='col-6 col-md-3 col-xl-3'>
                                        <div className='input-block local-forms'>
                                            <label>Batch No. </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={penetrant.batch_no} name='batch_no' onChange={handleChangePenetrant} />
                                            <div className='error'>{error?.pen_batch_no_err}</div>
                                        </div>
                                    </div>
                                    <div className='col-6 col-md-3 col-xl-3'>
                                        <div className='input-block local-forms'>
                                            <label>Validity </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={penetrant.validity} name='validity' onChange={handleChangePenetrant} />
                                            <div className='error'>{error?.pen_validity_err}</div>
                                        </div>
                                    </div>
                                </div>

{/* <div className="row">
  <div className="col">
    <div className="input-block local-forms">
      <label>Type</label>
      <input
        type="text"
        className="form-control"
        value="Penetrant: Solvent Removable"
        readOnly
      />
    </div>
  </div>

  <div className="col">
    <div className="input-block local-forms">
      <label>Make</label>
      <input
        type="text"
        className="form-control"
        value={penetrant.make}
        name="make"
        onChange={handleChangePenetrant}
      />
      <div className="error">{error?.pen_make_err}</div>
    </div>
  </div>

  <div className="col">
    <div className="input-block local-forms">
      <label>Model</label>
      <input
        type="text"
        className="form-control"
        value={penetrant.model}
        name="model"
        onChange={handleChangePenetrant}
      />
      <div className="error">{error?.pen_model_err}</div>
    </div>
  </div>

  <div className="col">
    <div className="input-block local-forms">
      <label>Batch No.</label>
      <input
        type="text"
        className="form-control"
        value={penetrant.batch_no}
        name="batch_no"
        onChange={handleChangePenetrant}
      />
      <div className="error">{error?.pen_batch_no_err}</div>
    </div>
  </div>

  <div className="col">
    <div className="input-block local-forms">
      <label>Validity</label>
      <input
        type="text"
        className="form-control"
        value={penetrant.validity}
        name="validity"
        onChange={handleChangePenetrant}
      />
      <div className="error">{error?.pen_validity_err}</div>
    </div>
  </div>
</div> */}

                                <div className='row'>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Type</label>
                                            <input type='text' className='form-control' value={'Cleaner: Solvent Removable'} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Make </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={cleaner.make} name='make' onChange={handleChangeCleaner} />
                                            <div className='error'>{error?.clean_make_err}</div>
                                        </div>
                                    </div>
                                   
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Batch No. </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={cleaner.batch_no} name='batch_no' onChange={handleChangeCleaner} />
                                            <div className='error'>{error?.clean_batch_err}</div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Validity </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={cleaner.validity} name='validity' onChange={handleChangeCleaner} />
                                            <div className='error'>{error?.clean_validity_err}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Type</label>
                                            <input type='text' className='form-control'  value={'Developer: Solvent Removable'} readOnly />
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Make </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={developer.make} name='make' onChange={handleChangeDeveloper} />
                                            <div className='error'>{error?.dev_make_err}</div>
                                        </div>
                                    </div>
                                                            
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Batch No.</label>
                                            <input type='text' className='form-control'disabled={isViewMode} value={developer.batch_no} name='batch_no' onChange={handleChangeDeveloper} />
                                            <div className='error'>{error?.dev_batch_err}</div>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='input-block local-forms'>
                                            <label>Validity </label>
                                            <input type='text' className='form-control' disabled={isViewMode} value={developer.validity} name='validity' onChange={handleChangeDeveloper} />
                                            <div className='error'>{error?.dev_validity_err}</div>
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

export default LptClearanceForm