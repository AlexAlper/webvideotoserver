
const {Client} = require("pg");
const express = require ("express");
const uuidv1 = require('uuid/v1');//uuidv1()
const app = express();
const fetch = require('node-fetch');
const { removeAllListeners } = require("nodemon");
const e = require("express");
const Blob = require("cross-blob");
var FileReader = require('filereader')
const io = require('socket.io')();

var bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '5mb' }))


app.use(express.json());

app.use("/static", express.static('./static/'));

app.use(express.static(__dirname+ "/css/"));
app.use(express.static(__dirname + '/public'));

const client = new Client({
    "user": "postgres",
    "password" : "13",
    "host" : "localhost",
    "port" : 5432,
    "database" : "info"
})


app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

var people = "";


app.post("/getcamera", async (req, res) => {

    console.log('lol')
    let str = "";

    console.log(people[0]);
    for(let i = 0; i < people.length; i++){
        str+=people[i] + " ";
    }
    console.log(str);

    let result = {
        site: people
    };
    try{
            const reqJson = req.body;
           // await createUser(reqJson.todo);   

        result.success= true;
    }
    catch(e){
        console.log(e)
        result.success=false;
    }
    finally{
        //res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));

    } 
});

app.post("/video", async (req, res) => {

    console.log('lol')
    let result = {};
    try{
        const reqJson = req.body;
        //console.log(req.body);
           // await createUser(reqJson.todo);   
        
      //  console.log(reqJson.site);


    require("fs").writeFile("out.webm", reqJson.site, 'base64', function(err) {
        console.log(err);
        });
        

       // var blob = new Blob(reqJson.site, {type: 'video/webm'});
       
       

       /* var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
    */

        result.success= true;
    }
    catch(e){
        console.log(e)
        result.success=false;
    }
    finally{
        //res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));

    } 
});





app.post("/order", async (req, res) => {

    console.log('lol')
    var mesrto = "";
    let result = {};
    try{
            const reqJson = req.body;
           // await createUser(reqJson.todo);   
        console.log(reqJson.site + " " + reqJson.type_order)
        mesrto= reqJson.site;
           var j = {
                additionalInfo: "Доп информация",
                amount: 10,
                createDate: "2019-07-22T09:14:38.107227+03:00",
                currency: "RUB",
                order: `1-13-${randomInteger(1,100)}-${randomInteger(1,100)}-${randomInteger(1,100)}`,
                paymentDetails: "Назначение платежа",
                qrType: "QRDynamic",
                sbpMerchantId: "MA0000000279"
                };
                
  let response = await fetch('https://e-commerce.raiffeisen.ru/api/sbp/v1/qr/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(j)
  });
  
   result = await response.json();
  console.log(result.qrId + " " + result.payload);

        result.success= true;
    }
    catch(e){
        console.log(e)
        result.success=false;
    }
    finally{
        //res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
        lisen(result.qrId, mesrto);

    } 
});

function lisen(qrId, site){
    

    
    let time = 0;
    setTimeout(async function run() {
       a =  await discover(qrId);
       console.log(a)
        if(a == "ACWP" && time <500){
            time++;
            setTimeout(run, 1000);
        } else if(time <500) { 
            console.log(site);
            people += site + " ";
            console.log(site);
        }
      
    }, 1000);
}

async function  discover(qrId){
    console.log(qrId)
    let response = await fetch(`https://e-commerce.raiffeisen.ru/api/sbp/v1/qr/${qrId}/payment-status?`);

    let result = await response.json();
    console.log(result);
    return result;
}

app.listen(8080, () => console.log("Web server is listening.. on port 8080"))


function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }


//start();

//async function start() {
///
//}