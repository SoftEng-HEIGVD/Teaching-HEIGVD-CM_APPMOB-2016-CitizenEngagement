angular.module('citizen-engagement.mapCtrl', [])

    .factory('GeolocServiceFla', function (geolocation) {
        var service = {

            locateUser: function () {

                return geolocation.getLocation().then(function (data) {

                    /*$scope.mapCenter.lat = data.coords.latitude;
                    $scope.mapCenter.lng = data.coords.longitude;
                    $scope.mapCenter.zoom = 8;*/

                    /*  $scope.mapCenter = {
                     lat: data.coords.latitude,
                     lng: data.coords.longitude,
                     zoom: 8

                     };*/
                    console.log(data.coords.longitude);
                    console.log(data.coords.latitude);
                    return data.coords;



                }, function (error) {
                    $log.error("Could not get location: " + error);
                    console.log("Could not get location: " + error);
                });

            }
        };

        return service;
    })
    .controller("IssuesMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocServiceFla) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };

        $scope.mapCenter = {};
// TODO loading while geoloc

        GeolocServiceFla.locateUser().then(function(coords){
            $scope.mapCenter = {
                lat:coords.latitude,
                lng: coords.longitude,
                zoom: 8

            };
        });


        $scope.mapMarkers = [];

        $http.get(apiUrl + '/issues').success(function (issues) {

            $scope.issues = issues;

            console.log(issues);


            $scope.mapMarkers.push({
                lat: 46.5,
                lng: 6.6,
                message: '<p>{{ issue.description }}</p><img src="{{ issue.imageUrl }}" width="200px" />',
                getMessageScope: function () {
                    var scope = $scope.$new();
                    /*    scope.issue = issue;*/
                    return scope;
                }
            });
        });


    })

    .controller("IssueMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocServiceFla) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };



        $scope.mapCenter = {
            lat: 46.5,
            lng: 6.6,
            zoom: 8
        };

        $scope.mapMarkers = [];
        /*        var issue = IssueService.getIssue();*/


        $http.get(apiUrl + '/issues').success(function (issues) {

            $scope.issues = issues;

            console.log(issues);


            $scope.mapMarkers.push({
                lat: 46.5,
                lng: 6.6,
                message: '<p>{{ issue.description }}</p><img src="{{ issue.imageUrl }}" width="200px" />',
                getMessageScope: function () {
                    var scope = $scope.$new();
                    /*    scope.issue = issue;*/
                    return scope;
                }
            });
        });


    });

