angular.module('citizen-engagement.factories', [])

  /*  .factory("CameraService", function ($q) {
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
    })*/
/*    .controller('NewIssueCtrl',
        function ($scope, $http, apiUrl, GeolocServiceFla, CameraService, qimgUrl, qimgToken) {
            $scope.loadIssueTypes = function () {
                console.log("ok");
                $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {

                    $scope.issueTypes = issueTypes;

                    console.log(issueTypes[0]);

                });
            };
            $scope.loadIssueTypes();
            GeolocServiceFla.locateUser().then(function (coords) {
                console.log("lat 1:" + coords.latitude);
            });


            $scope.issue = {};

            $scope.submit = function () {

                console.log("je test")
                $http({
                    method: "POST",
                    url: qimgUrl + "/images",
                    headers: {
                        Authorization: "Bearer " + qimgToken
                    },
                    data: {
                        data: $scope.imageData
                    }
                }).success(function(data) {
                    var imageUrl = data.url;
                    $scope.issue.imageUrl = imageUrl;
                    console.log($scope.issue.imageUrl);

                    var link = apiUrl + '/issues'
                    $http.post(link, {
                        description: $scope.issue.description,
                        lng: $scope.issue.lng,
                        lat: $scope.issue.lat,
                        //imageUrl: $scope.issue.imageUrl,
                        imageUrl: $scope.issue.imageUrl,
                        issueTypeId: $scope.issue.issueTypeId,


                    }).then(function (res) {
                        console.log("0 " + $scope.issue.issueTypeId);
                        console.log("1 " + $scope.issue.description);
                        $scope.response = res.issue;
                        console.log('voilà la réponse: ' + $scope.response);
                    });

                }).error(function(error){
                    console.log("error: " + JSON.stringify(arguments));
                });



            };
            $scope.takePicture = function () {
                console.log("picture");
                CameraService.getPicture({
                    quality: 75,
                    targetWidth: 400,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.DATA_URL
                }).then(function (imageData) {
                    $scope.imageData = imageData;
                    console.log($scope.imageData);



                });



            };


        }
    )*/


    .factory('IssueService', function ($http, apiUrl) {
        var service = {

            findIssuesByUser: function () { //TODO

                return $http.get(apiUrl + '/me/issues',
                    {headers: {'x-sort': '-createdOn'}}).success(function (issues) {
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

/*    .controller('HomeController',
        function ($scope, $http, apiUrl, IssueService) {

            $scope.loadIssuesByUser = function () {
                console.log("ok my issues");

                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    console.log(issues);
                });

            }
            $scope.$on('$ionicView.beforeEnter', function () {

                $scope.loadIssuesByUser();
            });


        })*/

/*    .controller('ProfileController',
        function ($scope, $http, apiUrl, AuthService, IssueService) {

            $scope.loadUserInfo = function () {
                console.log("ok my issues");

                userId = AuthService.currentUserId;
                $http.get(apiUrl + '/users/' + userId).success(function (user) {

                    $scope.user = user;

                    console.log(user);


                });
            }


            $scope.countIssues = function () {
                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    $scope.nbIssues = issues.data.length;


                });
            };
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.issues = null;
                $scope.loadUserInfo();
                $scope.countIssues();
            });


        })*/





