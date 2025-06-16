import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Role from '../Role/role';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    userId: {
      type: String
    },
    // optional
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    companyName: {
      type: String
    },
    phone: {
      type: String,
      // required: [true, 'Phone is required.'],
      // unique: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      trim: true,
      required: [true, "can't be blank"],
    },
    // Email is optional
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
      trim: true,
      index: true
    },
    invoiceSettings: {
      templates: [{
        template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
        financialYearStart: {
          type: Date,
          default: () => {
            const curr = new Date();
            return curr.getMonth() >= 3 ? new Date(curr.getFullYear(), 3, 1) : new Date(curr.getFullYear() - 1, 3, 1);
          }
        },
        financialYearEnd: {
          type: Date,
          default: () => {
            const curr = new Date();
            return curr.getMonth() >= 3 ? new Date(curr.getFullYear() + 1, 2, 31) : new Date(curr.getFullYear(), 2, 31)
          }
        },
        invoiceNumberFormat: { type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceDateFormat' },
        resetCycle: {
          type: String,
          enum: ["yearly", "monthly", "daily", "never"]
        },
        invoicePrefix: { type: String },
        startDateInclude: {
          type: Boolean,
          defualt: true
        },
        endDateInclude: {
          type: Boolean,
          defualt: false
        },
        previousInvCount: {type: Number, default: 0}
      }],
      templateIndex: {type: Number, default: 0}
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    },
    companyAddress: [{
      gst: { type: String, default: '' },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String }
    }],
    selectedAddress: {
      type: Number, default: 0
    },
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
    invoiceSettings: this.invoiceSettings,
    role: this.role,
    userId: this.userId,
    companyAddress: this.companyAddress,
    companyName: this.companyName,
    softDelete: this.softDelete,
    status: this.status,
    token: this.token,
    selectedAddress: this.selectedAddress,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt,
  };
};

const isProduction = process.env.NODE_ENV === 'production';
const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

userSchema.methods.generateJWT = function (appversion) {

  const token = jwt.sign(
    {
      expiresIn: '365d',
      id: this._id,
      companyName: this.companyName,
      username: this.phone
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
