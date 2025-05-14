const Paytm = require('paytm-pg-node-sdk');
const env = process.env;

// For Staging 
var environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;

// For Production 
// var environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;

// Find your mid, key, website in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
var mid = env.PAYTM_MID;
var key = env.PAYTM_KEY;
var website = "https://pcdealshardware.com/";
var client_id = "WEB";

var callbackUrl = "https://pcdealshardware.com/";
Paytm.MerchantProperties.setCallbackUrl(callbackUrl);

Paytm.MerchantProperties.initialize(environment, mid, key, client_id, website);
// If you want to add log file to your project, use below code
Paytm.Config.logName = "[PAYTM]";
Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
Paytm.Config.logfile = '/projects/ecommerce/server/src/helper/payment/pay.log';

const createTns = async () => {

    try {
        var channelId = Paytm.EChannelId.WEB;
        var orderId = "2";
        var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, "1.00");
        var userInfo = new Paytm.UserInfo("64952263e4f4bf1228948c2c"); 
        //userInfo.setAddress("Hisar");
        userInfo.setEmail("sajjan@havfly.com");
        //userInfo.setFirstName("sajjan");
        //userInfo.setLastName("sajjan");
        userInfo.setMobile("7894645487");
        //userInfo.setPincode("125001");
        var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
        var paymentDetail = paymentDetailBuilder.build();
       // var response = await Paytm.Payment.createTxnToken(paymentDetail);
    
        return Paytm.Payment.createTxnToken(paymentDetail).then(function (response) {
            if (response instanceof Paytm.SDKResponse) {
                let respObject = response.getResponseObject();
            
               
                console.log("\nRaw Response:\n", respObject.body.resultInfo.resultStatus);
                console.log("\nRaw Response:\n", respObject.body.resultInfo.resultCode);
                // resultCode
            }

            
            // DEBUGGING INFO
            console.log("\nRESPONSE RECEIVED IN DEMOAPP: ", response.getResponseObject());
            // DEBUGGING INFO ENDS
    
            return response;
        });
    } catch (err) {
        console.log(err);
    }

  

}

module.exports = {
    createTns
}