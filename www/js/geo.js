angular.module('citizen-engagement')

    .controller("MapCtrl", function($scope, geolocation,mapboxMapId, mapboxAccessToken, IssueService) {
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

            IssueService.getAllIssues(
                function(data) {
                    $scope.issues = data;
                    $scope.issues.forEach(function(issue) {
                        $scope.mapMarkers.push({
                            lat: issue.lat,
                            lng: issue.lng,
                            message: '<div ng-include="\'templates/mapTooltip.html\'">',
                            getMessageScope: function() {
                                var scope = $scope.$new();
                                scope.issue = issue;
                            return scope;
                            }
                        });
                    });

             }, function() {

             }, null);
        }, function(error) {
            console.log("Could not get location: " + error);
        });

    })

;
