import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaxGstSchema = new Schema(
  {
   name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    percentage: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true
    }
  }
);

TaxGstSchema.methods.toJSON = function () {
  
  return {
    id: this._id,
    name: this.name,
    user: this.user,
    percentage: this.percentage,
    status:this.status
  };
};



const TaxGst = mongoose.model('TaxGst', TaxGstSchema);

export default TaxGst;