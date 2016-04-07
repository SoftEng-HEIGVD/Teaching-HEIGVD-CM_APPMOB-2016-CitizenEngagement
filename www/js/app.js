// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('FixYourStreet', ['ionic', 'FixYourStreet.auth', 'leaflet-directive', 'FixYourStreet.constants', 'FixYourStreet.listIssue', 'FixYourStreet.map','yaru22.angular-timeago', 'ionic-native-transitions'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    .state('home', {
                        url: '/home',
                        controller: 'MapController',
                        templateUrl: 'templates/home.html'
                    })

                    .state('commentsList', {
                        url: '/commentsList/:issueId',
                        controller: 'ListCtrl',
                        templateUrl: 'templates/commentsList.html'
                    })

                    .state('newComment', {
                        url: '/newComment/:issueId',
                        templateUrl: 'templates/newComment.html',
                        controller: 'newComment'
                    })

                    .state('fullImg', {
                        url: '/fullImg',
                        params:{
                          imageUrl: null,
                        },
                        nativeTransitions: {
                          "type": "fade",
                          "duration":  500,
                        },
                        templateUrl: 'templates/fullImg.html',
                        controller:function($scope, $stateParams){
                          $scope.imageUrl = $stateParams.imageUrl;
                        }
                    })

                    .state('newIssue', {
                        url: '/newIssue',
                        templateUrl: 'templates/newIssue.html'
                    })

                    .state('issueDetails', {
                        url: '/issueDetails/:issueId',
                        controller: 'issueDetails',
                        templateUrl: 'templates/issueDetails.html'
                    })

                    .state('issueList', {
                        url: '/issueList',
                        templateUrl: 'templates/issueList.html'
                    })

                    .state('login', {
                        url: '/login',
                        controller: 'LoginCtrl',
                        templateUrl: 'templates/login.html'
                    })

                    ;




            // Define the default state (i.e. the first screen displayed when the app opens).
            $urlRouterProvider.otherwise(function ($injector) {
                $injector.get('$state').go('home'); // Go to the new issue tab by default.
            });
        })

        .run(function (AuthService, $rootScope, $state) {

            // Listen for the $stateChangeStart event of AngularUI Router.
            // This event indicates that we are transitioning to a new state.
            // We have the possibility to cancel the transition in the callback function.
            $rootScope.$on('$stateChangeStart', function (event, toState) {

                // If the user is not logged in and is trying to access another state than "login"...
                if (!AuthService.currentUserId && toState.name != 'login') {

                    // ... then cancel the transition and go to the "login" state instead.
                    event.preventDefault();
                    $state.go('login');
                }
            });
        })


        //Controller pour la cr�ation des issues
        .controller("IssueCtrl", function (apiUrl, $scope, $http, $filter) {
            $scope.inputs = [{
                    value: null
                }];

            $scope.addInput = function () {
                console.log("new input");
                $scope.inputs.push({
                    value: null
                });
            }

            $scope.submitIssue = function () {
                console.log($scope.tagValue);
                $http({
                    method: 'GET',
                    url: apiUrl + '/issueTypes',
                })
                        .success(function (allType) {
                            var myFilteredType = $filter('filter')(allType, {name: $scope.type});
                            var typeId = myFilteredType[0].id;
                            $http({
                                method: 'GET',
                                url: apiUrl + '/issueTypes/' + typeId,
                            })
                                    .success(function (typeChoosen) {
                                        var newIssue = {
                                            description: $scope.description,
                                            tags: $scope.tagValue,
                                            issueTypeId: typeChoosen.id,
                                            lat: "46.780806678050126",
                                            lng: "6.630673501428493",
                                            imageUrl: "https://departmentfortransport.files.wordpress.com/2014/02/bb2-vzyimaaw3cx-large.jpg",
                                        }
                                        $http({
                                            method: 'POST',
                                            url: apiUrl + '/issues',
                                            data: newIssue
                                        })
                                                .success(function (createdIssue) {
                                                    console.log(createdIssue);
                                                },
                                                        function error() {
                                                            console.log("Erreur pas encore faite");
                                                        });
                                    },
                                            function error() {
                                                console.log("Erreur pas encore faite");
                                            });
                        });
            }

            $scope.removeInput = function (index) {
                $scope.inputs.splice(index, 1);
            }

        })


        //controller pour les tags (je n'y ai pas touch�)
        .controller("TagsCtrl", function ($scope) {
            $scope.inputs = [{
                    value: null
                }];

            $scope.addInput = function () {
                console.log("new input");
                $scope.inputs.push({
                    value: null
                });
            }

            $scope.removeInput = function (index) {
                $scope.inputs.splice(index, 1);
            }
        })


        //controller pour cr�er un nouveau commment
        .controller("newComment", function ($scope, $stateParams, $state, $http, apiUrl) {
            $scope.inputs = [{
                    value: null
                }];

            $scope.goToNewComment = function (issue) {
                $state.go("newComment", {issueId: issue.id});
            };

            $scope.createComment = function () {
                var comment = {
                    type: "comment",
                    payload: {
                        text: $scope.someText
                    }
                }
                $http({
                    method: 'POST',
                    url: apiUrl + '/issues/' + $stateParams.issueId + '/actions',
                    data: comment,
                    headers: {
                        'x-sort': 'updatedOn'
                    }
                })
                        .success(function (createdComment) {
                            console.log(createdComment);
                        },
                                function error() {
                                    console.log("Erreur pas encore faite");
                                });
            }
        })



        //controller pour affiche les details d'une issue
        .controller('issueDetails', function (apiUrl, $http, $scope, $stateParams, $ionicLoading,$log, $state, geolocation, IssueService, ReverseGeocoding, mapboxMapId, mapboxAccessToken) {
            // The $ionicView.beforeEnter event happens every time the screen is displayed.
            $scope.$on('$ionicView.beforeEnter', function () {
                // Re-initialize the user object every time the screen is displayed.
                // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
                $scope.issues = {};
            });
            $scope.getAreaIssues = function () {
                $http({
                    method: 'GET',
                    url: apiUrl + '/issues/' +$stateParams.issueId ,
                }).success(function (issue) {
                    $scope.issue = issue;
                }).error(function () {
                    $scope.error = 'Could not retrieve Issues.';
                });
            };
            $scope.getAreaIssues();


            $ionicLoading.show({
                template: 'Loading geolocation...',
                delay: 750
            });
            geolocation.getLocation().then(function(data) {
              $scope.mapCenter.lat = data.coords.latitude;
              $scope.mapCenter.lng = data.coords.longitude;
              $scope.mapCenter.zoom = 17;
              $ionicLoading.hide();
            }, function(error) {
              $ionicLoading.hide();
              $log.error("Could not get location: " + error);
            });

            var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
            mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
            $scope.mapDefaults = {
              tileLayer: mapboxTileLayer
            };
            $scope.mapCenter = {
              lat: 51.48,
              lng: 0,
              zoom:17
            };

            $scope.$on('leafletDirectiveMap.move', function(event){


              //console.log(leafletBoundsHelpers);

            });


            $scope.mapMarkers = [];

            IssueService.getAllIssuesArea(function(issues) {
                  $scope.issues = issues;
                  angular.forEach($scope.issues, function(issue) {

                      $scope.mapMarkers.push({
                          lat: issue.lat,
                          lng: issue.lng,
                          id: issue.id
                      });
                  });

           }, function() {}, null);

           $scope.$on('leafletDirectiveMarker.click', function(e, args) {
             $state.go("issueDetails", { issueId: args.leafletEvent.target.options.id });
            });


            ReverseGeocoding.getPlaces(function(result) {
                  $scope.resultPlaces = result.features;
                  angular.forEach($scope.resultPlaces, function(place) {

                      console.log(place.place_name);
                  });

            }, function() {}, null);

        })


        //controller pour afficher la liste des commentaires
        .controller('ListCtrl', function ($scope, $stateParams, $http, apiUrl) {
            // The $ionicView.beforeEnter event happens every time the screen is displayed.
            $scope.$on('$ionicView.beforeEnter', function () {
                // Re-initialize the user object every time the screen is displayed.
                // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
                $scope.issues = {};
            });
                $http({
                    method: 'GET',
                    url: apiUrl + '/issues/' + $stateParams.issueId,
                }).success(function (issue) {
                    $scope.issue = issue;
                }).error(function () {
                    $scope.error = 'Could not retrieve Issues.';
                });
        })
