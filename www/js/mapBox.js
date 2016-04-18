angular.module('citizen-engagement.mapBox', ['leaflet-directive','geolocation'])






    .controller("IssueMapCtrl", function($http, apiUrl, $log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {


            $scope.mapCenter = {};
            $scope.mapDefaults = {};
            $scope.mapMarkers = [];
            $scope.userCoords = {};
            $scope.data = {};
            $scope.radius = {};
            $scope.mapEnabled = false;

            geolocation.getLocation().then(function(data) {

                    $scope.mapCenter.lat = data.coords.latitude;
                    $scope.mapCenter.lng = data.coords.longitude;
                    $scope.mapCenter.zoom = 14;
                    $scope.mapEnabled = true;

                    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;

                    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;

                    $scope.mapDefaults = {
                            tileLayer: mapboxTileLayer,
                            events: {
                                    map: {
                                            enable: ['zoomend', 'drag', 'click'],

                                    }
                            }
                    };
                    //ajout du pin du user
                    $scope.userCoords.lat = $scope.mapCenter.lat;
                    $scope.userCoords.lng = $scope.mapCenter.lng;

                    $scope.mapMarkers.push({
                            lat: $scope.userCoords.lat,
                            lng: $scope.userCoords.lng,

                    });

                    function calculateRadius(map){

                            var mapBounds = map.getBounds();
                            var x1 = mapBounds._northEast.lat;
                            var y1 = mapBounds._northEast.lng;
                            var x0 = $scope.mapCenter.lat;
                            var y0 = $scope.mapCenter.lng;

                            $scope.radius = mapBounds._northEast.distanceTo($scope.mapCenter)/6135;
                    }

                    function createData4POST()
                    {
                            $scope.data = {
                                    "loc": {
                                            "$geoWithin": {
                                                    "$centerSphere" : [
                                                            [ $scope.mapCenter.lat , $scope.mapCenter.lng ],
                                                            1
                                                    ]
                                            }
                                    }
                            }
                    }

                    function getIssuesFromLocation()
                    {
                            $http({
                                    method: 'POST',
                                    url: apiUrl + '/issues/search',
                                    data: $scope.data
                            }).success(addIssues2MapMarkers)
                    }

                    function addIssues2MapMarkers(issues)
                    {
                            angular.forEach(issues, function(issue, index){


                                    $scope.mapMarkers.push({
                                            color: "#FF0000",
                                            lat: issue.lat,
                                            lng: issue.lng,
                                            message: "<p>{{ issue.description }}</p><img src=\"{{ issue.imageUrl }}\" width=\"200px\" />",
                                            getMessageScope: function() {
                                                    var scope = $scope.$new();
                                                    scope.issue = issue;
                                                    return scope;
                                            }
                                    });

                            });
                    }
                    leafletData.getMap().then(calculateRadius).then(createData4POST).then(getIssuesFromLocation);
            }, function(error) {
                    $log.error("Could not get location: " + error);
            }).then(function(){
                    $scope.$on('leafletDirectiveMap.zoomend', function(event){
                    });
            });

    })



      .controller("SingleIssueMapCtrl", function($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, $stateParams){
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
