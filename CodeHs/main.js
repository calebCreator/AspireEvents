const url = "";
 /*(typeof process !== 'undefined' && process.env && process.env.GOOGLE_SCRIPT_URL)
    ? process.env.GOOGLE_SCRIPT_URL
    : "https://script.google.com/macros/s/AKfycbwKVFtsOLJ6THyon0SFFg7wtb2iJJfg4S8qkQNgACOsbjr-7Bvn7XkEN7X2kePNORc5/exec";
*/
async function init(page){
    setInterval(() => getData(page), 5000);
}


function addData(table, data){
    var table = document.getElementById(table);
    var row = table.insertRow(-1);
    
    var cells = [];
    for(var i = 0; i < data.length; i++){
        cells.push(row.insertCell(i));
    }
    
    for(var i = 0; i < data.length; i++){
        cells[i].innerHTML = data[i];
    }
}


function test(){
    document.getElementById("test").innerHTML = "HEllow"
}
var datas = [];
function displayRankings(){
    
    getData("rankings");
    //console.log(datas)
    //for(data of datas){
    //    addData('rankings',data)
    //}
    
    //document.getElementById("msg").innerHTML = ""
}

async function getData(page){
    document.getElementById("msg").innerHTML = "Loading...";
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

        document.getElementById("msg").innerHTML = "";
    } catch (error) {
        console.error(error);
        document.getElementById("msg").innerHTML = `Error loading data: ${error.message}`;
    }
        
        
        
}

async function postData(id,type,red1,red2,blue1,blue2,redScore,blueScore,redRP1,redRP2,redRP3,blueRP1,blueRP2,blueRP3,winner){

    const response = await fetch(`${url}?request=POST&id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}&red1=${encodeURIComponent(red1)}&red2=${encodeURIComponent(red2)}&blue1=${encodeURIComponent(blue1)}&blue2=${encodeURIComponent(blue2)}&redScore=${encodeURIComponent(redScore)}&blueScore=${encodeURIComponent(blueScore)}&redRP1=${encodeURIComponent(redRP1)}&redRP2=${encodeURIComponent(redRP2)}&redRP3=${encodeURIComponent(redRP3)}&blueRP1=${encodeURIComponent(blueRP1)}&blueRP2=${encodeURIComponent(blueRP2)}&blueRP3=${encodeURIComponent(blueRP3)}&winner=${encodeURIComponent(winner)}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    const datas = await response.json();
    console.log(datas);
}

async function updateData(id,type,red1,red2,blue1,blue2,redScore,blueScore,redRP1,redRP2,redRP3,blueRP1,blueRP2,blueRP3,winner){

    const response = await fetch(`${url}?request=PUT&id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}&red1=${encodeURIComponent(red1)}&red2=${encodeURIComponent(red2)}&blue1=${encodeURIComponent(blue1)}&blue2=${encodeURIComponent(blue2)}&redScore=${encodeURIComponent(redScore)}&blueScore=${encodeURIComponent(blueScore)}&redRP1=${encodeURIComponent(redRP1)}&redRP2=${encodeURIComponent(redRP2)}&redRP3=${encodeURIComponent(redRP3)}&blueRP1=${encodeURIComponent(blueRP1)}&blueRP2=${encodeURIComponent(blueRP2)}&blueRP3=${encodeURIComponent(blueRP3)}&winner=${encodeURIComponent(winner)}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    const datas = await response.json();
    console.log(datas);
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


