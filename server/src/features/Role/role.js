import mongoose from 'mongoose';

const { Schema } = mongoose;

const RoleSchema = new Schema(
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
      type:String
    },
    status: {
      type: Boolean,
      default:true
    }
  }
);

RoleSchema.methods.toJSON = function () {
  
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    slug: this.slug,
    status:this.status
  };
};



const Role = mongoose.model('Role', RoleSchema);

export default Role;