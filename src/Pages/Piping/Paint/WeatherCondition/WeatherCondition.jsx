import React, { useEffect, useState } from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import moment from 'moment';

const WeatherCondition = ({
  weatherActivity,
  handleWeatherData,
  validateWeather,
  weatherData,
  setWeatherTime,        // ✅ remove default {}
  weatherTime,
  setFilteredWeather,
  lockedDate = "",
  data
}) => {


  console.log("weatherTime", weatherTime)

  const [weather, setWeather] = useState(weatherActivity.map((activity) => ({
    activity_type: activity,
    performed_date: '',
    start_surface_temp: '',
    start_dew_point: '',
    start_relative_humidity: '',
    start_ambient_temp: '',
    finish_surface_temp: '',
    finish_dew_point: '',
    finish_relative_humidity: '',
    finish_ambient_temp: '',
  })));

  useEffect(() => {
    if (weatherData) {
      const updatedWeather = weatherActivity.map((activity) => {
        const existingData = weatherData.find((w) => w.activity_type === activity);

        return {
          activity_type: activity,
          performed_date: existingData
            ? moment(existingData?.performed_date).format('YYYY-MM-DD')
            : '',
          start_surface_temp: existingData?.start_surface_temp || '',
          start_dew_point: existingData?.start_dew_point || '',
          start_relative_humidity: existingData?.start_relative_humidity || '',
          start_ambient_temp: existingData?.start_ambient_temp || '',
          finish_surface_temp: existingData?.finish_surface_temp || '',
          finish_dew_point: existingData?.finish_dew_point || '',
          finish_relative_humidity: existingData?.finish_relative_humidity || '',
          finish_ambient_temp: existingData?.finish_ambient_temp || '',
        };
      });

      setWeather(updatedWeather);
    }
  }, [weatherData]);

  useEffect(() => {
    const newFilteredWeather = weather
      ?.filter(item => item.performed_date)
      ?.map(item => ({
        type: item.activity_type,
        date: item.performed_date
      }));

    setFilteredWeather(newFilteredWeather);
  }, [weather]);

  const [errors, setErrors] = useState([]);
  const handleInputChange = (e, index, field) => {
    const updatedForm = [...weather];
    updatedForm[index][field] = e.target.value;
    setWeather(updatedForm);
  };

  const validateForm = () => {
    const validationErrors = weather.map((activity, index) => {
      let error = {};
      if (!activity.performed_date) error.performed_date = 'Date is required';
      if (!activity.start_surface_temp) error.start_surface_temp = 'Start temperature is required';
      if (!activity.start_dew_point) error.start_dew_point = 'Start dew point is required';
      if (!activity.start_relative_humidity) error.start_relative_humidity = 'Start relative humidity is required';
      if (!activity.start_ambient_temp) error.start_ambient_temp = 'Start ambient temperature is required';
      if (!activity.finish_surface_temp) error.finish_surface_temp = 'Finish temperature is required';
      if (!activity.finish_dew_point) error.finish_dew_point = 'Finish dew point is required';
      if (!activity.finish_relative_humidity) error.finish_relative_humidity = 'Finish relative humidity is required';
      if (!activity.finish_ambient_temp) error.finish_ambient_temp = 'Finish ambient temperature is required';
      return error;
    });
    setErrors(validationErrors);
    return validationErrors.every(err => Object.keys(err).length === 0);
  };

  useEffect(() => {
    handleWeatherData(weather)
  }, [weather, handleWeatherData]);

  useEffect(() => {
    validateWeather.current = validateForm
  }, [weather])

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <h4>Weather Condition</h4>
            <table className="table table-bordered">
              <TableHeader setWeatherTime={setWeatherTime} weatherTime={weatherTime} />
              <tbody>
                {weatherActivity.map((activity, index) => (
                  <TableRow
                    key={index}
                    activity={activity}
                    data={weather[index]}
                    errors={errors[index]}
                    lockedDate={lockedDate}
                    onInputChange={(e, field) => handleInputChange(e, index, field)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCondition