import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Role from '../Role/role';
import { required } from 'joi/lib/types/date';


const { Schema } = mongoose;

const userSchema = new Schema(
  {
    customerId:{
      type:String
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
      default : ""
    },
    phone: {
      type: String,
      required: [true, 'Phone is required.'],
      unique: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      trim: true,
      required: [true, "can't be blank"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
      trim: true,
      index: true,
      set: (email) => email.toLowerCase()
    },
    spacialuser: {
      type: Boolean,
      default: false
    },
    discount: {
      type: Number,
      default: 0
    },
    wallet: {
      type: Number
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    },
    address: {
      type: String 
    },
    gst: { type: String, default: '' },
    shippingAddress: [{
      firstName: { type: String },
      lastName: { type: String },
      transportName: { type: String, required: true},
      marka: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      companyName: { type: String},
      gst: { type: String, default: '' },
      addressline1: { type: String },
      addressline2: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String }
    }],
    billingAddress: [{
      firstName: { type: String },
      lastName: { type: String },
      transportName: { type: String, required: true},
      marka: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      companyName: { type: String},
      gst: { type: String, default: '' },
      addressline1: { type: String },
      addressline2: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String }
    }],
    softDelete: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String
    },
    companyName: {
      type: String, default: "",
      required: true
    },
    verified: {
      type: Boolean,
      default : false
    }
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    password: this.password,
    phone: this.phone,
    email: this.email,
    wallet: this.wallet,
    role: this.role,
    customerId:this.customerId,
    shippingAddress:this.shippingAddress,
    billingAddress:this.billingAddress,
    address: this.address,
    gst: this.gst,
    softDelete: this.softDelete,
    status: this.status,
    token: this.token,
    companyName: this.companyName,
    spacialuser: this.spacialuser,
    wallet: this.wallet,
    verified: this.verified,
    discount: this.discount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,

  };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function (appversion) {

  const token = jwt.sign(
    {
      expiresIn: '12h',
      id: this._id,
      provider: this.provider,
      username: this.phone,
    },
    secretOrKey,
  );

  //webtoken
  let updateToken = {};
  if (appversion) {
    updateToken = { "token": token };
  }
  else {
    updateToken = { "token": token }
  }

  User.updateOne({ "_id": this._id }, { $set: updateToken }).exec();
  // todo to save token

  return token;
};


userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }

      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.getUserWithRole = async (newUser) => {

  let user = await User.findById(newUser._id).populate('role').exec();

  return user;
};

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// const delay = (t, ...vs) => new Promise(r => setTimeout(r, t, ...vs)) or util.promisify(setTimeout)

export async function hashPassword(password) {
  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      else resolve(hash);
    });
  });

  return hashedPassword;
}

export const validateUser = (user) => {
  const schema = {
    username: Joi.string().required(),
    password: Joi.required(),
  };

  return Joi.validate(user, schema);
};

const User = mongoose.model('User', userSchema);

export default User;
