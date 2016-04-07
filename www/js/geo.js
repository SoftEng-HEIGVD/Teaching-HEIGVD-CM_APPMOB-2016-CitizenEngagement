angular.module('citizen-engagement')
    /*
     * Geo Service (Build map, get location)
     */
    .service('geoService', ['geolocation','$ionicLoading', 'mapboxMapId', 'mapboxAccessToken', function(geolocation, $ionicLoading, mapboxMapId, mapboxAccessToken) {
        var defaultCoordinates = { // Default coordinates, Bern Switzerland
            latitude: 46.9547232,
            longitude:7.3598507
        };

        // Get location
        this.getLocation = function() {
            $ionicLoading.show({
                template: 'Getting Location...',
                animation: 'fade-in',
            });
            return geolocation.getLocation()
                .then(function(data) {
                        // Promise fullfilled
                        $ionicLoading.hide();
                        return data.coords;
                    }, function(error) {
                        // Promise rejected (Doesn't work with firefox, bug). Maybe set a timeout ?
                        return defaultCoordinates;
            });
        }
        // Map building function
        this.buildMap = function(scope, coordinates) {
            scope.mapCenter = {};

            var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
            mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
            scope.mapCenter.lat = coordinates.latitude;
            scope.mapCenter.lng = coordinates.longitude;

            scope.mapDefaults = {
                tileLayer: mapboxTileLayer
            };
            scope.mapCenter.zoom = 12;
        }
    }])

    .controller("MapCtrl", function($scope, geoService, IssueService, $ionicLoading) {
        $scope.mapCenter = {};
        $scope.mapMarkers = [];
        function buildMap(coords) {
            geoService.buildMap($scope, coords);
        }
        geoService.getLocation().then(buildMap);
        $ionicLoading.show({
            template: 'Getting issues...',
            animation: 'fade-in',
        });
        IssueService.getAllIssues(

            function(issues) {
                $scope.issues = issues;
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
            }, function(error) {
                return null;
            }, function(){
                $ionicLoading.hide();
                return null;
            });

    })

;
