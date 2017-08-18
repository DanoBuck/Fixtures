function fixtures(){
	//const urls = "https://api.football-data.org/v1/fixtures";
	const urls = "https://api.football-data.org/v1/competitions/445/fixtures";
	
	$.ajax({
		headers: { 'X-Auth-Token': 'bb162f8d16b9415a901f6394e5da790e' },
		url: urls,
		dataType: "json",
		type: "GET",
		success: function(data){
			let tableBody = document.getElementById("fixture-body");
			
			
			for (i = 0; i < data.fixtures.length; i++){
				if (data.fixtures[i].status == "TIMED"){
					var closetDate = formatDate(data.fixtures[i].date);
					var closetDateObject = new Date(data.fixtures[i].date);
					break;
				}
			}
			
			let upcoming = document.getElementById("upcoming");
			upcoming.innerHTML = getDay(closetDateObject.getDay()) + " Premier League Matches";
			
			const nextClosestDate = formatDate(closetDateObject.setDate(closetDateObject.getDate() + 1));
			
			for (i = 0; i < data.fixtures.length; i++){
				if (data.fixtures[i].status == "TIMED" && closetDate == formatDate(data.fixtures[i].date)){
					appendDataToTable(tableBody, data);
				}
				else if (nextClosestDate == formatDate(data.fixtures[i].date)){
					console.log(data.fixtures[i].homeTeamName + " V " + data.fixtures[i].awayTeamName);
					tableBody = document.getElementById("fixture-body2");
					appendDataToTable(tableBody, data);
					var dayNumber = new Date(data.fixtures[i].date);
					console.log(getDay(dayNumber.getDay()));
				}
			}
			
			let next = document.getElementById("next");
			next.innerHTML = getDay(dayNumber.getDay()) + " Premier League Matches";
					
			console.log(data);
		}
	});
}

function appendDataToTable(tableBody, data){
	let homeTh = document.createElement("tr");
					
	let homeTeam = document.createElement("td");
	getCrest(data.fixtures[i]._links.homeTeam, homeTeam);
	
	let awayTeam = document.createElement("td");
	getCrest(data.fixtures[i]._links.awayTeam, awayTeam);
	
	let date = document.createElement("td");
	date.innerHTML = formatDate(data.fixtures[i].date);

	let time = document.createElement("td");
	time.innerHTML = formatTime(data.fixtures[i].date); 	 
	
	homeTh.append(homeTeam);
	homeTh.append(awayTeam);
	homeTh.append(date);
	homeTh.append(time);
	
	tableBody.append(homeTh);
}

function getCrest(data, crestElement){
	data.href = data.href.replace("http", "https");
	$.ajax({
		headers: { 'X-Auth-Token': 'bb162f8d16b9415a901f6394e5da790e' },
		url: data.href,
		dataType: 'json',
		type: 'GET',
		success: function(homeData){
			let crestUrl = homeData.crestUrl;
			crestUrl = !crestUrl.includes("https") ? crestUrl.replace("http", "https") : crestUrl;
			let crestPicture = document.createElement("img");
			crestPicture.setAttribute("src", crestUrl);
			crestPicture.setAttribute("style", "display:inline-flex;max-width:40px;max-height:40px;float:left;");
			
			let div = document.createElement("div");
			div.innerHTML = homeData.name;
			div.setAttribute("style", "display: inline;margin-left: 10px;");
			crestElement.append(div);
			
			crestElement.append(crestPicture);
		}
	});
}

function formatDate(data){
	const date = new Date(data);
	
	let month = date.getMonth() + 1;
	
	// Alternative if statement
	month = month < 10 ? "0" + month : month;
	
	result = date.getDate() + "-" + month + "-" + date.getFullYear();
	
	return result;
}

function formatTime(data){
	const time = new Date(data);
	return time.getHours() + ":" + (time.getMinutes() == 0 ? time.getMinutes() + "0" : time.getMinutes());
}

function getDay(number){
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[number];
}

fixtures();