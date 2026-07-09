import React from 'react';

const TableRow = ({ activity, data, onInputChange, errors, lockedDate = "" }) => {
    return (
        <tr>
            <td>{activity}</td>
            <td>
                <input
                    type="date"
                    className={`form-control ${errors?.performed_date && 'is-invalid'}`}
                    value={data?.performed_date}
                    onChange={(e) => onInputChange(e, 'performed_date')}
                    max={new Date().toISOString().split("T")[0]}
                    // min={lockedDate}
                />
                {errors?.performed_date && <div className="invalid-feedback">{errors.performed_date}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.start_surface_temp && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.start_surface_temp}
                    onChange={(e) => onInputChange(e, 'start_surface_temp')}
                />
                {errors?.start_surface_temp && <div className="invalid-feedback">{errors.start_surface_temp}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.start_dew_point && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.start_dew_point}
                    onChange={(e) => onInputChange(e, 'start_dew_point')}
                />
                {errors?.start_dew_point && <div className="invalid-feedback">{errors.start_dew_point}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.start_relative_humidity && 'is-invalid'}`}
                    placeholder="%"
                    value={data?.start_relative_humidity}
                    onChange={(e) => onInputChange(e, 'start_relative_humidity')}
                />
                {errors?.start_relative_humidity && <div className="invalid-feedback">{errors.start_relative_humidity}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.start_ambient_temp && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.start_ambient_temp}
                    onChange={(e) => onInputChange(e, 'start_ambient_temp')}
                />
                {errors?.start_ambient_temp && <div className="invalid-feedback">{errors.start_ambient_temp}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.finish_surface_temp && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.finish_surface_temp}
                    onChange={(e) => onInputChange(e, 'finish_surface_temp')}
                />
                {errors?.finish_surface_temp && <div className="invalid-feedback">{errors.finish_surface_temp}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.finish_dew_point && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.finish_dew_point}
                    onChange={(e) => onInputChange(e, 'finish_dew_point')}
                />
                {errors?.finish_dew_point && <div className="invalid-feedback">{errors.finish_dew_point}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.finish_relative_humidity && 'is-invalid'}`}
                    placeholder="%"
                    value={data?.finish_relative_humidity}
                    onChange={(e) => onInputChange(e, 'finish_relative_humidity')}
                />
                {errors?.finish_relative_humidity && <div className="invalid-feedback">{errors.finish_relative_humidity}</div>}
            </td>
            <td>
                <input
                    type="number"
                    className={`form-control ${errors?.finish_ambient_temp && 'is-invalid'}`}
                    placeholder="°C"
                    value={data?.finish_ambient_temp}
                    onChange={(e) => onInputChange(e, 'finish_ambient_temp')}
                />
                {errors?.finish_ambient_temp && <div className="invalid-feedback">{errors.finish_ambient_temp}</div>}
            </td>
        </tr>
    );
};

export default TableRow;
