angular.module('citizen-engagement')

.controller("allIssuesCtrl", function($scope, $http, apiUrl) {
    $scope.issues = [];
    $scope.scrollEnable = true;

    var currentPage = 0;
    $scope.loadMoreIssues = function() {
        $http({
            method: 'GET',
            url: apiUrl + '/issues',
            headers: {
                'x-pagination': currentPage + ";5"
            }
        }).success(function(issues) {
            console.log(issues.length)
            if(issues.length == 0){
                $scope.scrollEnable = false;
                console.log($scope.scrollEnable);
            }
            $scope.issues = $scope.issues.concat(issues);
            });

        currentPage++;
    }


});