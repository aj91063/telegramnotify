var teleBot = require("node-telegram-bot-api");
var token = '1713439842:AAFu3x6KLSi3eOOzGil1DbGr1lxFFfIAf0Y';
var bot = new teleBot(token, { polling: true });
var request = require('request');
const express=require('express');
const app=express();
const port=process.env.POORT || 3010;


var centerName;
var address;
var state_name;
var district_name;
var fee_type;
var pincode;
var availableCapacity;
var dates;
var vaccine;
var min_age_limit;


let dateAra = new Date().toLocaleDateString().split("/");
let day = dateAra[1];
let month = dateAra[0];
let year = dateAra[2];
let dtt = `${day}-${month}-${year}`;

let getData = () => {
    bot.onText(/\/d (.+)/, function (msg, match) {
        var chatId = msg.chat.id;
        //var date=match[1];
        var city = match[1];
        console.log("----" + city);
        request(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${city}&date=${dtt}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var res = JSON.parse(body);
                CityName = res.centers[0]["district_name"];
                bot.sendMessage(chatId, "searching.." + CityName, { parse_mode: 'Markdown' }).then((msg) => {


                    console.log(res.centers[0]["sessions"][0]["available_capacity"]);
                    for (let key in res.centers) {
                        //console.log(res.centers[key]["name"]);

                        centerName = res.centers[key]["name"];
                        pincode = res.centers[key]["pincode"];
                        address = res.centers[key]["address"];
                        state_name = res.centers[key]["state_name"];
                        district_name = res.centers[key]["district_name"];
                        fee_type = res.centers[key]["fee_type"];
                        //console.log(`Cente name: ${centerName}\nAddress: ${address}\nPincode: ${pincode}\nState: ${state_name}\nDistrict: ${district_name}\nFee Type: ${fee_type}`);


                        for (let key2 in res.centers[key]["sessions"]) {
                            //console.log(res.centers[key]["sessions"][key2]["min_age_limit"]);

                            availableCapacity = res.centers[key]["sessions"][key2]["available_capacity"]
                            dates = res.centers[key]["sessions"][key2]["date"]
                            vaccine = res.centers[key]["sessions"][key2]["vaccine"]
                            min_age_limit = res.centers[key]["sessions"][key2]["min_age_limit"]
                            //console.log(`\nCapacity Available: ${availableCapacity}\nDate: ${dates}\nVaccine name: ${vaccine}\nAge: ${min_age_limit}`);

                            if (availableCapacity != 0) {
                                
                                    bot.sendMessage(chatId, "----------Slot Avability-----------" + `\nCente name: ${centerName}\nAddress: ${address}\nPincode: ${pincode}\nState: ${state_name}\nDistrict: ${district_name}\nFee Type: ${fee_type}\nAvailable Slot: ${availableCapacity}\nDate: ${dates}\nVaccine name: ${vaccine}\nAge: ${min_age_limit}\n\nCoWin: https://selfregistration.cowin.gov.in`);
                              
                                
                            }

                        }

                        //console.log("______________________________________")
                    }


                    console.log(res.centers.length)

                    //console.log(res);
                });


            }
            else {
                console.log(error);
            }
        });
    });
}
app.get("/",(req,res)=>{
    res.send("hello bro");
});
app.listen(port,()=>{
console.log("port: "+port);
});

getData();

