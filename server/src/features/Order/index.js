// import Razorpay from 'razorpay';
import Crypto from 'crypto';
import Cart from '../Cart/cart';
import Order from './order';
import Product from '../Product/product.js';
import User from '../User/user';
import Coupon from '../Coupon/coupon';
// import { } from '../Shipping'
import Payment from '../Payment/payment';
import { emailmessage } from '../Notification/email';

const PaytmChecksum = require('paytmchecksum');
const env = process.env;
const https = require('https');

import logger from '../../services/logger.js';
import { equal } from 'assert';

const ObjectId = require('mongoose').Types.ObjectId;

// const isProduction = 0;
// let razorpay;
// if (!isProduction) {
//     razorpay = new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });
// }

// List
const confirmOrder = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in place order'
    }

    try {

        let product = await Product.findOne({ _id: ObjectId(req.body.product) }).populate('tax_class');
        if (!product) {
            response.message = "this plan is no longer available";
            return res.json(response);
        }

        // for applying coupon
        let couponFilter = {};
        let today = new Date();
        couponFilter.validupto = { $gte: today.toISOString() };
        couponFilter.startDate = { $lte: today.toISOString() };
        couponFilter.status = true;
        let coupon = await Coupon.findOne(couponFilter).sort({ _id: -1 });

        let totalMrp, salePrice, totalTaxAmount, totalPaybleAmount;
        let totaldiscount = 0;
        totalMrp = product.mrp;
        salePrice = product.sale;

        let data = {};
        if (coupon) {
            data.coupon = coupon?._id;
            if (coupon.type == 'amount') {
                totaldiscount = coupon.amount;
            } else {
                totaldiscount = (salePrice * coupon.amount) / 100;
            }
        }
        let discountedPrice = salePrice - totaldiscount;
        totalTaxAmount = discountedPrice * product.tax_class.percentage / 100;

        totalPaybleAmount = discountedPrice + totalTaxAmount;

        let lastOrder = await Order.find({}, 'orderid').sort({ _id: -1 }).limit(1);

        let counter = 1000;

        if (lastOrder.length) {
            let lastUName = lastOrder[0]?.orderid;

            if (lastUName) {
                counter = parseInt(lastUName.replace('O', ''));
                counter++
            }
            else {
                counter = counter + 1;
            }
        } else {
            counter = counter + 1;
        }

        data.orderid = `O${counter}`;
        data.user = ObjectId(req.user.id);
        data.item = ObjectId(req.body.product);
        data.totalmrpprice = totalMrp;
        data.totalsaleprice = salePrice;
        data.totalTaxAmount = totalTaxAmount;
        data.totalPaybleAmount = totalPaybleAmount;
        data.totaldiscount = totaldiscount;

        let razParams = {
            amount: totalPaybleAmount * 100,
            currency: "INR",
            receipt: data.orderid,
            notes: {
                localOrderId: data.orderid,
                productId: req.body.product
            }
        }
        // let orderDetail = await razorpay.orders.create(razParams);
        // if (orderDetail) {
        //     data.razorpayOrderId = orderDetail.id;

        //     let orderSave = await Order.create(data);

        //     await emailmessage(
        //         req.user.email,
        //         'orderCreate',
        //         ``,
        //         totalPaybleAmount.toFixed(2),
        //         '',
        //         '',
        //         '',
        //         '',
        //         '',
        //         '',
        //         product.name,
        //     )

        //     response.status = 1;
        //     response.message = "Order is created sucessfully";
        //     response.user = req.user;
        //     response.localOrderId = orderSave._id;
        //     response.key = process.env.RAZORPAY_KEY_ID;
        //     response.orderDetail = orderDetail;
        //     return res.json(response);
        // } else {
        //     response.message = "issue in creating order";
        //     response.status = 0;
        //     return res.json(response);
        // }

        response.message = "issue in creating order";
            response.status = 0;
            return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const verifyOrder = async (req, res) => {
    let response = {
        status: 0,
        message: "issue in verifying the payment"
    }
    logger.info('Payment response - ', { metadata: req.body });

    try {
        response.status = 1;
        response.message = "Thank You for Payment"
        res.json(response);

        // let ipnBody = req.body?.entity;
        // demo ipn : 
        // {"entity": {
        //     "id": "pay_QSPDfUsl9OvjgS",
        //     "entity": "payment",
        //     "amount": 82482,
        //     "currency": "INR",
        //     "status": "captured",
        //     "order_id": "order_QSPD5S2CS0sj1f",
        //     "invoice_id": null,
        //     "international": false,
        //     "method": "upi",
        //     "amount_refunded": 0,
        //     "refund_status": null,
        //     "captured": true,
        //     "description": "Transaction",
        //     "card_id": null,
        //     "bank": null,
        //     "wallet": null,
        //     "vpa": "7082880212@ybl",
        //     "email": "rohan@havfly.com",
        //     "contact": "+917082880212",
        //     "notes": {
        //       "productId": "680f668d400a8c1b84bd96ab",
        //       "localOrderId": "O1001"
        //     },
        //     "fee": 1948,
        //     "tax": 298,
        //     "error_code": null,
        //     "error_description": null,
        //     "error_source": null,
        //     "error_step": null,
        //     "error_reason": null,
        //     "acquirer_data": {
        //       "rrn": "722502386730",
        //       "upi_transaction_id": "4A53BE850F6CECC71BF0AD2DB279DDB6"
        //     },
        //     "created_at": 1746700991,
        //     "reward": null,
        //     "upi": {
        //       "vpa": "7082880212@ybl"
        //     },
        //     "base_amount": 82482
        //   }
        //   }


        let ipnBody = req.body?.payload?.payment?.entity;

        let order = await Order.findOne({ orderid: ipnBody?.notes?.localOrderId }).populate({
            path: 'item',
            select: 'name timePeriod'
        }).populate({
            path: 'user',
            select: 'email phone products'
        });

        console.log("order", order)

        if (!order) {
            // response.message = "order not found";
            return;
        }
        order.status = ipnBody?.status == 'captured' ? "Completed" : "Failed";
        order.totalPaidAmount = ipnBody?.amount / 100;
        order.transactionDetail.transactionId = ipnBody?.id;
        order.transactionDetail.vpa = ipnBody?.vpa;
        order.transactionDetail.email = ipnBody?.email;
        order.transactionDetail.contact = ipnBody?.contact;
        if (!order.user.phone) order.phone = ipnBody?.contact;

        order.save();

        let item = {};
        item._id = ObjectId(order.item._id)
        let date = new Date()
        item.buyDate = date;
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + order.item.timePeriod);
        item.endDate = endDate;
        item.status = true;
        let found = false;

        for (let product of order.user.products) {
            if (product?._id.toString() == ipnBody?.notes?.productId.toString()) {
                if (product.status == true) {
                    let prevEnd = new Date(product.endDate);
                    prevEnd.setDate(prevEnd.getDate() + order.item.timePeriod);
                    product.endDate = prevEnd;
                    found = true;
                    break;
                } else {
                    product.buyDate = new Date();
                    let now = new Date();
                    now.setDate(now.getDate() + order.item.timePeriod);
                    product.endDate = now;
                    product.status = true;
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            if (order.user.products == undefined) {
                order.user.products = [];
            }
            order.user.products.push(item);
        }
        await order.user.save();

        let userName = `${order.user.firstName ? order.user.firstName + (order.user.lastName ? ' ' + order.user.lastName : '') : ''}`;
        let today = new Date();
        today = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`

        await emailmessage(
            order.user.email,
            'paymentComplete',
            userName,
            order.totalPaidAmount.toFixed(2),
            '',
            `${order.status ? order.status : ''}`,
            `${today ? today : ''}`,
            '',
            '',
            order.orderid,
            order.item.name,
        )
        return;
    } catch (error) {
        logger.error(error.message, { metadata: error });
    }
}

const refund = async (req, res) => {
    let response = {
        status: 0,
        message: "Issue in refund"
    }
    try {
        let paymentId = req.body.paymentId;
        let amount = req.body.amount

        let refund = await razorpay.payments.refund(paymentId, {
            amount : amount*100
        })
        console.log(refund);

        response.refund = refund;
        response.status = 1;
        response.message = "your request is generated";
        return res.json(response);

    } catch (error) {
        response.status = 0;
        response.message = err.message || err.toString()
        logger.error(response.message, { metadata: err });
        return res.status(500).json(response);
    }
}

const verifyRefund = async (req, res) => {
    let response = {
        status: 0,
        message: "Issue in refund"
    }
    logger.info('Refund response - ', { metadata: req.body });
    try {
        console.log("refund body", req.body);

    } catch (error) {
        response.status = 0;
        response.message = err.message || err.toString()
        logger.error(response.message, { metadata: err });
        return res.status(500).json(response);
    }
}

const ipnStatusUPI = async (req, res) => {

    // Default response
    let response = {
        "status": 0,
        "message": "Issue in receving upi ipn request."
    };

    logger.info('Payment response - ' + req.body.client_txn_id, { metadata: req.body });


    // Start from 
    let orderId = req.body.client_txn_id;

    if (!orderId) {
        response.message = "Please provide order id.";
    }

    try {

        // Create payment table proccess

        let order = await Order.findOne({ orderid: orderId });

        if (!order) {

            response.message = "We do not find any order with this ID.";
            logger.error(response.message, { metadata: {} });

        }

        if (order.status != 0) {
            response.message = "Already payment status updated.";
            logger.error(response.message, { metadata: payment });
            return 1;
        }

        order.mode = 'UPI';
        order.payment_trns_id = req.body?.upi_txn_id;
        order.status = req.body.status == true && order.totalPaybleAmount == req.body.amount ? 2 : 1;

        order.save();

        // gamil 

        let resp = await emailmessage(
            req.user.email,
            'orderCreate',
            `${req.user.firstName}`,
            order.totalPaybleAmount,
            '',
            '',
            new Date(order.createdAt.toString()).toDateString(),
            '',
            'PC DEALS INDIA',
            order.orderid
        );


        //whatsaap request
        //  await whatsaapRequest(template,req.user.phone,'value')


        // Regarding payment
        /* let data = {
             type: req.body.type,
             order: req.body.order,
             amount: req.body.amount,
             user:req.body.user,
             payment:req.body.payment,
             comment:req.body.comment,
             trans_coins:req.body.trans_coins,
             wallet_remaining_coins:req.body.wallet_remaining_coins,
             remaining_coins:req.body.remaining_coins,
             status:req.body.status
 
         }
         
         let transaction = await Transaction.create(data);*/

        // Go for payment

        // response.message = message+ " " + deleteCart;


        let txnTime = new Date(txnAt);


        let payment = Payment.create({
            userid: order.user,
            amount: order.totalPaybleAmount,
            mode: order.mode,
            type: 'Online Buy',
            paymentTransaction: order.payment_trns_id,
            transactionTime: txnTime.toISOString(),
            reason: order.status == 1 ? req.body.message : '',
            status: order.status

        });

        if (payment) {
            response.status = 1;
            response.message = '';
        }

        return res.json(response);

    } catch (err) {
        response.status = 0;
        response.message = err.message || err.toString()
        logger.error(response.message, { metadata: err });
        return res.status(500).json(response);
    }
}

// Get order by id
const getOrder = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in get order details api'
    }

    try {

        let filters = {};
        filters._id = ObjectId(req.params.id);

        let order = await Order.findOne(filters).populate({
            path: 'item',
            populate: {
                path: 'tax_class category'
            }
        }).populate('user')

        response.order = order;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }

}

const checkOrderStatus = async (req, res) => {


    // Default Response
    let response = {
        status: 0,
        message: 'We does not found this order id.'
    }

    try {

        if (req.user.role.slug != 'admin') {
            filters.user = ObjectId(req.user.id);
        }

        if (req.body.orderid) {
            filters.orderid = req.body.orderid;
        }

        let order = await Order.findOne(filters, { status: 1 });

        if (order) {
            response.order = order;
            response.status = 1;
            response.message = ''
        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// List

// To do create order by admin
const adminOrderCreate = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in admin order create'
    }

    try {



        // Shipping address
        let shippingAddress = {
            addressline1: req.body.shippingaddress.addressline1,
            addressline2: req.body.shippingaddress.addressline2,
            city: req.body.shippingaddress.city,
            state: req.body.shippingaddress.state,
            zipcode: req.body.shippingaddress.zipcode
        };

        let billingAddress = {
            addressline1: req.body.billingaddress.addressline1,
            addressline2: req.body.billingaddress.addressline2,
            city: req.body.billingaddress.city,
            state: req.body.billingaddress.state,
            zipcode: req.body.billingaddress.zipcode
        };

        let totalMrp, salePrice, totalQuanity;

        totalQuanity = totalMrp = salePrice = 0;
        let items = req.body.Items;

        for (const singleItem of req.body.Items) {
            if (singleItem.quantity > singleItem.product.quantity) {
                singleItem.quantity = singleItem.product.quantity;
                message = 'Updated cart item due to low quantity.';
            }

            totalQuanity += singleItem.quantity;
            totalMrp += singleItem.product.mrp;
            salePrice += parseInt(singleItem.product.sale);

            items.push({
                productId: singleItem.product.id,
                mrp: singleItem.product.mrp,
                tax: 0,
                sale: singleItem.product.sale,
                quantity: singleItem.quantity
            });
        }

        let data = {
            items: items,
            totalmrpprice: totalMrp,
            totalsaleprice: salePrice,
            totaldiscount: totalMrp - salePrice,
            totalTaxAmount: 0,
            shippingCost: 0,
            shippingTrcking: 0,
            totalPaybleAmount: salePrice,
            mode: 0,
            payment: salePrice,
            payment_trns_id: '',
            coupons: req.body.coupon,
            user: req.user.id,
            totalquantity: totalQuanity,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            status: 0,
        }

        if (req.body.couponcode) {

            let validateUpto = new Date();
            let coupon = await Coupon.findOne({ code: req.body.couponcode, validupto: { $gte: validateUpto.toISOString() } });

            if (!coupon) {
                response.message = 'Invalid coupon';
                return res.json(res.json(response));
            }

            data.coupon = coupon.code;
            data.couponDiscountAmount = coupon.amount;
            data.payment = salePrice - coupon.amount;
        }

        let order = await Order.create(data);

        Cart.deleteMany({ user: ObjectId(req.user.id) });



        // Go for payment
        response.order = order;
        response.status = 1;
        response.message = message;

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


// place order
// coupon
// mgt order 

const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in order list'
    }

    try {
        let filters = {};
        if (req.body.userId) {
            filters.user = ObjectId(req.body.userId);
        }

        if (req.body.orderId) {
            filters.orderid = req.body.orderId
        }

        if (req.body.id) {
            filters.id = req.body.id
        }

        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;

        if (req.body.status == 'Completed') {
            filters.status = req.body.status
        } else if (req.body.status == 'Pending') {
            filters.status = req.body.status
        }

        if (req.body.endDate && req.body.startDate) {

            let start = new Date(req.body.startDate)
            start.setHours(0, 0, 0)
            start.toISOString()

            let end = new Date(req.body.endDate)
            end.setHours(23, 59, 59)
            end.toISOString()

            filters.updatedAt = { $gte: start, $lte: end }
        }

        if (req.body.search) {
            filters["$or"] = [
                { "shippingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "serialNumber.number": { '$regex': req.body.search, $options: 'i' } },
                { "orderid": { '$regex': req.body.search, $options: 'i' } }
            ]
        }


        let list = await Order.find(filters).sort({ createdAt: -1 })
            .populate(['user', 'item'])
            .skip((page - 1) * numberOfRecords)
            .limit(numberOfRecords);

        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// list for csv
const orders = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in order list'
    }

    try {
        let filters = {};
        if (req.body.userId) {
            filters.user = ObjectId(req.body.userId);
        }

        if (req.body.orderId) {
            filters.orderid = req.body.orderId
        }

        if (req.body.id) {
            filters.id = req.body.id
        }


        if (req.body.status == 'Completed') {
            filters.status = req.body.status
        } else if (req.body.status == 'Pending') {
            filters.status = req.body.status
        }

        if (req.body.endDate && req.body.startDate) {

            let start = new Date(req.body.startDate)
            start.setHours(0, 0, 0)
            start.toISOString()

            let end = new Date(req.body.endDate)
            end.setHours(23, 59, 59)
            end.toISOString()

            filters.updatedAt = { $gte: start, $lte: end }
        }

        if (req.body.search) {
            filters["$or"] = [
                { "shippingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "orderid": { '$regex': req.body.search, $options: 'i' } }
            ]
        }

        let list = await Order.find(filters).sort({ createdAt: -1 })
            .populate('user item')

        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const ownOrderList = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in own order list'
    }

    try {

        let filters = {
            user: req.user.id,
            status: "Completed"
        };
        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;


        if (req.body.search) {
            filters["$or"] = [
                { "shippingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "shippingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.companyName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.city": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.state": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.phone": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.firstName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.lastName": { '$regex': req.body.search, $options: 'i' } },
                { "billingAddress.email": { '$regex': req.body.search, $options: 'i' } },
                { "serialNumber.number": { '$regex': req.body.search, $options: 'i' } },
                { "orderid": { '$regex': req.body.search, $options: 'i' } }
            ]
        }


        let list = await Order.find(filters).sort({ createdAt: -1 }).populate({
            path: 'item',
            select: 'name timePeriod'
        }).skip((page - 1) * numberOfRecords).limit(numberOfRecords);

        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const reOrderGen = async (req, res) => {
    let response = {
        status: 0,
        message: 'Issue in reorder'
    }
    try {
        let order = Order.findOne({ _id: req.body.orderid }, 'items').populate('items.productId');
        let cartValue = Cart.deleteMany({ user: req.user._id });

        let promisResp = await Promise.all([cartValue, order])
        let cart = []

        let counter = 0
        for (let singleitem of promisResp[1].items) {
            if (singleitem?.quantity) {

                if ((singleitem.productId.softDelete == false) && (singleitem.productId.status == true) && (singleitem.quantity >= 1)) {
                    cart.push(
                        {
                            product: singleitem.productId._id,
                            user: req.user.id,
                            customize: singleitem.customProduct,
                            quantity: singleitem.quantity
                        })
                } else {
                    counter++
                }
            } else {
                counter++
            }
        }


        let resp = await Cart.insertMany(cart)
        if (resp[0].quantity > 0) {
            response.message = "successfully order generate",
                response.status = 1
        } else if (counter > 1) {
            response.message = "successfully order generate \n same product are out of stock",
                response.status = 1
        }

        return res.json(response)
    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


const serialNumber = async (req, res) => {
    let response = {
        status: 0,
        message: 'Issue in serial number'
    }
    try {


        let srNum = await Order.findById(req.body.orderid);

        let newSrNum = []


        if (srNum.serialNumber.length) {
            let resp = srNum.serialNumber.find(obj => obj.productId.toString() === req.body.productId.toString())

            if (resp == undefined) {
                newSrNum.push(
                    {
                        productId: req.body.productId,
                        number: req.body.number
                    }
                )
                srNum.serialNumber.push(...newSrNum)

            } else {
                for (let singleSrNum of srNum.serialNumber) {
                    if (singleSrNum.productId.toString() === req.body.productId.toString()) {
                        if (req.body.number) {
                            singleSrNum.number = req.body.number
                        }
                        singleSrNum.save()
                    }
                }
            }

        } else {
            newSrNum.push(
                {
                    productId: req.body.productId,
                    number: req.body.number
                }
            )
            srNum.serialNumber.push(...newSrNum)
        }

        srNum.save()

        response.message = 'Add Serial Numbers'
        response.status = 1

        return res.json(response)

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

module.exports = { list, confirmOrder, verifyOrder, ownOrderList, getOrder, checkOrderStatus, ipnStatusUPI, refund, reOrderGen, orders, serialNumber };