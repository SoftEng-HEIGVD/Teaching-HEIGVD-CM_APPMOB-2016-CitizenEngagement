angular.module('citizen-engagement.mapIssues',[])

//to do : pagniation, headers, 
.controller('MapIssueCtrl',  function($scope, mapboxMapId, mapboxAccessToken) {
  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;

 
 angular.extend($scope, {
        san_fran: {
            lat: 37.78,
            lng: -122.42,
            zoom: 13
        },
        events: {},
        layers: {
            baselayers: {
                osm: {
                    name: 'OpenStreetMap',
                    url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

 /*
  $scope.mapDefaults = {
    tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };
  
  $scope.mapCenter = {
     lat: 51.48,
     lng: 0,
     zoom: 14
   };

   $scope.mapMarkers = [];

   */
});