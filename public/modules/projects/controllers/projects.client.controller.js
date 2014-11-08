'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'git',
	function($scope, $stateParams, $location, Authentication, Projects, git) {
		$scope.authentication = Authentication;
        $scope.displayInputFields = false;
        
		// Create new Project
		$scope.create = function() {
			// Create new Project object
			var project = new Projects ({
                link: this.projectInfo.homepage,
				name: this.projectInfo.name,
                description: this.projectInfo.description,
                version: this.projectInfo.version,
                author: this.projectInfo.author
			});
            
			// Redirect after save
			project.$save(function(response) {
				$location.path('projects/' + response._id);

				// Clear form fields
				$scope.name = '';
                $scope.description = '';
                $scope.version = '';
                $scope.author = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        $scope.loadGitProject = function () {
            //take in git address
            console.log(this.gitAddress);
            
            $scope.projectInfo = git.update({ gitAddress:this.gitAddress });
            console.log($scope.projectInfo);

            $scope.displayInputFields = true;

            
            //fetch project.json file from address
            
            //populate project fields
        };
        
		// Remove existing Project
		$scope.remove = function(project) {
			if ( project ) { 
				project.$remove();

				for (var i in $scope.projects) {
					if ($scope.projects [i] === project) {
						$scope.projects.splice(i, 1);
					}
				}
			} else {
				$scope.project.$remove(function() {
					$location.path('projects');
				});
			}
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			project.$update(function() {
				$location.path('projects/' + project._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};

		// Find existing Project
		$scope.findOne = function() {
			$scope.project = Projects.get({ 
				projectId: $stateParams.projectId
			});
		};
	}
]);