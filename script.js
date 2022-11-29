
//Declare a variable to store the searched city
var city="";
// variable declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}
// Here we create the AJAX call
function currentWeather(city){
    // Here we build the URL so we can get a data from server side.
    var queryURL= "https://weatherdbi.herokuapp.com/data/weather/" + city;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){

        // parse the response to display the current weather including the City name. the Date and the weather icon. 
        console.log(response);
        
    var name_of_region = data.region;
    var day_hour = data.currentConditions.dayhour;
    var temp_fmt_cel = data.currentConditions.temp.c +" °C";
     var temp_fmt_farh = data.currentConditions.temp.f+" °F";
    var precipitation = "Precipitation: " +data.currentConditions.precip;
    var humidity = "Humidity: " + data.currentConditions.humidity;
    var winds_in_km = "Winds: "+data.currentConditions.wind.km;
     var winds_in_mile = data.currentConditions.wind.mile;
    var comment = "Comment : " +data.currentConditions.comment;
    


        // Display UVIndex.
        //By Geographic coordinates method and using appid and coordinates as a parameter we are going build our uv query url inside the function below.
        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
    // This function returns the UVIindex response.
function UVIndex(ln,lt){
    //lets build the url for uvindex.
    var uvqURL="https://weatherdbi.herokuapp.com/data/weather/"+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}
    
// Here we display the 7 days forecast for the current city.
function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://weatherdbi.herokuapp.com/data/weather/"+cityid;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<7;i++){
             var element = weekforecastArr[i];
            var ind_day = element.day ;
            var ind_comment = element.comment;
            var ind_min_temp_c = element.min_temp.c+" °C";;
             var ind_min_temp_f = element.min_temp.f+" °F";
             var ind_max_temp_c = element.max_temp.c+" °C";;
             var ind_max_temp_f = element.max_temp.f+" °F";
            var ind_iconUrl = element.iconURL;
            
            
            console.log(ind_day);
              console.log(ind_comment);
    
              console.log(ind_min_temp_c);
              console.log(ind_min_temp_f);
              console.log(ind_max_temp_c);
               console.log(ind_max_temp_f);
            console.log(ind_iconUrl);
            
            
            $('#weekForecast').append('<div class="weekday"><div class="cardtext" id="ind_day">'+ind_day+'</div><div class="cardtext" id="ind_icon"><img src="'+ind_iconUrl+'" alt="" class="cardimag" id="indweatherIcon" /></div><div class="cardtext" id="ind_comment">'+ind_comment+'</div><div class="cardtext" id="ind_min_temp">Min :'+ind_min_temp_c+' / '+ind_min_temp_f+'</div><div class="cardtext" id="ind_max_temp">Max :'+ind_max_temp_c+' / '+ind_max_temp_f+'</div></div>&nbsp');
            
            
            
        }
       

       var winds = winds_in_km+ " Km/h " + " or " +winds_in_mile+ " Miles/h";
    
   document.getElementById("location").innerHTML = name_of_region;
    document.getElementById("dateTime").innerHTML = day_hour;
       document.getElementById("temperatureC").innerHTML = temp_fmt_cel;
       document.getElementById("temperatureF").innerHTML = temp_fmt_farh;
       document.getElementById("txtWord").innerHTML = comment;
    document.getElementById("weatherIcon").src=iconURl;
      document.getElementById("humidity").innerHTML = humidity;
       document.getElementById("precipitation").innerHTML = precipitation;
      document.getElementById("wind").innerHTML = winds;
       
    
    
    $("#city").val('');
   
    
    

    });
}

//Daynamically add the passed city on the search history
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}
// display the past search again when the list group item is clicked in search history
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Clear the search history from the page
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
//Click Handlers
$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);
$("#clear-history").on("click",clearHistory);





















