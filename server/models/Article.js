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
        type: String
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
        type: String
    },
    index: {
        type: String
    },
    selected: {
        type: String
    },
    components: [ComponentSchema],
    background: {
        type: String
    }
});

var ArticleSchema = new mongoose.Schema({
    fileName: {
        type: String,
        default: '',
        trim: true
    },
    slides: [SlideSchema],
    activeSlide: {
        active: {
            type: String
        },
        index: {
            type: String
        },
        selected: {
            type: String
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

ArticleSchema.path('fileName').required(true, 'Article title cannot be blank');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  var oss = OSS.createClient(config.oss);

  // if there are files associated with the item, remove from the cloud too
  oss.deleteObject({
    bucket: config.oss.bucket,
    object: this.picture.name
  }, function (err , response) {
    console.log(err);
    if (err) { return next(err); }
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
     * Save article and upload image
     *
     * @param {Object} image
     * @param {Function} cb
     * @api private
     */

    uploadAndSave: function(image, cb) {
        if (!image.name || !image.src) {
            return this.save(cb);
        }

        console.log(image);
        var oss = OSS.createClient(config.oss);
        var self = this;
        console.log(oss);

        oss.putObject({
            bucket: config.oss.bucket,
            object: image.name,
            source: image.src,
            headers: {}
        }, function(err, res) {
            if (err) {
                console.log(err);
                return cb(err);
            }
            if (res) {
                console.log(res);
                return cb(res);
            }
            self.save(cb);
        });
    },

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
            return cb('not found');
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
     * Add tag
     *
     * @param {tag} String
     * @param {Function} cb
     * @api private
     */
    addTag: function(tag, cb) {
        var tags = setTags(tag);
        if (tags.reduce) {
            this.tags = tags;
        } else {
            this.tags.push(tags);
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
            return cb('not found');
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
