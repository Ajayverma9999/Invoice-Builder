import { Router } from 'express';
import Cart from './cart';
import { checkpermission, verifyToken, treeUnderUser } from '../../helper/common';
import Product from '../Product/product';
import CustomizeCart from '../CustomCart/customizeCard';
import logger from '../../services/logger.js';

const ObjectId = require('mongoose').Types.ObjectId;

const carts = async (req, res) => {
    let response = {
        status: 0,
        message: 'Issue in cart list'
    }

    try {

        let filters = {};

        let page = req.body.page ? req.body.page : 1
        let numberOfrecord = 150;
        if (req.body.userid) {
            filters.user = req.body.userid;
        }

        let list = await Cart.find(filters)
            .skip((page - 1) * numberOfrecord)
            .limit(numberOfrecord)
            .populate({ path: 'customize', select: 'price name' })
            .populate({ path: 'user', select: 'firstName lastName phone email address pcdealUserEmail username companyName customerId' })
            .populate({ path: 'product', select: 'name sale mrp images' })
            .sort({ createdAt: -1 })

        let carts = {}
        if (list.length > 0) {
            for (let singleCart of list) {
                if (carts[singleCart.user?.id] == undefined) {
                    carts[singleCart.user?.id] = []
                    carts[singleCart.user?.id].push(singleCart)

                } else {
                    carts[singleCart.user?.id].push(singleCart)
                }
            }
        }

        response.carts = Object.values(carts);
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
// List
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in cart page content.'
    }

    try {

        let filters = {};
        filters.user = req.user.id;
        // filters.product.softDelete = false
        // product.softDelete = true;

        let list = await Cart.find(filters)
            .populate({
                path: 'product',
                populate: {
                    path: 'tax_class',
                    model: 'TaxGst'
                },
                populate: {
                    path: 'brand',
                    select: 'name'
                }
            })
            .populate({ path: 'customize', select: 'price name' })
        let rewardTotal = 0;
        for (let singleCart of list) {
            if (singleCart.product.rewardStatus) {
                rewardTotal += (singleCart.product.reward * singleCart.quantity)
            }
        }

        response.list = list;
        response.rewardTotal = rewardTotal
        response.exculsiveTax = 0;
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
        message: 'Issue in create category'
    }

    try {

        let filters = {};
        filters.status = true;
        filters.instock = true
        filters.quantity = { '$gte': 1 }
        filters._id = ObjectId(req.body.product);



        let product = await Product.findOne(filters, 'quantity productType minqty maxqty');
        if (!product || req.body.quantity <= 0) {
            response.status = 0
            response.message = 'This product does not exists';
            return res.json(response);
        }
        else if (product.minqty > req.body.quantity) {
            response.status = 0
            response.message = `Please enter a quantity between ${product.minqty} to ${product.maxqty}`;
            return res.json(response);
        }

        let cartChecking = await Cart.findOne({ product: ObjectId(req.body.product), user: req.user.id });

        if (cartChecking) {

            cartChecking.quantity = cartChecking.quantity + req.body.quantity;

            if (product.quantity < cartChecking.quantity) {
                response.message = 'This product has low quantity';
                cartChecking.quantity = product.quantity;
            }

            if (req.body.customize) {
                cartChecking.customize = req.body.customize
            }


            await cartChecking.save();

            response.cart = cartChecking;

        } else {


            let data = {
                product: product.id,
                user: req.user.id,
                quantity: req.body.quantity
            }

            if (product.quantity < req.body.quantity) {
                response.message = 'This product has low quantity';
                data.quantity = product.quantity;
            } else {
                if (req.body.customize) {
                    data.customize = req.body.customize
                }
            }

            let cart = await Cart.create(data);

            response.cart = cart;
        }

        // if (product.productType == 'customize') {
        //     await CustomizeCart.create({
        //         user: req.user.id,
        //         card: response.cart.id,
        //         product: response.cart.product,
        //         items: req.body.items
        //     })
        // }
        response.status = 1;
        response.message = '👍Product successfully added in your CART '
        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const multipleItems = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue to add multiple item add'
    }

    try {

        let filters = {};
        filters.status = true;

        let cartItems = [];

        for (const item of req.body.items) {

            item.quantity;


            filters._id = ObjectId(req.body.product);

            let product = await Product.findOne(filters, 'quantity');

            if (!product) {
                response.message = 'Some products is not avaliable';
            }

            let cartChecking = await Cart.findOne({ product: ObjectId(item.product), user: req.user.id });

            if (cartChecking) {

                cartChecking.quantity = cartChecking.quantity + item.quantity;

                if (product.quantity < cartChecking.quantity) {
                    response.message = 'Some products has low quantity';
                    cartChecking.quantity = product.quantity;
                }

                await cartChecking.save();

            } else {

                let data = {
                    product: product.id,
                    user: req.user.id,
                    quantity: item.quantity
                }

                if (product.quantity < item.quantity) {
                    response.message = 'Some products has low quantity';
                    data.quantity = product.quantity;
                }
                cartItems.push(data);
            }
        }
        await Cart.insertMany(cartItems);
        response.status = 1;
        response.message = response.message == 'Issue to add multiple item add' ? '' : response.message;

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
        message: 'Issue in update cart'
    }

    try {
        let filters = {};
        filters.status = true;



        let cartChecking = await Cart.findOne({
            _id: ObjectId(req.params.id),
            user: ObjectId(req.user.id)
        }).populate('product');


        if (!cartChecking) {

            response.message = 'Cart reference id invalid';
            return res.json(response);
        } else if (cartChecking.product.quantity < req.body.quantity) {
            response.message = `Low quantity please try less quantity`;
            return res.json(response);
        } else if ((cartChecking.product.minqty > req.body.quantity) && (req.body.delete == undefined)) {
            response.status = 0
            response.message = `Please enter a quantity between ${cartChecking.product.minqty} to ${cartChecking.product.maxqty}`;
            return res.json(response);
        }


        if ((req.body.quantity < 0) || (req.body.quantity == 0) && req.body.delete) {
            await await Cart.deleteOne({ _id: ObjectId(req.params.id) });
            await CustomizeCart.deleteOne({ card: ObjectId(req.params.id) });
            response.message = 'Removed item.'
        } else {
            if (req.body.quantity >= 0) {

                if (req.body.customize) {
                    cartChecking.customize = req.body.customize
                    cartChecking.customizeqty = req.body.customize.length
                }


                cartChecking.quantity = req.body.quantity;
                await cartChecking.save();
            }


            response.cart = cartChecking;
            response.message = 'Successfully Update'
        }


        response.status = 1;
        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }

}

// Delete - Not parmanent delete
const empty = async (req, res) => {
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in empty cart'
    }

    try {

        let removeResponse = await Cart.deleteMany({ user: ObjectId(req.user.id) });

        if (removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'Cart has been empty';
        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const outstockDelete = async (product) => {
    let response = {
        status: 0,
        message: 'Issue in cart'
    }
    try {
        if(product?.instock == false){
            let removeResponse = await Cart.deleteMany({ proudct: ObjectId(product.id) });
            
            if (removeResponse.deletedCount) {
                response.status = 1;
                response.message = 'Cart has been empty';
            }
        }


    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return response
    }
}



module.exports = { list, create, update, empty, multipleItems, carts, outstockDelete,outstockDelete };