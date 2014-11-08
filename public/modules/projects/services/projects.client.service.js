'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('git', ['$resource', function($resource) {
		return $resource('gitload/', null, {
			update: {
				method: 'PUT'
			}
		});
	}
]);