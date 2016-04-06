angular.module('citizen-engagement.mapCtrl', [])

    .controller("IssueMapController", function ($scope, mapboxMapId, mapboxAccessToken) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {
            lat: 51.48,
            lng: 0,
            zoom: 14
        };

        $scope.mapMarkers = [];
/*        var issue = IssueService.getIssue();*/

        $scope.mapMarkers.push({
            lat: 51.48,
            lng: 0,
            message: '<p>{{ issue.description }}</p><img src="{{ issue.imageUrl }}" width="200px" />',
            getMessageScope: function () {
                var scope = $scope.$new();
            /*    scope.issue = issue;*/
                return scope;
            }
        });
    });
