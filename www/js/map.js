angular.module('FixYourStreet.map', ['geolocation'])


  .controller("MapController", function($scope,$http,$ionicLoading,$log,$state, geolocation, IssueService, ReverseGeocoding, mapboxMapId, mapboxAccessToken, $ionicModal) {


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




  })

  .controller("MapSearch", function($scope,$http,$ionicLoading,$log,$state, geolocation, IssueService, ReverseGeocoding, mapboxMapId, mapboxAccessToken, $ionicModal) {
    $ionicModal.fromTemplateUrl('modalSearch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSearch = modal;
    });
    $scope.openModal = function() {
      $scope.modalSearch.show();
    };
    $scope.closeModal = function() {
      $scope.modalSearch.hide();
    };

    $scope.searchPlace = function(searchIn) {
      $http({
        method: 'GET',
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchIn + '.json?access_token=' + mapboxAccessToken
      }).success(function (result) {
        $scope.resultPlaces = result.features;
        angular.forEach($scope.resultPlaces, function(place) {

            console.log(place.place_name);
        });
      })

    };

  })

;
