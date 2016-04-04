// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('citizen-engagement', ['citizen-engagement.auth  ', 'ionic', 'citizen-engagement.constants'])



    /*function ContentController($scope, $ionicSideMenuDelegate) {
     $scope.toggleLeft = function() {
     $ionicSideMenuDelegate.toggleLeft();
     };
     }// TODO*/


    .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'templates/login.html'
    })

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
    })


/*
.controller('Testcontroller', function($http){
    $http({
        url:'http://localhost:'
    })
})*/
