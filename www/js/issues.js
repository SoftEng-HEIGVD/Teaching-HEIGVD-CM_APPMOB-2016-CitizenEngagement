angular.module('citizen-engagement')

    // Get all issues
    .controller('ListIssuesCtrl', function(apiUrl, $scope, $http){


        // Create and execute get functions
        $scope.getIssues = function() {
            $http({
                method: 'GET',
                url: apiUrl + '/issues',
                headers: {
                    "x-sort": "-createdOn",
                }
            }).success(function (issues) {
                $scope.issues = issues;
                console.log(issues);
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
    .controller('GetSpecificIssueCtrl', function(apiUrl, $scope, $state, $http, $stateParams, $ionicHistory) {

        /*if($ionicHistory.backView() && $ionicHistory.backView().stateName == 'mainMenu.newIssue') {
            $ionicHistory.clearHistory();
            //TODO: Add something to remove back button
        };*/
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
    .controller('AddIssueCtrl', function(apiUrl, $scope, $http, $state, $ionicHistory) {

        $scope.issue = {};

        $http({
            method: 'GET',
            url: apiUrl + '/issueTypes'
        }).success(function (data) {
            $scope.issueTypes = data;
        }).error(function(error) {
            console.log('Could not get types');
        });


        $scope.sendIssue = function() {
            $ionicHistory.nextViewOptions(
                {
                    disableBack: true
                });
            $http({
                method: 'POST',
                url: apiUrl + '/issues',
                data: $scope.issue
            }).success(function (data) {
                $state.go('mainMenu.issueDetails', {issueId: data.id});
            }).error(function(error){
                console.log("error...");
            });
        }

    })

    .controller('ListMyIssuesCtrl', function( apiUrl, $scope, $http) {


        $scope.getIssues = function() {
            $http({
                method: 'GET',
                url: apiUrl + '/me/issues'
            }).success(function (issues) {
                $scope.issues = issues;
            }).error(function(error) {
                console.log(error);
            }).finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        $scope.getIssues();
    })


;
