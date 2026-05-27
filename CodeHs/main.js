const url = "https://script.google.com/macros/s/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/exec"
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
    fetch(url+"?page=" + page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            var datas = data;
            for(data of datas){
                addData(page,data)
            }
            //console.log(datas);
            document.getElementById("msg").innerHTML = "";
        })    
        //.catch((error) => {
            //print("2: " + error);
        //})
        
        
        
}