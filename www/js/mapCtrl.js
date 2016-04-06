angular.module('citizen-engagement.mapCtrl', [])

    .controller("IssueMapController", function ($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId; //openlayers --> mapbox
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {
            lat: 46.5,
            lng: 6.6,
            zoom: 7
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
