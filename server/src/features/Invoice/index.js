import { Router } from 'express';
import Invoice from './invoice';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';
import User from '../User/user';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in invoice list'
    }

    try {
        let filters = {};
        filters.user = ObjectId(req.user.id);
        let list = await Invoice.find(filters);

        response.list = list;
        response.status = 1;
        response.message = 'Your invoices'

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

function isDateInRange(date, start, end) {
    const now = new Date(date);
    return now >= start && now <= end;
}

function getFinancialYear(today, format) {
    let startDate = new Date(format.financialYearStart);
    let endDate = new Date(format.financialYearEnd);
    let startDayFull = String(startDate.getDate()).padStart(2, '0');
    let startDay = String(startDate.getDate());
    let endDayFull = String(endDate.getDate()).padStart(2, '0');
    let endDay = String(endDate.getDate());
    let startMonthFull = String(startDate.getMonth() + 1).padStart(2, '0');
    let startMonth = String(startDate.getMonth() + 1);
    let endMonthFull = String(endDate.getMonth() + 1).padStart(2, '0');
    let endMonth = String(endDate.getMonth() + 1);
    let startYearFull = String(startDate.getFullYear());
    let startYear = String(startDate.getFullYear()).slice(-2);
    let endYearFull = String(endDate.getFullYear());
    let endYear = String(endDate.getFullYear()).slice(-2);
    let replacements = {
        'dds': startDayFull,
        'ds': startDay,
        'dde': endDayFull,
        'de': endDay,
        'mms': startMonthFull,
        'ms': startMonth,
        'mme': endMonthFull,
        'me': endMonth,
        'yyyys': startYearFull,
        'yys': startYear,
        'yyyye': endYearFull,
        'yye': endYear,
    }
    for (let key in replacements) {
        let exp = new RegExp(key, 'g');
        pattern = pattern.replaceAll(exp, replacements[key]);
    }
    return pattern;
}

function getInvoice(format, today, invoiceNo) {
    let pattern = format.invoiceNumberFormat;
    let day = String(today.getDate()).padStart(2, '0');
    let dayShort = String(today.getDate());
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let monthShort = String(today.getMonth() + 1);
    let yearFull = String(today.getFullYear())
    let yearShort = String(today.getFullYear()).slice(-2);


    let startDate = new Date(format.financialYearStart);
    let endDate = new Date(format.financialYearEnd);


    let startDayFull = String(startDate.getDate()).padStart(2, '0');
    let startDay = String(startDate.getDate());
    let endDayFull = String(endDate.getDate()).padStart(2, '0');
    let endDay = String(endDate.getDate());
    let startMonthFull = String(startDate.getMonth() + 1).padStart(2, '0');
    let startMonth = String(startDate.getMonth() + 1);
    let endMonthFull = String(endDate.getMonth() + 1).padStart(2, '0');
    let endMonth = String(endDate.getMonth() + 1);
    let startYearFull = String(startDate.getFullYear());
    let startYear = String(startDate.getFullYear()).slice(-2);
    let endYearFull = String(endDate.getFullYear());
    let endYear = String(endDate.getFullYear()).slice(-2);
    let replacement = {
        'MM': month,
        'M': monthShort,
        'DD': day,
        'D': dayShort,
        'YY': yearShort,
        'YYYY': yearFull,
        '{DATE}': today.toISOString().split("T")[0].split('-').reverse().join('-'),
        '{FIN_YEAR}': getFinancialYear(date, format),
        'dds': startDayFull,
        'ds': startDay,
        'dde': endDayFull,
        'de': endDay,
        'mms': startMonthFull,
        'ms': startMonth,
        'mme': endMonthFull,
        'me': endMonth,
        'yyyys': startYearFull,
        'yys': startYear,
        'yyyye': endYearFull,
        'yye': endYear,
    }
    for (let key in replacement) {
        let exp = new RegExp(key, 'g');
        pattern = pattern.replaceAll(exp, replacement[key]);
    }
    return pattern;
}

// Add
const create = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in creating your invoice'
    }

    try {
        let user = await User.findOne({ _id: req.user.id })
            .populate('invoiceSettings.templates.template')
            .populate('invoiceSettings.templates.invoiceNumberFormat');

        let userInvSetting = user.invoiceSettings.templates[templateIndex];
        





        let previous = await Invoice.findOne({ user: req.user.id }).sort({ createdAt: -1 }).select('invoiceNo')

        // let user = await User.findOne({_id: req.user.id}).populate({path : 'invoiceSettings.invoiceNumberFormat'});
        let invoiceNo = 1;
        let startDate = new Date(user.invoiceSettings.financialYearStart);
        let endDate = new Date(user.invoiceSettings.financialYearEnd);
        if (previous && isDateInRange(req.body.date, startDate, endDate)) {
            invoiceNo = previous.invoiceNo + 1;
        }

        let data = {
            name: req.body.name,
            invoiceType: req.body.invoiceType,
            invoiceNo: invoiceNo
        }
        let customerDetails = {};
        if (req.body.customerName) {
            customerDetails.name = req.body.customerName;
        }
        if (req.body.customerGst) {
            customerDetails.gst = req.body.customerGst;
        }
        if (req.body.address) {
            customerDetails.address = req.body.address;
        }
        if (req.body.city) {
            customerDetails.city = req.body.city;
        }
        if (req.body.state) {
            customerDetails.state = req.body.state;
        }
        if (req.body.pincode) {
            customerDetails.pincode = req.body.pincode;
        }
        data.customerDetails = customerDetails;
        let content = {};
        content.deliveryNote = req.body.deliveryNote;
        content.modeOfPayment = req.body.modeOfPayment;
        content.invoiceDate = new Date(req.body.date);
        content.invoice = getInvoice(user.invoiceSettings, content.invoiceDate, invoiceNo);

        response.message = "succeed";
        response.data = data;
        response.invoice = content;
        return res.json(response);

        let invoice = await Invoice.create(data);

        response.invoice = invoice;
        response.status = 1;
        response.message = 'Successfully Add New Role'

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}



module.exports = { list, create };