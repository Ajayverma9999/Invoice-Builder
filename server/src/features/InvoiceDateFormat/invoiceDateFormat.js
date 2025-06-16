import mongoose from 'mongoose';

const { Schema } = mongoose;

const InvoiceDateFormatSchema = new Schema(
    {
        formatId:{
            type: String,
            unique: true
        },
        dateFormat:{
            type: String
        },
        output: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        },
        softDelete: {
            type: Boolean, default: false
        },
        description: {
            type: String,
        }
    },
    { timestamps: true }
);

InvoiceDateFormatSchema.methods.toJSON = function () {

    return {
        id: this._id,
        dateFormat: this.dateFormat,
        status: this.status,
        softDelete: this.softDelete,
        output: this.output,
        formatId: this.formatId,
        description: this.description,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt
    };
};



const InvoiceDateFormat = mongoose.model('InvoiceDateFormat', InvoiceDateFormatSchema);

export default InvoiceDateFormat;