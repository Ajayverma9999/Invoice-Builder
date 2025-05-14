import mongoose from 'mongoose';

const { Schema } = mongoose;

const InvoiceFormatSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "can't be blank"],
            index: true,
        },
        structure: {
            type: String,
            required: true,
            unique: true,
            default: "INV/{fy}/{counter}"
        },
        dateFormat:{
            type: String,
            default : "DDMMYYYY"
        },
        description: {
            type: String,
        }
    },
    { timestamps: true }
);

InvoiceFormatSchema.methods.toJSON = function () {

    return {
        id: this._id,
        name: this.name,
        structure: this.structure,
        dateFormat: this.dateFormat,
        description: this.description,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt
    };
};



const InvoiceFormat = mongoose.model('InvoiceFormat', InvoiceFormatSchema);

export default InvoiceFormat;