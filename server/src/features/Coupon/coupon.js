import mongoose from 'mongoose';

const { Schema } = mongoose;

const CouponSchema = new Schema(
  {
   code: {
      type: String,
      required: [true, "can't be blank"],
      unique: true
    },
    description: {
      type:String
    },
    type:{
      type: String,
      enum: ['amount','percentage'],
      default:'amount'
     },
    minValue: {
      type:Number,
      default:0,
    },
    amount: {
      type: Number,
      required: [true, "can't be blank"],
    },
    validupto: {
      type:Date,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    status: {
      type: Boolean,
      default: false
    }
  }
);

CouponSchema.methods.toJSON = function () {
  
  return {
    id: this._id,
    code: this.code,
    type: this.type,
    description: this.description,
    minValue:this.minValue,
    startDate: this.startDate,
    amount: this.amount,
    validupto: this.validupto,
    status:this.status
  };
};

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;