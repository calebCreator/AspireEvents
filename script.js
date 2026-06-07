// DriveApp.getFiles() // Please add this comment line. By this, a scope of "https://www.googleapis.com/auth/drive.readonly" is automatically added by the script editor, when the script is run.



function doGet(e) {
  //var gameRequired = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GameRequired").getRange("A1").getValue()
  const params = e.parameter;
  const page = params['page'];
  const request = params['request'];
  const display = params['display'];
  //const db = params['db'];
  //const data = params['data'];
  
  if(page != undefined){
    return getPageData(page);
  }

  if(display != undefined){
    var value = params['value'];
    if(display == 'GET'){
      return getDisplay();
    }else if(display == 'RED'){
      return updateDisplay(value,'RED');
    }else if(display == 'BLUE'){
      return updateDisplay(value,'BLUE');
    }else{
      return ContentService.createTextOutput(JSON.stringify({ error: "Invalid Display Request" })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  if(request != undefined){
    if(request == 'GET'){
      return getDB();
    }else if(request == 'POST'){
      return addToDB(params);
    }else if(request == 'PUT'){
      return modifyDB(params);
    }else{
      return ContentService.createTextOutput(JSON.stringify({ error: "Invalid Database Request" })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  //Fallback return
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid Request" })).setMimeType(ContentService.MimeType.JSON);
  
}

function getPageData(page){
  const pages = ["rankings", "qualificationMatches", "finalsMatches", "currentMatch"];
  if (pages.includes(page)) {

    if(page == pages[0]){
      var data = getRows("A:D", page);
    }else if(page == pages[1]){
      var data = getRows("A:F", page);
    }else if(page == pages[2]){
      var data = getRows("A:H", page);
    }else if(page == pages[3]){
      var data = getRows("A:H", "qualificationMatches");
      
      //return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);

      var lastRow = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i][5] == "") {
          return ContentService.createTextOutput(JSON.stringify(lastRow)).setMimeType(ContentService.MimeType.JSON);
        } else {
          lastRow = data[i];
        }
      }

      //If no empty match has been found, meaning all matches have been played
      if (lastRow.length > 0){
        return ContentService.createTextOutput(JSON.stringify(lastRow)).setMimeType(ContentService.MimeType.JSON);
      }

      return ContentService.createTextOutput(JSON.stringify({ error: "Invalid last Match" })).setMimeType(ContentService.MimeType.JSON);
      //data = data[data.length - 1];
    }
   
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid page" })).setMimeType(ContentService.MimeType.JSON);
}

function getRows(rows, page){
  var idSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page);
  var data = [];
  var header = true;
  idSheet.getRange(rows).getValues().forEach(function(row) {
    if(row[0] != "" && ! header){
      data.push(row);
    }
    header = false;
  })

  return data;
}

function getDB(){
  const db = 'database';
  const dbCols = 'A:O';

  var idSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(db);
  var data = [];

  //Set to true to not grab first line (aka the header)
  var header = true;
  idSheet.getRange(dbCols).getValues().forEach(function(row) {
    if(row[0] != "" && ! header){
      data.push(row);
    }
    //Set to false, so other rows can be grabbed
    header = false;
  })

  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function addToDB(params){
  const secretKey = PropertiesService.getScriptProperties().getProperty('SECRET_KEY');
  if(params['key'] == undefined || params['key'] !== secretKey){
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid key" }))
    .setMimeType(ContentService.MimeType.JSON); 
  }

  var required = ['id','type','red1','red2','blue1','blue2','redScore','blueScore','redRP1','redRP2','redRP3','blueRP1','blueRP2','blueRP3','winner'];
  for (var i = 0; i < required.length; i++) {
    if (params[required[i]] == undefined) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Missing param: " + required[i] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  const db = 'database';
  var idSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(db);

  // Build the row from params, in column order
  var newRow = [
    params['id'],
    params['type'],
    params['red1'],
    params['red2'],
    params['blue1'],
    params['blue2'],
    params['redScore'],
    params['blueScore'],
    params['redRP1'],
    params['redRP2'],
    params['redRP3'],
    params['blueRP1'],
    params['blueRP2'],
    params['blueRP3'],
    params['winner']
  ];

  idSheet.appendRow(newRow);

  return ContentService.createTextOutput(JSON.stringify({ success: "Row added" }))
  .setMimeType(ContentService.MimeType.JSON);
}

function modifyDB(params) {
  const secretKey = PropertiesService.getScriptProperties().getProperty('SECRET_KEY');
  if(params['key'] == undefined || params['key'] !== secretKey){
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid key" }))
    .setMimeType(ContentService.MimeType.JSON); 
  }

  var required = ['id','type','red1','red2','blue1','blue2','redScore','blueScore','redRP1','redRP2','redRP3','blueRP1','blueRP2','blueRP3','winner'];
  for (var i = 0; i < required.length; i++) {
    if (params[required[i]] == undefined) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Missing param: " + required[i] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }


  const db = 'database';
  const dbCols = 'A:O';
  var idSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(db);
  var data = idSheet.getRange(dbCols).getValues();

  var matchId = params['id']; // the identifier to find the row

  for (var i = 1; i < data.length; i++) {
    var id = data[i][0];
    if (id == matchId) {
      idSheet.getRange(i + 1, 1, 1, 15).setValues([[
        params['id'], params['type'],
        params['red1'], params['red2'],
        params['blue1'], params['blue2'],
        params['redScore'], params['blueScore'],
        params['redRP1'], params['redRP2'], params['redRP3'],
        params['blueRP1'], params['blueRP2'], params['blueRP3'],
        params['winner']
      ]]);
      return ContentService.createTextOutput(JSON.stringify({ success: "Row updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ error: "Row not found" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDisplay() {
  var display = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('display');
  var values = display.getRange('A2:B2').getValues()[0];
  return ContentService.createTextOutput(JSON.stringify({ red: values[0], blue: values[1] }))
    .setMimeType(ContentService.MimeType.JSON);
}

function updateDisplay(value, color){
  var display = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('display');
  if(color == 'BLUE'){
    display.getRange('B2').setValue(value);
  }else if (color == 'RED'){
    display.getRange('A2').setValue(value);
  }else{
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid color" }))
        .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: "Display updated" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function setSecretKey() {
  //PropertiesService.getScriptProperties().setProperty('SECRET_KEY', '######');
  //const secretKey = PropertiesService.getScriptProperties().getProperty('SECRET_KEY');
  //console.log(secretKey);
}
