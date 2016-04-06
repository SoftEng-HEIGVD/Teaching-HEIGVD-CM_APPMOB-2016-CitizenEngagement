angular.module('citizen-engagement.mapBox', ['leaflet-directive'])


    .controller("IssueMapCtrl", function ($scope, mapboxMapId, mapboxAccessToken) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;

        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;

        $scope.mapDefaults = {tileLayer: mapboxTileLayer};
        $scope.mapCenter = {lat: 51.48, lng: 0, zoom: 14};
        $scope.mapMarkers = [];
    });
