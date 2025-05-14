import { Router } from 'express';
import Attribute from './attribute';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';
import { attributeSchema, sulgValidation } from '../../services/validators';
import Joi from 'joi';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List 
const list = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in attribute list'     
    }
    const {value} = Joi.validate(req.body,attributeSchema);
    if (!value) {
        return res.json({
          message: error.details[0].message,
        });
      }

    try {
        
        let filters = {};
        filters.softdelete = false;
        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;

        // let list = await Attribute.find(filters).skip((page - 1) * numberOfRecords).limit(numberOfRecords);
        let list = await Attribute.find(filters).sort({_id : -1});
        
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
const listFrontEnd = async (req, res) => {
    
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in attribute list'    
    }

    try {
        
        let filters = {};
        filters.status = true;
        filters.softdelete = false
        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;

        // let list = await Attribute.find(filters).skip((page - 1) * numberOfRecords).limit(numberOfRecords);
        let list = await Attribute.find(filters).sort({_id : -1});
        
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
        message: 'Issue in create attribute'    
    }

    try {
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let data = {
            name: req.body.name,
            description: req.body.description,
            slug: req.body.slug,
            status:req.body.status
        }

      
        
        let cat = await Attribute.create(data);
        
        response.category = cat;
        response.status = 1;
        response.message = 'Successfully Add New Attribute'

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
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

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
        if(req.user.role){
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let removeResponse = await Attribute.updateOne({_id: ObjectId(req.params.id)},{softdelete : true});
        
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


module.exports = { list,create, update, del, listFrontEnd};




