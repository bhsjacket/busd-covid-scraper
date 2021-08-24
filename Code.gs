let url = 'https://www.berkeleyschools.net/coronavirus/case-dashboard/';
let date = Utilities.formatDate(new Date(), 'America/Los_Angeles', "yyyy-MM-dd");

function scrapeCovidDashboard() {

  let html = UrlFetchApp.fetch(url, {headers:{Accept:'text/html'}}).getContentText();

  for(let i = 1; i < 7; i++) {
    let table = '<table' + html.split('<table')[i].split('</table>')[0] + '</table>';
    let rows = XmlService.parse(table).getDescendants().filter(row => {
      return row.asElement() && row.asElement().getName() === 'tr';
    }).slice(1);

    let data = [date];
    rows.forEach(row => {
      let school = row.getChildren().map(row => row.getValue().trim());
      let latestDataIndex = school.indexOf('') - 1; // find most recent month, furthest right non-empty cell
      data.push(latestDataIndex > 0 ? parseFloat(school[latestDataIndex]) : 0); // add the value as a float, or 0 if empty
    })
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[i-1].appendRow(data);
  }

}
