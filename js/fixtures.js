function fixtures(){
	const urls = "https://api.football-data.org/v1/competitions/445/fixtures";
	
	$.ajax({
		headers: { 'X-Auth-Token': 'bb162f8d16b9415a901f6394e5da790e' },
		url: urls,
		dataType: "json",
		type: "GET",
		success: function(data){
			let tableBody = document.getElementById("fixture-body");
			
			let inPlay = false;
			let closetDate = null;
			let closetDateObject = null;
			
			for (i = 0; i < data.fixtures.length; i++){
				if (data.fixtures[i].status == "TIMED"){
					closetDate = formatDate(data.fixtures[i].date);
					closetDateObject = new Date(data.fixtures[i].date);
					break;
				} 
				else if (data.fixtures[i].status == "IN_PLAY"){
					inPlay = true;
					createTable(["Home Team", "Away Team", "Status"], "inplay-fixture-body", null);
				}
			}
			
			createTable(["Home Team", "Away Team", "Date", "Kick Off"], "fixture-body", closetDateObject);
			const nextClosestDate = formatDate(closetDateObject.setDate(closetDateObject.getDate() + 1));
			createTable(["Home Team", "Away Team", "Date", "Kick Off"], "fixture-body2", closetDateObject);
			
			for (i = 0; i < data.fixtures.length; i++){
				if (data.fixtures[i].status == "TIMED" && closetDate == formatDate(data.fixtures[i].date)){
					tableBody = document.getElementById("fixture-body")
					appendDataToTable(tableBody, data);
				}
				else if (nextClosestDate == formatDate(data.fixtures[i].date)){
					tableBody = document.getElementById("fixture-body2");
					appendDataToTable(tableBody, data);
				}
				else if(data.fixtures[i].status == "IN_PLAY"){
					tableBody = document.getElementById("inplay-fixture-body");
					appendDataToInPlayTable(tableBody, data);
				}
			}
					
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

function appendDataToInPlayTable(tableBody, data){
	let homeTh = document.createElement("tr");
					
	let homeTeam = document.createElement("td");
	getCrest(data.fixtures[i]._links.homeTeam, homeTeam);
	homeTeam.innerHTML += data.fixtures[i].result.goalsHomeTeam;
	
	let awayTeam = document.createElement("td");
	getCrest(data.fixtures[i]._links.awayTeam, awayTeam);
	awayTeam.innerHTML += data.fixtures[i].result.goalsAwayTeam;
	
	let status = document.createElement("td");
	status.innerHTML = "In Play";	 
	
	homeTh.append(homeTeam);
	homeTh.append(awayTeam);
	homeTh.append(status);
	
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

function createTable(tableHeaders, id, closetDateObject){
	console.log("In here");
	
	let section = document.getElementById("fixtures");
	let title = document.createElement("h1");
	title.setAttribute("style", "text-align: center; margin-top: 15vh;");
	
	title.innerHTML = closetDateObject != null ? getDay(closetDateObject.getDay()) + " Premier League Matches" : "In Play Premeier League Matches";
	
	let containerDiv = document.createElement("div");
	containerDiv.setAttribute("class", "container"); 
	let table = document.createElement("table");
	table.setAttribute("class", "table table-hover");
	let thead = document.createElement("thead");
	let theadTr = document.createElement("tr");
	let theadTh = null;
	
	for(i = 0; i < tableHeaders.length; i++){
		theadTh = document.createElement("th");
		theadTh.innerHTML = tableHeaders[i];
		theadTr.append(theadTh);
	}
	
	let tbody = document.createElement("tbody");
	tbody.setAttribute("id", id);
	
	thead.append(theadTr);
	table.append(tbody);
	table.append(thead);
	containerDiv.append(table);
	section.append(title);
	section.append(containerDiv);
}

fixtures();