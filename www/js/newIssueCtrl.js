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
           /* $scote.saveImage = function(CameraService) {
                CameraService.getPicture({
                    quality: 75,
                    targetWidth: 400,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.DATA_URL
                }).then(function (imageData) {
                    // do something with imageData
                });
            };*/


        }
    )

    .factory('IssueService', function ($http, apiUrl) {
        var service = {

            findIssuesByUser: function () {

                return $http.get(apiUrl + '/me/issues',
                    {headers: {'x-sort': 'createdOn'}}).success(function (issues) {
                    console.log(issues);
                    return issues; //appel rend une promesse qui sera résolu avec les issues quand le résultat sera arrivé --> .then possible


                });

            }
        };

        return service;
    })

    .factory("CameraService", function ($q) {
        return {
            getPicture: function (options) {
                var deferred = $q.defer();
                navigator.camera.getPicture(function (result) {
                    // do any magic you need
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                }, options);
                return deferred.promise;
            }
        }
    })

    .controller('HomeController',
        function ($scope, $http, apiUrl, IssueService) {

            $scope.loadIssuesByUser = function () {
                console.log("ok my issues");

                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    console.log(issues);
                });

            }
            $scope.loadIssuesByUser();

        })

    .controller('ProfileController',
        function ($scope, $http, apiUrl, AuthService, IssueService) {

            $scope.loadUserInfo = function () {
                console.log("ok my issues");

                userId = AuthService.currentUserId;
                $http.get(apiUrl + '/users/' + userId).success(function (user) {

                    $scope.user = user;

                    console.log(user);


                });
            }
            $scope.loadUserInfo();

            $scope.countIssues = function () {
                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    $scope.nbIssues = issues.data.length;


                });
            };
            $scope.countIssues();

        })

    .controller("CameraTestController", function (CameraService) {

    });
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
