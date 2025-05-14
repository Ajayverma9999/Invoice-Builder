import User, { hashPassword } from './user';
import bcrypt from 'bcryptjs';
import { checkpermission, verifyToken, treeUnderUser, apiReq } from '../../helper/common';
import { emailmessage } from '../../features/Notification/email';
import EmailTemplate from '../EmailTemplate/emailTemplate';
import { whatsaapNotify } from '../Notification/whatsapp';

import logger from '../../services/logger.js';

const ObjectId = require('mongoose').Types.ObjectId;

// /api/users
const list = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in user list'
    }

    try {

        let responsePermission = await checkpermission(req.user.role.slug, 'listUsers');
        
        if (responsePermission.status != 1) {
            return res.json(responsePermission);
        }
        
        let filters = {};
        filters.role = { $ne: ObjectId('6114d54122b7c53a358bba04') }
        
        if(req.body.verified == true){
            filters.verified = true;
        }
        if(req.body.verified == false){
            filters.verified = false;
        }

        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;


        if (req.body.search) {

            filters["$or"] = [
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { customerId: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } },
                { address: { '$regex': req.body.search, $options: 'i' } }
            ]
        }

        
        let list = await User.find(filters).sort({ createdAt: -1 }).populate('role').skip((page - 1) * numberOfRecords).limit(numberOfRecords);

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

const users = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in user list'
    }

    try {

        let responsePermission = await checkpermission(req.user.role.slug, 'listUsers');

        if (responsePermission.status != 1) {
            return res.json(responsePermission);
        }

        let filters = {};
        filters.role = { $ne: ObjectId('6114d54122b7c53a358bba04') }

        // let numberOfRecords = 50;
        // let page = req.body.page ? req.body.page : 1;

        if (req.body.search) {

            filters["$or"] = [
                // { username: { '$regex': req.body.search, $options: 'i' } },
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { customerId: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } },
                { address: { '$regex': req.body.search, $options: 'i' } },
                // { "address.city": { '$regex': req.body.search, $options: 'i' } },
                // { "address.state": { '$regex': req.body.search, $options: 'i' } }
            ]
        }


        let list = await User.find(filters).sort({ createdAt: -1 }).populate('role');

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
        message: 'Issue in create user'
    }
    try {
        // Set customer - roleId
        let role = '6114d5c422b7c53a358bba0b';
        

        // If send role then check permission
        if (req.body.role) {
            let responsePermission = await checkpermission(req.user.role.slug, 'backendCreateUser');
            if (responsePermission.status != 1) {
                return res.json(responsePermission);
            }
            role = req.body.role
        }

        let filters = {};
        filters.$or = [
            { email: req.body.email }, { phone: req.body.email }
        ]
        filters.softDelete = true;
        let user = await User.findOne(filters);
        if(user){
            user.softDelete = false;
          let pass =  await hashPassword(req.body.password)
         user.password = pass

       response.token = user.generateJWT('app');
            await user.save();
            response.status = 1;
            response.message = "signup process has been succesfully completed"
            return res.json(response);
        }
        

        filters = {};
        filters.$or = [
            { email: req.body.email }, { phone: req.body.email }
        ]
        
        if(user && (user?.softDelete)){
            response.status = 0;
            response.message = "This email or phone is already exists please use another one";
            return res.json(response);
        }

        let data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            wallet: 0,
            role: ObjectId(role),
            address: req.body.address,
            gst: req.body.gst,
        };
        

        if (req.body.companyName) {
            data.companyName = req.body.companyName
        }
        
        let customer = await User.find({customerId : {$exists : true}}, 'customerId').sort({ _id: -1 }).limit(1);
        // customer id gen
        let counter = 1000;
        if (customer.length) {
            let id = customer[0]?.customerId;
            
            if (id) {
                counter = parseInt(id.replace('U', ''));
                counter++
            }
            else {
                counter = counter + 1;
            }
        } else {
            counter = counter + 1;
        }
        
        data.customerId = `U${counter}`;
        // Create user query
        let newUser = await User.create(data);
        
        // await Promise.all([
        //     emailmessage(
        //         newUser.email,
        //         'signUp',
        //         newUser.username,
        //         '',
        //         req.body.password,
        //         '',
        //         ''
        //     )])
            
        // whatsaap notification
        // let whatsaapdata = {
        //     templateName: "pcdh_registration",
        //     phone: newUser.phone,
        //     dataArray: [`${newUser.firstName, newUser.firstName}`, newUser.phone, req.body.password],
        //     languageCode: "en",
        // }

        // whatsaapNotify(whatsaapdata)
        
        newUser.registerUser(newUser, (err, user) => {
            
            if (err) throw err;
            // just redirect to login

            response.token = user.generateJWT('app');
            response.message = 'Registration Successfully';
            response.status = 1
            return res.json(response)
        });

    } catch (err) {
        console.log(err);
        
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        if ((Object.values(err)[1] == 'MongoError') && (Object.values(err)[3] == 11000) && ((Object.values(err)[4].email == 1) || (Object.values(err)[4].phone == 1))) {
            let value = Object.values(err)[5].email ? Object.values(err)[5].email : Object.values(err)[5].phone
            response.message = value + "\n already registered"
        }

        return res.json(response);
    }
}

const getProfile = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in profile api'
    }

    try {

        response.user = req.user;
        response.message = '';
        response.status = 1;
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }

}

const userProfile = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in profile api'
    }

    try {


        let user = await User.findOne({ email: req.body.email })

        if (user) {
            response.me = user;
            response.message = '';
            response.status = 1;
        }
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }

}

const updateProfile = async (req, res) => {

    let response = {
        status: 1,
        message: 'Issue in update profile api.'
    };

    try {

        let user = {}

        
        
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
            
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }

        
        if (req.body.companyName) {
            user.companyName = req.body.companyName;
        }
        
        if (req.body.address) {
            user.address = req.body.address;
        }

        if (req.body.gst) {
            user.gst = req.body.gst;
        }
        
        let resp = await User.updateOne({ _id: req.user.id }, { $set: user })

        if (resp.n > 0) {
            response.status = 1;
            response.message = 'Update Successfully'
            response.user = user;
        }

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;
        return res.json(response);
    }
}

const forgetPassword = async (req, res) => {

    // Mobile number and otp
    // Or email number and otp

    let response = {
        status: 0,
        message: 'Issue in user! register first',
    };
    try {
        const { otp, phone, email } = req.body;

        let filters = {};
        filters.$or = [
            { email: req.body.email }, { phone: req.body.email }
        ]

        const user = await User.findOne(filters);
        if (!user) {
            response.status = 0;
            response.message = 'User not found';
            return res.json(response);
        }
        if (user.otp != otp || !otp) {
            response.status = 0;
            response.message = 'Incorrect OTP';
            user.otp = "";
            return res.json(response);
        }
        // 
        user.otp = "";
        await user.save();
        response.status = 1;
        response.message = 'otp verification commplet';

        return res.json(response);
    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        res.status(500).json(response);
    };

}

const updatePassword = async (req, res) => {

    // old password
    // new password
    // confirm password

    let response = {
        status: 1,
        message: 'Issue in update profile password.'
    };

    try {

        if (!req.body.oldPassword) {
            response.message = 'Please provide old password.';
        }

        if (!req.body.newPassword) {
            response.message = 'Please provide new password.';
        }

        if (!req.body.confirmPassword) {
            response.status = 0;
            response.message = 'Please provide confirm password.';
        }
        if (req.body.newPassword === req.body.confirmPassword) {
            // genrate new password
            let heshpassword = await hashPassword(req.body.confirmPassword);

            let filters = {};
            filters.$or = [
                { email: req.body.email }, { phone: req.body.email }
            ]
            let user = await User.findOne(filters);
            user.password = heshpassword
            await user.save()
            let whatsaapdata = {
                templateName: "password_recovery",
                phone: user.phone,
                dataArray: [user.firstName + " " + user.lastName, req.body.email, req.body.confirmPassword],
                languageCode: "en"
            }

            whatsaapNotify(whatsaapdata)


            response.status = 1;
            response.message = "Password Update Successfully";
        }

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
        message: 'Issue in update user.'
    }

    try {

        let responsePermission = await checkpermission(req.user.role.slug, 'listUsers');

        if (responsePermission.status != 1) {
            return res.json(responsePermission);
        }

        let user = await User.findById(req.params.id);

        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }

        if (req.body.companyName) {
            user.companyName = req.body.companyName;
        }

        if (req.body.gst) { user.gst = req.body.gst };

        if (req.body.role) {
            user.role = req.body.role;
        }

        await user.save()

        response.user = user;
        response.status = 1;
        response.message = 'Successfully Update';

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const latestUpdated = async (req, res) => {
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in latest Updated user list'
    }

    try {
        let responsePermission = await checkpermission(req.user.role.slug, 'listUsers');

        if (responsePermission.status != 1) {
            return res.json(responsePermission);
        }

        let filters = {};

        if (req.body.search) {
            filters["$or"] = [
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { customerId: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } },
            ]
        }

        let list = await User.find(filters).sort({ updatedAt: -1, _id: 1 }).populate('role');

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

// Delete - Not parmanent delete
const del = async (req, res) => {
    // Default Response
    let response = {
        status: 0,
        message: 'Issue in delete attribute'
    }

    try {
        let filter = {};
        if(req.body.email){
            filter.email = req.body.email
        }
        if(req.body.phone){
            filter.phone = req.body.phone
        }
        let user = await User.findOne(filter)
        if(!user){
            response.status = 0;
            response.message = "user doesn't found";
            return res.json(response);
        }
        let removeResponse = await User.updateOne(filter, {softDelete: true});

        return res.json({ status: 1, message: "User deleted successfully" });
        

        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const addAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in add addresses.'
    }

    try {

        if(!req.body.transportName || !req.body.marka){
            response.status = 0;
            response.message = "Enter both transport name and marka before move further";
            return res.json(response);
        }

        let data = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            transportName: req.body.transportName,
            marka: req.body.marka,
            email: req.user.email,
            phone: req.user.phone,
            companyName: req.user.companyName,
            gst: req.body.gst,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode
        };
        

        req.user.shippingAddress.push(data);
        await req.user.save();

        response.user = req.user
        response.status = 1;
        response.message = 'Successfully Add Your Address';
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const addBillingAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in add Billing address.'
    }

    try {

        if(!req.body.transportName || !req.body.marka){
            response.status = 0;
            response.message = "Enter both transport name and marka before move further";
            return res.json(response);
        }

        let data = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            transportName: req.body.transportName,
            marka: req.body.marka,
            email: req.user.email,
            phone: req.user.phone,
            companyName: req.user.companyName,
            gst: req.body.gst,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode
        };
        

        req.user.billingAddress.push(data);
        await req.user.save();

        response.user = req.user
        response.status = 1;
        response.message = 'Successfully Add Your Address';
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const updateAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in add addresses.'
    }

    try {

        req.user.address = req.body.address;
        await req.user.save();

        response.status = 1;
        response.message = 'Update Addreses';
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const removeAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in remove addresses.'
    }

    try {
                
        let addresskey = req.params.addresskey;

        req.user.shippingAddress.splice(addresskey, 1);
        await req.user.save();

        response.status = 1
        response.message = '';
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const removeBillingAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in remove addresses.'
    }

    try {
                
        let addresskey = req.params.addresskey;

        req.user.billingAddress.splice(addresskey, 1);
        await req.user.save();

        response.status = 1
        response.message = '';
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const getAddress = async (req, res) => {

    // Default Response
    let response = {
        status: 0,
        message: 'Issue in manage addresses.'
    }

    try {
        response.address = req.user.address;
        response.message = '';
        response.status = 1
        return res.json(response);

    } catch (err) {

        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const verifyUser = async (req, res) => {
    let response = {
        message: "issue in verifying user",
        status: 0

    }
    try {

        let responsePermission = await checkpermission(req.user.role.slug, 'verifyUser');

        if (responsePermission.status != 1) {
            response.message = "You are not authorized to verify user";
            return res.json(responsePermission);
        }
        let user = await User.findOne({email: req.body.email});
        
        if(req.body.verify){
            user.verified = true;
        }else{
            user.verified = false;
        }

        await user.save();

        // await emailmessage(req.body.email, 'verify', user.username, '', '', '', '', '', user.companyName);

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const updateDiscount = async (req, res) => {
    let response = {
        message: "issue in changing the value of discount",
        status: 0

    }
    try {

        let data = {};
        if(req.body.discount >= 0){
            data.discount = req.body.discount;
        }

        let user = await User.updateOne({ email: req.body.email }, { $set: data })
        if (user.n) {
            response.status = 1;
            response.message = 'value of discount has been changed';
        }

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

const assignRole = async (req, res) => {
    let response = {
        message: "issue in assigning role of a user",
        status: 0

    }
    try {

        let responsePermission = await checkpermission(req.user.role.slug, 'verifyUser');

        if (responsePermission.status != 1) {
            response.message = "You are not authorized to assign a role to user";
            return res.json(responsePermission);
        }
        let user = await User.findOne({email: req.body.email});
        
        if(req.body.role){
            user.role = ObjectId(req.body.role);
        }else{
            user.role = ObjectId(req.body.role);
        }

        await user.save();

        response.message = "role of user is successfully changed";
        response.status = 1;

        // await emailmessage(req.body.email, 'verify', user.username, '', '', '', '', '', user.companyName);

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}

module.exports = { list, users, create, update, latestUpdated, del, addAddress, addBillingAddress, updatePassword, getAddress, removeAddress, removeBillingAddress, updateAddress, updateProfile, getProfile, forgetPassword,  userProfile,  verifyUser, updateDiscount, assignRole };