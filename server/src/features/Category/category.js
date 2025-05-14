import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    description: {
      type: String,
    },
    slug: {
        type: String, unique: true, set: (name) => name.trim().replace(/[^A-Z0-9]+/ig, "_").toLowerCase()
    },
    status: {
      type: Boolean,
      default:true
    },
    softDelete: {
        type: Boolean,
        default: false
    }
  },
  {timestamps : true}
);

CategorySchema.methods.toJSON = function () {
  
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    slug: this.slug,
    status:this.status,
    softDelete:this.softDelete,
    updatedAt: this.updatedAt,
        createdAt: this.createdAt
  };
};



const Category = mongoose.model('Category', CategorySchema);

export default Category;