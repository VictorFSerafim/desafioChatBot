const axios = require('axios');

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search";
const OPEN_METEO_API_URL = "https://api.open-meteo.com/v1/forecast";


async function SearchInfoLocationByCity(city) {
    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            params: {
                q: city,
                format: 'json',
                limit: 1 
            }
        });
        return response.data;
    } catch (error) {
             console.error(`Erro ao buscar ${city}:`, error.message);
             return null;
    }
}


async function SearchTemperature(lat, lon) {
    try {
        const response = await axios.get(OPEN_METEO_API_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                current: 'temperature_2m,weather_code',              
                forecast_days: 1 
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar dados climáticos para (${lat}, ${lon}):`, error.message);
        return null;
    }
}

module.exports = {
    SearchInfoLocationByCity,
    SearchTemperature
};