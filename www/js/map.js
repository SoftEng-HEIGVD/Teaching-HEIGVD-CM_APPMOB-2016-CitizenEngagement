angular.module('citizen-engagement.map', [])

    .factory('GeolocServiceFla', function (geolocation, $log) {
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

        GeolocServiceFla.locateUser().then(function (coords) {
            $scope.mapCenter = {
                lat: coords.latitude,
                lng: coords.longitude,
                zoom: 15

            };
        });


        $scope.mapMarkers = [];

        $http.get(apiUrl + '/issues').success(function (issues) {


            angular.forEach(issues, function (issue) {

                $scope.mapMarkers.push({
                    lat: issue.lat,
                    lng: issue.lng,
                    "icon": {
                        "iconUrl": "http://iconshow.me/media/images/Application/Map-Markers-icons/png/256/MapMarker_Marker_Outside_Pink.png",
                        "iconSize": [50, 50], // size of the icon
                        "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                        "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                        "className": "dot",

                    },
                     /*message: '<p>{{issue.description}}</p><img src="{{issue.imageUrl}}" width="200px"/>',
                     getMessageScope: function() {
                     var scope = $scope.$new();
                     scope.issue = issue;
                     return scope;
                     }*/
                    message: '<a class="item item-avatar" ui-sref="menu.issueDetails({issueId:issue.id})" width = 200px>' +
                    '<img src="{{issue.imageUrl}}" width="50px" height="50px"><h4>{{issue.issueType.name}}</h4><p>{{issue.description}}</p>' +
                    '<p>{{issue.createdOn | date:"mediumDate"}}</p></a>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;
                    }



                });

                console.log(issue);
            });


            $scope.issues = issues;

            console.log(issues);

            GeolocServiceFla.locateUser().then(function (coords) {
                $scope.mapMarkers.push({


                    lat: coords.latitude,
                    lng: coords.longitude,
                    "icon": {
                        "iconUrl": "http://img.lum.dolimg.com/v1/images/open-uri20150608-27674-1fy4fw9_f422ec7b.png?region=0%2C0%2C400%2C400",
                        "iconSize": [100, 100], // size of the icon
                        "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                        "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                        "className": "dot"
                    },
                    message: '<p>{{ issue.description }}</p><img src="{{ issue.imageUrl }}" width="200px" />',
                    getMessageScope: function () {
                        var scope = $scope.$new();
                        /*    scope.issue = issue;*/
                        return scope;
                    }
                });
            });

        });


    })


    .controller("IssueMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocServiceFla, $stateParams) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {};

        GeolocServiceFla.locateUser().then(function (coords) {

        });

        $scope.mapMarkers = [];
        /*        var issue = IssueService.getIssue();*/

        var id = $stateParams.issueId;
        $http({
            method: 'GET',
            url: apiUrl + '/issues/' + id
        }).success(function (issue) {

            $scope.mapCenter = {
                lat: issue.lat,
                lng: issue.lng,
                zoom: 15

            };
            $scope.issue = issue;
            console.log(issue);
            $scope.mapMarkers.push({
                lat: issue.lat,
                lng: issue.lng,

            });

        });


    })


    .controller("HomeMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocServiceFla, $stateParams) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {};


        $scope.mapMarkers = [];

// TODO loading while geoloc

        GeolocServiceFla.locateUser().then(function (coords) {
            $scope.mapCenter = {
                lat: coords.latitude,
                lng: coords.longitude,
                zoom: 15
            };

            $scope.mapMarkers.push({
                lat: coords.latitude,
                lng: coords.longitude,
                message: "<strong>You are here</strong>"

            });

        });


    })

    .controller("NewIssueMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocServiceFla, $stateParams) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {};
        $scope.latitude = "";
        $scope.longitude = "";

        $scope.mapMarkers = [];


        GeolocServiceFla.locateUser().then(function (coords) {
            $scope.mapCenter = {
                lat: coords.latitude,
                lng: coords.longitude,
                zoom: 15
            };

            $scope.mapMarkers.push({
                lat: coords.latitude,
                lng: coords.longitude

            });

            $scope.issue.lat = coords.latitude;
            $scope.issue.lng = coords.longitude;

        });


    })


    .controller("UserIssuesController", function ($scope, $http, AuthService, apiUrl, IssueService) {
        $scope.loadUserInfo = function () {

            userId = AuthService.currentUserId;
            $http.get(apiUrl + '/users/' + userId).success(function (user) {

                $scope.user = user;

                console.log(user);


            });
        }
        $scope.loadUserInfo();

        $scope.getIssuesByUser = function () {
            IssueService.findIssuesByUser().then(function (issues) {
                $scope.issues = issues;
                console.log(issues);


            });
        };
        $scope.getIssuesByUser();
    });
;

