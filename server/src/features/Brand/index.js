import { Router } from 'express';
import Brand from './brand';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';
import { sulgValidation } from '../../services/validators';
import Joi from 'joi';

import logger from '../../services/logger.js';

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in brand list'
    }

    try {

        let filters = {};
        filters.softDelete = false;
        let list = await Brand.find(filters);

        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const frontEndList = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in brand list'
    }

    try {
        let filters = {};
        filters.status = true;
        filters.softDelete = false;
        let list = await Brand.find(filters);

        response.list = list;
        response.status = 1;
        response.message = ''

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// Add
const create = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in create brand'
    }

    try {


        let data = {
            name: req.body.name,
            description: req.body.description,
            image: req.file.path,
            slug: req.body.slug
        }

        let brand = await Brand.create(data);

        response.brand = brand;
        response.status = 1;
        response.message = 'Successfully Add Brand';

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
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
        message: 'Issue in update brand'
    }

    try {


        let brand = await Brand.findById(req.params.id);

        if (req.body.name) {
            brand.name = req.body.name
        }
        if (req.body.description) {
            brand.description = req.body.description
        }

        if (req.body.slug) {
            brand.slug = req.body.slug
        }

        if (req.body.status) {
            brand.status = req.body.status
        }


        if (req.file) {
            brand.image = req.file.path;
        }

        brand.save();


        response.brand = brand;
        response.status = 1;
        response.message = 'Successfully Update'

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
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
        message: 'Issue in delete brand'
    }

    try {

        let removeResponse = await Brand.updateOne({ _id: ObjectId(req.params.id) }, { softDelete: true });

        if (removeResponse.n == 1) {
            response.status = 1;
            response.message = 'Brand has been deleted';

        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


module.exports = { list, create, frontEndList, update, del };




