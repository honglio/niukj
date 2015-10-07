var mongoose = require('mongoose'),
    config = require('../../config/config'),
    OSS = require('aliyun-oss'),
    utils = require('../../lib/utils');

/**
 * Article Schema
 */
var ComponentSchema = new mongoose.Schema({
    color: {
        type: String
    },
    selected: {
        type: Boolean
    },
    face: {
        type: String
    },
    size: {
        type: String
    },
    style: {
        type: String
    },
    weight: {
        type: String
    },
    decoration: {
        type: String
    },
    text: {
        type: String
    },
    type: {
        type: String
    },
    x: {
        type: String
    },
    y: {
        type: String
    },
    imageType: {
        type: String
    },
    src: {
        type: String
    }
});

var SlideSchema = new mongoose.Schema({
    active: {
        type: Boolean
    },
    index: {
        type: String
    },
    selected: {
        type: Boolean
    },
    components: [ComponentSchema],
    background: {
        type: String
    },
    theme: {
        type: String
    }
});

var ArticleSchema = new mongoose.Schema({
    draft: {
        type: Boolean,
        default: true
    },
    fileName: {
        type: String,
        default: '',
        trim: true
    },
    slides: [SlideSchema],
    activeSlide: {
        active: {
            type: Boolean
        },
        index: {
            type: String
        },
        selected: {
            type: Boolean
        },
        x: {
            type: String
        },
        y: {
            type: String
        },
        components: [ComponentSchema],
        background: {
            type: String
        }
    },
    width: {
        type: String
    },
    height: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account'
    },
    comments: [{
        body: {
            type: String,
            default: ''
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'Account'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [],
    desc: {
        type: String,
        default: ''
    },
    picture: {
        name: {
            type: String,
            default: ''
        },
        src: {
            type: String,
            default: ''
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    hitCounter: {
        type: Number,
        default: 0
    },
    love: {
        type: Number,
        default: 0
    }
});

/**
 * Validations
 */

ArticleSchema.path('fileName').required(true, '课件名不能为空。');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function(next) {
    var oss = OSS.createClient(config.oss);

    // remove from the cloud too
    oss.deleteObject({
        bucket: config.oss.bucket.component,
        object: this.picture.name
    }, function(err, response) {
        console.log(err);
        if (err) {
            return next(err);
        }
        console.log(response);
        next(response.status);
    });
});

/**
 * Getters
 */

var getTags = function(tags) {
    return tags.join(',');
};

/**
 * Setters
 */

var setTags = function(tags) {
    return tags.split(',');
};

/**
 * Methods
 */

ArticleSchema.methods = {

    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @param {Function} cb
     * @api private
     */

    addComment: function(user, comment, cb) {

        this.comments.push({
            body: comment.body,
            user: user._id
        });
        // TODO: email commenter's name and comment to article writer
        this.save(cb);
    },

    /**
     * Remove comment
     *
     * @param {commentId} String
     * @param {Function} cb
     * @api private
     */

    removeComment: function(commentId, cb) {
        var index = utils.indexof(this.comments, {
            id: commentId
        });
        if (index !== -1) {
            this.comments.splice(index, 1);
        } else {
            return cb('没有找到。');
        }
        this.save(cb);
    },

    /**
     * Update desc
     *
     * @param {desc} String
     * @param {Function} cb
     * @api private
     */
    updateDesc: function(desc, cb) {
        this.desc = desc;
        this.save(cb);
    },

    /**
     * Update draft
     *
     * @param {draft} String
     * @param {Function} cb
     * @api private
     */
    updateDraft: function(draft, cb) {
        this.draft = draft;
        this.save(cb);
    },

    /**
     * Add tag
     *
     * @param {tag} String
     * @param {Function} cb
     * @api private
     */
    addTag: function(tag, cb) {
        var tags;

        if (tag) {
            tags = setTags(tag);
            if (tags.reduce) { // if tags is Array.
                this.tags = tags;
            } else { // if tags is String.
                this.tags.push(tags);
            }
        } else {
            this.tags = [];
        }

        this.save(cb);
    },

    /**
     * Add tag
     *
     * @param {tag} String
     * @param {Function} cb
     * @api private
     */
    getTag: function() {
        return getTags(this.tags);
    },

    /**
     * Remove tag
     *
     * @param {tag} String
     * @param {Function} cb
     * @api private
     */
    removeTag: function(tag, cb) {
        var index = this.tags.indexOf(tag);
        if (index !== -1) {
            this.tags.splice(index, 1);
        } else {
            return cb('没有找到。');
        }
        this.save(cb);
    }
};

/**
 * Statics
 */

ArticleSchema.statics = {

    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function(id, cb) {
        this.findOne({
                _id: id
            })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb);
    },

    /**
     * List articles
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function(options, cb) {
        var criteria = options.criteria || {};
        var fields = options.fields || null;
        var opt = options.options || {};
        this.find(criteria, fields, opt)
            .populate('user', 'profile')
            .sort({
                'createdAt': -1
            }) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },

    updateAndSave: function(id, update, cb) {
        this.findByIdAndUpdate(id, update, cb);
    }

};

mongoose.model('Article', ArticleSchema);
