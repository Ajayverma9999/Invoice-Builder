import { Router } from 'express';
import Template from './template';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in Template list'    
    }

    try {
        let filters = {};
        let list = await Template.find(filters);
        
        response.list = list;
        response.status = 1;

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const frontendList = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in Template list'    
    }

    try {
        let filters = {status : true};
        let list = await Template.find(filters);
        
        response.list = list;
        response.status = 1;

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const create = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in Category list'    
    }

    try {
        let prev = await Template.findOne({}).select('templateNo');
        let templateNo = 1;
        if(prev){
            templateNo = prev.templateNo + 1;
        }
        let data = {}
        data.name = req.body.name;
        data.slug = req.body.name;
        data.description = req.body.description;
        data.templateNo = req.body.templateNo;
        data.category = ObjectId(req.body.category);

        await Template.create(data);

        response.status = 1;
        response.message = "new template added";
        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const update = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in updating template'    
    }

    try {
        
        let data = {}
        if(req.body.name){
            data.name = req.body.name;
            data.slug = req.body.name;
        }
        if(req.body.description) data.description = req.body.description;
        data.category = ObjectId(req.body.category);

        await Template.updateOne({_id: req.body.id}, {$set : data});

        response.status = 1;
        response.message = "template updated successfully";
        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

