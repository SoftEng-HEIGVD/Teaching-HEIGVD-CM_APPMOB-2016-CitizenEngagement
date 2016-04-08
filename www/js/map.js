angular.module('FixYourStreet.map', ['geolocation'])


  .controller("MapController", function($scope,$http,$ionicLoading,$state, geolocation, leafletData, IssueService, mapboxMapId, mapboxAccessToken, $ionicModal) {

    // Default position on the map (World centered on Europe)
    $scope.mapCenter = {
      lat: 40,
      lng: 0,
      zoom:2
    };

    // Get position of the user (if he allow to)
    geolocation.getLocation().then(function(data) {
      $scope.mapCenter = {
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        zoom:17
      };
    }, function(error) {
      $log.error("Could not get location: " + error);
    });

    // Set the layer to mapbox custom map
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    $scope.mapDefaults = {
      tileLayer: mapboxTileLayer
    };

    // Markers
    $scope.$on('leafletDirectiveMap.moveend', function (event) {
      leafletData.getMap().then(function (map) {


        $scope.mapMarkers = [];
          var bbox = map.getBounds();

          IssueService.getAllIssuesArea(bbox, function(issues) {
                $scope.issues = issues;
                console.log('hepmap');
                console.log(issues);

                angular.forEach($scope.issues, function(issue) {

                    $scope.mapMarkers.push({
                        lat: issue.lat,
                        lng: issue.lng,
                        id: issue.id
                    });
                });

         }, function() {}, null);

      });

    });

    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
     $state.go("issueDetails", { issueId: args.leafletEvent.target.options.id });
    });

    $scope.changeMapCenter = function(bbox) {
      if($scope.modalSearch.show()){
        $scope.modalSearch.hide();
      }

      leafletData.getMap().then(function (map) {

        map.fitBounds([
          [bbox[1], bbox[0]],
          [bbox[3], bbox[2]]
        ]);
      });
    };

    // Search Modal Box

    $ionicModal.fromTemplateUrl('modalSearch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSearch = modal;
    });

  })

  .controller("MapSearch", function($scope,$http,$ionicLoading,$log,$state, geolocation, IssueService, mapboxAccessToken, $ionicModal) {

    // Reverse geocoding with the api of mapbox for place, city, countries...
    $scope.searchPlace = function(searchIn) {

      $ionicLoading.show({
          template: 'Searching...',
          delay: 750
      });
      $http({
        method: 'GET',
        url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchIn + '.json?access_token=' + mapboxAccessToken + '&limit=10'
      }).success(function (result) {
        $ionicLoading.hide();
        $scope.resultPlaces = result.features;
      }).error(function (error) {
        $ionicLoading.hide();
        $scope.error = 'Could not retrieve any places..';
      })
    };

  })

;
