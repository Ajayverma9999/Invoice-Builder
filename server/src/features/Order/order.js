import mongoose from 'mongoose';

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    orderid: {
      type: String,
      required: [true, 'Order id is required']
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    totalmrpprice: {
      type: Number
    },
    totalsaleprice: {
      type: Number
    },
    totaldiscount: {
      type: Number, default : 0
    },
    totalTaxAmount: {
      type: Number
    },
    // If total payble amount is equal totalPaidAmount then Admin can complete mark this order other wise can't.
    totalPaybleAmount: {
      type: Number
    },
    totalPaidAmount: {
      type: Number, default : 0
    },
    payment: {
      type: Number
    },
    orderMode: {
      type: String, default: "online"
    },
    razorpayOrderId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    status: {
      type: String,
      enum : ["Pending", "Completed", "Failed"],
      default: "Pending"
    },
    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      companyName: { type: String },
      gst: { type: String, default: '' },
      email: { type: String },
      phone: { type: String, default: '' },
      addressline1: { type: String },
      addressline2: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String }
    },
    billingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      companyName: { type: String },
      gst: { type: String, default: '' },
      email: { type: String },
      phone: { type: String },
      addressline1: { type: String },
      addressline2: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String }
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Payment'
    },
    transactionDetail: {
      transactionId : {type: String},
      vpa: {type: String},
      email: {type: String},
      contact: {type: String},
      
    }
  },
  { timestamps: true }
);

OrderSchema.methods.toJSON = function () {

  return {
    id: this._id,
    orderid: this.orderid,
    item: this.item,
    totalmrpprice: this.totalmrpprice,
    totalsaleprice: this.totalsaleprice,
    totaldiscount: this.totaldiscount,
    totalTaxAmount: this.totalTaxAmount,
    totalPaybleAmount: this.totalPaybleAmount,
    payment: this.payment,
    razorpayOrderId: this.razorpayOrderId,
    user: this.user,
    status: this.status,
    coupon: this.coupon,
    shippingAddress: this.shippingAddress,
    billingAddress: this.billingAddress,
    orderMode: this.orderMode,
    paymentId: this.paymentId,
    transactionDetail: this.transactionDetail,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Order = mongoose.model('Order', OrderSchema);

export default Order;