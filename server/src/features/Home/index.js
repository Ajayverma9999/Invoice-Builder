import { Router } from 'express';
import Setting from '../Setting/setting';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';

let logger = require('../../services/logger');

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;

// Add
const getHomePage = async (req, res) =>  {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in create attribute'    
    }

    try {
        
        let homeSetting = {};
        let allHomeSettings = await Setting.find({filter: 'home'});

        for(let singleSetting of allHomeSettings){
            homeSetting[singleSetting.key] = singleSetting.status
        }
        
        response.home = homeSetting;
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



module.exports = { getHomePage };




