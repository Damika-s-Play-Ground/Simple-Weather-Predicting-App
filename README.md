<div align="center">
  <h1> Simple Weather Predicting App 🌦️ </h1>
</div>
<p align="center">
  <img src="./asset/preview.png" alt="App Preview" height="400"/>
</p>


## About

This is a simple weather predicting app built using React.js. It allows users to search for the current weather conditions in any city. The app uses data from the OpenWeather API and provides information like temperature, humidity, wind speed, and more.

---

## Features

- **Search by City**: Look up the current weather in any city.
- **Dynamic Backgrounds**: Background changes according to weather conditions.
- **Weather Icons**: Visual representations of the current weather.
- **Gauge Meter**: A gauge meter showing temperature range.
- **Responsive**: Works on both desktop and mobile devices.

---

## Tech Stack

- React.js
- Axios
- OpenWeather API
- GitHub Pages for deployment

---

## Installation and Setup

### Clone the repository

```bash
git clone https://github.com/Damika-Anupama/Simple-Weather-Predicting-App.git
```
Navigate to the project directory
```bash
cd Simple-Weather-Predicting-App
``````
Install dependencies
```bash
npm install
``````

### Configure your API key

The app reads the OpenWeather API key from an environment variable. Copy the
example file and add your own key:

```bash
cp .env.example .env
```

Then edit `.env` and set `REACT_APP_OWM_KEY` to a key from
[OpenWeather](https://home.openweathermap.org/api_keys). `.env` is gitignored so
your key is never committed.

> ⚠️ **Security note:** an OpenWeather key was previously hardcoded in the source
> and pushed to this public repo. That key is compromised and **must be rotated** —
> generate a new one and revoke the old key in your OpenWeather dashboard. Also
> note that Create React App inlines `REACT_APP_*` values into the client bundle
> at build time, so any key shipped to the browser is inherently public; use a
> restricted free-tier key.

Start the development server
```bash
npm start
``````
Deployment
- The app is deployed using GitHub Pages. You can view the live app here.

Contributing
- Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
