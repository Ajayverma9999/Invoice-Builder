import { timestamp } from 'joi/lib/types/date';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PaymentsSchema = new Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: [true, "can't be blank"],
      index: true,
    },
    mode: {
      type: String,
    },
    // Add Wallet, Online Buy
    type: {
      type: String,
      enum: ['OnlineBuy', 'AddWallet', 'Refund'],
      default: 'OnlineBuy'
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order'
    },
    orderObject: {
      type: Object
    },
    orderPayment: {
      CURRENCY: { type: String },
      GATEWAYNAME: { type: String },
      RESPMSG: { type: String },
      BANKNAME: { type: String },
      PAYMENTMODE: { type: String },
      CUSTID: { type: String },
      MID: { type: String },
      MERC_UNQ_REF: { type: String },
      RESPCODE: { type: String },
      TXNID: { type: String },
      TXNAMOUNT: { type: String },
      ORDERID: { type: String },
      STATUS: { type: String },
      BANKTXNID: { type: String },
      TXNDATETIME: { type: String },
      TXNDATE: { type: String },
      CHECKSUMHASH: { type: String }
    },
    paymentIdentifier: {
      type: String
    },
    paymentTransaction: { type: String },
    transactionTime: { type: Date },
    reason: {
      type: String
    },
    // 0 pending, 1 fail , 2 success
    status: {
      type: Number
    }
  },
  { timestamps: true }
);

PaymentsSchema.methods.toJSON = function () {

  return {
    id: this.id,
    userid: this.userid,
    amount: this.amount,
    mode: this.mode,
    type: this.type,
    orderObject: this.orderObject,
    orderId: this.orderId,
    paymentIdentifier: this.paymentIdentifier,
    paymentTransaction: this.paymentTransaction,
    transactionTime: this.transactionTime,
    reason: this.reason,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};



const Payment = mongoose.model('Payment', PaymentsSchema);

export default Payment;