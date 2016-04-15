angular.module('FixYourStreet.issues', [])

  .service('IssueService', ['$http', 'apiUrl', function($http, apiUrl) {

      this.getIssuesArea = function (bbox, offset, limit, callback) {
          $http({
            method: 'POST',
            url: apiUrl + '/issues/search',
            headers: {
              'x-sort': '-updatedOn',
              'x-pagination': offset+';'+limit //Can handled higher as 5000 when we use option chunkedLoading with the clustering plugin
            },
            data:{
              "$and": [ {
                "lat": {
                  "$gte": bbox._southWest.lat,
                  "$lte": bbox._northEast.lat
                }
                }, {
                  "lng": {
                    "$gte": bbox._southWest.lng,
                    "$lte": bbox._northEast.lng
                  }
                }
              ]
            }
        }).success(callback)
      }

      this.getById = function (id, callback) {
        $http({
            method: 'GET',
            url: apiUrl + '/issues/' + id,
        }).success(callback)
      }

      this.getIssuesTypes = function (callback) {
        $http({
            method: 'GET',
            url: apiUrl + '/issueTypes',
        }).success(callback)
      }

  }])

  .factory("CameraService", function ($q) {
      return {
          getPicture: function (options) {
              var deferred = $q.defer();
              navigator.camera.getPicture(function (result) {
                  // do any magic you need
                  deferred.resolve(result);
              }, function (err) {
                  deferred.reject(err);
              }, options);
              return deferred.promise;
          }
      }
  })

  .controller("issueList", function($rootScope,$scope,$state, leafletData, IssueService, $ionicLoading,timeAgo) {

      // After 24 hours, display the date normally.
      var oneDay = 60*60*24;
      timeAgo.settings.fullDateAfterSeconds = oneDay;

      /* Issue with promise handler on LeafletData : https://github.com/tombatossals/angular-leaflet-directive/issues/1052
         Workaround: Check if the map exist, if not it means that the page was call from the homepage
      */
      if(leafletData.getMap('homeMap').$$state.status == 0){
        $state.go("home", { reload: true});
      }

      $scope.issuesPerPage = 5;
      $scope.currentPage = 0;

      // The $ionicView.beforeEnter event happens every time the screen is displayed.
      $scope.$on('$ionicView.beforeEnter', function () {
        leafletData.getMap('homeMap').then(function (map) {
           $scope.bboxList = map.getBounds();

           IssueService.getIssuesArea($scope.bboxList, $scope.currentPage*$scope.issuesPerPage,$scope.issuesPerPage, function(issues) { // Offset is 0 and limit value per "page" ist 5
                  $scope.pagedIssues = issues;
           }, function(error) {
             $log.error("Could not get Issues: " + error);
           });

           IssueService.getIssuesArea($scope.bboxList, 0,0, function(issues) { // limit of 0 mean limit defined by server
                 $scope.total = issues.length;
          }, function(error) {
            $log.error("Could not get Issues: " + error);
          });

        });
      });

      $scope.loadMore = function() {
        $scope.currentPage++;
        IssueService.getIssuesArea($scope.bboxList, $scope.currentPage,$scope.issuesPerPage, function(newIssues) {
          $scope.pagedIssues = $scope.pagedIssues.concat(newIssues);
        }, function(error) {
          $log.error("Could not get Issues: " + error);
        });

      };

      $scope.nextPageDisabledClass = function() {
        return $scope.currentPage === $scope.pageCount()-1 ? "disabled" : "";
      };

      $scope.pageCount = function() {
        return Math.ceil($scope.total/$scope.issuesPerPage);
      };

    })


  //controller pour affiche les details d'une issue
  .controller('issueDetails', function (apiUrl, $http, $scope, $stateParams, $log, IssueService, mapboxMapId, mapboxAccessToken) {
      // Default position on the map (World centered on Europe)
      $scope.mapDCenter = {
        lat: 40,
        lng: 0,
        zoom:14
      };

      // Set the layer to mapbox custom map
      var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
      mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.jpg70?access_token=" + mapboxAccessToken;
      $scope.mapDDefaults = {
        tileLayer: mapboxTileLayer
      };

      IssueService.getById($stateParams.issueId, function(issue) {
        $scope.issue = issue;

        $scope.mapDCenter = {
          lat: issue.lat,
          lng: issue.lng,
          zoom:18
        };

        $scope.mapDMarkers = [];

        $scope.mapDMarkers.push({
          lat: issue.lat,
          lng: issue.lng
        });
     }, function(error) {
       $log.error("Could not retrieve Issues: " + error);
     });

  })


  //Controller pour la création des issues
  .controller("newIssue", function (apiUrl, $http, $scope, $filter, $stateParams, $state, $ionicModal,$ionicLoading,leafletData, geolocation, $log, IssueService, mapboxMapId, mapboxAccessToken, CameraService, qimgUrl, qimgToken) {

      $scope.issue = {};
      $scope.issue.lat = $stateParams.lat;
      $scope.issue.lng = $stateParams.lng;

      // Default position on the map (World centered on Europe)
      $scope.mapNCenter = {
        lat: parseFloat($stateParams.lat),
        lng: parseFloat($stateParams.lng),
        zoom:parseFloat($stateParams.zoom)
      };

      // Set the Marker at the center to indicate where will be located the new issue
      leafletData.getMap('mapNewI').then(function (map) {
        var marker = L.marker([map.getCenter().lat, map.getCenter().lng]).addTo(map);

        map.on('move', function () {
          marker.setLatLng(map.getCenter());
          $scope.issue.lat = map.getCenter().lat;
          $scope.issue.lng = map.getCenter().lng;
        });

      });

      // Set the layer to mapbox custom map
      var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
      mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.jpg70?access_token=" + mapboxAccessToken;
      $scope.mapNDefaults = {
        tileLayer: mapboxTileLayer
      };

      // Get position of the user (if he allows to)
      $scope.geolocateMap = function(bbox) {
        $ionicLoading.show({
            template: 'Localisation...',
            delay: 750
        });

        geolocation.getLocation().then(function(data) {
          $scope.mapNCenter = {
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

      // MapSearch: Modal Box
      $ionicModal.fromTemplateUrl('templates/mapSearch.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modalSearch = modal;
      });

      // MapSearch: Change the map center with a bbox
      $scope.changeMapCenterBBOX = function(bbox) {
        // If the request is coming from the modalSearch
        if($scope.modalSearch.show()){
          $scope.modalSearch.hide();
        }

        leafletData.getMap('mapNewI').then(function (map) {

          map.fitBounds([
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]]
          ]);

        });
      };

      // Define the tags controls
      $scope.issue.tags = [{value:null}];

      $scope.addTag = function () {
          $scope.issue.tags.push({value:null});
      }

      $scope.removeTag = function (index) {
          $scope.issue.tags.splice(index, 1);
      }

      $scope.takePhoto = function () {

          CameraService.getPicture({
              quality: 70,
              targetWidth: 600,
              targetHeight: 600,
              correctOrientation: true,
              destinationType: Camera.DestinationType.DATA_URL}).then(function (imageData) {
              $ionicLoading.show({
                  template: 'Uploading...',
              });
              $http({
                  method: "POST",
                  url: qimgUrl + "/images",
                  headers: {
                      Authorization: "Bearer " + qimgToken
                  },
                  data: {
                      data: imageData
                  }
              }).success(function (data) {
                  $scope.imageUploadedUrl = data.url;
                  $ionicLoading.hide();
              }).error(function(error){
                  $ionicLoading.hide();
                  $log.error("Could not upload the issue: " + error);
              });
          });
      };

      // Post the issue
      $scope.submitIssue = function () {

        var newIssue = {
            description: $scope.issue.description,
            issueTypeId: $scope.issue.type,
            lat: $scope.issue.lat,
            lng: $scope.issue.lng,
            imageUrl: $scope.imageUploadedUrl
        }

        $http({
            method: 'POST',
            url: apiUrl + '/issues',
            data: newIssue
          }).success(function (createdIssue) {

            var tags = [];

            angular.forEach($scope.issue.tags, function(issue) {
              tags.push(issue.value);
            });

            // Post the tags
            $http({
              method: 'POST',
              url: apiUrl + '/issues/' + createdIssue.id + '/actions',
              data: {
                type : "addTags",
                payload :{
                  tags : tags
                }
              }

            }).success(function(data) {
                $state.go("issueDetails", { issueId: createdIssue.id });
            }).error(function(error){
                $log.error("Could not create the tags: " + error);
            });
          }).error(function(error){
              $log.error("Could not create the issue: " + error);
          });

      }


  })

  // Get the list of types
  .controller("TypesCtrl", function ($scope,$http, $log, apiUrl,IssueService) {
      IssueService.getIssuesTypes(function(types) {
        $scope.types = types;
      }, function(error) {
        $log.error("Could not get IssuesTypes: " + error);
      });
  })

;
