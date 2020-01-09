/*!
 *
 * Developed By Rishi Ramesh
 * Update New - 11/12/2019
 */
$(document).ready(function() {
    app.initialized() // Application Life Cycle Initialization
        .then(function(_client) {
            var city = "";
            var local_citynames = [];
            var myLatitude = 0;
            var myLongitude = 0;
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?";
            var weatherURL = "https://api.openweathermap.org/data/2.5/weather?";
            var headers = {
                "Authorization": "Basic <%= encode(iparam.api_key) %>"				//Encrypted Header For API Request
            };
            var options = {
                headers: headers
            };
            var client = _client;
            client.events.on('app.activated',					//Application Activation
                function() {
                    client.db.get("city:5").then(
                        function(data) {
                            var j = 0;
                            var n = data.city_names.length;
                            for (var i = n - 1; i >= n - 5; i--) {
                                if (i < 0)
                                    break;
                                local_citynames[j] = data.city_names[i];
                                j++;

                            }
                            document.getElementById("recent").innerHTML = local_citynames.join(", ");
                        });
                    $(".wrapper").css("margin-top", ($(window).height()) / 5);
                    //DATE AND TIME//
                    //Converted into days, months, hours, day-name, AM/PM
                    var dt = new Date();
                    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    $('#day').html(days[dt.getDay()]);
                    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    $('#date').html(months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear());
                    //GEOLOCATION and WEATHER API//
                    if (navigator.geolocation) { 				//Weather Using Navigator Location (Automated User Location)
                        navigator.geolocation.getCurrentPosition(function(position) {
                            myLatitude = parseFloat(Math.round(position.coords.latitude * 100) / 100).toFixed(2);
                            myLongitude = parseFloat(Math.round(position.coords.longitude * 100) / 100).toFixed(2);
                    
                            client.request.get(`${weatherURL}lat=${myLatitude}&lon=${myLongitude}&id=524901&appid=<%=iparam.api_key%>`, options)			//API Request For Open Weather
                                .then(
                                    function(data) {
                                        $('#city').html(JSON.parse(data.response).name + ", " + JSON.parse(data.response).sys.country);
                                        var temp = (JSON.parse(data.response).main.temp - 273);
                                        $('#temperature').html(Math.round(temp));
                                        $('.windspeed').html(JSON.parse(data.response).wind.speed + " Km/h");
                                    },
                                    function(error) {
                                        console.log(error);
                                    });

                        });
                    } else {
                        $("#city").html("Please turn on Geolocator on Browser.")
                    }




                    $("#searchButton").click(function() { //City Search Weather																				
                        var datenew = new Date();
                        datenew.setDate(datenew.getDate() + 0);
                        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        $('#day').html(days[datenew.getDay()]);
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                        $(".wrapper").css("margin-top", ($(window).height()) / 5);
                        // Selecting the input element and get its value
                        city = document.getElementById("myInput").value;
                        city = city.charAt(0).toUpperCase() + city.slice(1);
                        if (city == '') {
                            client.interface.trigger("showNotify", {
                                type: "danger",
                                title: "Error",
                                message: "Kindly give an input!! :("
                            });
                            return;
                        }
                        client.request.get(`${weatherURL}q=${city}&id=524901&appid=<%=iparam.api_key%>`, options)     //API Request For Open Weather
                            .then(
                                function(data) {
                                    // Displaying the value
                                    $('#city').html(JSON.parse(data.response).name + ", " + JSON.parse(data.response).sys.country);
                                    var tempInput = (JSON.parse(data.response).main.temp - 273);
                                    $('#temperature').html(Math.round(tempInput));
                                    $('.windspeed').html(JSON.parse(data.response).wind.speed + " Km/h");

                                    client.db.get("city:5").then(
                                        function(data) {
                                            var j = 0;
                                            var n = data.city_names.length;
                                            for (var i = n - 1; i >= n - 5; i--) {
                                                if (i < 0)
                                                    break;
                                                local_citynames[j] = data.city_names[i];
                                                j++;
                                            }
                                            if (local_citynames.indexOf(city) == -1) {
                                                client.db.update("city:5", "append", {
                                                    "city_names": [city]
                                                });
                                                if (local_citynames.length >= 5)
                                                    local_citynames.length--;
                                                document.getElementById("recent").innerHTML = city + ", " + local_citynames.join(", ");
                                            } else
                                                document.getElementById("recent").innerHTML = local_citynames.join(", ");
                                        },
                                        function() {
                                            client.db.update("city:5", "append", {
                                                "city_names": [city]
                                            }).then(
                                                function() {
                                                    document.getElementById("recent").innerHTML = city;
                                                });
                                        });

                                },
                                function() { //Failure To Find City
                                    client.interface.trigger("showNotify", {
                                        type: "danger",
                                        title: "Error",
                                        message: "City doesn't exist!! :("
                                    });
                                });
                    });

                    $("#daytype").on('change', function() { //Function To Change Date & Weather Based On Date
                        var daynum = 0;
                        var x = document.getElementById("daytype").value;
                        var datenew = new Date();
                        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                        switch (x) {
                            case '0':
                                datenew.setDate(datenew.getDate() + 0);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 0;
                                break;
                            case '1':
                                datenew.setDate(datenew.getDate() + 1);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 7;
                                break;
                            case '2':
                                datenew.setDate(datenew.getDate() + 2);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 15;
                                break;
                            case '3':
                                datenew.setDate(datenew.getDate() + 3);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 23;
                                break;
                            case '4':
                                datenew.setDate(datenew.getDate() + 4);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 31;
                                break;
                            case '5':
                                datenew.setDate(datenew.getDate() + 5);
                                $('#day').html(days[datenew.getDay()]);
                                $('#date').html(months[datenew.getMonth()] + " " + datenew.getDate() + ", " + datenew.getFullYear());
                                daynum = 39;
                                break;

                        }


                        if (city != 0) {
                            client.request.get(`${forecastURL}q=${city}&id=524901&appid=<%=iparam.api_key%>&cnt=42`, options)   //API Request For Open Weather
                                .then(
                                    function(data) {
                                        $('#city').html(JSON.parse(data.response).city.name + ", " + JSON.parse(data.response).city.country);
                                        var tempDay = (JSON.parse(data.response).list[daynum].main.temp - 273);
                                        $('#temperature').html(Math.round(tempDay));
                                        $('.windspeed').html(JSON.parse(data.response).list[daynum].wind.speed + " Km/h");
                                    });
                        } else {
                            client.request.get(`${forecastURL}lat=${myLatitude}&lon=${myLongitude}&id=524901&appid=<%=iparam.api_key%>&cnt=42`, options)   //API Request For Open Weather
                                .then(
                                    function(data) {
                                        $('#city').html(JSON.parse(data.response).city.name + ", " + JSON.parse(data.response).city.country);
                                        var tempDay = (JSON.parse(data.response).list[daynum].main.temp - 273);
                                        $('#temperature').html(Math.round(tempDay));
                                        $('.windspeed').html(JSON.parse(data.response).list[daynum].wind.speed + " Km/h");
                                    });
                        }
                    });
                });
        })
        .catch(function() {

            fdLogger.log("Error initializing App, Sorry for the inconvenience");

        });
});