import { Router } from 'express';
import InvoiceFormat from './invoiceFormat';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

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
        let list = await InvoiceFormat.find(filters);
        
        response.list = list;
        response.status = 1;
        response.message = 'We have these formats'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// Add
const create = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in creating new format'    
    }

    try {
        let data = {};
        data.name = req.body.name;
        data.structure = req.body.structure;
        data.description = req.body.description;

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

module.exports = { list,create};