import { Router } from 'express';
import Joi from 'joi';
import { addUserSchema, addUsersSchema } from '../../services/validators';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { requireUserAuth } from '../../middleware/requireLocalAuth';
import { notification } from '../../features/Notification/';
//import rolesRoutes from './roles';
//import usersRoutes from './users';
import errLogger from './logger';
import Attribute from '../../features/Attribute';
import Dashboard from '../../features/Dashborad';
import Template from '../../features/Template';
import Category from '../../features/Category';
import Invoice from '../../features/Invoice';
import InvoiceFormat from '../../features/InvoiceDateFormat';
import User from '../../features/User';
import Role from '../../features/Role'; 
import Setting from '../../features/Setting';
import Permission from '../../features/Permission';
import TaxGst from '../../features/TaxGst';
import Home from '../../features/Home';
import { uploadDestination } from '../../helper/fileuploader';
import { emailTemplates, emailTemplate, otp, rateLimiter } from '../../helper/common';
import counter from '../../helper/counter';
import importFiles from '../../helper/importExport';
//bettingType

const router = Router();

// Role routing

router.get('/category', Category.list);
router.post('/category/add', requireJwtAuth, Category.create);
router.post('/category/edit', requireJwtAuth, Category.update);
router.post('/category/edit/:id', Category.del);

// invoice date format 
router.post('/invoice/date/add', InvoiceFormat.create);
router.post('/invoice/date/list', InvoiceFormat.list);
router.post('/invoice/date/frontend/list', InvoiceFormat.frontendList);


router.get('/home', Home.getHomePage);

router.get('/roles', Role.list);
router.post('/role/add', Role.create);
router.put('/role/edit/:id', Role.update);


// invoice routing 
router.post('/invoice/add', requireJwtAuth, Invoice.create);


// template routing
router.post('/template/add', requireJwtAuth, Template.create);
router.post('/template/update', requireJwtAuth, Template.update);
router.post('/template/list', requireJwtAuth, Template.list);
router.post('/template/frontend/list', requireJwtAuth, Template.frontendList);

// adminDashboard
// User routing
//requireJwtAuth

router.post('/users/forcsv', requireJwtAuth, User.users);
router.post('/users', requireJwtAuth, User.list);
router.post('/latestupdated/users', requireJwtAuth, User.latestUpdated);
router.post('/user/add', User.create);
router.post('/user/signup', User.create);
// updateProfile, getProfile
router.get('/user/profile', requireJwtAuth, User.getProfile);
router.post('/user/profile',  User.userProfile);
router.post('/user/profile/edit', requireJwtAuth, User.updateProfile);
router.post('/user/invoice/setting/edit', requireJwtAuth, User.updateInvoiceSetting);

// Address
router.post('/user/address/add', requireJwtAuth, User.addAddress);
router.put('/user/address/edit', requireJwtAuth, User.updateAddress);
router.put('/user/edit/:id', requireJwtAuth, User.update);
router.get('/user/address', requireJwtAuth, User.getAddress);
//router.delete('/user/address/:addresskey',User.removeAddress);
router.post('/user/password/change', User.updatePassword);
router.post('/user/forgetPassword', User.forgetPassword);
router.post('/user/verifification',requireJwtAuth, User.verifification);
// router.post('/user/cashback/add',requireJwtAuth, User.addwallet);


router.get('/admin/dashboard', requireJwtAuth, Dashboard.adminDashboard);

// Categories routing 
// requireJwtAuth
router.get('/attributes', requireJwtAuth, Attribute.list);
router.get('/attribute/list', Attribute.listFrontEnd);
router.post('/attribute/add', requireJwtAuth, Attribute.create);
router.put('/attribute/edit/:id', requireJwtAuth, Attribute.update);
router.delete('/attribute/:id', requireJwtAuth, Attribute.del);

// Settings routing 
// requireJwtAuth
router.get('/settings', requireJwtAuth, Setting.list);
router.post('/settings/forcustomer',  Setting.settings);
router.post('/setting/add', requireJwtAuth, Setting.create);
router.put('/setting/edit/:id', requireJwtAuth, Setting.update);
router.delete('/setting/:id', requireJwtAuth, Setting.del);
router.post('/setting', requireJwtAuth, Setting.singleSetting);
router.post('/offer/update',requireJwtAuth,Setting.offerUpdate)
router.get('/offers',Setting.getOffers)


router.post('/customize/offer/update',requireJwtAuth,Setting.customizeofferUpdate)
router.get('/customize/offers',Setting.customizeofferGet)


router.get('/permissions', requireJwtAuth, Permission.list);
router.post('/permission/add', requireJwtAuth, Permission.create);
router.put('/permission/edit/:id', requireJwtAuth, Permission.update);
router.delete('/permission/:id', requireJwtAuth, Permission.del);



// Review routing
// requireJwtAuth
router.get('/taxgsts', TaxGst.list);
router.get('/frontend/taxgst', TaxGst.listForFrontEnd);
router.post('/taxgst/add', TaxGst.create);
router.put('/taxgst/edit/:id', TaxGst.update);
//router.delete('/taxgst/:id', TaxGst.del);

//router.use('/roles', rolesRoutes);
//router.use('/users', usersRoutes);
//router.use('/errorlog', errLogger);
// notifincation for android

router.get('/notification', notification);
router.post('/template', emailTemplate)
router.get('/templates', emailTemplates)



router.post('/counter/reports', counter.counterReports)
router.post('/email/otp', otp)


router.post('/product/upload', uploadDestination('products').single('products'), importFiles.productImport)
router.post('/users/upload', uploadDestination('users').single('users'), importFiles.userUpload)
router.post('/subproduct/upload', uploadDestination('subproduct').single('subproduct'), importFiles.subproduct)
// router.get('/users/file', userimport)


export default router;