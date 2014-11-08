'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    created: {
		type: Date,
		default: Date.now
	},
    user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    
    
    link: {
        type: String,
		default: '',
		required: 'Please fill Project link',
		trim: true
    },
	name: {
		type: String,
		default: '',
		required: 'Please fill Project name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Project description',
		trim: true
	},
	version: {
		type: String,
		default: '',
		required: 'Please fill Project version',
		trim: true
	},
    author: {
        type: String,
		default: '',
		required: 'Please fill Project author',
		trim: true
    }
});

mongoose.model('Project', ProjectSchema);