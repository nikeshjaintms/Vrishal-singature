import React from 'react';

const StatusList = ({ statusOptions, value, onChange }) => {
    return (
        <div className='col-md-3'>
            <select
                className='form-control form-select'
                value={value}
                onChange={onChange}
            >
                <option value=''>Select Status</option>
                {statusOptions?.map((elem, i) => (
                    <option key={i} value={elem.value}>
                        {elem.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StatusList;
