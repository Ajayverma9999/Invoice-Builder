import mongoose from 'mongoose';

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    customize: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customize'
      }
    ],
    quantity: {
      type: Number
    },
  },
  { timestamps: true }
);

CartSchema.methods.toJSON = function () {

  return {
    id: this.id,
    proudct: this.product,
    user: this.user,
    customize:this.customize,
    quantity: this.quantity,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};



const Cart = mongoose.model('Cart', CartSchema);

export default Cart;