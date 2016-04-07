/**
 * Created by Sabine on 05.04.2016.
 */

angular.module('citizen-engagement.issueCtrl',[])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl, $state) {
            $scope.loadIssues = function() {
                console.log("ok");
                $http.get(apiUrl+'/issues',{headers: {'x-sort': 'createdOn'}}).success(function(issues) {

                    $scope.issues = issues;

                    console.log("j'ai la première issue du tableau" +issues[0]);

                });
            };
            $scope.loadIssues();

           /* $scope.loadIssueType = function () {
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
        })

    .controller("issueDetailCtrl", function($scope, $http, apiUrl, $stateParams) {
        console.log("j'arrive à récupe le paramètre" + $stateParams);
        var id = $stateParams.issueId;
        console.log('id ' + id);
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+id
        }).success(function(issue) {
            console.log("okbla");

            $scope.issue = issue;
            console.log("j'ai mon issue" + issue);

        });



    });



