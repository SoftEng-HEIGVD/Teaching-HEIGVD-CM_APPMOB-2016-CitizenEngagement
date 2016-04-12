angular.module('FixYourStreet.issues', [])

  .service('IssueService', ['$http', 'apiUrl', function($http, apiUrl) {

      this.getIssuesArea = function (bbox, offset, limit, callback) {
          $http({
            method: 'POST',
            url: apiUrl + '/issues/search',
            headers: {
              'x-sort': 'updatedOn',
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

  }])

  .controller("issueList", function($rootScope,$scope,$state, leafletData, IssueService, $ionicLoading) {

    /* Issue with promise handler on LeafletData : https://github.com/tombatossals/angular-leaflet-directive/issues/1052
       Workaround: Check if the map exist, if not it means that the page was call from the homepage
    */
    if(leafletData.getMap().$$state.status == 0){
      $state.go("home", { reload: true});
    }

    $ionicLoading.show({
        template: 'Loading...',
        delay: 750
    });

    $scope.issuesPerPage = 5;
    $scope.currentPage = 0;

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function () {
      leafletData.getMap().then(function (map) {
         $scope.bboxList = map.getBounds();

         IssueService.getIssuesArea($scope.bboxList, $scope.currentPage*$scope.issuesPerPage,$scope.issuesPerPage, function(issues) { // Offset is 0 and limit value per "page" ist 5
                $scope.pagedIssues = issues;
                $ionicLoading.hide();
         }, function(error) {
           $ionicLoading.hide();
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
      $ionicLoading.show({
          template: 'Loading...',
          delay: 750
      });
      $scope.currentPage++;
      IssueService.getIssuesArea($scope.bboxList, $scope.currentPage,$scope.issuesPerPage, function(newIssues) {
        $scope.pagedIssues = $scope.pagedIssues.concat(newIssues);
        $ionicLoading.hide();
      }, function(error) {
        $ionicLoading.hide();
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
      IssueService.getById($stateParams.issueId, function(issue) {
            $scope.issue = issue;
     }, function(error) {
       $log.error("Could not retrieve Issues: " + error);
     });

  })


  //Controller pour la création des issues
  .controller("IssueCtrl", function (apiUrl, $scope, $http, $filter) {
      $scope.inputs = [{
              value: null
          }];

      $scope.addInput = function () {
          console.log("new input");
          $scope.inputs.push({
              value: null
          });
      }


      $scope.submitIssue = function () {
          $http({
              method: 'GET',
              url: apiUrl + '/issueTypes',
          }).success(function (allType) {
                var myFilteredType = $filter('filter')(allType, {name: $scope.type});
                var typeId = myFilteredType[0].id;
                $http({
                    method: 'GET',
                    url: apiUrl + '/issueTypes/' + typeId,
                }).success(function (typeChoosen) {
                    var newIssue = {
                        description: $scope.description,
                        tags: $scope.tagValue,
                        issueTypeId: typeChoosen.id,
                        lat: "46.780806678050126",
                        lng: "6.630673501428493",
                        imageUrl: $scope.imageUploadedUrl,
                    }
                    $http({
                        method: 'POST',
                        url: apiUrl + '/issues',
                        data: newIssue
                      }).success(function (createdIssue) {
                          console.log(createdIssue);
                          },function error() {
                            console.log("Erreur pas encore faite");
                            });
                          },
                                      function error() {
                                          console.log("Erreur pas encore faite");
                                      });
                  });
      }

      $scope.removeInput = function (index) {
          $scope.inputs.splice(index, 1);
      }

  })


  //controller pour les tags (je n'y ai pas touché)
  .controller("TagsCtrl", function ($scope) {
      $scope.inputs = [{
              value: null
          }];

      $scope.addInput = function () {
          $scope.inputs.push({
              value: null
          });
      }

      $scope.removeInput = function (index) {
          $scope.inputs.splice(index, 1);
      }
  })

  .controller("takePhoto", function ($scope, CameraService, $http, qimgUrl, qimgToken) {
      $scope.takePhoto = function () {
          CameraService.getPicture({
              quality: 75,
              targetWidth: 400,
              targetHeight: 300,
              destinationType: Camera.DestinationType.DATA_URL}).then(function (imageData) {
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
                  $scope.imageUploadedData = data;
                  $scope.imageUploadedUrl = data.url;
              }).error(function(error){
                  $log.error(error);
              });
          });
      };
  })

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

;
