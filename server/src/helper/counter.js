import Order from '../features/Order/order';
import User from '../features/User/user';
import Payment from '../features/Payment/payment';
import Category from '../features/Category/category';
import Product from '../features/Product/product';
import Project from '../features/Project/project';
const customerrole = '6114d5c422b7c53a358bba0b'

let logger = require('../services/logger');


const counterReports = async (req, res) => {
  let response = {
    message : "issue in counter reports",
    status : 0
  }
  try {
    console.log("entered 1");
    
    let counterPromis = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Project.countDocuments()
    ]);
    
    response.category = counterPromis[0];
    response.product = counterPromis[1];
    response.project = counterPromis[2];

    response.message = "counted all the documents"
    response.status = 1;

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;
  }
}


// const counterReports = async (req, res) => {

//   let response = {
//     message: "issue in counter report",
//     status: 0
//   }

//   try {

//     // order total

//     function counter(db, role) {

//       let morning = new Date();
//       let night = new Date();

//       morning.setHours(0, 0, 0)
//       morning.toISOString()
//       night.setHours(23, 59, 59)
//       night.toISOString()
//       let todayfilters = {};


//       if (role) {
//         todayfilters.role = role
//       }
//       todayfilters.createdAt = { $gte: morning, $lte: night }
//       // today total 
//       let todaytotal = db.countDocuments(todayfilters)


//       let weekFirstDay = new Date();
//       let weeklastDay = new Date();

//       weekFirstDay.setDate(weekFirstDay.getDate() - (weekFirstDay.getDay() || 7) + 1)
//       weekFirstDay.setHours(0, 0, 0)
//       weekFirstDay.toISOString()

//       weeklastDay.setDate(weeklastDay.getDate() - (weeklastDay.getDay() - 1) + 6)
//       weeklastDay.setHours(23, 59, 59)
//       weeklastDay.toISOString()

//       let weeklyfilters = {};
//       if (role) {
//         weeklyfilters.role = role
//       }

//       weeklyfilters.createdAt = { $gte: weekFirstDay, $lte: weeklastDay }

//       // weekly total 
//       let weeklytotal = db.countDocuments(weeklyfilters)


//       let filters = {}

//       if (role) {
//         filters.role = role
//       }

//       // all total
//       let total = db.countDocuments(filters)

//       return { todaytotal, weeklytotal, total }
//     }



//     function paymentCounter() {

//       let morning = new Date();
      
//       morning.setHours(0, 0, 0)
//       morning.toISOString()

//       let night = new Date();
//       night.setHours(23, 59, 59)
//       night.toISOString()

//       let todayfilters = {};

//       todayfilters.createdAt = { $gte: morning, $lte: night }
//       todayfilters.status = 2

//       let todaytotal = Payment.aggregate([
//         { $match: todayfilters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$amount" }
//           }
//         }
//       ])


//       // weekly total 
//       let weekFirstDay = new Date();
//       let weeklastDay = new Date();

//       weekFirstDay.setDate(weekFirstDay.getDate() - (weekFirstDay.getDay() || 7) + 1)
//       weekFirstDay.setHours(0, 0, 0)
//       weekFirstDay.toISOString()

//       weeklastDay.setDate(weeklastDay.getDate() - (weeklastDay.getDay() - 1) + 6)
//       weeklastDay.setHours(23, 59, 59)
//       weeklastDay.toISOString()

//       let weeklyfilters = {};

//       weeklyfilters.createdAt = { $gte: weekFirstDay, $lte: weeklastDay }
//       weeklyfilters.status = 2
//       let weeklytotal = Payment.aggregate([
//         { $match: weeklyfilters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$amount" }
//           }
//         }
//       ])

//       //  total 

//       let filters = {}

//         filters.status = 2

//       let total = Payment.aggregate([
//         { $match: filters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$amount" }
//           }
//         }
//       ])

//       return { todaytotal, weeklytotal, total }
//     }



//     function orderAmountCounter() {

//       let morning = new Date();
      
//       morning.setHours(0, 0, 0)
//       morning.toISOString()

//       let night = new Date();
//       night.setHours(23, 59, 59)
//       night.toISOString()

//       let todayfilters = {};

//       todayfilters.updatedAt = { $gte: morning, $lte: night }
//       todayfilters.status = 2

//       let todaytotal = Order.aggregate([
//         { $match: todayfilters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$payment" }
//           }
//         }
//       ])


//       // weekly total 
//       let weekFirstDay = new Date();
//       let weeklastDay = new Date();

//       weekFirstDay.setDate(weekFirstDay.getDate() - (weekFirstDay.getDay() || 7) + 1)
//       weekFirstDay.setHours(0, 0, 0)
//       weekFirstDay.toISOString()

//       weeklastDay.setDate(weeklastDay.getDate() - (weeklastDay.getDay() - 1) + 6)
//       weeklastDay.setHours(23, 59, 59)
//       weeklastDay.toISOString()

//       let weeklyfilters = {};

//       weeklyfilters.updatedAt  = { $gte: weekFirstDay, $lte: weeklastDay }
//       weeklyfilters.status = 2
//       let weeklytotal = Order.aggregate([
//         { $match: weeklyfilters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$payment" }
//           }
//         }
//       ])

//       //  total 

//       let filters = {}

//         filters.status = 2

//       let total = Order.aggregate([
//         { $match: filters },
//         {
//           $group: {
//             _id: null,
//             "amount": { $sum: "$payment" }
//           }
//         }
//       ])

//       return { todaytotal, weeklytotal, total }
//     }







//     let orderscounters = counter(Order)
//     let customerCounters = counter(User, customerrole)
//     let paymentCounters = paymentCounter(Payment)
//     let amountOfOrder = orderAmountCounter();
        
//     let totalReports = await Promise.all([
//       orderscounters.todaytotal,
//       orderscounters.weeklytotal,
//       orderscounters.total,

//       customerCounters.todaytotal,
//       customerCounters.weeklytotal,
//       customerCounters.total,

//       paymentCounters.todaytotal,
//       paymentCounters.weeklytotal,
//       paymentCounters.total,

//       amountOfOrder.todaytotal,
//       amountOfOrder.weeklytotal,
//       amountOfOrder.total,
//     ])
//     let todayPayment = 0, weekPayment = 0, allpayment = 0;
//     let todayOrderAmount = 0, weekOrderAmount = 0, allOrderAmount = 0;
    

//     if (totalReports[6][0]) {
//       todayPayment = totalReports[6].length ? totalReports[6][0]?.amount : 0
//       weekPayment = totalReports[7].length ? totalReports[7][0]?.amount : 0
//       allpayment = totalReports[8].length ? totalReports[8][0]?.amount : 0
//     }
    
//     if (totalReports[9]) {
//       todayOrderAmount = totalReports[9][0]?.amount != undefined ? totalReports[9][0]?.amount : 0
//       weekOrderAmount = totalReports[10][0]?.amount != undefined ? totalReports[10][0]?.amount : 0
//       allOrderAmount = totalReports[11][0]?.amount != undefined ? totalReports[11][0]?.amount : 0
//     }




//     let countOrders = {
//       "today": totalReports[0],
//       "thisWeek": totalReports[1],
//       "totals": totalReports[2]
//     }

//     let countCustomers = {
//       "today": totalReports[3],
//       "thisWeek": totalReports[4],
//       "totals": totalReports[5]
//     }

//     let countpayments = {
//       "today": todayPayment,
//       "thisWeek": weekPayment,
//       "totals": allpayment
//     }

//     let completedOrder = {
//       "today": todayOrderAmount,
//       "thisWeek": weekOrderAmount,
//       "totals": allOrderAmount
//     }
    
  


//     response.message = "",
//       response.status = 1,
//       response.list = { countOrders, countCustomers, countpayments ,completedOrder}


//     return res.json(response)


//   } catch (err) {
    // logger.error(err.message, { metadata: err });
    // response.message = err.message || err.toString();
    // response.status = 0;
//   }
// }

module.exports = {
  counterReports
}