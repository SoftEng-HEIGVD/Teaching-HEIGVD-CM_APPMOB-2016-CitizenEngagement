angular.module('citizen-engagement.auth', [])

    .factory('AuthService', function () {

        var service = {
            currentUserId: null,

            setUser: function (user) {
                service.currentUserId = user.userId;
            },

            unsetUser: function () {
                service.currentUserId = null;
            }
        };

        return service;
    });