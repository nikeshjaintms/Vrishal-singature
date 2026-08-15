import React, { useEffect } from 'react'
import { getUserProcedureMaster } from '../../../../../../Store/Store/Procedure/ProcedureMaster';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';

const RtClearanceForm = ({
    rt,
    rtForm,
    handleChange,
    handleChange2,
    error,
    data
}) => {

    console.log(data, '@@2')

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [])

    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }))

    return (
        <>
            <div className='row'>
                <div className='col-12 col-md-4 col-xl-4'>
                    <div className="input-block local-forms custom-select-wpr">
                        <label> Procedure No. <span className="login-danger">*</span></label>
                        <Dropdown
                            options={procedureOptions}
                            value={rt.procedure}
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
                        <label>Test Date <span className="login-danger">*</span></label>
                        <input type='date' className='form-control' value={rtForm.test_date} name='test_date' onChange={handleChange2} readOnly={data?.status !== 2}
                            max={new Date().toISOString().split("T")[0]} min={moment(data?.report_date).format("YYYY-MM-DD")} />
                        <div className='error'>{error?.test_date_err}</div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Source</label>
                        <input type='text' className='form-control' value={rtForm.source} name='source' readOnly={data?.status !== 2}
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.source_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Film Type</label>
                        <input type='text' className='form-control' value={rtForm.film_type} name='film_type'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.film_type_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Strength</label>
                        <input type='text' className='form-control' value={rtForm.strength} name='strength'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.strength_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Sensivity</label>
                        <input type='text' className='form-control' value={rtForm.sensivity} name='sensivity'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.sensivity_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Density</label>
                        <input type='text' className='form-control' value={rtForm.density} name='density'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.density_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Penetrameter</label>
                        <input type='text' className='form-control' value={rtForm.penetrameter} name='penetrameter'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.penetrameter_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Front</label>
                        <input type='text' className='form-control' value={rtForm.front} name='front'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.front_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Back</label>
                        <input type='text' className='form-control' value={rtForm.back} name='back'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.back_err}</div>
                </div>

                <div className='col-12 col-md-4 col-xl-4'>
                    <div className='input-block local-forms'>
                        <label>Acceptance Standard</label>
                        <input type='text' className='form-control' value={rtForm.acc_standard} name='acc_standard'
                            onChange={handleChange2} />
                    </div>
                    <div className='error'>{error?.acc_standard_err}</div>
                </div>
            </div>

        </>
    )
}

export default RtClearanceForm