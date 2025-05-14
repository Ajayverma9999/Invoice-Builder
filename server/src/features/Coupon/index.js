import { Router } from 'express';
import Coupon from './coupon';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';
import { couponsSchema } from '../../services/validators';
import Joi from 'joi';
import Cart from '../../features/Cart/cart';

import logger from '../../services/logger.js';

const router = Router();
const ObjectId = require('mongoose').Types.ObjectId;


// List
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in coupon list'
    }

    try {

        let filters = {};

        let list = await Coupon.find(filters);

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

const applyCoupon = async (req, res) => {
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in update coupon'
    }

    try {

        let filter = {}
        let products = await Cart.find({ user: req.user._id }).populate({ path: 'product', select: 'categories' });

        let validateUpto = new Date();

        filter.validupto = { $gte: validateUpto.toISOString() };
        filter.users = ObjectId(req.user._id);
        filter.code = req.body.coupon;

        let allCateg = []

        for (let singleProduct of products) {
            for (let singleCategori of singleProduct.product.categories) {
                allCateg.push(singleCategori)
            }
        }

        let productIds = products.map((key) => { return key.product._id })

        if (productIds.length) {
            filter.products = { $in: productIds }
        }

        if (allCateg.length) {

            filter.categories = { $in: allCateg }
        }

        let coupon = await Coupon.findOne(filter);

        console.log(coupon);

        if (!coupon) {
            response.message = 'Invalid coupon';
            return res.json(response);

        }

        response.coupon = coupon;
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
        message: 'Issue in create coupon'
    }

    try {
        if (req.user.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'addCoupon');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let data = {
            code: req.body.code,
            type: req.body.type,
            description: req.body.description,
            minValue: req.body.minValue,
            amount: req.body.amount,
            status: req.body.status
        }

        if (req.body.validupto) {
            let validupto = new Date(req.body.validupto);
            validupto = validupto.setHours(23, 59, 59);
            data['validupto'] = new Date(validupto);
        }

        if (req.body.startDate) {
            let startDate = new Date(req.body.startDate);
            startDate = startDate.setHours(0, 0, 0);
            data['startDate'] = new Date(startDate);
        }

        let coupon = await Coupon.create(data);

        response.coupon = coupon;
        response.status = 1;
        response.message = 'Successfully Add Coupon'

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
        message: 'Issue in update coupon'
    }

    try {
        if (req.user.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'updateCoupon');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }

        let coupon = await Coupon.findById(req.params.id);

        if (req.body.code) {
            coupon.code = req.body.code;
        }
        if (req.body.type) {
            coupon.type = req.body.type;
        }
        if (req.body.description) {
            coupon.description = req.body.description;
        }
        if (req.body.minValue) {
            coupon.minValue = req.body.minValue;
        }
        if (req.body.amount) {
            coupon.amount = req.body.amount;
        }
        if (req.body.validupto) {
            let validupto = new Date(req.body.validupto);
            validupto = validupto.setHours(23, 59, 59);
            coupon.validupto = new Date(validupto);
        }
        if (req.body.validupto) {
            let startDate = new Date(req.body.startDate);
            startDate = startDate.setHours(0, 0, 0);
            coupon.startDate = new Date(startDate);
        }
        if (req.body.status) {
            coupon.status = req.body.status;
        }
        coupon.save()

        response.coupon = coupon;
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
        message: 'Issue in delete coupon'
    }

    try {
        if (req.user.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'deleteCoupon');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
        }
        let removeResponse = await Coupon.deleteOne({ _id: ObjectId(req.params.id) });

        if (removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'Coupon has been deleted';
        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


module.exports = { list, create, update, del, applyCoupon };




