angular.module('FixYourStreet.map', ['geolocation'])


  .controller("MapController", function($scope,$ionicLoading,$log,$state, geolocation, IssueService, ReverseGeocoding, mapboxMapId, mapboxAccessToken) {

    $ionicLoading.show({
        template: 'Loading geolocation...',
        delay: 750
    });
    geolocation.getLocation().then(function(data) {
      $scope.mapCenter.lat = data.coords.latitude;
      $scope.mapCenter.lng = data.coords.longitude;
      $scope.mapCenter.zoom = 17;
      $ionicLoading.hide();
    }, function(error) {
      $ionicLoading.hide();
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

    $scope.$on('leafletDirectiveMap.move', function(event){


      //console.log(leafletBoundsHelpers);

    });


    $scope.mapMarkers = [];

    IssueService.getAllIssuesArea(function(issues) {
          $scope.issues = issues;
          angular.forEach($scope.issues, function(issue) {

              $scope.mapMarkers.push({
                  lat: issue.lat,
                  lng: issue.lng,
                  id: issue.id
              });
          });

   }, function() {}, null);

   $scope.$on('leafletDirectiveMarker.click', function(e, args) {
     $state.go("issueDetails", { issueId: args.leafletEvent.target.options.id });
    });


    ReverseGeocoding.getPlaces(function(result) {
          $scope.resultPlaces = result.features;
          angular.forEach($scope.resultPlaces, function(place) {

              console.log(place.place_name);
          });

    }, function() {}, null);

  })

;
