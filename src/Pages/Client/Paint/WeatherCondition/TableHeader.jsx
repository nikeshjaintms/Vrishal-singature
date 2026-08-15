import React from 'react'

const TableHeader = ({ setWeatherTime = {}, weatherTime = {} }) => {

    const handleTimeChange = (e, field) => {
        setWeatherTime((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    return (
        <thead>
            <tr>
                <th rowSpan="2">Activity</th>
                <th rowSpan="2">Date Performed</th>
                <th colSpan="2">Start Time</th>
                <th colSpan="2">
                    <input
                        className='form-control w-50 h-50'
                        type="time"
                        value={weatherTime.startTime}
                        onChange={(e) => handleTimeChange(e, 'startTime')}
                    />
                </th>
                <th colSpan="2">Finish Time</th>
                <th colSpan="2">
                    <input
                        className='form-control w-50 h-50'
                        type="time"
                        value={weatherTime.endTime}
                        onChange={(e) => handleTimeChange(e, 'endTime')}
                    />
                </th>
            </tr>
            <tr>
                <th>Surface or Metal Temp °C</th>
                <th>Dew Point °C</th>
                <th>Relative Humidity %</th>
                <th>Ambient Temp °C</th>
                <th>Surface or Metal Temp °C</th>
                <th>Dew Point °C</th>
                <th>Relative Humidity %</th>
                <th>Ambient Temp °C</th>
            </tr>
        </thead>
    )
}

export default TableHeader