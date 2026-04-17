import request from "request";

/**
 * Aqui se defienn el nombre del pais a consultar cgiendo la variable name del pais
 * @param name - Nombre del pais a consultar
 * @param callback - Para festinar error y datos 
 */
const countryCapital = (
  name: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(`REST Countries API is not available: ${error.message}`, undefined);
    } else if (response.body.length === 0) {
      callback(`REST Countries API error: country not found`, undefined);
    } else {
      callback(undefined, response);
    }
  });
};

/**
 * Funcion para obtener toda la informaciondel tiempo por dias dada la lungitud y latitud del pais seleccionado y opbtenido con contrycapital
 * @param lat - Latitud
 * @param lon - Longitud 
 * @param startDate - Fecha de inicio al analizar
 * @param endDate - Fecha final a anilizar
 * @param callback - Callback para los datos y errores
 */
const currentWeather = (
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  callback: (
    err: string | undefined,
    data: request.Response | undefined,
  ) => void,
) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max`;

  request({ url: url, json: true }, (error: Error, response) => {
    if (error) {
      callback(`Open-Meteo API is not available: ${error.message}`, undefined);
    } else if (response.body.error) {
      callback(`Open-Meteo API error: ${response.body.reason}`, undefined);
    } else {
      callback(undefined, response);
    }
  });
};

// Procesamos la cantidad de argumentos
if (process.argv.length < 5) {
  console.log("Numero de argumentos inválidos");
  process.exit(1);
}

/**
 * Funcion principal que dado el nomrbe del pais gentina con callback chaining las dos llamadas a la funciones 
 * 
 */
countryCapital(process.argv[2], (countryErr, countryData) => {
  if (countryErr) {
    console.log("error");
    console.log(countryErr);
  } else if (countryData) {

    const countryInfo = countryData.body[0];
    const countryName = countryInfo.name.common;
    const capitalName = countryInfo.capital[0];
    const latitude: number = countryInfo.latlng[0];
    const longitude: number = countryInfo.latlng[1];
    const regionName = countryInfo.region;
    const populationNum = countryInfo.population;

    console.log(`País: ${countryName}`);
    console.log(`Capital: ${capitalName}`);
    console.log(`Coordenadas: Lat ${latitude}, Lon ${longitude}`);
    console.log(`Región: ${regionName}`);
    console.log(`Población: ${populationNum}\n`);

    currentWeather(latitude, longitude, process.argv[3], process.argv[4], (wheatherErr, wheatherData) => {
      if (wheatherErr) {
        console.log(wheatherErr);
      } else if (wheatherData) {
        console.table(wheatherData.body.daily);
      }
    })
  }
});

