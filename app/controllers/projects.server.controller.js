'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    git = require('git-exec'),
    fs = require('fs'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	_ = require('lodash'),
    repositories = [];

/**
 * Attempt to autoload Project info from Git
 */

exports.gitLoad = function(req, res){
    var gitAddress = req.body.gitAddress;
    var packageFile = {};
    var storagePath = '.projectcheckouts';
    
    console.log('Loading ' + gitAddress);
    
    var deleteFolderRecursive = function(path) {
        if( fs.existsSync(path) ) {
            fs.readdirSync(path).forEach(function(file,index){
                var curPath = path + '/' + file;
                if(fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    
//    gitAddress = 'git@github.com:mrsanz/developmentWorkflowApp.git';
    
    if(gitAddress === undefined){
        return res.status(400).send();
    }
    
    if(fs.existsSync(storagePath)){
        deleteFolderRecursive(storagePath);
    }
    
   
    
    git.clone(gitAddress, storagePath, function(repo) {
        if (repo !== null) {
            var obj = JSON.parse(fs.readFileSync(storagePath +'/package.json', 'utf8'));
             res.jsonp(obj);
        } else {
          return res.status(400).send();
        }
    }); 
    
                
        
//      var data = repo.exec('show', ['HEAD:package.json'], function(data) {
//          console.log( data );
//        
//      });
//        console.log(data);
//        
       
//    if(repositories[gitAddress] === undefined) {
//        packageFile = repositories[gitAddress] = git.clone(gitAddress, gitAddress).exec('show', ['HEAD:package.json']);
//    } else {
//        packageFile = repositories[gitAddress].exec('show', ['HEAD:package.json']);
//    }
    
   
};


/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	project.user = req.user;

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project ;

	project = _.extend(project , req.body);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project ;

	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) { 
	Project.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
		if (err) return next(err);
		if (! project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

