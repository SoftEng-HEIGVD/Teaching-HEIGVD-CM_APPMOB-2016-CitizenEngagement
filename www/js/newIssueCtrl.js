angular.module('citizen-engagement.newIssueCtrl', [])
    .controller('NewIssueCtrl',
        function ($scope, $http, apiUrl) {
            $scope.loadIssueTypes = function () {
                console.log("ok");
                $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {

                    $scope.issueTypes = issueTypes;

                    console.log(issueTypes[0]);

                });
            };
            $scope.loadIssueTypes();

        });
