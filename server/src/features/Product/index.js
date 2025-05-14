import { checkpermission, verifyToken, treeUnderUser, getSettings } from '../../helper/common';
import Product from './product';
import Review from '../Review/review';
import ReviewController from '../Review/';
import WishList from '../WishList/wishList';
import Cart from '../Cart/cart';
import User from '../User/user';
import Order from '../Order/order';
import mongoose from 'mongoose'
import logger from '../../services/logger.js';
import Coupon from '../Coupon/coupon.js';

const ObjectId = require('mongoose').Types.ObjectId;

// /backend/products
const list = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in product list',
  };

  try {
    let numberOfRecords = 50;
    let page = req.body.page ? req.body.page : 1;

    let filters = {};

    if (req.body.status != undefined) {
      filters.status = req.body.status
    }

    filters.softDelete = false;
    if (req.body.categories != null) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        if (mongoose.Types.ObjectId.isValid(singleCategory)) {
          categories.push(ObjectId(singleCategory));
        }
      }
      if (categories.length) {
        filters.categories = { $in: categories };
      }
    }

    if (req.body.hotSelling) {
      filters.hotSelling = req.body.hotSelling;
    }

    if (req.body.search) {
      filters['$or'] = [
        { name: { '$regex': req.body.search, $options: 'i' } },
        { slug: { '$regex': req.body.search, $options: 'i' } },
        { sku: { '$regex': req.body.search, $options: 'i' } },
      ]
    }

    let list = await Product.find(filters)
      .sort({ orderby: 1 })
      .skip((page - 1) * numberOfRecords)
      .limit(numberOfRecords)
      .populate('category tax_class')

    response.list = list;
    response.status = 1;
    response.message = '';

    return res.json(response);
  } catch (err) {
    console.log('err', err)
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const products = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in product list',
  };

  try {

    let filters = {};

    if (req.body.status != undefined) {
      filters.status = req.body.status
    }

    filters.softDelete = false;
    if (req.body.categories != null) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      if (categories.length) {
        filters.categories = { $in: categories };
      }
    }


    if (req.body.hotSelling) {
      filters.hotSelling = req.body.hotSelling;
    }

    if (req.body.search) {
      filters['$or'] = [
        { name: { '$regex': req.body.search, $options: 'i' } },
        { slug: { '$regex': req.body.search, $options: 'i' } },
        { sku: { '$regex': req.body.search, $options: 'i' } },
      ]
    }

    let list = await Product.find(filters)
      .sort({ orderby: 1 })
      .populate('categories')
      .populate('tax_class')

    let prods = JSON.parse(JSON.stringify(list))

    response.list = prods;
    response.status = 1;
    response.message = '';

    return res.json(response);
  } catch (err) {
    console.log(err)
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

// /products
const listForFrontEnd = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in product list',
  };

  try {
    let numberOfRecords = 50;
    let page = req.body.page ? req.body.page : 1;

    let couponFilter = {};
    let today = new Date();
    couponFilter.validupto = {$gte: today.toISOString()};
    couponFilter.startDate = {$lte: today.toISOString()};
    couponFilter.status = true;
    let coupon = await Coupon.findOne(couponFilter).sort({_id: -1});

    let filters = {};
    filters.softDelete = { $ne: true };
    filters.status = { $ne: false };

    // return res.json(filters);
    let categories = [];
    if (req.body.categories != null) {
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      if (categories.length) {
        filters.categories = { $in: categories };
      }
    }


    if (req.body.minprice || req.body.maxprice) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      filters.sale = {};
      let minprice = req.body.minprice ? req.body.minprice : 1;
      let maxprice = req.body.maxprice ? req.body.maxprice : 100000;

      if (minprice && maxprice) {
        filters.sale = { $gte: minprice, $lte: maxprice };
      }
    }

    if (req.body.brands != undefined && req.body.brands[0] != undefined) {
      let brands = [];
      for (const singleBrand of req.body.brands) {
        brands.push(ObjectId(singleBrand));
      }
      filters.brand = { $in: brands };
    } else if (req.body.brand) {
      filters.brand = req.body.brand;
    }

    if (req.body.hotSelling) {
      filters.hotSelling = req.body.hotSelling;
    }

    if (req.body.search) {
      filters['$or'] = [

        { name: { '$regex': req.body.search, $options: 'i' } },
        { slug: { '$regex': req.body.search, $options: 'i' } },
        { sku: { '$regex': req.body.search, $options: 'i' } },
      ]
    }

    let list = await Product.find(filters)
      .sort({ orderby: 1 })
      .skip((page - 1) * numberOfRecords)
      .limit(numberOfRecords)
      .populate('category')
      .populate('tax_class')

    let prods = list.filter(item => item.category?.status == true);
    
    response.list = prods;
    response.discountType = coupon?.type;
    response.discountAmount = coupon?.amount;
    response.status = 1;
    response.message = '';

    return res.json(response);
  } catch (err) {
    console.log(err)
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const letestProduct = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in product list',
  };

  try {
    let counter = req.body.counter ? req.body.counter : 8;
    let page = req.body.page ? req.body.page : 1;

    let filters = {};
    filters.softDelete = false;
    filters.status = true;
    filters.instock = true;
    filters._id = ObjectId('678a301b8014dd1c442c7c0f')

    if (req.body.categories != null) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      if (categories.length) {
        filters.categories = { $in: categories };
      }
    }

    if (req.body.minprice || req.body.maxprice) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      filters.sale = {};
      if (req.body.minprice) {
        filters.sale[$gte] = parseInt(req.body.minprice);
      }

      if (req.body.maxprice) {
        filters.sale[$lte] = parseInt(req.body.maxprice);
      }
    }

    if (req.body.brands) {
      let brands = [];
      for (const singleBrand of req.body.brands) {
        brands.push(ObjectId(singleBrand));
      }
      if (brands.length) {
        filters.brand = { $in: brands };
      }
    }

    if (req.body.search) {
      filters["$or"] = [

        { name: { '$regex': req.body.search, $options: 'i' } },
        { slug: { '$regex': req.body.search, $options: 'i' } },
        { sku: { '$regex': req.body.search, $options: 'i' } },
      ]
    }


    let list = await Product.find(filters)
      .skip(0)
      .limit(counter)
      .sort({ orderby: 1 })
      .populate('category')
      .populate('tax_class')

    let prods = JSON.parse(JSON.stringify(list))

    response.list = prods;
    response.status = 1;
    response.message = '';
    return res.json(response);
  } catch (err) {
    console.log(err)
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const getproduct = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in single product.',
  };

  try {
    let filters = {
      softDelete: false,
      status: true
    };

    let couponFilter = {};
    let today = new Date();
    couponFilter.validupto = {$gte: today.toISOString()};
    couponFilter.startDate = {$lte: today.toISOString()};
    couponFilter.status = true;
    let coupon = await Coupon.findOne(couponFilter).sort({_id: -1});

    let product = await Product.findOne({_id: ObjectId(req.body.id)})
      .populate('category tax_class')

    response.product = product;
    response.discountType = coupon?.type;
    response.discountAmount = coupon?.amount;
    response.status = 1;
    response.message = '';

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

// Add
// Only admin/shop manager
const create = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in create product',
  };

  try {
    if (req.user.role) {
      let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
      if (responsePermission.status != 1) {
        return res.json(responsePermission);
      }
    }

    // if (req.body.alias.length) {
    //   let product = await Product.findOne({ alias: req.body.alias })
    //   if (product?.alias) {
    //     response.message = 'This Alias is all ready added'
    //     return res.json(response)
    //   }
    // }

    // multiple categories
    let category;
    if (req.body.category != null) {
      category = ObjectId(req.body.category);
    }

    // mutiple price
    let priceQty = {};
    if (req.body.price && req.body.price[0]?.id) {
      for (let singlePrice of req.body.price) {
        priceQty[singlePrice.id] = singlePrice.value;
      }
    }

    let data = {
      // Basic information
      name: req.body.name,
      slug: req.body.name,
      sku: req.body.sku,
      description: req.body.description,
      timePeriod: req.body.timePeriod,
      benefits: req.body.benefits,

      // Price
      mrp: req.body.mrp,
      sale: req.body.sale ? req.body.sale : req.body.mrp,
      price: priceQty,

      // Meta details
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      metaTags: req.body.metaTags,
      metaSchema: req.body.metaSchema,
      // Other things
      tax_class: ObjectId(req.body.tax_class),
      category: category,
      status: req.body.status,
    };

    if (req.body.alias) {
      data.alias = req.body.alias
    } else if (req.body.alias == '') {
      data.alias = req.body.alias
    }

    if (req.body.orderby) {
      data.orderby = req.body.orderby
    }

    if (req.body.hotSelling) {
      data.hotSelling = req.body.hotSelling;
    }

    // Create product
    let product = await Product.create(data);

    response.product = product;
    response.status = 1;
    response.message = 'Successfully Add New Product';

    return res.json(response);
  } catch (err) {
    console.log("err", err);

    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const updateImage = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Update product images',
  };

  try {
    if (req.user.role) {
      let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
      if (responsePermission.status != 1) {
        return res.json(responsePermission);
      }
    }

    let productId = req.body.product;

    // Create product
    let product = await Product.findById(productId);

    product.images = images;

    if (req.body.defaultImage) {
      product.defaultImage = req.body.defaultImage;
    }

    await product.save();

    response.product = product;
    response.status = 1;
    response.message = 'Image upload';

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const deleteImage = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Update product images',
  };

  try {
    if (req.user.role) {
      let responsePermission = await checkpermission(req.user.role.slug, 'authorised');
      if (responsePermission.status != 1) {
        return res.json(responsePermission);
      }
    }

    let productId = req.body.product;
    let deleteKey = req.body.deleteKey;

    // Create product
    let product = await Product.findById(productId);

    let allImages = product.images;

    product.images = allImages.filter((element, index) => index != deleteKey);

    await product.save();

    response.images = product.images;
    response.status = 1;
    response.message = 'Product Image has been deleted';

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

// Only admin/shop manager
const update = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in update product',
  };

  try {
    // multiple categories

    // let prod = await Product.findById(ObjectId(req.params?.id))
    // if ((req.body.alias && req.body.alias.length) && (prod.alias != req.body.alias)) {
    //   let product = await Product.findOne({ alias: req.body.alias })
    //   if (product?.alias == req.body.alias) {
    //     response.message = 'This Alias is all ready added'
    //     return res.json(response)
    //   }
    // }


    let product = {}

    if (req.body.category != null) {
      product.category = ObjectId(req.body.category);
    }

    if (req.body.hotSelling) {
      product.hotSelling = req.body.hotSelling;
    } else if (req.body.hotSelling == false) {
      product.hotSelling = req.body.hotSelling;
    }

    if (req.body.name) {
      product.name = req.body.name;
    }
    if (req.body.slug) {
      product.slug = req.body.name;
    }
    if (req.body.description) {
      product.description = req.body.description;
    }
    if (req.body.sku) {
      product.sku = req.body.sku;
    }
    if (req.body.benefits) {
      product.benefits = req.body.benefits;
    }
    if (req.body.timePeriod) {
      product.timePeriod = req.body.timePeriod;
    }

    // Price
    if (req.body.mrp || (req.body.mrp > -1)) {
      product.mrp = req.body.mrp;
    }

    if (req.body.sale) {
      product.sale = req.body.sale ? req.body.sale : req.body.mrp;
    } else {
      product.sale = req.body.sale ? req.body.sale : req.body.mrp;
    }

    // Meta details
    if (req.body.metaTitle) {
      product.metaTitle = req.body.metaTitle;
    }
    if (req.body.metaDescription) {
      product.metaDescription = req.body.metaDescription;
    }
    if (req.body.metaTags) {
      product.metaTags = req.body.metaTags;
    }
    if (req.body.metaSchema) {
      product.metaSchema = req.body.metaSchema;
    }

    if (req.body.tax_class) {
      product.tax_class = ObjectId(req.body.tax_class);
    }

    if (req.body.status) {
      product.status = req.body.status;
    }

    if (req.body.orderby) {
      product.orderby = req.body.orderby;
    }
    // product.save();
    let update = await Product.updateOne({ _id: req.params?.id }, { $set: product });

    if (update.n > 0) {
      response.product = product;
      response.status = 1;
      response.message = 'Successfully Update';
      // await FtpScheduler.addLatestUpdateedCate([req.params?.id], 'id')
    }

    return res.json(response);
  } catch (err) {
    console.log(err);
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

// Delete - Not parmanent delete
const del = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in delete product',
  };

  try {
    let product = await Product.findOne({ _id: ObjectId(req.params.id) }, { softDelete: 1 });
    product.softDelete = true;
    product.save();

    let review = Review.deleteMany({ product: ObjectId(product._id) });
    let card = Cart.deleteMany({ product: ObjectId(product._id) });
    let wishlist = WishList.deleteMany({ productId: ObjectId(product._id) });
    let promiseReqest = await Promise.all([review, card, wishlist]);

    response.status = 1;
    response.message = 'Product has been Deleted';

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const similarproductions = async (req, res) => {
  let response = {
    status: 0,
    message: 'Issue in similar product',
  };
  try {
    let filters = {};

    filters.showsimilarproductions = true;
    if (req.body.slug) {
      filters.slug = req.body.slug;
      filters.status = true;
      filters.instock = true;
    } else {
      filters._id = ObjectId(req.body.product);
    }

    filters.quantity = { $gt: 1 };

    let product = await Product.findOne(filters, 'categories brand');
    if (product?.categories || product?.brand) {

      let cat = product?.categories;
      let brand = product?.brand

      let list = await Product.find({
        instock: true,
        softDelete: { $ne: true },
        $or: [{ categories: { $in: cat } }, { brand: ObjectId(brand) }],
      })
        .sort({ createdAt: -1 })
        .limit(4);
      let subProduct = await Customize.find({ softdelete: false, status: true }).populate('group')

      let subProd = {}
      for (let singlePro of subProduct) {

        if (singlePro?.group?.category == 'Processor') {
          singlePro.group.category = 'processer'
        }

        if (subProd[singlePro?.group?.category?.toLowerCase()] == undefined) {
          subProd[singlePro?.group?.category?.toLowerCase()] = {}
          // console.log('singlePro?.group?.category', singlePro?.group?.category)
        }

        if (subProd[singlePro?.group?.category?.toLowerCase()][singlePro?.group?.id] == undefined) {
          subProd[singlePro?.group?.category?.toLowerCase()][singlePro.group.id] = []
        }

        subProd[singlePro?.group?.category?.toLowerCase()][singlePro.group.id].push(singlePro)

      }
      let prods = JSON.parse(JSON.stringify(list))
      for (let singleProd of prods) {
        if (singleProd.productType == 'customize') {
          let customDetails = {}

          for (let singleId of [...singleProd.productOptions['ram'], ...singleProd.productOptions['storage'], ...singleProd.productOptions['processer'], ...singleProd.productOptions['other']]) {


            let category = singleId?.category?.toLowerCase();

            if (category == 'processor') {
              category = 'processer'
            }

            const groupId = singleId?.id;

            if (customDetails[category] == undefined) {
              customDetails[category] = []

            }


            if (Object.keys(subProd).length) {

              for (let singleGroup in subProd[category]) {
                if (subProd[category][singleGroup].length) {
                  customDetails[category].push(...subProd[category][singleGroup])
                }

              }

            }
          }


          singleProd.productOptions = {}


          singleProd.productOptions = customDetails


        }
      }


      response.list = prods;
    }

    // let products = list.map((key) => {
    //   return ObjectId(key._id);
    // });

    // Review
    // response.avgRating = await ReviewController.getProductReviewRating(products);

    response.status = 0;
    response.message = '';
    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

const reviewByProducts = async (req, res) => {
  // Default Response
  let response = {
    status: 0,
    message: 'Issue in review list',
  };

  try {
    let filters = {};
    filters.softDelete = false;
    filters.status = true;
    filters.instock = true;

    if (req.body.categories != null) {
      let categories = [];
      for (const singleCategory of req.body.categories) {
        categories.push(ObjectId(singleCategory));
      }
      if (categories.length) {
        filters.categories = { $in: categories };
      }
    }

    if (req.body.minprice || req.body.maxprice) {
      let categories = [];
      if (req.body.categories != null) {
        for (const singleCategory of req.body.categories) {
          categories.push(ObjectId(singleCategory));
        }
      }
      filters.sale = {};
      let minprice = req.body.minprice ? req.body.minprice : 1;
      let maxprice = req.body.maxprice ? req.body.maxprice : 100000;

      if (minprice && maxprice) {
        filters.sale = { $gte: minprice, $lte: maxprice };
      }
    }

    if (req.body.brands != undefined && req.body.brands[0] != undefined) {
      let brands = [];
      for (const singleBrand of req.body.brands) {
        brands.push(ObjectId(singleBrand));
      }
      filters.brand = { $in: brands };
    } else if (req.body.brand) {
      filters.brand = req.body.brand;
    }

    let productsList = await Product.find(filters, 'id').sort({ id: -1 });

    let productsAvgRating = {};
    for (let product of productsList) {
      let avgRating = await ReviewController.getProductReviewRating([product.id]);
      productsAvgRating[product.id] = avgRating[product.id];
    }

    response.list = productsAvgRating;
    response.status = 1;
    response.message = '';

    return res.json(response);
  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message || err.toString();
    response.status = 0;

    return res.json(response);
  }
};

// payment failed then product quantity incress from order detalis
const incressQty = async (id) => {
  try {
    let order = await Order.findById(id)

    for (let singleItem of order.items) {
      await Product.updateOne({ _id: singleItem.productId }, { $inc: { quantity: singleItem.quantity } })
    }

  } catch (err) {
    logger.error(err.message, { metadata: err });
  }
}

module.exports = {
  list,
  create,
  update,
  del,
  getproduct,
  reviewByProducts,
  letestProduct,
  listForFrontEnd,
  deleteImage,
  updateImage,
  similarproductions,
  incressQty,
  products
};
