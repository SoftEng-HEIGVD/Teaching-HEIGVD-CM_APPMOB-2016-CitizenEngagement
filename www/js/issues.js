angular.module('citizen-engagement')

    // Get all issues
    .controller('ListIssuesCtrl', function(apiUrl, $scope, $http){


        // Create and execute get functions
        $scope.getIssues = function() {
            $http({
                method: 'GET',
                url: apiUrl + '/issues'
            }).success(function (issues) {
                $scope.issues = issues;
            }).error(function(error) {
                console.log('an error occurred');
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        $scope.getIssues();
    })

    // Get specific issue
    .controller('GetSpecificIssueCtrl', function(apiUrl, $scope, $http,$stateParams) {
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+$stateParams.issueId
        }).success(function (issue) {
            $scope.issue = issue;
        }).error(function(error) {
            console.log("error");
        }).finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });

    })
    // Add new issue
    .controller('AddIssueCtrl', function(apiUrl, $scope, $http) {

    })

    .controller('ListMyIssuesCtrl', function(apiUrl, $scope, $http) {
        // Create and execute get functions
        $scope.getIssues = function() {
            $http({
                method: 'GET',
                url: apiUrl + '/me/issues'
            }).success(function (issues) {
                $scope.issues = issues;
            }).error(function(error) {
                console.log('an error occurred');
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        $scope.getIssues();
    })


;
