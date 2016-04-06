angular.module('FixYourStreet.map', ['leaflet-directive','geolocation'])


  .controller("MapController", function($scope,$log, geolocation, mapboxMapId, mapboxAccessToken) {

    geolocation.getLocation().then(function(data) {
      $scope.mapCenter.lat = data.coords.latitude;
      $scope.mapCenter.lng = data.coords.longitude;
      $scope.mapCenter.zoom = 17;
    }, function(error) {
      $log.error("Could not get location: " + error);
    });

    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    $scope.mapDefaults = {
      tileLayer: mapboxTileLayer
    };
    $scope.mapCenter = {
      lat: 51.48,
      lng: 0,
      zoom:17
    };
    $scope.mapMarkers = [];

    /*
    var issue = GetIssuesArea.getIssue();

    $scope.mapMarkers.push({
      lat: issue.lat,
      lng: issue.lng,
      message: "",
      getMessageScope: function() {
        var scope = $scope.$new();
        scope.issue = issue;
        return scope;
      }
    });*/
  })


;
