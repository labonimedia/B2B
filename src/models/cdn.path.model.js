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
        },
        secreteKey: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Middleware to encrypt fields before saving to MongoDB
cdnPathSchema.pre('save', function (next) {
    if (this.isModified('accessKey')) {
        this.accessKey = encrypt(this.accessKey);
    }
    if (this.isModified('secreteKey')) {
        this.secreteKey = encrypt(this.secreteKey);
    }
    next();
});

// Middleware to decrypt fields after retrieval from MongoDB
cdnPathSchema.post('find', function (docs) {
    if (Array.isArray(docs)) {
        docs.forEach(doc => {
            if (doc.accessKey) {
                doc.accessKey = decrypt(doc.accessKey);
            }
            if (doc.secreteKey) {
                doc.secreteKey = decrypt(doc.secreteKey);
            }
        });
    } else {
        if (docs.accessKey) {
            docs.accessKey = decrypt(docs.accessKey);
        }
        if (docs.secreteKey) {
            docs.secreteKey = decrypt(docs.secreteKey);
        }
    }
});

// Middleware to decrypt fields after retrieving single document
cdnPathSchema.post('findOne', function (doc) {
    if (doc) {
        if (doc.accessKey) {
            doc.accessKey = decrypt(doc.accessKey);
        }
        if (doc.secreteKey) {
            doc.secreteKey = decrypt(doc.secreteKey);
        }
    }
});

// Add plugins for pagination and toJSON
cdnPathSchema.plugin(toJSON);
cdnPathSchema.plugin(paginate);

const CdnPath = mongoose.model('CdnPath', cdnPathSchema);

module.exports = CdnPath;
