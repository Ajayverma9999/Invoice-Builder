import { Router } from 'express';
import User, { hashPassword } from './user';
import bcrypt from 'bcryptjs';
import { checkpermission, verifyToken, treeUnderUser, apiReq } from '../../helper/common';
import { emailmessage } from '../../features/Notification/email';
// import EmailTemplate from '../EmailTemplate/emailTemplate';
import { whatsaapNotify } from '../Notification/whatsapp';
import { userSchema } from '../../services/validators';

let logger = require('../../services/logger');

const router = Router();
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

        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;


        if (req.body.search) {

            filters["$or"] = [
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { userId: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } }
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

        if (req.body.updatedUser) {
            filters.updatedUser = req.body.updatedUser;
        }
        let numberOfRecords = 50;
        let page = req.body.page ? req.body.page : 1;


        if (req.body.search) {

            filters["$or"] = [
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { userId: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } }
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

        let data = {
            email: req.body.email,
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            role: ObjectId(role),
        };

        if (req.body.companyName) {
            data.companyName = req.body.companyName
        }

        let customer = await User.find({role:ObjectId(role)}, 'userId').sort({ _id: -1 }).limit(1);
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
        //     connectWithPCdWithEmail(newUser),
        //     emailmessage(
        //         newUser.email,
        //         'signUp',
        //         newUser.firstName + " " + newUser.firstName,
        //         '',
        //         req.body.password,
        //         '',
        //         ''
        //     )])

        // // whatsaap notification
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

        // Req otp
        if (req.body.phone) {
            user.phone = req.body.phone;
        }

        // Req otp
        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.companyName) {
            user.companyName = req.body.companyName;
        }

        let addressData = {};
        if (req.body.state) {
            addressData.state = req.body.state;
        }
        if (req.body.city) {
            addressData.city = req.body.city;
        }
        if (req.body.zipcode) {
            addressData.zipcode = req.body.zipcode;
        }
        if (req.body.companyAddress) {
            addressData.companyAddress = req.body.addressline1;
        }
        if (req.body.gst) {
            addressData.gst = req.body.gst;
        }

        user.updatedUser = true;

        if (req.body.newPassword === req.body.confirmPassword) {
            user.password = await hashPassword(req.body.confirmPassword);
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

        if ((Object.values(err)[1] == 'MongoError') && (Object.values(err)[3] == 11000) && ((Object.values(err)[4].email == 1) || (Object.values(err)[4].phone == 1))) {
            let value = Object.values(err)[5].email ? Object.values(err)[5].email : Object.values(err)[5].phone
            response.message = value + "\n already registered"
        }

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
        status: 0,
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
            return res.json(response);
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

            // whatsaapNotify(whatsaapdata)


            response.status = 1;
            response.message = "Password Update Successfully";
        }else{
            response.message = "password and confirm passwords are mismatched";
            return res.json( response); 
        }

        return res.json(response);

    } catch (err) {
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;
        return res.json(response);
    }

}

const updateInvoiceSetting = async (req, res) => {
    try {
        let data = {};
        let invoiceSettings = {};
        invoiceSettings.financialYearStart = req.body.financialYearStart;
        invoiceSettings.financialYearEnd = req.body.financialYearEnd;
        invoiceSettings.invoiceNumberFormat = req.body.invoiceNumberFormat;
        invoiceSettings.invoiceDateFormat = req.body.invoiceDateFormat;
        // invoiceSettings.invoiceNumberFormat = ObjectId(req.body.invoiceNumberFormat);
        invoiceSettings.templates._id.push(ObjectId(req.body.templates));
        invoiceSettings.resetCycle = req.body.resetCycle;
        invoiceSettings.dateInclude = req.body.dateInclude;
        invoiceSettings.templateIndex = req.body.templateIndex ? req.body.templateIndex : 0;
        data.invoiceSettings = invoiceSettings;

        await User.updateOne({_id : ObjectId(req.user.id)}, {$set : data});
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

        if (req.body.phone) {
            user.phone = req.body.phone;
        }

        if (req.body.companyName) {
            user.companyName = req.body.companyName;
        }

        if (req.body.email) {
            user.email = req.body.email;
        }

        if (req.body.confirmPassword) {
            let hesh = await hashPassword(req.body.confirmPassword);
            user.password = hesh
        }

        if (req.body.role) {
            user.role = req.body.role;
        }

        user.save()

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

        filters.updatedUser = true;

        if (req.body.search) {
            filters["$or"] = [
                { firstName: { '$regex': req.body.search, $options: 'i' } },
                { lastName: { '$regex': req.body.search, $options: 'i' } },
                { userId: { '$regex': req.body.search, $options: 'i' } },
                { email: { '$regex': req.body.search, $options: 'i' } },
                { phone: { '$regex': req.body.search, $options: 'i' } },
                { companyName: { '$regex': req.body.search, $options: 'i' } }
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

        let removeResponse = await Attribute.deleteOne({ _id: ObjectId(req.params.id) });

        if (removeResponse.deletedCount) {
            response.status = 1;
            response.message = 'Attribute has been deleted';

        }

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


        let data = {
            gst: req.body.gst,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode
        };

        req.user.companyAddress.push(data);
        await req.user.save();

        response.address = data;
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
        let index = req.body.index;
        let data = {
            gst: req.body.gst,
            address: req.body.address,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode
        };

        req.user.companyAddress[index] = data;
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

        req.user.companyAddress.splice(addresskey, 1);
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


const verifification = async (req, res) => {
    let response = {
        status: 0,
        message: 'Issue in verify'
    }
    try {

        let resprespToken = await verifyToken(req)
        if (resprespToken.status == 0) {
            return res.json(resprespToken);
        }
        if(req.user){
            response.user = req.user
            response.message = ''
            response.status = 1
        }
        return res.json(response)

    } catch (err) {
       
        logger.error(err.message, { metadata: err });
        response.message = err.message || err.toString();
        response.status = 0;

        return res.json(response);
    }
}


module.exports = { list, users, create, update, updateInvoiceSetting, latestUpdated, del, addAddress, updatePassword, getAddress, removeAddress, updateAddress, updateProfile, getProfile, forgetPassword, userProfile, verifification};