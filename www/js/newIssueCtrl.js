angular.module('citizen-engagement.newIssueCtrl', [])
    .controller('NewIssueListCtrl',
        function ($scope, $http, apiUrl) {
            $scope.loadIssueTypes = function () {
                console.log("ok");
                $http.get(apiUrl + '/issueTypes').success(function (issues) {

                    $scope.issueTypes = issueTypes;

                    console.log(issues[0]);

                });
            };
            $scope.loadIssueTypes();

        });
