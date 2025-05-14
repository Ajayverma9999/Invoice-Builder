import 'dotenv/config';
let logger = require('../services/logger');
//import Promise from 'promise';
import Setting from '../features/Setting/setting';
import Shipping from '../features/Shipping/shipping';
import Order from '../features/Order/order';
import User from '../features/User/user';

import Payment from '../features/Payment/payment'
import { emailmessage } from '../features/Notification/email';
import { whatsaapNotify } from '../features/Notification/whatsapp';

import {
  response
} from "express";
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import Cartslab from '../features/CartRateSlab/slab';
// import fetch from 'fetch';
const env = process.env;
const ObjectId = require('mongoose').Types.ObjectId;

export const settingsData = async (name = '') => {

  try {
    let settings = await Setting.find({}, 'name value').sort({
      orderby: 'asc'
    }).exec();

    let allSettings = {};

    settings.forEach(function (element) {
      allSettings[element.name] = element.value;
    });


    if (name) {
      allSettings = allSettings[name];
    }

    return allSettings;
  } catch (err) { }
}

export const httpRequest = async (url, params) => {
  return await axios
    .post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Content-Length': params.length
      }
    })
    .then(responseHttp => {
      //console.log(responseHttp.status);
      //console.log(responseHttp.data);
      return responseHttp;
    })
    .catch(error => {
      return error;
    })
}

export const getFilterSettings = async (filter) => {
  let settings = await Setting.find(filter, 'name value key').sort({
    orderby: 'asc'
  }).exec();

  let allSettings = {};

  await settings.forEach(function (element) {
    allSettings[element.key] = element.value;
  });

  return allSettings;

}

export const getSettings = async (key) => {

  let settings = await Setting.findOne({ key: key, status: true }, 'value').exec();
  if (settings) {

    return settings.value;
  } else {
    return 0
  }

}

export const getShippingCosting = async (state, weight) => {
  let settings = await getFilterSettings({ filter: 'shipping' });

  let costing = 0;
  if (settings['flat_shipping'] == 1 && settings['flat_shipping_cost'] > 0) {
    costing = settings['flat_shipping_cost'];
  } else {
    let shippingCost = await Shipping.findOne({ state: { $regex: state, $options: 'i' } }, 'cost');
    if (shippingCost) {
      let weightList = Object.keys(shippingCost.cost).sort((a, b) => parseInt(a) - parseInt(b)).reverse()

      let costWeight = 0;
      for (let singleWaight of weightList) {
        if (singleWaight <= Math.ceil(weight)) {
          costWeight = singleWaight;
          break;
        }
      }

      if (costWeight in shippingCost.cost) {
        // console.log(shippingCost.cost[costWeight], "*", Math.ceil(weight));
        costing = (shippingCost.cost[costWeight] * Math.ceil(weight));
      } else {
        costing = settings['flat_shipping_cost'];
      }

    } else {
      let defaultweightvalue = await getSettings('defaultweightshipping')
      costing = parseInt(defaultweightvalue) * parseInt(Math.ceil(weight))
    }

  }
  return costing;
}

export const bettingAlowedGame = async (gameId) => {

  let d = new Date();

  let gameHistory = await GameHistory.find({
    start: {
      $lte: d.toISOString()
    },
    betting_allow_time: {
      $gt: d.toISOString()
    },
    game: ObjectId(gameId),
  }).exec();


  return gameHistory;
}

export const crGame = async (gameId) => {

  let d = new Date();

  let gameHistory = await GameHistory.findOne({
    'start': {
      $lte: d.toISOString()
    },
    'end': {
      $gt: d.toISOString()
    },
    game: ObjectId(gameId)
  }, {
    number: 0
  }).exec();


  return gameHistory;
}

export const verifyToken = async (req) => {


  let headers = req.headers;
  let token = '';

  // let ar = [0,2000,500,1000,800,1200,1500,1800];
  //  await new Promise(resolve => setTimeout(resolve, ar[Math.floor(Math.random() * ar.length)]));

  let response = {
    status: 1,
    message: '',
  };


  if (headers) {
    token = headers['x-auth-token'];
  }

  let tokens = [req.user.token, req.user.webtoken]

  if (tokens.indexOf(token) == -1) {

    response.status = 0;

    response.message = "Unauthorised access";
  }

  return response;
}

export const treeUnderUser = async (agentId) => {

  let allChld = [];

  let crntCheckChild = [agentId];

  let runningLoop = 1;

  while (runningLoop) {
    let newChild = await User.find({
      parent: {
        $in: crntCheckChild
      }
    }).exec();

    if (newChild.length == 0) {
      runningLoop = 0;
      break;
    }

    crntCheckChild = newChild.map(function (a) {
      return a.id;
    });
    allChld = [...allChld, ...crntCheckChild];
  }

  return allChld;
}

export const checkpermission = async (roleId, action) => {

  let permission = {};

  permission.backendCreateUser = ['admin'];
  permission.updateUser = ['admin'];
  permission.deleteUser = ['admin'];
  permission.listUsers = ['admin'];
  permission.verifyUser = ['admin'];

  permission.authorised = ['admin'];
  // Order
  permission.updateOrder = ['admin', 'manager'];
  permission.orderListBackend = ['admin', 'manager'];
  permission.createOrderBackend = ['admin', 'manager'];

  // Product
  permission.addProduct = ['admin', 'manager'];
  permission.deleteProduct = ['admin', 'manager'];
  permission.updateProduct = ['admin', 'manager'];
  permission.productlistbackend = ['admin', 'manager'];

  // Categories
  permission.addCategories = ['admin', 'manager'];
  permission.deleteCategories = ['admin', 'manager'];
  permission.updateCategories = ['admin', 'manager'];
  permission.categorieslistbackend = ['admin', 'manager'];

  permission.addAttribute = ['admin']
  permission.updateAttribute = ['admin']
  permission.deleteAttribute = ['admin']


  permission.addCoupon = ['admin']
  permission.updateCoupon = ['admin']
  permission.deleteCoupon = ['admin']

  permission.addEmailTemplate = ['admin']
  permission.updateEmailTemplate = ['admin']
  permission.deleteEmailTemplate = ['admin']

  let response = {
    'status': 0,
    'message': 'Access denied'
  };

  if (action && permission[action] !== undefined) {
    if (permission[action].indexOf(roleId) !== -1) {
      response.status = 1;
      response.message = '';
    }
  }

  return response;
}

export const emailTemplate = (req, res) => {
  try {

    let response = {
      message: "issue in email templates",
      status: 0
    }

    let template = req.body.template;

    response.message = "",
      response.status = 1,
      response.list = templateFun()[template]


    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

  }
}

export const templateFun = () => {
  let allTemplate = {
    signUp: ["[username]", "[gmail]", "[password]"],
    orderCreate: ["[gmail]", '[username]', "[Amount]", "[Date]", "[company_name]", "[order_Id]"],
    orderUpdate: ["[gmail]", '[username]', "[Amount]", "[Date]", "[Order_Status]", "[company_name]", "[order_Id]"],
    offer: ["[Product_Name]", "[offerDetails]"],
    VerificationOtp: ["[otp]"],
  }
  return allTemplate
}


export const emailTemplates = (req, res) => {
  try {
    let response = {
      message: "issue in email templates",
      status: 0
    }


    response.message = "",
      response.status = 1,
      response.list = Object.keys(templateFun())

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;
  }
}


export const otp = async (req, res) => {
  let response = {
    status: 0,
    message: 'Issue in Otp',
  };
  try {

    let filter = {}
    filter.$or = [
      { email: req.body.email }, { phone: req.body.email }
    ]


    let user = await User.findOne(filter)

    if (user) {

      let otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp
      user.save();
      await emailmessage(
        req.body.email,
        'VerificationOtp',
        ``,
        '',
        '',
        '',
        '',
        otp
      )




      let whatsaapReq = {
        templateName: "pcdh_password_reset",
        phone: user.phone,
        dataArray: [user.otp],
        languageCode: "en",
        headerArray: [],
        buttonArray: []
      }

      whatsaapNotify(whatsaapReq)



      response.status = 1;
      response.message = `verification otp send on ${req.body.email}`
    } else {
      response.status = 0;
      response.message = `Enter your valid Details.`
    }

    return res.json(response)
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    res.status(500).json(response);
  }
}


export const rateLimiter = (millisecond, totalReq) => {


  const apiLimiter = rateLimit({
    windowMs: millisecond,
    max: totalReq,
    standardHeaders: true,
    legacyHeaders: false,
    message: "ok",
    handler: function (req, res /*, next*/) {
      return res.status(500).json({ status: 0, message: 'message off' });
    }
  })

  return apiLimiter

}

export const apiReq = async (api, type, body) => {
  // console.log(api, type, body);
  let req = {
    method: type,
    url: api,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  };

  let resp = await axios.request(req);
  return resp

};

export const userCashback = async (orderid) => {
  try {
    orderid = orderid.toString()
    let pdcid = ""
    let order
    if (orderid) {
      order = await Order.findById({ _id: ObjectId(orderid) }).populate('user')
    }

    if (orderid && pdcid?.length) {
      
    } else {
      return false
    }
  } catch (err) {
    logger.error(err.message, { metadata: err });
  }
}

export const submitRewards = async (email, rewardAmount, url, comment) => {
  try {

    let rewardUrl = `${process.env.PCDEALS_REWARDS_URL}/api/user/rewards/add`
    //  let rewardUrl =  'http://localhost:6000/api/user/rewards/add'
    let data = { "email": email, "amount": rewardAmount, url: url, comment: comment }
    console.log('data', data)
    let resp = await apiReq(rewardUrl, 'POST', JSON.stringify(data))

    if (resp.data.status) {
      return resp
    }
  } catch (err) {
    console.log(err);
  }
}

export const rewardsAdd = async (order) => {
  try {
    let slabReward = 0, productReward = 0, total = 0;
    if (order.rewardStatus) {
      for (let singleRwd of order.rewards) {
        if (singleRwd.productid == null) {
          slabReward += singleRwd.amount

        }
        if (singleRwd.slabid == null) {
          productReward += singleRwd.amount
        }
      }

      order.rewardStatus = false
    }

    total = slabReward + productReward + order.shippingCost

    if (slabReward) {
      await submitRewards(order.user.email, slabReward, 'https://pcdealshardware.com/pcdeals-hardware', `Cart Value Reward Points for Order ID : ${order.orderid}`)
    }
    if (productReward) {
      await submitRewards(order.user.email, productReward, 'https://pcdealshardware.com/pcdeals-hardware', `ADD – Product Reward Points for Order ID : ${order.orderid}`)
    }
    if (order.shippingCost) {
      await submitRewards(order.user.email, order.shippingCost, 'https://pcdealshardware.com/pcdeals-hardware', `Freight Reward Points for Order ID : ${order.orderid}`)
      order.pcdealCashback = true
    }

    let url = `${process.env.PCDEALS_REWARDS_URL}/api/user/rewardpoints`;
    let resp = await apiReq(url, 'POST', JSON.stringify({ email: order.user.email }))

    if (total && resp.data.reward) {
      let whatsaapdata = {
        templateName: "pcdr_rewards",
        phone: order.user.phone,
        dataArray: [`${order.user.firstName, order.user.firstName}`, total, order.orderid, resp.data.reward],
        languageCode: "en",
      }
      whatsaapNotify(whatsaapdata)
    }

    return order.save()



  } catch (err) {
    console.log(err);
  }
}

export const cartslabAmount = async (amount) => {
  try {
    let filter = { '$and': [{ min: { '$lte': amount } }, { max: { '$gte': amount } }], status: true }

    let slab = await Cartslab.find(filter).sort({ max: 1, min: 1 }).limit(1);
    let data = { id: null, rate: 0 }
    if (slab.length) {

      let rate = slab[0] ? (slab[0].status ? slab[0].rate : 0) : 0;
      data = { id: slab[0].id, rate: parseInt((amount * rate) / 100) };
    }
    return data
  } catch (err) {
    console.log(err);
    logger.error(err.message, { metadata: err });
  }
}