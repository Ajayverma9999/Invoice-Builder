import mongoose from 'mongoose';

const { Schema } = mongoose;

const PermissionSchema = new Schema(
  {
   name: {
      type: String,
      required: [true, "can't be blank"],
      index: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true
    }
  }
);

PermissionSchema.methods.toJSON = function () {
  
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    status:this.status
  };
};



const Permission = mongoose.model('Permission', PermissionSchema);

export default Permission;