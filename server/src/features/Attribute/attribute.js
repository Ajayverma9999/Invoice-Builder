import mongoose from 'mongoose';

const { Schema } = mongoose;

const AttributeSchema = new Schema(
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
    },softdelete : {
      type: Boolean,
      default:false  
    }
  }
);

AttributeSchema.methods.toJSON = function () {
  
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    slug: this.slug,
    status:this.status,
    softdelete: this.softdelete
  };
};



const Attribute = mongoose.model('Attribute', AttributeSchema);

export default Attribute;