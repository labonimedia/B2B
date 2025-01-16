const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const crypto = require('crypto');

const encryptionKey = process.env.ENCRYPTION_KEY || '01234567890123456789012345678901'; // 32 characters key
const algorithm = 'aes-256-cbc'; // Encryption algorithm

// Helper functions for encryption and decryption
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'utf8'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (encryptedText) => {
    const [ivHex, encryptedData] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(encryptionKey, 'utf8'),
        Buffer.from(ivHex, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const cdnPathSchema = mongoose.Schema(
    {
        bucketName: {
            type: String,
            required: true,
            trim: true,
        },
        region: {
            type: String,
            required: true,
            trim: true,
        },
        accessKey: {
            type: String,
            required: true,
            trim: true,
            select: false, // Do not return this field when querying
            set: encrypt, // Automatically encrypt before saving
            get: decrypt, // Automatically decrypt when retrieving
        },
        secreteKey: {
            type: String,
            required: true,
            trim: true,
            select: false,
            set: encrypt,
            get: decrypt,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

// Middleware to ensure only one active bucket
cdnPathSchema.pre('save', async function (next) {
    const currentBucket = this;

    // If the status is set to 'active'
    if (currentBucket.status === 'active') {
        // Update all other documents to 'inactive'
        await mongoose.model('CdnPath').updateMany(
            { status: 'active', _id: { $ne: currentBucket._id } },
            { $set: { status: 'inactive' } }
        );
    }

    next();
});


// Add plugins for pagination and toJSON
cdnPathSchema.plugin(toJSON);
cdnPathSchema.plugin(paginate);

const CdnPath = mongoose.model('CdnPath', cdnPathSchema);

module.exports = CdnPath;
