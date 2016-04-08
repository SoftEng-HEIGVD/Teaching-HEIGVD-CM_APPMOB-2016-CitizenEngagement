angular.module('citizen-engagement')

    .controller("AllIssuesMapController", function($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {
            lat: 46.78,
            lng: 6.65,
            zoom: 14
        };
        $scope.mapMarkers = [];

        $http({
            method: 'GET',
            url: apiUrl + '/issues',
        }).success(function(issues) {
            angular.forEach(issues, function(issue) {
                $scope.mapMarkers.push({
                    lat: issue.lat,
                    lng: issue.lng,
                    message: '<p>{{issue.description}}</p><img src="{{issue.imageUrl}}" width="200px"/>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;
                    }
                });
            });
        });
    })
    .controller("OneIssueMapController", function($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, $stateParams){
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {};
        $scope.mapMarkers = [];
        var issueId = $stateParams.issueId;
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId
        }).success(function(issue){

            $scope.mapMarkers.push({
                lat: issue.lat,
                lng: issue.lng,
                message: '<p>{{issue.description}}</p><img src="{{issue.imageUrl}}" width="200px"/>',
                getMessageScope: function() {
                    var scope = $scope.$new();
                    scope.issue = issue;
                    return scope;
                }
            });
            $scope.mapCenter = {
                lat: issue.lat,
                lng: issue.lng,
                zoom: 15
            };
        });

});