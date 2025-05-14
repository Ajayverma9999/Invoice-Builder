import { Router } from 'express';
import Permission from './permission';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in permission list'    
    }

    try {
        
        let filters = {};

        let list = await Permission.find(filters);
        
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
        message: 'Issue in create permission'    
    }

    try {

        let data = {
            name: req.body.name,
            description: req.body.description,
            status:req.body.status
        }
        
        let permission = await Permission.create(data);
        
        response.permission = permission;
        response.status = 1;
        response.message = 'Successfully Add New Permission'

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
        message: 'Issue in update permssion'    
    }

    try {


        let permission = await Permission.findById(req.params.id);

        permission.name = req.body.name,
        permission.description = req.body.description,
        permission.status = req.body.status
        permission.save()
        
        response.permission = permission;
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
        message: 'Issue in delete permission'    
    }

    try {

        let removeResponse = await Payment.deleteOne({_id: ObjectId(req.params.id)});
        
        if(removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'Permission has been deleted';
     
        }

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }   
}


module.exports = { list,create, update, del};




