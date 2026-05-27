// DriveApp.getFiles() // Please add this comment line. By this, a scope of "https://www.googleapis.com/auth/drive.readonly" is automatically added by the script editor, when the script is run.

function doGet(e) {
  //var gameRequired = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GameRequired").getRange("A1").getValue()
  const params = e.parameter;
  const pages = ["rankings", "qualificationMatches", "finalsMatches"];
  const page = params['page'];
  var data = [];
  
  if (page == pages[0] || page == pages[1] || page == pages[2]) {
    var idSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(page);
    var header = true;

    if(page == pages[0]){
      idSheet.getRange("A:D").getValues().forEach(function(row) {
        if(row[0] != "" && ! header){
          data.push(row);
        }
        header = false;
      })
    }else if(page == pages[1] || page == pages[2]){
      idSheet.getRange("A:F").getValues().forEach(function(row) {
        if(row[0] != "" && ! header){
          data.push(row);
        }
        header = false;
      })
    }
   
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  }
  return [];
}
