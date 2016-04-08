angular.module('FixYourStreet.issues', [])

  .service('IssueService', ['$http', 'apiUrl', function($http, apiUrl) {

      this.getAllIssuesArea = function (bbox, callback) {
          $http({
            method: 'POST',
            url: apiUrl + '/issues/search',
            headers: {
              'x-sort': 'updatedOn',
              'x-pagination': '0;100'
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
  }])

  //controller pour affiche les details d'une issue
  .controller('issueDetails', function (apiUrl, $http, $scope, $stateParams, $ionicLoading, $log, $state, IssueService, mapboxMapId, mapboxAccessToken) {
      // The $ionicView.beforeEnter event happens every time the screen is displayed.
      $scope.$on('$ionicView.beforeEnter', function () {
          // Re-initialize the user object every time the screen is displayed.
          // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
          $scope.issues = {};
      });
      $scope.getAreaIssues = function () {
          $http({
              method: 'GET',
              url: apiUrl + '/issues/' + $stateParams.issueId,
          }).success(function (issue) {
              $scope.issue = issue;
          }).error(function () {
              $log.error("Could not retrieve Issues: " + error);
          });
      };
      $scope.getAreaIssues();


  })

;
