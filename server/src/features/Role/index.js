import { Router } from 'express';
import Role from './role';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in role list'    
    }

    try {
        
        let filters = {};

        let list = await Role.find(filters);
        
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
        message: 'Issue in create role'    
    }

    try {

        let data = {
            name: req.body.name,
            description: req.body.description,
            slug: req.body.slug,
            status:req.body.status
        }
        
        let role = await Role.create(data);
        
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

// Edit
const update = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in update role'    
    }
    try {


        let role = await Role.findById(req.params.id);

            role.name = req.body.name,
            role.description = req.body.description,
            role.slug = req.body.slug,
            role.status = req.body.status
        
            role.save()
        
        response.role = role;
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

module.exports = { list,create, update};