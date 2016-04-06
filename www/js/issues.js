angular.module('citizen-engagement')

.controller("allIssuesCtrl", function($scope, $http, apiUrl) {

    $scope.noMoreItemsAvailable = false;
    $scope.issues = [];
    var i = 0;
    var currentPage = 0

    $scope.loadMore = function() {

        i++;
        $http({
            method: 'GET',
            url: apiUrl + '/issues',
            headers: {
                'x-pagination': currentPage + ";1"
            }
        }).success(function(issues) {
            $scope.issues = $scope.issues.concat(issues);
        });

        currentPage++;

        if ( i == 14 ) {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
})

.controller("issueCtrl", function($scope, $http, apiUrl, $stateParams) {
        var issueId = $stateParams.issueId;
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId
        }).success(function(issue) {

            $scope.issue = issue;
        });


});