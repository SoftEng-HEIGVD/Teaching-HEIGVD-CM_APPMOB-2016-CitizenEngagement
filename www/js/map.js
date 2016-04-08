angular.module('FixYourStreet.map', ['geolocation'])


  .controller("MapController", function($rootScope,$scope,$log,$http,$ionicLoading,$state, geolocation, leafletData, IssueService, mapboxMapId, mapboxAccessToken, $ionicModal) {

    // Markers
    $scope.$on('leafletDirectiveMap.moveend', function (event) {
        $scope.getIssues();
    });

    // Redirection on click on a marker to the details page
    $scope.$on('leafletDirectiveMarker.click', function(e, args) {
      $state.go("issueDetails", { issueId: args.leafletEvent.target.options.id });
    });

    // Default position on the map (World centered on Europe)
    $scope.mapCenter = {
      lat: 40,
      lng: 0,
      zoom:2
    };

    // Get position of the user (if he allow to)
    $scope.geolocateMap = function(bbox) {
      $ionicLoading.show({
          template: 'Localisation...',
          delay: 750
      });

      geolocation.getLocation().then(function(data) {
        $scope.mapCenter = {
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          zoom:17
        };
        $ionicLoading.hide();
      }, function(error) {
        $ionicLoading.hide();
        $log.error("Could not get location: " + error);
      });
    };

    // Set the layer to mapbox custom map
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    $scope.mapDefaults = {
      tileLayer: mapboxTileLayer
    };

    // Get the issue within the bounds
    $scope.getIssues = function() {
      leafletData.getMap().then(function (map) {

          var bbox = map.getBounds();

          IssueService.getAllIssuesArea(bbox, function(issues) {
                $rootScope.issuesBounds = issues;

                $scope.mapMarkers = [];

                angular.forEach($rootScope.issuesBounds, function(issue) {

                    $scope.mapMarkers.push({
                        lat: issue.lat,
                        lng: issue.lng,
                        id: issue.id
                    });
                });

         }, function(error) {
           $log.error("Could not get/set markers: " + error);
         });
      });
    };

    // Change the map center with a bbox
    $scope.changeMapCenter = function(bbox) {
      // If the request is coming from the modalSearch
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
      $scope.resultPlaces = [];
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
