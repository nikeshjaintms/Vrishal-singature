import React from 'react'
import { Pencil, Trash2 } from 'lucide-react';

const SuperVisorDetails = ({
    superVisor,
    superVisorData,
    superVisorError,
    errors3,
    editIndex2,
    handleChangeSupervisor,
    handleSaveSuperVisor,
    handleEditSupervisor,
    handleDeleteSupervisor
}) => {
    return (
        <div className='row'>
            <div className="col-12 mb-4 gap-4" style={{ justifyContent: "flex-start", alignItems: "center", display: "flex" }}>
                <div className="form-heading">
                    <h4 className='mb-0'>Site Supervisor Details:</h4>
                </div>
                <button type="button" onClick={handleSaveSuperVisor} className="btn btn-primary">{editIndex2 !== null ? 'Update' : 'Save'}</button>
                <div className='error' style={{ fontSize: '15px' }}>{superVisorError}</div>
            </div>

            <div className='row mt-2'>
                <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                        <label> Name <span className="login-danger">*</span></label>
                        <input type="text" className="form-control" name="name" onChange={handleChangeSupervisor} value={superVisor.name} />
                        <div className='error'>{errors3.name_err}</div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                        <label> Mobile <span className="login-danger">*</span></label>
                        <input type="number" className="form-control" name="mobile" onChange={handleChangeSupervisor} value={superVisor.mobile} />
                        <div className='error'>{errors3.mobile_err}</div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                        <label> Email <span className="login-danger">*</span></label>
                        <input type="email" className="form-control" name="email" onChange={handleChangeSupervisor} value={superVisor.email} />
                        <div className='error'>{errors3.email_err}</div>
                        <div className='error'>{errors3.email_err}</div>
                    </div>
                </div>
            </div>
            {superVisorData?.length > 0 && (
                <div className='col-12'>
                    <div className="table-responsive" style={{ minHeight: "130px" }}>
                        <table className="table table-striped custom-table comman-table mb-0">
                            <thead>
                                <tr>
                                    <th>Sr.</th>
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Email</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {superVisorData?.map((e, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td>{e.mobile}</td>
                                        <td>{e.email}</td>
                                        <td className="d-flex justify-content-end">
                                            <a className='action-icon mx-1' style={{ cursor: "pointer" }} onClick={() => handleEditSupervisor(i)} data-toggle="tooltip" data-placement="top" title="Edit">
                                                <Pencil />
                                            </a>
                                            <a className='action-icon mx-1' style={{ cursor: "pointer" }} onClick={() => handleDeleteSupervisor(i)} data-toggle="tooltip" data-placement="top" title="Delete">
                                                <Trash2 />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SuperVisorDetails