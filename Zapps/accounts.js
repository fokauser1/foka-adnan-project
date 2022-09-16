const { google } = require("googleapis");
const bcrypt = require('bcrypt');
const hashedKey = "$2b$10$UV4PJD.iCpOYzzz.FR7tOebqmCz0Cmzk9Ta8s2H/fE0XVhO4dBQfa";
const path = require('path');
var userAndpass;

module.exports.login = async (req,res) => {
    const p  = req.cookies.bcrypt;
    if (p){
    const key = "1235"
    const isMatch2 =  await bcrypt.compare(key, p);
    if (isMatch2){
    res.redirect('logedin')
    }
    else{
        res.render('login')
    }
    }
    else{
        res.render('login')
    }

    async function getPasswords(){
    
        const auth = new google.auth.GoogleAuth({
            keyFile: "loginFormCredential.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
          });
          //createclient instance for auth
      const client = await auth.getClient();
    
      //Instance of Googlesheets API
    
      const googleSheets = google.sheets({ version: "v4", auth: client });
    
      const spreadsheetId = "1xLop7ZrEk53_PWe9-qlX_lUi5SnVgXC6pLsxDXHUyOM";
    
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "sheet3",
      });
    userAndpass =  getRows.data.values;
    }
    getPasswords();
}

module.exports.logout = (req,res) => {
    res.cookie('bcrypt', '', {maxAge: 1});
    res.redirect("/login")
}
module.exports.logedin = async (req,res) => {
    let loc = path.join(__dirname, ".." , "/views/seller.html")
        const p  = req.cookies.bcrypt;
        console.log(p)
        if (p){
        const key = "1235"
    
        const isMatch2 =  await bcrypt.compare(key, p);
        if (isMatch2){
        res.sendFile(loc)
        }
        else {
            res.redirect('/login')
        }
    }
        else{
            res.redirect('/login')
        }
}

module.exports.login_post = async (req,res) =>{
        const {passowrd,name} = req.body;
        let isMatchPassword = false;
        let isMatchUsername = false;
         for (let i = 0; i < userAndpass.length; i++){
             const hashPassword = userAndpass[i][1];
             const hashUserName = userAndpass[i][0];
            // console.log(hashPassword,hashUserName)
              isMatchPassword =  await bcrypt.compare(passowrd, hashPassword);
              isMatchUsername = await bcrypt.compare(name, hashUserName);
              console.log(isMatchPassword,isMatchUsername);
             if (isMatchPassword && isMatchUsername){
             res.cookie('bcrypt',hashedKey, {httpOnly:true, maxAge: 1000 * 60 * 60 * 24 * 7} )
             res.json({success : true})
             break;
             }
         }
         if  (!isMatchPassword || !isMatchUsername){
            res.json({success : false}) 
        }

}