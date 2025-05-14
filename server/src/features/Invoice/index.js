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
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

function isDateInRange(date, start, end){
    const date = new Date(date);
    return date >= start && date <= end;
}

function getFormattedDate(format, today){
    
}

function getInvoice(format, today, invoiceNo){
    let pattern = format.invoiceNumberFormat;
    pattern = pattern.replaceAll('{cnt}', invoiceNo);
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    pattern = pattern.replaceAll('DD', day ? day : '');
    pattern = pattern.replaceAll('YYYY', year ? year : '');
    let formattedDate = getFormattedDate(format.invoiceNumberFormat, today);
    return pattern;
}

// Add
const create = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in creating your invoice'    
    }

    try {
        let previous = await Invoice.findOne({user: req.user.id}).sort({createdAt: -1}).select('invoiceNo')
        let user = await User.findOne({_id: req.user.id}).populate({path : 'invoiceSettings.invoiceNumberFormat'});
        let invoiceNo = 1;
        let startDate = new Date(user.invoiceSettings.financialYearStart);
        let endDate = new Date(user.invoiceSettings.financialYearEnd);
        if(previous && isDateInRange(req.body.date, startDate, endDate)){
            invoiceNo = previous.invoiceNo+1;
        }
        
        let data = {
            name: req.body.name,
            invoiceType: req.body.invoiceType,
            invoiceNo : invoiceNo
        }
        let customerDetails = {};
        if(req.body.customerName) {
            customerDetails.name =  req.body.customerName;
        }
        if(req.body.customerGst){
            customerDetails.gst = req.body.customerGst;
        }
        if(req.body.address){
            customerDetails.address = req.body.address;
        }
        if(req.body.city){
            customerDetails.city = req.body.city;
        }
        if(req.body.state){
            customerDetails.state = req.body.state;
        }
        if(req.body.pincode){
            customerDetails.pincode = req.body.pincode;
        }
        data.customerDetails = customerDetails;
        let content = {};
        content.deliveryNote = req.body.deliveryNote;
        content.modeOfPayment = req.body.modeOfPayment;
        content.invoiceDate = new Date(req.body.date);
        content.invoice = getInvoice(user.invoiceSettings, content.invoiceDate, invoiceNo);
        
        

        let role = await Invoice.create(data);
        
        response.role = role;
        response.status = 1;
        response.message = 'Successfully Add New Role'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}



module.exports = { list,create};