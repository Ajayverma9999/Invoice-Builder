import fs from 'fs';
import { parse } from 'csv-parse';
import User, { hashPassword } from '../features/User/user';
import logger from '../services/logger';
import Product from '../features/Product/product';
import Order from '../features/Order/order';
import Customize from '../features/Product/customised';

import Category from '../features/Category/category'
import Brand from '../features/Brand/brand';
import Attribute from '../features/Attribute/attribute';


const rolecustomer = '6114d5c422b7c53a358bba0b';
const ObjectId = require('mongoose').Types.ObjectId;

const userUpload = async (req, res) => {

  let response = {
    message: 'issue in user import',
    status: 0
  }
  try {

    let data = req.file;
    let fileData = []
    await fs.createReadStream(`${data.destination}/${data.filename}`)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", function (row) {  // single row
        if (row[6].trim()) {
          fileData[row[6]] = {
            'provider': 'phone',
            'firstName': row[2],
            'lastName': row[3],
            'phone': row[4].toString(),
            'secondPhone': row[5].toString(),
            'email': row[6],
            'password': row[13],
            'companyName': row[1],
            'role': ObjectId(rolecustomer),
            'address': {
              'firstName': row[2],
              'lastName': row[3],
              'email': row[6],
              'phone': row[4].toString(),
              'gst': row[7],
              'city': row[8],
              'state': row[9],
              'zipcode': row[10],
              'addressline1': row[11],
              'addressline2': row[12] ? row[12] : row[11],
              'softDelete': false,
              'status': false
            }
          };
        }
      })
      .on("end", function () {
        User.insertMany(Object.values(fileData)).then(() => {

          response.message = "Add same new customes"
          response.status = 1
          res.json(response)
        }).catch((err) => {
          if (Object.values(err)[0] == 'BulkWriteError' && Object.values(err)[2] == 11000) {
            response.message = "same custome already added"
            response.status = 0
            res.json(response)
          }
        });

        fs.rmSync(`${data.destination}${data.filename}`)
      })

  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message
    return res.json(response);
  }
}


const productImport = async (req, res) => {
  let response = {
    message: 'issue In Product Import',
    status: 0
  }
  try {



    let brands = Brand.find({ status: "true" }, 'slug')
    let categories = Category.find({ softDelete: false, status: true }, 'slug parent');
    let allAtribute = Attribute.find({ softdelete: false, status: true }, 'slug')
    let promisReq = await Promise.all([brands, categories, allAtribute])

    let allbrand = {}
    for (let singleBrand of promisReq[0]) {
      allbrand[singleBrand.slug] = singleBrand.id;
    }

    let parentCateg = {}
    let subcategories = {}
    // category slug by id
    for (let singleCat of promisReq[1]) {
      if (singleCat.parent) {
        subcategories[singleCat.slug] = singleCat.id;
      } else {
        parentCateg[singleCat.slug] = singleCat.id;
      }
    }


    let allAttributes = {};
    for (let singleAttribute of promisReq[2]) {
      allAttributes[singleAttribute.slug] = singleAttribute.id;
    }



    let data = req.file;
    let addproduct = {}, temp = {};
    let updateProduct = {}
    fs.createReadStream(`${data.destination}/${data.filename}`)
      .pipe(parse({
        delimiter: ",", relax_quotes: true,
        columns: column => column.map(key => key.trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase())
      }))
      .on("data", function (row) {

        if(temp[row['alias']] == undefined){
          temp[row['alias']] = row['alias']
        }else{
          row['alias'] = ''
        }

        if (row['slug'] != undefined) {
          let updPrice = {}
          if (row['quantityandprice']) {
            let strArr = row['quantityandprice'].split(',')
            for (let index in strArr) {
              index = strArr[index].split(':')
              if (parseInt((index[0]))) {
                updPrice[(index[0])] = index[1]
              }
            }
          }

          updateProduct[row['slug']] = {
            'mrp': parseInt(row['mrp']),
            'price': updPrice,
            'quantity': parseInt(row['quantity']),
            'sale': parseInt(row['sale']) ? parseInt(row['sale']) : parseInt(row['mrp']),
            'weight': parseInt(row['weight']),
            'orderby': parseInt(row['orderby']),
            'minstockqty': parseInt(row['minstockqty']) ? parseInt(row['minstockqty']) : 0,
            'minqty': parseInt(row['minqty']),
            'maxqty': parseInt(row['maxqty']),
            'stock': (row['stock'] == 'Active') ? true : false,
            'hotselling': (row['hotselling'] == 'Active') ? true : false,
            'status': (row['status'] == 'Active') ? true : false,
            'alias':row['alias'],


          };
        } else if (row['name']) {
          let category = parentCateg[row['categoriesslug']];
         
          addproduct[row['name'].trim()] = {
            'name': row['name'].trim(),
            'slug': row['name'].trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase(),
            'sku': row['name'].trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase(),
            'showsimilarproductions': false,
            'categories': [ObjectId(category)] ? [ObjectId(category)] : [],
            'subcategories': [ObjectId(subcategory)] ? [ObjectId(subcategory)] : [],
            'brand': allbrand[row['brandslug'].trim()],
            'attributes': [],
            'description': row['description'],
            'mrp': parseInt(row['mrp']),
            'sale': parseInt(row['sale']) ? parseInt(row['sale']) : parseInt(row['mrp']),
            'minqty': parseInt(row['minqty']),
            'maxqty': parseInt(row['maxqty']),
            'minStockQty': parseInt(row['minstockqty']) ? parseInt(row['minstockqty']) : 0,
            'weight': parseInt(row['weight']),
            'orderby': parseInt(row['orderby']),
            'productType': 'normal',
            'alias':  (product.indexOf(row['alias']) > -1) ? '' : row['alias'],
            'productOptions': {},
            'quantity': row['quantity'],
            'metaTitle': '',
            'metaDescription': '',
            'metaTags': '',
            'metaSchema': '',
            'hotSelling': false,
            'status': false,
            'backordering': false,
            'instock': true,
            'defaultImage': 0,
          };
        }
      })

      .on("end", async function () {

        if (Object.values(addproduct).length) {

          Product.insertMany(Object.values(addproduct)).then((resp) => {
            response.message = "products add"
            response.status = 1
            return res.json(response)
          }).catch((err) => {
            if (Object.values(err)[0] == 'BulkWriteError' && Object.values(err)[2] == 11000) {
              response.message = "same product already added"
              response.status = 0
              return res.json(response)

            }
          });

          fs.rmSync(`${data.destination}${data.filename}`)
        } else if (Object.values(updateProduct).length) {
          let allSlug = Object.keys(updateProduct)

          for (let singleSlug of allSlug) {
            let data = {
              "mrp": parseInt(updateProduct[singleSlug].mrp),
              "sale": parseInt(updateProduct[singleSlug].sale),
              "price": updateProduct[singleSlug].price,
              "quantity": parseInt(updateProduct[singleSlug].quantity),
              'minStockQty': parseInt(updateProduct[singleSlug].minstockqty),
              'minqty': parseInt(updateProduct[singleSlug].minqty),
              'maxqty': parseInt(updateProduct[singleSlug].maxqty),
              'weight': parseInt(updateProduct[singleSlug].weight),
              'hotSelling': updateProduct[singleSlug].hotselling,
              'instock': updateProduct[singleSlug].stock,
              'orderby': parseInt(updateProduct[singleSlug].orderby),
              'status': updateProduct[singleSlug].status,
              'alias': updateProduct[singleSlug].alias,

            }
            await Product.updateOne({ slug: singleSlug }, { $set: data })
          }

          fs.rmSync(`${data.destination}${data.filename}`)
          response.message = "updateing process start"
          response.status = 1
          return res.json(response)

        }

      })

  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message
    return res.json(response);
  }
}


const subproduct = async (req, res) => {
  let response = {
    message: 'issue in subproduct import',
    status: 0
  }
  try {
   
    let data = req.file;
    let addProduct = {},temp = {}
    let updateProduct = {}

    let category = { 'p': 'Processor', 's': 'Storage', 'r': 'Ram', 'o': 'Other' }
    fs.createReadStream(`${data.destination}/${data.filename}`)
      .pipe(parse({
        delimiter: ",", relax_quotes: true, escape: '\\', ltrim: true, rtrim: true,
        columns: column => column.map(key => key.trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase())
      }))
      .on("data", function (row) {

        if(temp[row['alias']] == undefined){
          temp[row['alias']] = row['alias']
        }else{
          row['alias'] = ''
        }




        if (row['slug'] != undefined) {
          updateProduct[row['slug'].trim()] = {
            'price': parseInt(row['price']),
            'stock': (row['stock'] == 'OutOfStock') ? false : true,
            'alias':  row['alias'],

          }

        } else if (row['slug'] == undefined) {
          if (row['name'].trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase()) {
            addProduct[row['name'].trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase()] = {
              'name': row['name'],
              'slug': row['name'].trim().replace(/[^A-Z0-9]+/ig, "").toLowerCase(),
              'category': category[row['categories'][0].toLowerCase()],
              'price': parseInt(row['price']),
              'stock': (row['stock'] == 'OutOfStock') ? false : true,
              'description': row['description'],
              'status': false,
              'alias': row['alias'],

            };
          }
        }
      })
      .on("end", async function () {

        if (Object.values(addProduct).length) {
          Customize.insertMany(Object.values(addProduct)).then(() => {
            response.message = "Add SubProducts"
            response.status = 1
            res.json(response)
          }).catch((err) => {
            if (Object.values(err)[0] == 'BulkWriteError' && Object.values(err)[2] == 11000) {
              response.message = "same products already added"
              response.status = 0
              res.json(response)
            }
          });

          fs.rmSync(`${data.destination}${data.filename}`)
        } else if (Object.values(updateProduct).length) {

          let allSlug = Object.keys(updateProduct)

          for (let singleSlug of allSlug) {
            let data = {
              "price": parseInt(updateProduct[singleSlug].price),
              "stock": updateProduct[singleSlug].stock,
              "alias": updateProduct[singleSlug].alias
            }
            await Customize.updateOne({ slug: singleSlug }, { $set: data })
          }

          response.message = "updateing process start.."
          response.status = 1
          res.json(response)
          fs.rmSync(`${data.destination}${data.filename}`)
        }
      })

  } catch (err) {
    logger.error(err.message, { metadata: err });
    response.message = err.message
    return res.json(response);
  }
}
module.exports = { userUpload, productImport, subproduct }