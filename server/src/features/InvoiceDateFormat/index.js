import { Router } from 'express';
import InvoiceFormat from './invoiceDateFormat';

let logger = require('../../services/logger');

const ObjectId = require('mongoose').Types.ObjectId;

// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in invoice list'    
    }

    try {
        let filters = {softDelete: false};
        let list = await InvoiceFormat.find(filters);
        
        response.list = list;
        response.status = 1;
        response.message = 'fromat lists fetched successfully'
    } catch (err) {
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;
    }
    return res.json(response);
}

const frontendList = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in frontend list'    
    }

    try {
        let filters = {status: true, softDelete: false};
        let list = await InvoiceFormat.find(filters);
        
        response.list = list;
        response.status = 1;
        response.message = 'We have these formats'

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;
    }
    return res.json(response);
}

// Add
const create = async (req, res) =>  {
    let response = {
        status: 0,
        message: 'Issue in creating new format'
    }

    try {
        let data = {};
        let invoice = await InvoiceFormat.find().sort({_id: -1}).limit(1);
        let cnt = 100;
        if(invoice){
            let prevFormatId = invoice.formatId;
            prevFormatId = parseInt(prevFormatId.replaceAll('INF', ''));
            cnt = prevFormatId+1;
        }
        data.formatId = `INF${cnt}`;
        data.dateFormat = req.body.dateFormat;
        data.description = req.body.description;
        data.output = req.body.output;

        let invoiceFormat = await InvoiceFormat.create(data);

        response.invoiceFormat = invoiceFormat;
        response.status = 1;
        response.message = 'Successfully Added new format'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const update = async (req, res) => {
    let response = {
        message: "issue in update",
        status: 0
    }
    try {
        let data = {};
        if(req.body.dateFormat) data.dateFormat = req.body.dateFormat;
        if(req.body.description) data.description = req.body.description;
        if(req.body.output) data.output = req.body.output;
        if(req.body.status != undefined) data.status = req.body.status;

        let invFormat = await InvoiceFormat.updateOne({_id: ObjectId(req.body.id)}, {$set : data});
        if(invFormat.acknowledged){
            response.message = "update successfully";
            response.status = 1;
        }

    } catch (error) {
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;
    }
    return res.json(response);
}

const del = async (req, res) => {
    let response = {
        message: "issue in delete",
        status: 0
    }
    try {
        let invFormat = await InvoiceFormat.updateOne({_id: ObjectId(req.params.id)}, {$set : {softDelete : true}});
        if(invFormat.acknowledged){
            response.message = "deleted successfully";
            response.status = 1;
        }
    } catch (error) {
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;
    }
    return res.json(response);
}

module.exports = { list, create, frontendList, update, del};