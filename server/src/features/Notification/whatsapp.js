import { Router } from 'express';
import axios from 'axios';
let logger = require('../../services/logger');

const whatsaapRequest = (templateName, phone,dataArray,languageCode) => {
    // otp_verify
    // order_shipped_and_track
    try {

      let data = JSON.stringify({
        "countryCode": "+91",
        "phoneNumber": phone,
        "callbackData": "some text here",
        "type": "Template",
        "template": {
          "name": templateName,
          "languageCode": languageCode,
          "bodyValues": dataArray
        }
      });

    

      let config = {
        method: 'post',
        url: 'https://api.interakt.ai/v1/public/message/',
        headers: { 
          'Authorization': `Basic ${process.env.WHATSAAP_API_KEY}`, 
          'Content-Type': 'application/json'
        },
        data : data
      };
      let response = axios.request(config)
      return response.data
                  
    } catch (error) {
        logger.error("whatsaap notification", { metadata: error });
    }
}


const whatsaapNotify = (data) => {
  try {
    
   let resp = whatsaapRequest(data.templateName, data.phone,data.dataArray,data.languageCode)
   if(resp?.result){
    return 1
   }else{
    return 0
   }
  } catch (err) {
    logger.error("whatsaap whatsaapNotify", { metadata: err });
  }
}


const phoneVerify = {

}

// const wtsReq = async (req,res) =>{
//   try {
    
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = {
  whatsaapNotify,
  whatsaapRequest
}