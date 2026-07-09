import React from 'react'

const Return_Table = ({ headers, data }) => {

    const headerKeys = Object.keys(headers);
    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="form-heading">
                                <h4 className="mb-0">Items Details</h4>
                            </div>
                        </div>
                        <div className="col-12 mt-3 table-responsive">
                            <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                <thead>
                                    <tr>
                                        <th>Sr no</th>
                                        {headerKeys.map((key, index) => (
                                            <th key={index}>{key}</th>
                                        ))}
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td>{rowIndex + 1}</td>
                                            {headerKeys.map((key, colIndex) => (
                                                <td key={colIndex} >
                                                    {row[headers[key]] ? row[headers[key]] : '-'}
                                                </td>
                                            ))}

                                        </tr>
                                    ))}
                                    {data?.length === 0 ? (
                                        <tr>
                                            <td colspan="999">
                                                <div className="no-table-data">
                                                    Enter items!
                                                </div>
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Return_Table