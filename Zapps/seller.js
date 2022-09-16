const { google } = require("googleapis");
const path = require('path')


module.exports.seller = (req, res)=>{
    let loc = path.join(__dirname , ".." , '/views/seller.html')
    res.sendFile(loc)
}

module.exports.seller_post =  async (request , response) =>{

    const {amount, date, type} = request.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "loginFormCredential.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

        
    // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1xLop7ZrEk53_PWe9-qlX_lUi5SnVgXC6pLsxDXHUyOM";
  let time = new Date();
  let year = time.getUTCFullYear();
  let month = time.getMonth();
  let date1 = time.getDate();
  var currentDate = (month+ 1)  + "/" + date1 + "/" + year;

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Hotels",
  });
  var write = "";
  var cookies = request.cookies;
  var name ="";
  var number ="";
  var address ="";
  var costumer = false;

  for (var i = 1; i <= getRows.data.values.length - 1; i++){
    name = getRows.data.values[i][0];
    number = "+" + (getRows.data.values[i][1]);
    address = getRows.data.values[i][2];

    // if((cookies.number == number))console.log(i,name, number, address);

    // console.log(i,cookies.name, cookies.number, cookies.address);

    if ((cookies.name == name) && (( "+251" + cookies.number) == number) && (cookies.address == address)){
      
      console.log(i,name, number, address);
      costumer = true;

      write = `Hotels!G${i+1}:I${i+1}`;
      
      const writeRow = await googleSheets.spreadsheets.values.update({
        auth,
    
        spreadsheetId,
    
        range: write,
    
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [
                [amount, type, date]
            ],
        },
      })

  }
  if (costumer){
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet2",
    });
    
    var index = getRows.data.values.length + 1;
    console.log(index);
    
    var sheet2 = `Sheet2!A${index}:E${index}`;
    
    const writeRow2 = await googleSheets.spreadsheets.values.append({
      auth,
  
      spreadsheetId,
  
      range: sheet2,
  
      valueInputOption: "USER_ENTERED",
      resource:{
          values: [
              [amount, type, date, "", currentDate]
          ],
      },
    })
  }
  }
  

  response.send("Successfully Submitted");
}

