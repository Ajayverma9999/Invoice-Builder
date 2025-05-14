import { unique } from 'joi/lib/types/array';
import mongoose from 'mongoose';

const { Schema } = mongoose;


/*
new fields
warranty/warranty procedure/ service center list
Minimum Order/Maximum Order Quantity
Weight of the items/ Dimensions of the items(L/W/D)
qty wise dicount price
*/
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"]
    },
    slug: {
      type: String, unique: true, set: (name) => name.trim().replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
    },
    // sku: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   required: [true, "can't be blank"]
    // },
    description: {
      type: String,
      default: ''
    },
    showsimilarproductions: {
      type: Boolean,
      default: true
    },
    timePeriod: {
      type: Number,
      required: true
    },
    tax_class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaxGst'
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    benefits: {
      type : Array
    },
    mrp: {
      type: Number,
      default: 0,
    },
    sale: {
      type: Number,
      default: 0
    },
    avgRating: {
      type: Number,
      default: 0
    },
    hotSelling: {
      type: Boolean,
      default: false
    },
    // Meta details
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaTags: { type: String },
    metaSchema: { type: String },
    alias: { type: String },
    softDelete: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    },
    orderby: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

ProductSchema.methods.toJSON = function () {

  return {
    id: this._id,
    name: this.name,
    slug: this.slug,
    // sku: this.sku,
    description: this.description,
    showsimilarproductions: this.showsimilarproductions,
    timePeriod: this.timePeriod,
    tax_class: this.tax_class,
    benefits: this.benefits,
    category: this.category,
    mrp: this.mrp,
    sale: this.sale,
    alias: this.alias,
    metaTitle: this.metaTitle,
    metaDescription: this.metaDescription,
    metaTags: this.metaTags,
    metaSchema: this.metaTags,
    hotSelling: this.hotSelling,
    softDelete: this.softDelete,
    status: this.status,
    avgRating: this.avgRating,
    orderby: this.orderby,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
};

// inclusive and exclusive

const Product = mongoose.model('Product', ProductSchema);

export default Product;