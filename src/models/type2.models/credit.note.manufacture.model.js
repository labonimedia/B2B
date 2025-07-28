const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const creditNoteSchema = new mongoose.Schema(
    {
        creditNoteNumber: {
            type: String,
            unique: true,
            required: true,
        },
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
            required: true,
        },
        createdByEmail: {
            type: String,
            required: true,
        },
        createdByName: String,

        sender: {
            email: String,
            fullName: String,
            companyName: String,
            contactNumber: String,
        },
        receiver: {
            email: String,
            fullName: String,
            companyName: String,
            contactNumber: String,
        },

        set: [
            {
                designNumber: String,
                hsnCode: {
                    type: String,
                },
                hsnGst: {
                    type: String,
                },
                size: String,
                color: String,
                quantity: Number,
                price: Number,
                totalAmount: Number, // price * quantity
                reason: String,
            }
        ],

        totalCreditAmount: {
            type: Number,
            required: true,
        },

        used: {
            type: Boolean,
            default: false,
        },

        usedInInvoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
        },

        usedAt: {
            type: Date,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

creditNoteSchema.plugin(toJSON);
creditNoteSchema.plugin(paginate);

const ManufactureCreditNote = mongoose.model('ManufactureCreditNote', creditNoteSchema);

module.exports = ManufactureCreditNote;
