import mongoose from 'mongoose';

const { Schema } = mongoose;

const TemplateSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "can't be blank"],
            index: true,
        },
        description: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        templateNo: {
            type: Number,
            unique: true,
            required: true
        },
        slug: {
            type: String
        },
        status: {
            type: Boolean,
            default: true
        },
        softDelete: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

TemplateSchema.methods.toJSON = function () {

    return {
        id: this.id,
        name: this.name,
        description: this.description,
        slug: this.slug,
        status: this.status,
        softDelete: this.softDelete,
        templateNo: this.templateNo,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt
    };
};



const Template = mongoose.model('Template', TemplateSchema);

export default Template;