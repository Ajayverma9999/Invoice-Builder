import mongoose from 'mongoose';

const { Schema } = mongoose;

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true
    },
    slug: {
      type: String
    },
    status: {
      type: String,
      default: true
    },
    softDelete: {
      type: Boolean,
      default : false
    }
  }, { timestamps: true }
);

BrandSchema.methods.toJSON = function () {

  return {
    id: this._id,
    name: this.name,
    description: this.description,
    image: this.image,
    slug: this.slug,
    status: this.status,
    softDelete: this.softDelete,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Brand = mongoose.model('Brand', BrandSchema);

export default Brand;