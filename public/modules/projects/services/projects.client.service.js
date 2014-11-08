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
]).factory('git', ['$gitAddress', function($gitAddress) {
		return $gitAddress('gitLoad/', 
        { gitAddress: $gitAddress }, 
                           {
			update: {
				method: 'PUT'
			}
		});
	}
]);