import { Router } from 'express';
import Category from './category';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in Category list'    
    }

    try {
        let filters = {};
        let list = await Category.find(filters);
        
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

// Add
const create = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in creating new categories'    
    }

    try {
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let data = {
            name : req.body.name,
            description: req.body.description,
            slug: req.body.name
        };

        response.status = 1;
        response.message = 'Successfully added new category'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const update = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in updating category'    
    }

    try {
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let data = {};

        if(req.body.name){
            data.name = req.body.name;
            data.slug = req.body.name;
        }

        if(req.body.description){
            data.description = req.body.description;
        }

        if(req.body.status != undefined){
            data.status = req.body.status;
        }

        await Category.updateOne({_id: ObjectId(req.body.id)},{$set : data});

        response.status = 1;
        response.message = 'Successfully updated category'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const del = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in creating new categories'    
    }

    try {
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }
        await Category.deleteOne({_id: ObjectId(req.body.id)});

        response.status = 1;
        response.message = 'category deleted successfully'

        return res.json(response);

    } catch (err) {
        
        logger.error(err.message, {metadata: err});
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

module.exports = { list,create, update, del};