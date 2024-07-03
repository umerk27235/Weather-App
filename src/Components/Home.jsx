import { useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space, Spin, Alert } from 'antd';
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

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const latitude = 24.860966;  
  const longitude = 66.990501; 

  const onSearch = async () => {
    setLoading(true);
    setError(null);

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

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

  return (
    <div>
      <h1>Weather App</h1>
      <Space direction="vertical">
        <Search
          placeholder="Input search text (e.g., country or city)"
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
            <p className='blinkTextEffect'>Latitude: {latitude}</p>
            <p className='blinkTextEffect'>Longitude: {longitude}</p>
            <p className='blinkTextEffect'>Temperature: {weatherData.current.temperature_2m} °C</p>
            <p className='blinkTextEffect'>Wind Speed: {weatherData.current.wind_speed_10m} m/s</p>
            
          </div>
        )}
      </Space>
    </div>
  );
}

export default Home;
