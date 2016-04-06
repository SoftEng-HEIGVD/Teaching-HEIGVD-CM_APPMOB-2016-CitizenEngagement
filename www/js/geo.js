angular.module('citizen-engagement')

    .controller("MapCtrl", function($scope, geolocation,mapboxMapId, mapboxAccessToken) {
        $scope.mapCenter = {};
        geolocation.getLocation().then(function(data) {
            $scope.mapCenter.lat = data.coords.latitude;
            $scope.mapCenter.lng = data.coords.longitude;
            var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
            mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;

            $scope.mapDefaults = {
                tileLayer: mapboxTileLayer      
            };
            $scope.mapCenter.zoom = 12;
            $scope.mapMarkers = [];
        }, function(error) {
            console.log("Could not get location: " + error);
        });

    })

;
