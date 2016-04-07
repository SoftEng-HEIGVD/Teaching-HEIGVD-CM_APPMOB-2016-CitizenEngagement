angular.module('citizen-engagement')

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

    /**
     * Allows to pass data from one controller to another
     */
    .service('storageService', function() {
        this.setData = function(data) {
            this.data = data;
        }
        this.getData = function() {
            return this.data;
        }
    })

    .controller("takePhotoCtrl", function (CameraService, storageService, $http, qimgUrl, qimgToken,$state) {
// take the picture
        CameraService.getPicture({
            quality: 75,
            targetWidth: 400,
            targetHeight: 300,
// return base64-encoded data instead of a file
            destinationType: Camera.DestinationType.DATA_URL
        }).then(function (imageData) {
// upload the image
            $http({
                method: "POST",
                url: qimgUrl + "/images",
                headers: {
                    Authorization: "Bearer " + qimgToken
                },
                data: {
                    data: imageData
                }
            }).success(function (data) {
                storageService.setData(data)
                $state.go('mainMenu.newIssue');
            });
        })
    })

;
