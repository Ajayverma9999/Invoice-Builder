import mongoose from 'mongoose';


const { Schema } = mongoose;

const SettingSchema = new Schema(
  {
    key: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "can't be blank"]
    },
    value: {
      type: String,
    },
    orderby: {
      type: Number,
    },
    halptext: {
      type: String,
    },
    filter: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true
    },
    offers: [{
      value: { type: String },
      status: { type: Boolean },
      color:{type:String},
    }],
    description: { type: String }
  }
);



SettingSchema.methods.toJSON = function () {

  return {
    id: this._id,
    key: this.key,
    name: this.name,
    value: this.value,
    orderby: this.orderby,
    halptext: this.halptext,
    filter: this.filter,
    status: this.status,
    offers: this.offers,
    description: this.description
  };
};



const Setting = mongoose.model('Setting', SettingSchema);

export default Setting;