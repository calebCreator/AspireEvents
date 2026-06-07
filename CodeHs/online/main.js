const url = "https://script.google.com/macros/s/AKfycbyvA7A-KeSZ5lb6vSQjEuaMuDTIvvEEtque_Uvn8GcY6nFTbpOlWFWxQQKHXBOe0_3I/exec";
 /*(typeof process !== 'undefined' && process.env && process.env.GOOGLE_SCRIPT_URL)
    ? process.env.GOOGLE_SCRIPT_URL
    : "https://script.google.com/macros/s/AKfycbwKVFtsOLJ6THyon0SFFg7wtb2iJJfg4S8qkQNgACOsbjr-7Bvn7XkEN7X2kePNORc5/exec";
*/
async function init(page){
    await getData(page);
    setInterval(() => getData(page), 5000);
}


function addData(table, data){
    var table = document.getElementById(table);
    var row = table.insertRow(-1);

    var cells = [];
    for(var i = 0; i < data.length; i++){
        cells.push(row.insertCell(i));
    }

    // Fill cells, formatting numbers
    for(var i = 0; i < data.length; i++){
        var value = data[i];
        if(typeof value === "number" && value % 1 !== 0){
            value = value.toFixed(2);
        }
        cells[i].innerHTML = value;
    }

    // If this row represents a match (qualification or finals), bold the winning score
    // Expected shortened match format used elsewhere: [matchNum, red1, red2, blue1, blue2, redScore, blueScore, winner]
    if((table.id === 'qualificationMatches' || table.id === 'finalsMatches') && data.length >= 8){
        var winner = String(data[7]).toLowerCase();
        if(winner === 'red'){
            // red score is at index 5
            cells[5].innerHTML = '<b>' + cells[5].innerHTML + '</b>';
        } else if(winner === 'blue'){
            // blue score is at index 6
            cells[6].innerHTML = '<b>' + cells[6].innerHTML + '</b>';
        } else if(winner === 'tie'){
            // bold both on a tie
            cells[5].innerHTML = '<b>' + cells[5].innerHTML + '</b>';
            cells[6].innerHTML = '<b>' + cells[6].innerHTML + '</b>';
        }
    }

    return row;
}


function test(){
    document.getElementById("test").innerHTML = "HEllow"
}
var datas = [];


async function getData(page){
    document.getElementById("msg").innerHTML = '<span class="spinner-inline"></span>Loading...';
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const response = await fetch(`${url}?page=${encodeURIComponent(page)}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const datas = await response.json();
        if (!Array.isArray(datas)) {
            throw new Error("Unexpected response format: expected an array");
        }

        var table = document.getElementById(page);

        // Clear existing table data (except header)
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        for (const item of datas) {
            addData(page, item);
        }

        //document.getElementById("msg").innerHTML = "";
    } catch (error) {
        console.error(error);
        document.getElementById("msg").innerHTML = `Error loading data: ${error.message}`;
    }
        
        
        
}

async function postData(id,type,red1,red2,blue1,blue2,redScore,blueScore,redRP1,redRP2,redRP3,blueRP1,blueRP2,blueRP3,winner, key){

    const response = await fetch(`${url}?request=POST&id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}&red1=${encodeURIComponent(red1)}&red2=${encodeURIComponent(red2)}&blue1=${encodeURIComponent(blue1)}&blue2=${encodeURIComponent(blue2)}&redScore=${encodeURIComponent(redScore)}&blueScore=${encodeURIComponent(blueScore)}&redRP1=${encodeURIComponent(redRP1)}&redRP2=${encodeURIComponent(redRP2)}&redRP3=${encodeURIComponent(redRP3)}&blueRP1=${encodeURIComponent(blueRP1)}&blueRP2=${encodeURIComponent(blueRP2)}&blueRP3=${encodeURIComponent(blueRP3)}&winner=${encodeURIComponent(winner)}&key=${encodeURIComponent(key)}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    const datas = await response.json();
    console.log(datas);

    return datas;
}

async function updateData(id,type,red1,red2,blue1,blue2,redScore,blueScore,redRP1,redRP2,redRP3,blueRP1,blueRP2,blueRP3,winner, key){

    const response = await fetch(`${url}?request=PUT&id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}&red1=${encodeURIComponent(red1)}&red2=${encodeURIComponent(red2)}&blue1=${encodeURIComponent(blue1)}&blue2=${encodeURIComponent(blue2)}&redScore=${encodeURIComponent(redScore)}&blueScore=${encodeURIComponent(blueScore)}&redRP1=${encodeURIComponent(redRP1)}&redRP2=${encodeURIComponent(redRP2)}&redRP3=${encodeURIComponent(redRP3)}&blueRP1=${encodeURIComponent(blueRP1)}&blueRP2=${encodeURIComponent(blueRP2)}&blueRP3=${encodeURIComponent(blueRP3)}&winner=${encodeURIComponent(winner)}&key=${encodeURIComponent(key)}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    const datas = await response.json();
    console.log(datas);
    return datas;
}

async function getData2(){
    const response = await fetch(`${url}?request=GET`);
    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    const datas = await response.json();
    console.log(datas);

    return datas;
}

async function getCurrentMatch(){
    matches = await getData2();
    for (var i = 0; i < matches.length; i++){
        if(matches[i][6] === "" ){
            return matches[i];
        }
    }
    return null;
    //Return last match
    //currentMatch = matches[matches.length - 1];
    //return currentMatch;
}

async function getLastMatch(){
    matches = await getData2();
    for (var i = 0; i < matches.length; i++){
        if(matches[i][6] === "" ){
            return matches[i-1];
        }
    }

    //Return last match
    currentMatch = matches[matches.length - 1];
    return currentMatch;
}

//This function returns the qualification matches from the list of matches
function getQualificationMatches(matches){
    var qualificationMatches = [];
    for (match of matches){
        if(match[1] === "qualifier"){
            qualificationMatches.push(match);
        }
    }
    return qualificationMatches;
}

//This function returns the finals matches from the list of matches
function getFinalsMatches(matches){
    var finalsMatches = [];
    for (match of matches){
        if(match[1] === "final"){
            finalsMatches.push(match);
        }
    }
    return finalsMatches;
}

function getPlayedMatches(matches){
    var playedMatches = [];
    for (match of matches){
        if(match[6] !== ""){
            playedMatches.push(match);
        }
    }
    return playedMatches;
}

async function displayQualMatches(update = true){

    if(update || localStorage.getItem("matches" ) === null){
        //Get the matches data
        var matches = await getData2();
        localStorage.setItem("matches", JSON.stringify(matches));
    } else {
        var matches = JSON.parse(localStorage.getItem("matches"));
    }
    quals = getQualificationMatches(matches);

    var searchBox = document.getElementById("searchBox");
    var query = searchBox.value.trim();
    var queryLower = query.toLowerCase();
    if(query !== ""){
        quals = quals.filter(match => {
            return [match[2], match[3], match[4], match[5]].some(team => String(team).toLowerCase().startsWith(queryLower));
        });
    }

    //Clear the table
    var table = document.getElementById("qualificationMatches");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    //var matchNum = 0
    for (match of quals){
        //matchNum++;

        //Use number part of match id
        var matchNum = match[0].match(/\d+/);
         // Use match ID as match number for better tracking, since matches may not always be in order

        //Shorten match data to only include relevant information for the table
        match = [matchNum, match[2], match[3], match[4], match[5], match[6], match[7], match[14]];
        var row = addData("qualificationMatches", match);

        // Bold the matching search prefix inside each team cell
        if(query !== ""){
            for(var col = 1; col <= 4; col++){
                var teamText = String(match[col]);
                var teamLower = teamText.toLowerCase();
                if(teamLower.startsWith(queryLower)){
                    var prefix = teamText.slice(0, query.length);
                    var suffix = teamText.slice(query.length);
                    row.cells[col].innerHTML = '<b>' + prefix + '</b>' + suffix;
                }
            }
        }
    }

    //If there are no qualification matches yet, update the message to indicate that the finals have not started
    if(quals.length === 0){
        if(searchBox.value.trim() === ""){
            //Not searching, so show message about quals not starting
            document.getElementById("msg").innerHTML = "Qualification matches have not started yet.";
        }else{
            //Searching but no matches found, so show message about no matches found
            document.getElementById("msg").innerHTML = "No matches found for team " + searchBox.value.trim() + ".";
        }
    }else{
        document.getElementById("msg").innerHTML = "";
    }
}

async function displayFinalsMatches(){
    //Get the matches data
    var matches = await getData2();
    finals = getFinalsMatches(matches);

    //Clear the table
    var table = document.getElementById("finalsMatches");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    var matchNum = 0
    for (match of finals){
        matchNum++;
        //Shorten match data to only include relevant information for the table
        match = [matchNum, match[2], match[3], match[4], match[5], match[6], match[7], match[14]];
        addData("finalsMatches", match);
    }

    //If there are no finals matches yet, update the message to indicate that the finals have not started
    if(finals.length === 0){
        document.getElementById("msg").innerHTML = "Finals have not started yet.";
    }else{
        document.getElementById("msg").innerHTML = "";
    }

}

function filterMatches(){
    displayQualMatches(false);
}

function setPasskey(){
    let passkey = prompt("Enter the passkey to access the scorekeeper:");
    // Store the passkey in local storage for later use
    localStorage.setItem("passkey", passkey);
    alert("Passkey saved! You can now access the scorekeeper.");
}

function getPasskey(){
    // Retrieve the passkey from local storage
    const passkey = localStorage.getItem("passkey");
    if (passkey) {
        return passkey;
    } else {
        alert("No passkey found. Please set a passkey first.");
        setPasskey();
        return localStorage.getItem("passkey");
    }
}
