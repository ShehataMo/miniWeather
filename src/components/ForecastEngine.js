import React, { useReducer, useEffect } from 'react';
import '../css/all.min.css'
import '../css/weather-icons-wind.min.css'
import '../App.css';
import '../cardBig.css';
import ForecastCard from './ForecastCard';
import Header from './Header'
import Error from './Error'
import DayForecast from './DayForecast';

// this is the initial state of all the variables we need/expect to get from the API plus a couple others to handle errors
const initialState = {
  loading: true,
  errorMessage: 0,
  forecast: [
    {
      main: null,
      avgTemp : null,
      minTemp : null,
      maxTemp : null,
      day: null
    },
    {
      main: null,
      avgTemp : null,
      minTemp : null,
      maxTemp : null,
      day: null
    },
    {
      main: null,
      avgTemp : null,
      minTemp : null,
      maxTemp : null,
      day: null
    },
    {
      main: null,
      avgTemp : null,
      minTemp : null,
      maxTemp : null,
      day: null
    }
  ],
  cod:0
};

// The reducer is the function that will shift the state based on the dispatch value. 
// here it's unloading the values of dispatch onto the state variables

const reducer = (state, action)=> {
  switch (action.type) {
    case 'SEARCH_PROGRESS':
      return {
        ...state,
        loading: true
      }
      case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        cod: action.cod,
        forecast: [
          {
            main: action.main1,
            avgTemp : action.avgTemp1,
            minTemp : action.minTemp1,
            maxTemp : action.maxTemp1,
            day: action.day1
          },
          {
            main: action.main2,
            avgTemp : action.avgTemp2,
            minTemp : action.minTemp2,
            maxTemp : action.maxTemp2,
            day: action.day2
          },
          {
            main: action.main3,
            avgTemp : action.avgTemp3,
            minTemp : action.minTemp3,
            maxTemp : action.maxTemp3,
            day: action.day3
          },
          {
            main: action.main4,
            avgTemp : action.avgTemp4,
            minTemp : action.minTemp4,
            maxTemp : action.maxTemp4,
            day: action.day4
          }
        ]
      }
      case 'SEARCH_FAIL':
      return {
        ...state,
        errorMessage: action.error,
        loading: action.loading,
        cod: action.cod
      }
      default: 
      return state;
  } 
}

// base component
const ForecastEngine = ({ city, country, main, temp })=> {
  // basic declarations of state and the reducer hook
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, errorMessage, cod, forecast } = state;
//  assigning the background gardient color
  var highColor = 0;
  var lowColor = 0;
  var color = null;
  if(temp>12 && temp<40) {
      highColor = (1+(1-(temp-17)/28)*254);
      lowColor = highColor-150;
      color = `linear-gradient(0deg, rgb(255,${highColor},0),rgb(255,${lowColor},0))`; 

  } else if (temp<12) {
      highColor = (1+(1-(temp-(-20))/38)*254);
      lowColor = highColor+100;
      color = `linear-gradient(0deg, rgb(0,${lowColor},255),rgb(0,${highColor},255))`; 
  }

  // definition of the function that gets the API results and assignes it to dispatch
  // this happens once the search button is pressed
  useEffect ( () => {
    // once search is pressed, send search progress to display loading signal
    dispatch({
      type:'SEARCH_PROGRESS'
    });
    // some functions are needed to filter the API results and calculate the average for each day
    // forecast sends reading every 3 hours. That is 12 temps per day. Take average of the 12 to be the expected per day
    // function to extract all the 32 temps from the forecast
    const extract = (obj) => obj.main.temp;
    // function to slice the temps into 4 arrays - one array per day holding 12 temps
    function segment(arr) {
      let result = []; // this array will hold 4 internal arrays each of them holding 12 temps for each day
      for (let i = 0; i<arr.length; i+=12){
        result.push(arr.slice(i,i+12))
      }
      return result;
    }
    // function to get the average temp for each day
    function calcAvgs (arr) {
      let sum = 0;
      for (let i = 0; i<arr.length; i++){
          sum += arr[i]; 
      }
      let avg =  sum/arr.length;
      return Math.floor(avg);
    }
    // fetch the results from API the unload by dispatch
    // cod is the code returned form API, 200 is success otherwise it's faliure
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=48&units=metric&appid=644ba889d2629824a466b19685f307e0`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.cod === "200") {
        var temps = jsonResponse.list.map(extract); // extracting the temps from the list of each day
        var daysTemps = segment(temps); // apply the slice function to the temps function
        var avgTemps = daysTemps.map(calcAvgs); // retruns an array of strings with 4 average temps for each day
        dispatch({
          type: 'SEARCH_SUCCESS',
          cod: jsonResponse.cod,
          city: jsonResponse.city.name,

          main1: jsonResponse.list[0].weather[0].main,
          avgTemp1 : avgTemps[0],
          minTemp1 : Math.min.apply(Math,daysTemps[0]),
          maxTemp1 : Math.max.apply(Math,daysTemps[0]),
          day1: (new Date((jsonResponse.list[6].dt + jsonResponse.city.timezone) * 1000 )).toLocaleString('en-us', {weekday:'long'}),

          main2: jsonResponse.list[12].weather[0].main,
          avgTemp2 : avgTemps[1],
          minTemp2 : Math.min.apply(Math,daysTemps[1]),
          maxTemp2 : Math.max.apply(Math,daysTemps[1]),
          day2: (new Date((jsonResponse.list[12].dt + jsonResponse.city.timezone) * 1000 )).toLocaleString('en-us', {weekday:'long'}),

          main3: jsonResponse.list[24].weather[0].main,
          avgTemp3 : avgTemps[2],
          minTemp3 : Math.min.apply(Math,daysTemps[2]),
          maxTemp3 : Math.max.apply(Math,daysTemps[2]),
          day3: (new Date((jsonResponse.list[18].dt + jsonResponse.city.timezone) * 1000 )).toLocaleString('en-us', {weekday:'long'}),

          main4: jsonResponse.list[36].weather[0].main,
          avgTemp4 : avgTemps[3],
          minTemp4 : Math.min.apply(Math,daysTemps[3]),
          maxTemp4 : Math.max.apply(Math,daysTemps[3]),
          day4: (new Date((jsonResponse.list[30].dt + jsonResponse.city.timezone) * 1000 )).toLocaleString('en-us', {weekday:'long'})
        })
      } else if(jsonResponse.cod !== "200") {
        dispatch({
          type: 'SEARCH_FAIL',
          loading: false,
          error: jsonResponse.message,
          cod: jsonResponse.cod
        })
      }
        
    })
  },[city])

  // conditional rendering based on state values
  return(
    <div className="app">
     {
      //  render loading after calling the component to action
       loading === true  ? // if loading is true - useEffects has started talking to API
       <div className="container">
         <div className='loading'>     
          <i className='fas fa-spinner fa-4x spinner '></i>
         </div>
       </div>
       :
       cod === "200"  ? // if temp is updated and cod is 200 as in successful API response
       <div>
           <Header/>
            <div className="container">
              <div className="det" style= {{background: `${color}`}}>
                <ForecastCard
                  city= { city }
                  country = { country }
                  main = { main } 
                  temp = { temp }
                />
                <div className="det__dwn">
                  {forecast.map((day)=>(
                    <DayForecast 
                      avgTemp = {Math.floor(day.avgTemp)}
                      main = {day.main}
                      minTemp = {Math.floor(day.minTemp)}
                      maxTemp = {Math.floor(day.maxTemp)}
                      day = {day.day}
                      key={day.avgTemp}
                    />
                  ))}
                </div>
              </div>
            </div>
       </div>
       :
       cod !== "200" ? // if loading is then error happend
       <Error cod = { cod } errorMessage= { errorMessage } />
       :
       <h1>dunno</h1> // we never get to this point so yeah dunno!
     } 
     </div>
  )
}

export default ForecastEngine;

