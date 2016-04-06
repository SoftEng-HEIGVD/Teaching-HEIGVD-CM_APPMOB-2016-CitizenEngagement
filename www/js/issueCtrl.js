/**
 * Created by Sabine on 05.04.2016.
 */

angular.module('citizen-engagement.issueCtrl',[])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl) {
            $scope.loadIssues = function() {
                console.log("ok");
                $http.get(apiUrl+'/issues').success(function(issues) {

                    $scope.issues = issues;

                    console.log(issues[0]);

                });
            };
            $scope.loadIssues();

            /*$scope.loadIssueType = function () {
                $http.get(apiUrl + '/issues').success(function (issues) {
                    $scope.issues = issues;
                    console.log(issueTypes[0].name);

                    index = 0;

                    while (index < issues.length)
                    {
                        console.log(issues[index].name);
                        index++;
                    }

                });
            };*/



        });
