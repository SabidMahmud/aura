module.exports = {

"[project]/.next-internal/server/app/api/auth/signup/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/models/User.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// User schema definition
const userSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    // Authentication fields
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: function() {
            return !this.googleId; // Required only if not using OAuth
        },
        unique: true,
        minlength: 3,
        trim: true,
        match: /^[a-zA-Z0-9_]+$/
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Required only if not using OAuth
        },
        minlength: 8
    },
    // OAuth fields
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    // Profile information
    name: {
        type: String,
        trim: true
    },
    avatar: {
        type: String // URL to profile image
    },
    // Onboarding status
    isOnboardingComplete: {
        type: Boolean,
        default: false
    },
    // User preferences
    timezone: {
        type: String,
        default: 'UTC'
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    },
    // Privacy and terms
    acceptedTermsAt: {
        type: Date
    },
    privacyPolicyAcceptedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});
// Indexes for performance
userSchema.index({
    email: 1
});
userSchema.index({
    googleId: 1
});
userSchema.index({
    username: 1
});
userSchema.index({
    createdAt: -1
});
// Virtual for getting user's full display name
userSchema.virtual('displayName').get(function() {
    return this.name || this.username || this.email.split('@')[0];
});
// Ensure virtual fields are included in JSON
userSchema.set('toJSON', {
    virtuals: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', userSchema);
}),
"[project]/models/Metric.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Metric schema definition
const metricSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    // Scale configuration
    minValue: {
        type: Number,
        default: 1
    },
    maxValue: {
        type: Number,
        default: 5
    },
    // Labels for scale points (optional)
    scaleLabels: {
        type: Map,
        of: String,
        default: new Map()
    },
    // Color for UI display
    color: {
        type: String,
        default: '#3B82F6' // Default blue
    },
    // Order for display
    sortOrder: {
        type: Number,
        default: 0
    },
    // Active status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Compound index for user's metrics
metricSchema.index({
    userId: 1,
    sortOrder: 1
});
metricSchema.index({
    userId: 1,
    isActive: 1
});
// Ensure metric names are unique per user
metricSchema.index({
    userId: 1,
    name: 1
}, {
    unique: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Metric || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Metric', metricSchema);
}),
"[project]/models/Tag.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Tag schema definition
const tagSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200
    },
    // Category for grouping tags
    category: {
        type: String,
        trim: true,
        maxlength: 30,
        default: 'General'
    },
    // Color for UI display
    color: {
        type: String,
        default: '#10B981' // Default green
    },
    // Icon or emoji for display
    icon: {
        type: String,
        maxlength: 10
    },
    // Order for display
    sortOrder: {
        type: Number,
        default: 0
    },
    // Usage statistics
    usageCount: {
        type: Number,
        default: 0
    },
    lastUsedAt: {
        type: Date
    },
    // Active status
    isActive: {
        type: Boolean,
        default: true
    },
    // AI extraction keywords (for journal parsing)
    keywords: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ]
}, {
    timestamps: true
});
// Compound indexes for user's tags
tagSchema.index({
    userId: 1,
    sortOrder: 1
});
tagSchema.index({
    userId: 1,
    isActive: 1
});
tagSchema.index({
    userId: 1,
    category: 1
});
tagSchema.index({
    userId: 1,
    usageCount: -1
});
// Ensure tag names are unique per user
tagSchema.index({
    userId: 1,
    name: 1
}, {
    unique: true
});
// Text index for keyword search
tagSchema.index({
    name: 'text',
    keywords: 'text'
});
// Method to increment usage count
tagSchema.methods.incrementUsage = function() {
    this.usageCount++;
    this.lastUsedAt = new Date();
    return this.save();
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Tag || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Tag', tagSchema);
}),
"[project]/models/ActionLog.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// ActionLog schema definition
const actionLogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    tagId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Tag',
        required: true
    },
    // When the action occurred
    loggedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Date in YYYY-MM-DD format for easy querying
    date: {
        type: String,
        required: true
    },
    // How the action was logged
    source: {
        type: String,
        enum: [
            'manual',
            'journal',
            'api'
        ],
        default: 'manual'
    },
    // Additional context (optional)
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Intensity or rating (optional)
    intensity: {
        type: Number,
        min: 1,
        max: 5
    },
    // Duration in minutes (optional)
    duration: {
        type: Number,
        min: 0
    },
    // Location or context (optional)
    context: {
        type: String,
        trim: true,
        maxlength: 100
    },
    // Reference to journal entry if logged via AI
    journalEntryId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'JournalEntry'
    }
}, {
    timestamps: true
});
// Indexes for efficient querying
actionLogSchema.index({
    userId: 1,
    date: -1
});
actionLogSchema.index({
    userId: 1,
    tagId: 1,
    date: -1
});
actionLogSchema.index({
    userId: 1,
    loggedAt: -1
});
actionLogSchema.index({
    tagId: 1,
    date: -1
});
// Compound index for analytics queries
actionLogSchema.index({
    userId: 1,
    date: 1,
    tagId: 1
});
// Pre-save middleware to set the date field
actionLogSchema.pre('save', function(next) {
    if (this.loggedAt) {
        // Convert loggedAt to YYYY-MM-DD format
        const date = new Date(this.loggedAt);
        this.date = date.toISOString().split('T')[0];
    }
    next();
});
// Static method to get actions for a date range
actionLogSchema.statics.getActionsForDateRange = function(userId, startDate, endDate) {
    return this.find({
        userId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).populate('tagId').sort({
        loggedAt: -1
    });
};
// Static method to get daily action counts
actionLogSchema.statics.getDailyActionCounts = function(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    return this.aggregate([
        {
            $match: {
                userId: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Types.ObjectId(userId.toString()),
                date: {
                    $gte: startDateStr
                }
            }
        },
        {
            $group: {
                _id: '$date',
                count: {
                    $sum: 1
                },
                tags: {
                    $addToSet: '$tagId'
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        }
    ]);
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ActionLog || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('ActionLog', actionLogSchema);
}),
"[project]/models/DailyRating.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// DailyRating schema definition
const dailyRatingSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Date in YYYY-MM-DD format
    date: {
        type: String,
        required: true
    },
    // Map of metricId to rating value
    ratings: {
        type: Map,
        of: {
            metricId: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
                ref: 'Metric',
                required: true
            },
            value: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            notes: {
                type: String,
                trim: true,
                maxlength: 200
            }
        },
        required: true
    },
    // Overall notes for the day
    dayNotes: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    // When the rating was submitted
    submittedAt: {
        type: Date,
        default: Date.now
    },
    // Mood tracking (optional quick rating)
    overallMood: {
        type: Number,
        min: 1,
        max: 5
    },
    // Energy level (optional quick rating)
    overallEnergy: {
        type: Number,
        min: 1,
        max: 5
    },
    // Sleep quality from previous night
    sleepQuality: {
        type: Number,
        min: 1,
        max: 5
    },
    sleepHours: {
        type: Number,
        min: 0,
        max: 24
    }
}, {
    timestamps: true
});
// Compound unique index to ensure one rating per user per day
dailyRatingSchema.index({
    userId: 1,
    date: 1
}, {
    unique: true
});
// Index for date range queries
dailyRatingSchema.index({
    userId: 1,
    date: -1
});
// Index for analytics queries
dailyRatingSchema.index({
    userId: 1,
    submittedAt: -1
});
// Static method to get ratings for a date range
dailyRatingSchema.statics.getRatingsForDateRange = function(userId, startDate, endDate) {
    return this.find({
        userId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({
        date: -1
    });
};
// Static method to get average ratings for metrics
dailyRatingSchema.statics.getAverageRatings = function(userId, metricId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];
    return this.aggregate([
        {
            $match: {
                userId: new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Types.ObjectId(userId.toString()),
                date: {
                    $gte: startDateStr
                }
            }
        },
        {
            $addFields: {
                ratingsArray: {
                    $objectToArray: '$ratings'
                }
            }
        },
        {
            $unwind: '$ratingsArray'
        },
        {
            $match: {
                'ratingsArray.v.metricId': new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Types.ObjectId(metricId.toString())
            }
        },
        {
            $group: {
                _id: '$userId',
                averageRating: {
                    $avg: '$ratingsArray.v.value'
                },
                count: {
                    $sum: 1
                },
                minRating: {
                    $min: '$ratingsArray.v.value'
                },
                maxRating: {
                    $max: '$ratingsArray.v.value'
                }
            }
        }
    ]);
};
// Instance method to get rating for a specific metric
dailyRatingSchema.methods.getRatingForMetric = function(metricId) {
    const metricIdStr = metricId.toString();
    return this.ratings.get(metricIdStr);
};
// Instance method to set rating for a specific metric
dailyRatingSchema.methods.setRatingForMetric = function(metricId, value, notes = '') {
    const metricIdStr = metricId.toString();
    this.ratings.set(metricIdStr, {
        metricId: metricId,
        value: value,
        notes: notes
    });
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.DailyRating || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('DailyRating', dailyRatingSchema);
}),
"[project]/models/Insight.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// StatisticalData sub-schema
const statisticalDataSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    avgWithTag: {
        type: Number,
        required: true
    },
    avgWithoutTag: {
        type: Number,
        required: true
    },
    daysWithTag: {
        type: Number,
        required: true
    },
    daysWithoutTag: {
        type: Number,
        required: true
    },
    analysisStartDate: {
        type: String,
        required: true
    },
    analysisEndDate: {
        type: String,
        required: true
    }
}, {
    _id: false
});
// Insight schema definition
const insightSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The tag that was analyzed
    tagId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Tag',
        required: true
    },
    // The metric that was correlated
    metricId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'Metric',
        required: true
    },
    // Type of correlation found
    correlationType: {
        type: String,
        enum: [
            'positive',
            'negative',
            'neutral'
        ],
        required: true
    },
    // Strength of correlation (0-1)
    correlationStrength: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    },
    // Statistical significance (p-value)
    pValue: {
        type: Number,
        min: 0,
        max: 1
    },
    // AI-generated insight content
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    // Short title for the insight
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    // Statistical data supporting the insight
    statisticalData: {
        type: statisticalDataSchema,
        required: true
    },
    // Insight status
    status: {
        type: String,
        enum: [
            'active',
            'dismissed',
            'archived'
        ],
        default: 'active'
    },
    // User interaction
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    userRating: {
        type: Number,
        min: 1,
        max: 5
    },
    userFeedback: {
        type: String,
        maxlength: 500
    },
    // Priority for display (higher = more important)
    priority: {
        type: Number,
        default: 0
    },
    // Tags for categorization
    categories: [
        {
            type: String,
            enum: [
                'health',
                'productivity',
                'mood',
                'energy',
                'sleep',
                'exercise',
                'nutrition',
                'social',
                'other'
            ]
        }
    ]
}, {
    timestamps: true
});
// Indexes for efficient querying
insightSchema.index({
    userId: 1,
    createdAt: -1
});
insightSchema.index({
    userId: 1,
    status: 1,
    priority: -1
});
insightSchema.index({
    userId: 1,
    tagId: 1,
    metricId: 1
});
insightSchema.index({
    userId: 1,
    isRead: 1
});
// Compound index to prevent duplicate insights
insightSchema.index({
    userId: 1,
    tagId: 1,
    metricId: 1,
    correlationType: 1
}, {
    unique: true
});
// Static method to get insights for user
insightSchema.statics.getInsightsForUser = function(userId, status = 'active') {
    return this.find({
        userId,
        status
    }).populate('tagId', 'name color icon').populate('metricId', 'name color').sort({
        priority: -1,
        createdAt: -1
    });
};
// Static method to get unread insights count
insightSchema.statics.getUnreadCount = function(userId) {
    return this.countDocuments({
        userId,
        isRead: false,
        status: 'active'
    });
};
// Instance method to mark as read
insightSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};
// Instance method to dismiss insight
insightSchema.methods.dismiss = function() {
    this.status = 'dismissed';
    return this.save();
};
// Instance method to get impact description
insightSchema.methods.getImpactDescription = function() {
    const diff = Math.abs(this.statisticalData.avgWithTag - this.statisticalData.avgWithoutTag);
    const percentage = (diff / this.statisticalData.avgWithoutTag * 100).toFixed(1);
    if (this.correlationType === 'positive') {
        return `${percentage}% higher on average`;
    } else if (this.correlationType === 'negative') {
        return `${percentage}% lower on average`;
    }
    return 'No significant difference';
};
// Virtual for correlation description
insightSchema.virtual('correlationDescription').get(function() {
    const strength = this.correlationStrength;
    if (strength >= 0.7) return 'Strong';
    if (strength >= 0.5) return 'Moderate';
    if (strength >= 0.3) return 'Weak';
    return 'Very Weak';
});
// Ensure virtual fields are included in JSON
insightSchema.set('toJSON', {
    virtuals: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Insight || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Insight', insightSchema);
}),
"[project]/models/JournalEntry.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// JournalEntry schema definition
const journalEntrySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Original journal text
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    // Date of the entry
    date: {
        type: String,
        required: true
    },
    // Entry metadata
    entryDate: {
        type: Date,
        default: Date.now
    },
    // Mood/sentiment analysis (optional)
    sentiment: {
        score: {
            type: Number,
            min: -1,
            max: 1
        },
        label: {
            type: String,
            enum: [
                'very_negative',
                'negative',
                'neutral',
                'positive',
                'very_positive'
            ]
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1
        }
    },
    // AI processing status
    aiProcessingStatus: {
        type: String,
        enum: [
            'pending',
            'processing',
            'completed',
            'failed'
        ],
        default: 'pending'
    },
    // AI extracted tags
    extractedTags: [
        {
            tagId: {
                type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
                ref: 'Tag'
            },
            confidence: {
                type: Number,
                min: 0,
                max: 1
            },
            extractedText: {
                type: String
            }
        }
    ],
    // AI response metadata
    aiResponse: {
        model: String,
        processingTime: Number,
        tokensUsed: Number,
        rawResponse: String
    },
    // Error information if AI processing failed
    processingError: {
        message: String,
        code: String,
        timestamp: Date
    },
    // Entry tags/categories
    categories: [
        {
            type: String,
            enum: [
                'daily',
                'reflection',
                'goals',
                'gratitude',
                'challenges',
                'insights',
                'other'
            ]
        }
    ],
    // Privacy settings
    isPrivate: {
        type: Boolean,
        default: true
    },
    // Word count for analytics
    wordCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// Indexes for efficient querying
journalEntrySchema.index({
    userId: 1,
    date: -1
});
journalEntrySchema.index({
    userId: 1,
    entryDate: -1
});
journalEntrySchema.index({
    userId: 1,
    aiProcessingStatus: 1
});
// Text index for searching journal content
journalEntrySchema.index({
    content: 'text'
});
// Pre-save middleware to calculate word count and set date
journalEntrySchema.pre('save', function(next) {
    // Calculate word count
    this.wordCount = this.content.trim().split(/\s+/).length;
    // Set date if not provided
    if (!this.date) {
        this.date = new Date().toISOString().split('T')[0];
    }
    next();
});
// Static method to get entries for date range
journalEntrySchema.statics.getEntriesForDateRange = function(userId, startDate, endDate) {
    return this.find({
        userId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({
        date: -1
    });
};
// Static method to get entries pending AI processing
journalEntrySchema.statics.getPendingProcessing = function() {
    return this.find({
        aiProcessingStatus: {
            $in: [
                'pending',
                'processing'
            ]
        }
    }).sort({
        entryDate: 1
    });
};
// Instance method to mark as processing
journalEntrySchema.methods.markAsProcessing = function() {
    this.aiProcessingStatus = 'processing';
    return this.save();
};
// Instance method to mark processing as completed
journalEntrySchema.methods.markProcessingCompleted = function(extractedTags, aiResponse) {
    this.aiProcessingStatus = 'completed';
    this.extractedTags = extractedTags;
    this.aiResponse = aiResponse;
    return this.save();
};
// Instance method to mark processing as failed
journalEntrySchema.methods.markProcessingFailed = function(error) {
    this.aiProcessingStatus = 'failed';
    this.processingError = {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date()
    };
    return this.save();
};
// Instance method to get summary
journalEntrySchema.methods.getSummary = function(maxLength = 100) {
    if (this.content.length <= maxLength) {
        return this.content;
    }
    return this.content.substring(0, maxLength).trim() + '...';
};
// Virtual for getting readable processing status
journalEntrySchema.virtual('processingStatusDisplay').get(function() {
    const statusMap = {
        'pending': 'Waiting for processing',
        'processing': 'Analyzing entry...',
        'completed': 'Analysis complete',
        'failed': 'Processing failed'
    };
    return statusMap[this.aiProcessingStatus] || 'Unknown status';
});
// Ensure virtual fields are included in JSON
journalEntrySchema.set('toJSON', {
    virtuals: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.JournalEntry || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('JournalEntry', journalEntrySchema);
}),
"[project]/models/index.ts [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

// Export all models and their types
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Metric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Metric.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Tag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Tag.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$ActionLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/ActionLog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$DailyRating$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/DailyRating.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Insight$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Insight.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$JournalEntry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/JournalEntry.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/models/index.ts [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Metric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Metric.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Tag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Tag.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$ActionLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/ActionLog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$DailyRating$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/DailyRating.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Insight$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Insight.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$JournalEntry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/JournalEntry.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/models/index.ts [app-route] (ecmascript) <locals>");
}),
"[project]/models/index.ts [app-route] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ActionLog": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$ActionLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "DailyRating": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$DailyRating$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "Insight": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Insight$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "JournalEntry": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$JournalEntry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "Metric": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Metric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "Tag": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Tag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    "User": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
});
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Metric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Metric.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Tag$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Tag.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$ActionLog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/ActionLog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$DailyRating$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/DailyRating.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Insight$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Insight.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$JournalEntry$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/JournalEntry.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/models/index.ts [app-route] (ecmascript) <locals>");
}),
"[project]/app/api/auth/signup/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/models/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i("[project]/models/index.ts [app-route] (ecmascript) <exports>");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
;
;
;
;
async function POST(req) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__["connect"])();
    try {
        const { username, email, password } = await req.json();
        // Basic validation
        if (!username || !email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'All fields are required'
            }, {
                status: 400
            });
        }
        if (password.length < 8) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Password must be at least 8 characters long'
            }, {
                status: 400
            });
        }
        // Check if user already exists
        const existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            $or: [
                {
                    email
                },
                {
                    username
                }
            ]
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'User with that email or username already exists'
            }, {
                status: 409
            });
        }
        // Hash password
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
        // Create new user
        const newUser = new __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        // In a real app, you'd also handle session creation/login here
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'User created successfully'
        }, {
            status: 201
        });
    } catch (error) {
        console.error(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__d4dde7c4._.js.map