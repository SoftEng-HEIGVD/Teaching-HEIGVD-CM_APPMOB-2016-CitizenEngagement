angular.module('FixYourStreet.map', ['geolocation'])

  .controller("MapController", function($rootScope,$scope,$log,$http,$ionicLoading,$state, geolocation, leafletData, IssueService, mapboxMapId, mapboxAccessToken, $ionicModal) {

    // Markers
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.issuesBounds = {};
        $scope.getIssues();
    });
    $scope.$on('leafletDirectiveMap.homeMap.moveend', function (event) {
        $scope.issuesBounds = {};
        $scope.getIssues();
    });

    // Disabled the button list if no issues are within the bounds
    $scope.disabledListIssue = function() {
      return $scope.issuesBounds == '' ? "disabled" : "";
    };

    // Default position on the map (World centered on Europe)
    $scope.mapCenter = {
      lat: 40,
      lng: 0,
      zoom:3
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

    // Get the issue within the bounds and add markers
    $scope.getIssues = function() {
      leafletData.getMap('homeMap').then(function (map) {

          var bbox = map.getBounds();

          IssueService.getIssuesArea(bbox, 0 ,500, function(issues) { // Offset is 0 and limit value ist 500
                $scope.issuesBounds = issues;

                $scope.disabledListIssue(); // Disabled list button if there are nos issues within the bounds

                $scope.mapMarkers = [];

                var markers = L.markerClusterGroup();

                angular.forEach($scope.issuesBounds, function(issue) {
                  var marker = L.marker(new L.LatLng(issue.lat, issue.lng), { issueId: issue.id });
                  markers.addLayer(marker);
                });

                // Redirection 'on click' on a marker to the details page
                markers.on('click', function(e) {
                  $state.go("issueDetails", { issueId: e.layer.options.issueId });
                });

                map.addLayer(markers);

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

      leafletData.getMap('homeMap').then(function (map) {

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

  .controller("MapSearch", function($scope,$http,$ionicLoading,$log, geolocation, IssueService, mapboxAccessToken, $ionicModal) {

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
        $log.error("Could not retrieve any places: " + error);
      })
    };

  })


;
