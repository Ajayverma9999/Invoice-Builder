import { Router } from 'express';
import TaxGst from './taxgst';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in TaxGst list'    
    }

    try {
        
        let filters = {};

        let list = await TaxGst.find(filters);
        
        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// List
const listForFrontEnd = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in TaxGst list'    
    }

    try {
        
        let filters = {
            status: true
        };

        let list = await TaxGst.find(filters);
        
        response.list = list;
        response.status = 1;
        response.message = ''

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
        message: 'Issue in create tax gst'    
    }

    try {

        let data = {
            name: req.body.name,
            percentage: req.body.percentage,
            status:req.body.status
        }
        
        let taxgst = await TaxGst.create(data);
        
        response.taxgst = taxgst;
        response.status = 1;
        response.message = 'Successfully Add New Tax'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// Edit
const update = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in update taxgst'    
    }

    try {


        let taxgst = await TaxGst.findById(req.params.id);

        taxgst.name = req.body.name;
        taxgst.percentage = req.body.percentage;
        taxgst.status = req.body.status;
        taxgst.save()
        
        
        response.taxgst = taxgst;
        response.status = 1;
        response.message = 'Successfully Update'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// Delete - Not parmanent delete
const del = async (req, res) => {
       // Default Response
    let response = {
        status: 0,
        message: 'Issue in delete tax gst'    
    }

    try {

        let removeResponse = await TaxGst.deleteOne({_id: ObjectId(req.params.id)});
        
        if(removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'TaxGst has been deleted';
     
        }

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }   
}


module.exports = { list,create, update, del, listForFrontEnd};




