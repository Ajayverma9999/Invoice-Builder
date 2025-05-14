import { Router } from 'express';
import Joi from 'joi';
import { addUserSchema, addUsersSchema } from '../../services/validators';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import { requireUserAuth } from '../../middleware/requireLocalAuth';
import { notification } from '../../features/Notification/';
//import rolesRoutes from './roles';
//import usersRoutes from './users';
import errLogger from './logger';
import Category from '../../features/Category';
import Attribute from '../../features/Attribute';
import Product from '../../features/Product';
import Dashboard from '../../features/Dashborad';
import User from '../../features/User';
import Role from '../../features/Role';
import Banner from '../../features/Banner';
import Brand from '../../features/Brand';
import Coupon from '../../features/Coupon';
import BalanceSheet from '../../features/BalanceSheet';
import EmailTemplate from '../../features/EmailTemplate';
import Setting from '../../features/Setting';
import Payment from '../../features/Payment';
import Permission from '../../features/Permission';
import Review from '../../features/Review';
import Shipping from '../../features/Shipping';
import TaxGst from '../../features/TaxGst';
import Transaction from '../../features/Transaction';
import Zipcode from '../../features/Zipcode';
import Tag from '../../features/Tag';
import Cart from '../../features/Cart';
import Order from '../../features/Order';
import Home from '../../features/Home';
import { uploadDestination } from '../../helper/fileuploader';
import WarrantyProcedure from '../../features/WarrantyProcedure';
import Page from '../../features/Pages';
import ShippingZone from '../../features/ShippingZone';
import WishList from '../../features/WishList';
import Checkout from '../../features/Checkout';
import SocialMedia from '../../features/Admin';
import { emailTemplates, emailTemplate, otp, rateLimiter } from '../../helper/common';
import ServiceCenter from '../../features/ServiceCenter';
import counter from '../../helper/counter';
import importFiles from '../../helper/importExport';
import Track from '../../features/Tracks';
import Slab from '../../features/CartRateSlab';
//bettingType

const router = Router();

// Role routing
/*
router.get('/roles', Category.list);
router.post('/role/add', Category.add);
router.put('/role/edit/:id', Category.edit);
router.delete('/role/edit/:id', Category.delete);

router.put('/user/edit/:id', Category.edit);


router.delete('/user/edit/:id', Category.delete);
*/

router.get('/home', Home.getHomePage);
router.get('/roles', Role.list);
router.post('/role/add', Role.create);
router.put('/role/edit/:id', Role.update);


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

// Address
router.post('/user/address/add', requireJwtAuth, User.addAddress);
router.post('/user/billingaddress/add', requireJwtAuth, User.addBillingAddress);
router.put('/user/address/edit', requireJwtAuth, User.updateAddress);
router.put('/user/edit/:id', requireJwtAuth, User.update);
router.get('/user/address', requireJwtAuth, User.getAddress);
router.delete('/user/address/:addresskey', requireJwtAuth, User.removeAddress);
router.delete('/user/billingaddress/:addresskey', requireJwtAuth, User.removeBillingAddress);
router.post('/user/password/change', User.updatePassword);
router.post('/user/forgetPassword', User.forgetPassword);
router.post('/verify/user', requireJwtAuth, User.verifyUser);
router.post('/markspacial', requireJwtAuth, User.updateDiscount);
router.post('/assign/role', requireJwtAuth, User.assignRole);
router.post('/user/delete', User.del);


router.get('/admin/dashboard', requireJwtAuth, Dashboard.adminDashboard);

// Product routing
//requireJwtAuth

router.post('/backend/products', requireJwtAuth, Product.list);
router.post('/backend/subproducts', requireJwtAuth, Product.subProductsList);
router.post('/products', Product.listForFrontEnd);
// router.post('/products/forcsv',requireJwtAuth, Product.products);
router.post('/getproduct', Product.getproduct);
router.post('/getproduct/limits', Product.letestProduct);
//
router.post('/product/add', requireJwtAuth, Product.create);
router.put('/product/edit/:id', requireJwtAuth, Product.update);
router.delete('/product/:id', requireJwtAuth, Product.del);
router.post('/product/update/bycategory', requireJwtAuth, Product.updateProductsByCategory);
// router.post('/reviewbyproducts', Product.reviewByProducts);

// req.body.product, req.body.deleteKey
router.post('/product/deleteimage', requireJwtAuth, Product.deleteImage);
// req.body.product, images
router.post('/product/updateimage', requireJwtAuth, uploadDestination('products').any('images'), Product.updateImage);

// Wish List 
router.post('/wishlist', requireJwtAuth, WishList.list);
router.post('/frontend/wishlist', requireJwtAuth, WishList.frontEndList)
router.post('/wishlist/add', requireJwtAuth, WishList.create);
router.delete('/wishlist/:id', requireJwtAuth, WishList.del);
router.delete('/wishlist/empty', requireJwtAuth, WishList.wishListEmpty);
router.post('/userwishlist', requireJwtAuth, WishList.userWishListbyProducts);
router.post('/addanddelete', requireJwtAuth, WishList.addandDelete);
// Checkout
router.get('/checkout', requireJwtAuth, Checkout.beforeCheckout);

//router.put('/page/edit/:id', Page.update);

//varient
// Page - list,create, update, listFrontEnd, getPage
router.get('/pages', Page.list);
router.get('/page/list', Page.listFrontEnd)
router.post('/page/add', Page.create);
router.put('/page/edit/:id', Page.update);
router.delete('/page/:id', Page.remove);
router.post('/page/:slug', Page.getPage);
router.post('/editor', uploadDestination('cdEditor').single('upload'), Page.ckfileUploader)

// Categories routing 
// requireJwtAuth
router.get('/attributes', requireJwtAuth, Attribute.list);
router.get('/attribute/list', Attribute.listFrontEnd);
router.post('/attribute/add', requireJwtAuth, Attribute.create);
router.put('/attribute/edit/:id', requireJwtAuth, Attribute.update);
router.delete('/attribute/:id', requireJwtAuth, Attribute.del);


// Categories routing 
//requireJwtAuth
router.post('/frontend/categories', Category.frontEndlist);
router.post('/categories', requireJwtAuth, Category.list);
router.post('/category/add', requireJwtAuth, uploadDestination('categories').single('image'), Category.create);
router.put('/category/edit/:id', requireJwtAuth, uploadDestination('categories').single('image'), Category.update);
router.delete('/category/:id', requireJwtAuth, Category.del);
router.post('/childcategorys', Category.childCategory)


// ShippingZones
router.get('/shippingzones', ShippingZone.list);
router.post('/shippingzone/add', requireJwtAuth, ShippingZone.create);
router.put('/shippingzone/edit/:id', requireJwtAuth, ShippingZone.update);
router.delete('/shippingzone/:id', requireJwtAuth, ShippingZone.del);

// Banners routing 

router.get('/frontend/banners', Banner.frontEndList);
router.get('/banners', requireJwtAuth, Banner.list);
router.post('/banner/add', requireJwtAuth, uploadDestination('banners').single('image'), Banner.create);
router.put('/banner/edit/:id', requireJwtAuth, uploadDestination('banners').single('image'), Banner.update);
router.delete('/banner/:id', Banner.del);

// Brands
//requireJwtAuth
router.get('/brands', requireJwtAuth, Brand.list);
router.get('/frontend/brands', Brand.frontEndList);
router.post('/brand/add', requireJwtAuth, uploadDestination('brand').single('image'), Brand.create);
router.put('/brand/edit/:id', requireJwtAuth, uploadDestination('brand').single('image'), Brand.update);
router.delete('/brand/:id', requireJwtAuth, Brand.del);


// Coupon routing 
// requireJwtAuth
router.get('/coupons', requireJwtAuth, Coupon.list);
router.post('/coupon/add', requireJwtAuth, Coupon.create);
router.put('/coupon/edit/:id', requireJwtAuth, Coupon.update);
router.delete('/coupon/:id', requireJwtAuth, Coupon.del);

// Balance Sheet routing 
// requireJwtAuth
router.post('/balance/add', requireJwtAuth, BalanceSheet.create);
router.post('/balance', requireJwtAuth, BalanceSheet.list);

// email template routing 
router.post('/emailTemplates', requireJwtAuth, EmailTemplate.list);
router.post('/emailTemplate/add', requireJwtAuth, EmailTemplate.create);
router.put('/emailTemplate/edit/:id', requireJwtAuth, EmailTemplate.update);
router.delete('/emailTemplate/:id', requireJwtAuth, EmailTemplate.del);


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



// Payment routing 
router.get('/payments', requireJwtAuth, Payment.list);
router.post('/payment/add', requireJwtAuth, Payment.create);
router.put('/payment/edit/:id', requireJwtAuth, Payment.update);
router.delete('/payment/:id', requireJwtAuth, Payment.del);

router.post('/paytmipn', Payment.paymentNotification);
router.post('/paytm/returnurl/:paymentid', Payment.paytmreturn);

// Permission routing
router.get('/permissions', requireJwtAuth, Permission.list);
router.post('/permission/add', requireJwtAuth, Permission.create);
router.put('/permission/edit/:id', requireJwtAuth, Permission.update);
router.delete('/permission/:id', requireJwtAuth, Permission.del);

// Review routing
router.get('/reviews/product/:product', Review.getProductReviews);
router.get('/reviews', requireJwtAuth, Review.list);
router.post('/letest/reviews', Review.letestList);
router.post('/user/review', requireJwtAuth, Review.userReview);
router.post('/review/add', requireJwtAuth, uploadDestination('review').single('image'), Review.create);
router.put('/review/edit/:id', requireJwtAuth, Review.update);
router.delete('/review/:id', requireJwtAuth, Review.del);

// Review routing
router.get('/shippings', requireJwtAuth, Shipping.list);
router.post('/shipping/add', requireJwtAuth, Shipping.create);
router.post('/shipping/cost', requireJwtAuth, Shipping.getShippingCost);
router.put('/shipping/edit/:id', requireJwtAuth, Shipping.update);
router.delete('/shipping/:id', requireJwtAuth, Shipping.del);


// Review routing
// requireJwtAuth
router.get('/taxgsts', TaxGst.list);
router.get('/frontend/taxgst', TaxGst.listForFrontEnd);
router.post('/taxgst/add', TaxGst.create);
router.put('/taxgst/edit/:id', TaxGst.update);
//router.delete('/taxgst/:id', TaxGst.del);



// Transaction routing
router.get('/transactions', requireJwtAuth, Transaction.list);
router.post('/transaction/add', requireJwtAuth, Transaction.create);
router.put('/transaction/edit/:id', requireJwtAuth, Transaction.update);
router.delete('/transaction/:id', requireJwtAuth, Transaction.del);

// Transaction routing
router.get('/cartlist', requireJwtAuth, Cart.list);
router.get('/cart/empty', requireJwtAuth, Cart.empty)
router.post('/cart/add', requireJwtAuth, Cart.create);
router.post('/cart/multiple', requireJwtAuth, Cart.multipleItems);
router.put('/cart/edit/:id', requireJwtAuth, Cart.update);
router.post('/carts',requireJwtAuth, Cart.carts)
// Transaction routing
router.post('/admin/orders', requireJwtAuth, Order.list);
router.put('/admin/order/status/:id', requireJwtAuth, Order.updateStatus)
router.post('/order/create', requireJwtAuth, Order.confirmOrder);
router.post('/orders/forcsv',requireJwtAuth,Order.orders)
// Get order details
router.get('/order/detail/:id', requireJwtAuth, Order.getOrder);

router.post('/orders', requireJwtAuth, requireUserAuth, Order.ownOrderList);
// checkOrderStatus, IpnStatusUPI
router.post('/order/checkorderstatus', requireJwtAuth, requireUserAuth, Order.checkOrderStatus);
router.post('/order/recreate', requireJwtAuth, Order.reOrderGen)


router.get('/warrantyproccesses', WarrantyProcedure.list);
router.post('/warrantyproccess/add', requireJwtAuth, WarrantyProcedure.create);
router.put('/warrantyproccess/edit/:id', requireJwtAuth, WarrantyProcedure.update);
router.delete('/warrantyproccess/:id', requireJwtAuth, WarrantyProcedure.del);

// Transaction routing
// requireJwtAuth
router.get('/tags', Tag.list);
router.post('/tag/add', Tag.create);
router.put('/tag/edit/:id', Tag.update);
router.delete('/tag/:id', Tag.del);

// Zipcode routing
// requireJwtAuth
router.post('/zipcode/citystate', requireJwtAuth, Zipcode.getCityState);
router.get('/zipcodes', requireJwtAuth, Zipcode.list);
router.post('/zipcode/add', requireJwtAuth, Zipcode.create);
router.get('/states', Zipcode.states);

router.post('/social', SocialMedia.list);
router.post('/socialmedia/create', requireJwtAuth, SocialMedia.create);
router.post('/socialmedia/edit', requireJwtAuth, SocialMedia.update);

//router.use('/roles', rolesRoutes);
//router.use('/users', usersRoutes);
//router.use('/errorlog', errLogger);
// notifincation for android

router.get('/notification', notification);
router.post('/template', emailTemplate)
router.get('/templates', emailTemplates)


router.post('/servicecenters', ServiceCenter.list);
router.post('/servicecenter/add', requireJwtAuth, ServiceCenter.create);
router.put('/servicecenter/edit/:id', requireJwtAuth, ServiceCenter.update);
router.delete('/servicecenter/:id', requireJwtAuth, ServiceCenter.del);

router.post('/counter/reports', counter.counterReports)
router.post('/email/otp', otp)

router.post('/track/add', requireJwtAuth, Track.create);
router.get('/track/list', requireJwtAuth, Track.list);
router.put('/track/edit/:id', requireJwtAuth, Track.edit);
router.delete('/track/delete/:id', requireJwtAuth, Track.remove);


router.post('/product/upload', uploadDestination('products').single('products'), importFiles.productImport)
router.post('/users/upload', uploadDestination('users').single('users'), importFiles.userUpload)
router.post('/subproduct/upload', uploadDestination('subproduct').single('subproduct'), importFiles.subproduct)
// router.get('/users/file', userimport)

// router.get('/frontend/banners', Slab.frontEndList);
router.post('/slab/list', requireJwtAuth, Slab.list);
router.post('/slab', requireJwtAuth, Slab.getslab);
router.post('/slab/add', requireJwtAuth,  Slab.create);
router.put('/slab/edit/:id', requireJwtAuth,  Slab.update);



export default router;