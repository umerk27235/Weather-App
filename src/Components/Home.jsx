import { useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space, Spin, Alert, Button, notification } from 'antd';
import '../App.css';

function Home() {
  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (isRainyDay) => {
    let message = 'Seems to be sunny today!';
    let description = "Don't forget to take water bottle with you.";
  
    if (isRainyDay) {
      message = 'It\'s going to rain!';
      description = 'Take your umbrella with you.';
    }
  
    api.open({
      message,
      description,
      duration: 6,
      style: {
        width: 600,
        backgroundColor: isRainyDay ? '#9099a1': '#fadb14', 
        color: isRainyDay ? '#fa541c' : '#333',
      },
      placement: 'topRight', 
    });
  };
  

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = async (city) => {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('City not found');
      }
      const { lat, lon } = data[0];
      return { latitude: lat, longitude: lon };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return null;
    }
  };

  const onSearch = async (city) => {
    if (!city.trim()) {
      setError('Please enter a valid city name');
      setWeatherData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const coordinates = await fetchCoordinates(city);
    if (coordinates) {
      await fetchWeatherData(coordinates.latitude, coordinates.longitude);
    } else {
      setError('City not found');
      setWeatherData(null);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <Space direction="vertical">
        <Search
          placeholder="Input search text (e.g., city name)"
          enterButton="Search"
          size="large"
          suffix={suffix}
          onSearch={onSearch}
        />
        {loading && <Spin size="large" />}
        {error && <Alert message={error} type="error" />}
        {weatherData && (
          <div>
            <h2>Weather Information</h2>
            <p className='blinkTextEffect'>Latitude: {weatherData.latitude}</p>
            <p className='blinkTextEffect'>Longitude: {weatherData.longitude}</p>
            <p className='blinkTextEffect'>Temperature: {weatherData.current_weather.temperature} °C</p>
            <p className='blinkTextEffect'>Wind Speed: {weatherData.current_weather.windspeed} km/h</p>
            <p className='blinkTextEffect'>Wind Direction: {weatherData.current_weather.winddirection}°</p>
            <p className='blinkTextEffect'>Elevation: {weatherData.elevation} m</p>
            <p className='blinkTextEffect'>Humidity: {Math.round(weatherData.hourly.relative_humidity_2m[0])}%</p>
            <Space>
              <Button type="primary" onClick={() => openNotification(weatherData.current_weather.temperature >= 30)}>
                Wanna Know About Today&apos;s Prediction?
              </Button>
            </Space>
            {contextHolder}
          </div>
        )}
      </Space>
    </div>
  );
}

export default Home;
