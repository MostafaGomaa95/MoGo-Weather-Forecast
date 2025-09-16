let searchInput = document.getElementById("searchInput");

// Get Date Elements
let todayDate = document.getElementById("todayDate");
let tomDate = document.getElementById("tomDate");
let atmDate = document.getElementById("atmDate");
let rainChance = document.getElementById("rainChance");
let windSpeed = document.getElementById("windSpeed");

// Get Today Elements
let cityLocation = document.getElementById("cityLocation");
let todayTmp = document.getElementById("todayTmp");
let todayIcon = document.getElementById("todayIcon");
let todayCondition = document.getElementById("todayCondition");
let windDirection = document.getElementById("windDirection");

// Get Tomorrow Elements
let tomIcon = document.getElementById("tomIcon");
let tomMaxTemp = document.getElementById("tomMaxTemp");
let tomMinTemp = document.getElementById("tomMinTemp");
let tomState = document.getElementById("tomState");

// Get After Tomorrow Elements
let atmIcon = document.getElementById("atmIcon");
let atmMaxTemp = document.getElementById("atmMaxTemp");
let atmMinTemp = document.getElementById("atmMinTemp");
let atmState = document.getElementById("atmState");

// Fetch Data
async function getData(location) {
    let response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=3bfb758e8ad743dc81475658251409&q=${location}&days=3`
    );
    let data = await response.json();
    if (!response.ok) return null;
    return data;
}

// Get Dates
function getDays() {
    function getParts(date) {
        return {
            weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
            day: date.toLocaleDateString("en-GB", { day: "numeric" }),
            month: date.toLocaleDateString("en-GB", { month: "long" }),
        };
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);

    return {
        today: getParts(today),
        tomorrow: getParts(tomorrow),
        afterTomorrow: getParts(afterTomorrow),
    };
}

// Display Data Logic
function setDates() {
    let daysDates = getDays();

    todayDate.innerHTML = `<div>${daysDates.today.weekday}</div>
    <div>${daysDates.today.day} ${daysDates.today.month}</div>`;
    tomDate.innerHTML = `<div>${daysDates.tomorrow.weekday}</div>`;
    atmDate.innerHTML = `<div>${daysDates.afterTomorrow.weekday}</div>`;
}
async function setForecast(searchLocation = "cairo") {
    let responseData = await getData(searchLocation);
    if (responseData === null) return;
    setDayOne(responseData);
    setDayTwo(responseData.forecast.forecastday[1]);
    setDayThree(responseData.forecast.forecastday[2]);
}
function setDayOne(dOne) {
    cityLocation.innerHTML = dOne.location.name;
    todayTmp.innerHTML = `${dOne.current.temp_c} <sup>o</sup> C`;
    const icon = dOne.current.condition.icon;
    todayIcon.src = getIconURL(icon);
    todayCondition.innerHTML = dOne.current.condition.text;
    rainChance.innerHTML = `${dOne.forecast.forecastday[0].day.daily_chance_of_rain} %`;
    windSpeed.innerHTML = `${dOne.current.wind_kph} km/h`;
    windDirection.innerHTML = dOne.current.wind_dir;

}
function setDayTwo(dTwo) {
    const icon = dTwo.day.condition.icon;
    tomIcon.src = getIconURL(icon);
    tomMaxTemp.innerHTML = `${dTwo.day.maxtemp_c} <sup>o</sup> C`;
    tomMinTemp.innerHTML = `${dTwo.day.mintemp_c} <sup>o</sup> C`;
    tomState.innerHTML = dTwo.day.condition.text;

}
function setDayThree(dThree) {
    const icon = dThree.day.condition.icon;
    atmIcon.src = getIconURL(icon);
    atmMaxTemp.innerHTML = `${dThree.day.maxtemp_c} <sup>o</sup> C`;
    atmMinTemp.innerHTML = `${dThree.day.mintemp_c} <sup>o</sup> C`;
    atmState.innerHTML = dThree.day.condition.text;
}

function getIconURL(iconPath) {
    return iconPath.startsWith("//") ? `https:${iconPath}` : iconPath;
}

// Run Logic
setDates();
setForecast();
searchInput.addEventListener("input", function () {
    setForecast(searchInput.value);
});
