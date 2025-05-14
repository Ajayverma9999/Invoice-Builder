import mongoose from 'mongoose';

const { Schema } = mongoose;

const InvoiceSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "can't be blank"],
            index: true,
        },
        invoiceId: {
            type: String,
            required : true
        },
        invoiceNo: {
            type: Number,
            required: true
        },
        invoiceType: {
            type: String
        },
        totalAmount: {
            type: Number
        },
        customerDetails: {
            gst: {type: String, default : ""},
            name: {type: String, default : ""},
            addres: {type: String},
            state: {type: String},
            city : {type: String},
            pincode : {type: Number}
        },
        invoiceDate: {type: Date, default : Date.now()},
        url: {
            type: String
        },
        template: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template'
        },
        content: {
            type: Object
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        startYear: {
            type: Number,
            required: true
        },
        endYear: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        }
    },
    { timestamps: true }
);

InvoiceSchema.methods.toJSON = function () {

    return {
        id: this._id,
        name: this.name,
        invoiceId: this.invoiceId,
        invoiceNo: this.invoiceNo,
        invoiceType: this.invoiceType,
        totalAmount: this.totalAmount,
        customerDetails: this.customerDetails,
        template: this.template,
        invoiceDate: this.invoiceDate,
        startYear: this.startYear,
        endYear: this.endYear,
        description: this.description,
        url: this.url,
        user: this.user,
        content: this.content,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt
    };
};



const Invoice = mongoose.model('Invoice', InvoiceSchema);

export default Invoice;