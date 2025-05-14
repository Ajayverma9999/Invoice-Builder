const axios = require('axios');
const https = require('https');

//const fetch = require('node-fetch');
const env = process.env;
const PaytmChecksum = require('paytmchecksum');
const { httpRequest, apiReq } = require('../common');
const logger = require('../../services/logger');
const { urlencoded } = require('express');
const mid = env.PAYTM_MID;
let host = env.PAYTM_HOST;
let secret = env.PAYTM_SECRET;



const apiURL = {
    "createPayment": "/link/create",
    "reSendNotification": "/link/resendNotificatio",
    "paymentOption": "/theia/api/v2/fetchPaymentOptions",
    "initiateTransaction": "/theia/api/v1/initiateTransaction"
}

// https.request(options, function(post_res) {
//     post_res.on('data', function (chunk) {
//         response += chunk;
//     });

//     post_res.on('end', function(){
//         console.log('Response: ', response);
//     });
//     return response;
// });

var doRequest = async (options) => {
    return new Promise ((resolve, reject) => {
      let req = https.request(options);
      let response = ''

      req.on('data', res => {
        response += chunk;
      });

      req.on('end', res => {
        console.log(response);
        resolve(response);
      });
  
      req.on('error', err => {
        reject(err);
      });
  
      req.end();
    }); 
  }

/* cellbackURl 
Staging Environment: https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=<order_id>
Production Environment: https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=<order_id>
*/

const paymentInitiate = async (reqdata) => {

    try {
        // let paytmParams = {
        //     "body": {
        //         "requestType": "Payment",
        //         "mid": mid,
        //         "websiteName": "https://pcdealshardware.com/",
        //         "orderId": reqdata.orderId,
        //         "callbackUrl": `https://pcdealshardware.com/paytmCallback?orderId=${reqdata.orderId}`,
        //         "txnAmount": { "value": reqdata.amount, "currency": "INR", },
        //         "userInfo": { "custId": reqdata.custId, },
        //     }
        // };

        let paytmParams = {};

        //"extendInfo":{"udf1":"aa","udf2":"2","udf3":"2","mercUnqRef":"shubham"},"userInfo":{"custId":"shubhamtest123"}},"head":{"signature":"{{paytm-checksum}}"}}'
        paytmParams.body = {
            "requestType"   : "Payment",
            "mid"           : mid,
            "websiteName"   : "DEFAULT",
            "orderId"       : reqdata.orderId,
            "callbackUrl"   : "https://pcdealshardware.com/",
            "txnAmount"     : {
                "value"     : reqdata.amount,
                "currency"  : "INR",
            },
            "userInfo"      : {
                "custId"    : reqdata.custId,
            },
        };
        console.log('before check sum',paytmParams );

    let checksum =  await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), env.PAYTM_KEY);
    
            paytmParams.head = {
            "signature": checksum
            };
            
            console.log('paytmParams', paytmParams);
            var post_data = JSON.stringify(paytmParams);
            
            var options = {
            
            /* for Staging */
            hostname: host,
            
            /* for Production */
            // hostname: 'securegw.paytm.in',
            
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid='+mid+'&orderId='+reqdata.orderId,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
            }
            };


            // const response = await axios.post(
            //     'https://securegw.paytm.in/theia/api/v1/initiateTransaction',
            //     post_data,
            //     {
            //         params: {
            //             'mid': 'PCDEAL88143275344444',
            //             'orderId': reqdata.orderId
            //         },
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Cookie': 'JSESSIONID=ECC60E5D1AEF97FC4EA0A264686D6DFA'
            //         }
            //     }
            // );

        //    let response = await fetch('https://securegw.paytm.in/theia/api/v1/initiateTransaction?mid=PCDEAL88143275344444&orderId='+reqdata.orderId, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Cookie': 'JSESSIONID=ECC60E5D1AEF97FC4EA0A264686D6DFA'
        //         },
        //         body: post_data
        //     });
        //console.log(response);
          // console.log(response.body);
           
            // Working code
            let response = '';
            let post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                    console.log('Response: ', response);
                    return response;
            
                });
            });

            post_req.write(post_data);
            post_req.end();
                      

 } catch (err) {
        console.log(err);
        return err;
    }
}


const paymentoption = async (reqData, orderid) => {
    try {

        let params = {
            "body": {
                "mid": mid,
                "orderId": orderid,
                "returnToken": "true"
            },
            "head": {
                "tokenType": "TXN_TOKEN",
                "token": reqData.txnToken
            }
        }

        let resp
        if (reqData.body.resultInfo.resultMsg == 'Success' && reqData.body.resultInfo.resultCode == "0000") {
            resp = PaytmChecksum.verifySignature(params, env.PAYTM_API_KEY, reqData.head.signature)
        }

        if (resp) {
            let url = `https://securegw.paytm.in/theia/api/v2/fetchPaymentOptions?mid=${mid}&orderId=${orderid.toString}`

            let resp = await httpRequest(url, params)
            console.log("resp.data2", resp.data);
            return resp.data
        }

    } catch (err) {
        logger.error('error in paymentoption', { metadata: err })
    }
}

const verificationPayMathod = async (req, res) => {
    try {
        // https://securegw-stage.paytm.in/theia/api/v1/fetchPcfDetails?mid={mid}&orderId={order-id}

        httpRequest
    } catch (err) {

    }
}



const paymentMode = {
    "upi": {
        "paymentMode": "UPI",
        "channelCode": "collect",
        "payerAccount": "abcdefgh@paytm"
    },
    "cCard": {
        "paymentMode": "CREDIT_CARD",
        "cardInfo": "|4111111111111111|111|122032",
        "authMode": "otp",
    },
    "dCard": {
        "paymentMode": "DEBIT_CARD",
        "cardInfo": "|4111111111111111|111|122032",
        "authMode": "otp",
    },
    "netBanking": {
        "paymentMode": "NET_BANKING",
        "channelCode": " bank codes "
    }
    //bank code list // https://business.paytm.com/docs/bank-codes/?ref=payments&utm_campaign=BW_Chatbot&utm_medium=BW_Chatbot&utm_source=BW_Chatbot
}



const processTransaction = async (reqdata) => {
    let params = {
        body: {
            "requestType": "",
            "mid": mid,
            "orderId": reqdata.orderid,
            "paymentMode": "CREDIT_CARD",
            "cardInfo": "|4111111111111111|111|122032",
            "authMode": "otp",
        },

        head: {
            "txnToken": "reqdata.txnToken"
        }
    }


    let url = `${url}/theia/api/v1/processTransaction?mid=${mid}&orderId=${reqdata.orderid}`


    let resp = await httpRequest(url, JSON.stringify(params))

    if (resp.data.body.resultInfo.resultCode == '0000') {
        resp.data.body.bankForm //{.redirectForm, .directForms , .displayField} 

    }


    // after payment chack status

    let statusurl = `${url}/v3/order/status`
    let dataparams = {
        "mid": mid,
        "orderId": reqdata.orderid
    }

    let paymentStatusresp = await httpRequest(statusurl, JSON.stringify(dataparams))

    if (paymentStatusresp.data.body.resultInfo) {
        return paymentStatusresp.data.body
    }

}

module.exports = {
    paymentInitiate
}