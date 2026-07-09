import React, { useEffect, useState } from 'react'
import { getUserProcedureMaster } from '../../../../../../Store/Piping/Procedure/ProcedureMaster';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';

const FTClearanceForm = ({
    rt,
    rtForm,
    handleChange,
    handleChange2,
    error,
    data
}) => {

    console.log(data, '@@2')

    const dispatch = useDispatch();
    const [FTType, setFTType] = useState(null);

    const FTTypeOptions = [
        { label: "Local FT", value: "LOCAL" },
        { label: "Overall FT", value: "OVERALL" },
        { label: "Furnace FT", value: "FURNACE" },
    ];

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [])

    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);
    console.log(procedureData, '@@procedureData')

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }))
    console.log(procedureOptions, '@@procedureOptions')

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
                            // disabled={data?.status !== 2}
                        />
                        <div className='error'>{error?.procedure_err}</div>
                    </div>
                </div>


                <div className='col-12 col-md-4 col-xl-4'>
                    <div className="input-block local-forms">
                        <label>Test Date <span className="login-danger">*</span></label>
                        <input type='date' className='form-control' value={rtForm.test_date} name='test_date' onChange={handleChange2} 
                            max={new Date().toISOString().split("T")[0]} min={moment(data?.offer_date).format("YYYY-MM-DD")} />
                        <div className='error'>{error?.test_date_err}</div>
                    </div>
                </div>

            </div>



        </>
    )
}

export default FTClearanceForm