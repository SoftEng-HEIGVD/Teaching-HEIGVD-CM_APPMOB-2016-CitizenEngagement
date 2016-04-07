// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('FixYourStreet', ['ionic', 'FixYourStreet.auth', 'leaflet-directive', 'FixYourStreet.constants', 'FixYourStreet.listIssue', 'FixYourStreet.map'])

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

                    .state('issueMap', {
                        url: '/issueMap',
                        controller: 'MapController',
                        templateUrl: 'templates/issueMap.html'
                    })

                    .state('commentsList', {
                        url: '/commentsList',
                        templateUrl: 'templates/commentsList.html'
                    })

                    .state('newComment', {
                        url: '/newComment',
                        templateUrl: 'templates/newComment.html'
                    })

                    .state('fullImg', {
                        url: '/fullImg',
                        templateUrl: 'templates/fullImg.html'
                    })

                    .state('newIssue', {
                        url: '/newIssue',
                        templateUrl: 'templates/newIssue.html'
                    })

                    .state('issueDetails', {
                        url: '/issueDetails/:issueId',
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
                $injector.get('$state').go('issueMap'); // Go to the new issue tab by default.
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


         .controller("test", function (apiUrl, $scope, $http, $filter) {
             $scope.submitIssue = function (){
                 console.log($scope.test);
             }
         })

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

        .controller('newComment', function ($scope, $ionicModal) {

            $ionicModal.fromTemplateUrl('templates/newComment.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.createComment = function (u) {
                //MISSING SAVE FUNCTION
                $scope.modal.hide();
            };

        });
