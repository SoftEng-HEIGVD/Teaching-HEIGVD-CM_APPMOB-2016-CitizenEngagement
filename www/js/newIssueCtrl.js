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

        //TODO post function
        $scope.saveIssue = function () {
            console.log("ok");
            $http.post(apiUrl + '/issues').success(function (issue) {



                console.log(issue);

            });
        };





        }
)

    .controller('HomeController',
        function ($scope, $http, apiUrl) {

            $scope.loadIssuesByUser = function () {
                console.log("ok my issues");


                $http.get(apiUrl + '/me/issues',
                    {headers: {'x-sort': 'createdOn'}}).success(function (issues) {

                    $scope.issues = issues;

                    console.log(issues);



                });
            }
            $scope.loadIssuesByUser();

        })
;


/*
TODO
{
    "description": "Integer at metus vitae erat porta pellentesque.",
    "lng": "6.651479812689227",
    "lat": "46.77227088657382",
    "imageUrl": "http://www.somewhere.localhost.localdomain",
    "issueTypeId": "54d8ae183fd30364605c81b1"
}*/
