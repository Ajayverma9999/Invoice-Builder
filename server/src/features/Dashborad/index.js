import { Router } from 'express';
import Attribute from '../Attribute/attribute';

import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const adminDashboard = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in attribute list'    
    }

    try {
        
        response.status = 1;
        response.message = 'Dashboard request'

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
        message: 'Issue in create attribute'    
    }

    try {

        let data = {
            name: req.body.name,
            description: req.body.description,
            slug: req.body.slug,
            status:req.body.status
        }
        
        let cat = await Attribute.create(data);
        
        response.category = cat;
        response.status = 1;
        response.message = 'Successfully Add Attribute'

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
        message: 'Issue in update attribute'    
    }

    try {


        let attribute = await Attribute.findById(req.params.id);

            attribute.name = req.body.name,
            attribute.description = req.body.description,
            attribute.slug = req.body.slug,
            attribute.status = req.body.status
        

            attribute.save()
        
        
        response.attribute = attribute;
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
        message: 'Issue in delete attribute'    
    }

    try {

        let removeResponse = await Attribute.updateOne({_id: ObjectId(req.params.id)},{status : false});
        
        if(removeResponse.n == 1) {
            response.status = 1;
            response.message = 'Attribute has been deleted';
     
        }

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }   
}


module.exports = { adminDashboard,create, update, del};




