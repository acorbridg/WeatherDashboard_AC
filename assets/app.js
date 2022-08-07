//api key variable
var APIkey = "27c3fb25ac281c0d47d1866e90304c5e"
var cityList = JSON.parse(localStorage.getItem("cityList") || "[]")
//function that calls the city name
function getGeoUrl (cityName){
    return `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIkey}`

}
//function that calls for latitude and longitude
function getWeatherUrl (lat, lon){
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIkey}&units=imperial`
}

function renderCurrentWeather (data, city) {
    // console.log(data)
    const $weather = $("#currentWeather")
    const html = $(`<h1>${city}</h1>
    <h3>Temp: ${data.current.temp} &deg;F</h3>
    <h3>Wind Speed: ${data.current.wind_speed} MPH</h3>
    <h3>Humidity: ${data.current.humidity}%</h3>
    <h3>UV Index: ${data.current.uvi}</h3>`
    )
    $weather.empty()
    $weather.append(html)

}

function renderDayBlock (data) {
    const $daily = $("#five")
    $daily.empty()
    for(let i=0; i<5; i++) {
        const newDate = new Date(data.daily[i].dt*1000)
        $daily.append($(`
        <div class="card"><div class="card-body">
        <h4>${newDate.getMonth()}/${newDate.getDate()}/${newDate.getFullYear()}</h4>
        <h5>Temp: ${data.daily[i].temp.day} &deg;F</h5>
        <h5>Wind: ${data.daily[i].wind_speed} MPH</h5>
        <h5>Humidity: ${data.daily[i].humidity}%</h5>
        </div>  
        </div>`))
    
        // console.log(data.daily)
    }
}
function historyCity (historyCityName) {
    const historyCityButton = $(`<div><button>${historyCityName}</button></div>`)  
        $(".cities").append(historyCityButton)
        historyCityButton.on("click", function() {
            $("form input").val(historyCityName)
            $("form").submit()
        })
}

//waiting for the page to be loaded
$(document).ready(() => {
    for(let i=0; i<cityList.length; i++) {
        historyCity (cityList[i])
    }
    $("form").on("submit", function(event) {
        event.preventDefault()
        const townName = $("form input").val()
        if (!cityList.includes(townName)) {
            cityList.push(townName)
            historyCity (townName)
        }
        window.localStorage.setItem("cityList", JSON.stringify(cityList))
        //promise to  pull data for SLC from getGeoUrl function
        $.ajax(getGeoUrl(townName)).then( (data)=> {
            const city = data[0]
            const lat = city.lat
            const lon = city.lon
            //promise to pull data for lat and lon from getWeatherUrl functions 
            $.ajax(getWeatherUrl(lat, lon)).then ((data) => {
                const daily = city.daily
                renderCurrentWeather (data, city.name) 
                renderDayBlock (data, daily)
            }) 
            
        })
    })
})



