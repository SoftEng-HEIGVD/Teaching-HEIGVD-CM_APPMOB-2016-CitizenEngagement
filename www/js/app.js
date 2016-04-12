angular.module('FixYourStreet', ['ionic', 'leaflet-directive', 'FixYourStreet.auth', 'FixYourStreet.comments','FixYourStreet.constants', 'FixYourStreet.issues', 'FixYourStreet.map', 'yaru22.angular-timeago', 'ionic-native-transitions'])


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
                    controller: 'commentsList',
                    templateUrl: 'templates/commentsList.html'
                })

                .state('newComment', {
                    url: '/newComment/:issueId',
                    templateUrl: 'templates/newComment.html',
                    controller: 'newComment'
                })

                .state('fullImg', {
                    url: '/fullImg',
                    params: {
                        imageUrl: null,
                    },
                    nativeTransitions: {
                        "type": "fade",
                        "duration": 500,
                    },
                    templateUrl: 'templates/fullImg.html',
                    controller: function ($scope, $stateParams) {
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
                    controller: 'issueList',
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

        .config(function($ionicNativeTransitionsProvider){
            $ionicNativeTransitionsProvider.setDefaultOptions({
              duration: 500, // in milliseconds (ms), default 400,
              slowdownfactor: 1, // overlap views (higher number is more) or no overlap (1), default 4
              iosdelay: -2, // ms to wait for the iOS webview to update before animation kicks in, default -1
              androiddelay: -2, // same as above but for Android, default -1
              winphonedelay: -1, // same as above but for Windows Phone, default -1,
              fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
              fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
              triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
              backInOppositeDirection: true // Takes over default back transition and state back transition to use the opposite direction transition to go back
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


        // WHen an image is not found use the url provided in errSrc attribut
        .directive('errSrc', function() {
          return {
            link: function(scope, element, attrs) {
              element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                  attrs.$set('src', attrs.errSrc);
                }
              });

              attrs.$observe('ngSrc', function(value) {
                if (!value && attrs.errSrc) {
                  attrs.$set('src', attrs.errSrc);
                }
              });
            }
          }
        })



;
