import { Router } from 'express';
import { templateFun } from '../../helper/common';
// import EmailTemplate from '../EmailTemplate/emailTemplate';
import User from '../User/user';
const customerRole = '6114d5c422b7c53a358bba0b'

let logger = require('../../services/logger');

if( process.env.EMAIL_API_ID_PROD ) {
// EMAIL_API_ID_PROD
// EMAIL_DOMAIN_PROD
// EMAIL_PROD
let mailgun = require('mailgun-js')({ apiKey: process.env.EMAIL_API_ID_PROD, domain: process.env.EMAIL_DOMAIN_PROD });

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;
// https://www.npmjs.com/package/mailgun.js?utm_source=recordnotfound.com







const emailmessage = async (
  gmail,
  slug,
  username,
  Amount,
  password,
  status,
  date,
  otp,
  companyName,
  orderId,
  productName,
  offerDetails,
  link
) => {

  if (slug == 'offer') {
    // only for offer
    let usersEmails = await User.find({ role: ObjectId(customerRole), status: true, softDelete: false }, 'email');
    let allEmails = []
    for (let singleEmail of usersEmails) {
      allEmails.push(singleEmail.email)
      }
      gmail = allEmails
      }
      
      let emailTempDetails = await EmailTemplate.findOne({ slug: slug });
      
      // let allTemplate = await templateFun();
      let text = emailTempDetails.description;
      // for (let SingleTemplate of allTemplate[slug]) {
        text = text.replaceAll('[gmail]', gmail ?  gmail : '');
        text = text.replaceAll('[username]', username ? username : '');
        text = text.replaceAll('[Amount]', Amount ? Amount : '');
  text = text.replaceAll('[password]', password ? password : '');
  text = text.replaceAll('[Order_Status]', status ? status : '');
  text = text.replaceAll('[Date]', date ? date : '');
  text = text.replaceAll('[otp]', otp);
  text = text.replaceAll('[company_name]', companyName ? companyName : '');
  text = text.replaceAll('[order_Id]', orderId ? orderId : '');
  text = text.replaceAll('[Product_Name]', productName ? productName : '' );
  text = text.replaceAll('[offerDetails]', offerDetails ? offerDetails : '' );
  text = text.replaceAll('[link]', link ? link : '');
  
  
  // }
  try {
    let response = {
      status: 0,
      messages: "issue in email send after create order"
      }
      let data = {
        from: process.env.EMAIL_PROD,
        to: gmail,
        subject: emailTempDetails?.subject,
        html: text
        };
        
        console.log("run email");
        await mailgun.messages().send(data, (err, body) => {
          logger.info('emailRun',{metadata:body})
          logger.info('emailRun_err',{metadata:err})
          if (err) {
            response.messages = err;
            return response
      } else {
        response.messages = body
        response.status = 1
        return response
      }
    }
    );


  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
}

const updateOrder = {

}

const emailVerify = {

}



module.exports = { emailmessage }

}