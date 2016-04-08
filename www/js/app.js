// Ionic Starter App

angular.module('citizen-engagement', ['ionic', 'citizen-engagement.auth', 'citizen-engagement.constants', 'geolocation', 'leaflet-directive'])


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
        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $rootScope.filterEnabled = toState.data && toState.data.filterEnabled;
        });

    })


    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('mainMenu', {
                url: "",
                abstract: true,
                templateUrl: "templates/menu.html"
            })
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                templateUrl: 'templates/login.html'
            })
            .state('mainMenu.issues', {
                url: '/issues',
                views: {
                    'appContent': {
                        templateUrl: "templates/issueList.html",
                        controller: "ListIssuesCtrl"
                    }
                },
                data: {
                    filterEnabled: true
                }
            })
            .state('mainMenu.myIssues', {
                url: '/myIssues',
                views: {
                    'appContent': {
                        templateUrl: "templates/myIssues.html",
                        controller: "ListMyIssuesCtrl"
                    }
                }
            })


            .state('mainMenu.takePhoto', {
                url: '/takePhoto',
                views: {
                    'appContent': {
                        templateUrl: "templates/takePhoto.html",
                        controller: "takePhotoCtrl"
                    }
                }
            })


            .state('mainMenu.newIssue', {
                url: '/newIssue',
                views: {
                    'appContent': {
                        templateUrl: "templates/newIssue.html",
                        controller: "AddIssueCtrl"
                    }
                }
            })

            .state('mainMenu.issueDetails', {
                url: '/issue/:issueId', // ?$stateParams ?
                views: {
                    'appContent': {
                        templateUrl: "templates/issueDetails.html",
                        controller: "GetSpecificIssueCtrl"
                    }
                }
            })

            .state('mainMenu.issueAddTags', {
                url: '/actions',
                views: {
                    'appContent': {
                        templateUrl: "templates/issueDetailsAddTags.html",
                        controller: "AddTagsCtrl"
                    }
                }
            })

            .state('mainMenu.issueMap', {
                url: '/issueMap',
                views: {
                    'appContent': {
                        templateUrl: "templates/issueMap.html",
                        controller: "MapCtrl"
                    }
                }
            })
        ;


        // Define the default state (i.e. the first screen displayed when the app opens).
        $urlRouterProvider.otherwise(function ($injector) {
            $injector.get('$state').go('mainMenu.issues'); // Go to the new issue tab by default.
        });
    })


    .controller('navCtrl', function ($scope, $ionicSideMenuDelegate) {
        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.menuItems = [
            {
                title: 'My issues',
                state: 'mainMenu.myIssues',
                class: 'issues-my'
            },
            {
                title: 'Issue Map',
                state: 'mainMenu.issueMap',
                class: 'issues-map'
            }, {
                title: 'All issues',
                state: 'mainMenu.issues',
                class: 'issues-all'
            }, {
                title: 'New issue',
                state: 'mainMenu.newIssue',
                class: 'issues-new'
            }, {
                title: 'Take pic',
                state: 'mainMenu.takePhoto',
                class: 'issues-new'
            }
        ];
    })

;
