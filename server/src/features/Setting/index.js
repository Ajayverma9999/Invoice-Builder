import { Router } from 'express';
import Setting from './setting';
import { checkpermission, verifyToken, treeUnderUser, getFilterSettings } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in setting list'
    }

    try {

        let filters = {
            filter: { $ne: 'checkoutoffer' }
        };

        if (req.query.key) filters.key = req.query.key;

        if (req.query.filter) filters.filter = req.query.filter;
        let list = await Setting.find(filters).sort({ orderby: 1 });

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
// for customer
const settings = async (req, res) => {

    // Default Response
    let response = {
        message: "issue in single setting",
        status: 0
    }
    try {
        let filters = {}
        filters.status = true
        if (req.body.key) {
            filters.key = req.body.key;
        };

        let resp = await getFilterSettings(filters)

        if (Object.keys(resp).length) {
            response.setting = resp
            response.status = 1
            response.message = ''
        }

        return res.json(response)
    } catch (error) {
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
        message: 'Issue in create setting'
    }

    try {

        let data = {
            key: req.body.key,
            name: req.body.name,
            value: req.body.value,
            orderby: req.body.orderby,
            halptext: req.body.halptext,
            filter: req.body.filter,
            status: req.body.status
        }

        let setting = await Setting.create(data);

        response.setting = setting;
        response.status = 1;
        response.message = 'Successfully Add New Setting'

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
        message: 'Issue in update setting'
    }

    try {
        if (req.user.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }

        }


        let setting = await Setting.findById(req.params.id);

        if (req.body.key) { setting.key = req.body.key; }
        if (req.body.name) { setting.name = req.body.name; }
        if (req.body.value) { setting.value = req.body.value; }
        if (req.body.orderby) { setting.orderby = req.body.orderby; }
        if (req.body.halptext) { setting.halptext = req.body.halptext; }
        if (req.body.filter) { setting.filter = req.body.filter; }
        if (req.body.status) { setting.status = req.body.status; }

        setting.save()


        response.setting = setting;
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
        message: 'Issue in delete setting'
    }

    try {
        if (req.user.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }
        let removeResponse = await Setting.deleteOne({ _id: ObjectId(req.params.id) });

        if (removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'Setting has been deleted';

        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const singleSetting = async (req, res) => {
    let response = {
        message: "issue in single setting",
        status: 0
    }
    try {
        let filters = {}
        filters.status = true
        if (req.body.key) {
            filters.key = req.body.key;
        };

        let resp = await getFilterSettings(filters)

        if (Object.keys(resp).length) {
            response.setting = resp
            response.status = 1
            response.message = ''
        }

        return res.json(response)
    } catch (error) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

// for offer 
const offerUpdate = async (req, res) => {
    let response = {
        message: "issue in offers",
        status: 0
    }
    try {
        let resp = await Setting.findOne({ filter: 'checkoutoffer' })
        resp.offers = req.body.offers
        resp.description = req.body.description
        resp.save();

        response.status = 1
        response.message = 'Submit offers'

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const getOffers = async (req, res) => {
    let response = {
        message: "issue in get offers",
        status: 0
    }
    try {
        let resp = await Setting.findOne({ filter: 'checkoutoffer' }, 'offers description')

        response.offers = resp
        response.status = 1
        response.message = ''

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


const customizeofferUpdate = async (req, res) => {
    let response = {
        message: "issue in offers",
        status: 0
    }
    try {
        let resp = await Setting.findOne({ filter: 'customizeoffer' })
        resp.offers = req.body.offers
        resp.description = req.body.description
        resp.save();

        response.status = 1
        response.message = 'Submit offers'

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const customizeofferGet = async (req, res) => {
    let response = {
        message: "issue in get offers",
        status: 0
    }
    try {
        let resp = await Setting.findOne({ filter: 'customizeoffer' }, 'offers description')

        response.offers = resp
        response.status = 1
        response.message = ''

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}



module.exports = {
    list, create, update, del, singleSetting, offerUpdate, getOffers, customizeofferUpdate,
    customizeofferGet, settings
};