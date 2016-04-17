angular.module('citizen-engagement')


.service('IssueService', ['$http', 'apiUrl', function($http, apiUrl, $ionicLoading) {
    /**
     * Get all issues from apiUrl
     */
  this.getAllIssues = function(successCallback, errorCallback, finallyCallback) {
    $http({
        method: 'GET',
        url: apiUrl + '/issues',
        headers: {
          "x-sort": "-createdOn",
        }
      }).success(successCallback)
      .error(errorCallback)
      .finally(finallyCallback);
  }
  /**
   * Get issues with type filter enabled
   */
  this.filterByType = function(issueType, successCallback, errorCallback, finallyCallback) {
      $http({
        method: 'POST',
        data: {
            "_issueType": issueType
        },
        headers: {
          "x-sort": "-createdOn",
        },
        url: apiUrl + '/issues/search'
    }).success(successCallback)
    .error(errorCallback)
    .finally(finallyCallback);
  }
}])

// List issues controller.
.controller('ListIssuesCtrl', function(apiUrl, IssueService, $scope, $rootScope, $http, $ionicLoading) {
    $scope.getIssues = function() {
        IssueService.getAllIssues(
          function(data) { // finallyCallback
            $scope.issues = data;
          },
          function(err) { // Error callback
            return err;
          },
          function() { // finallyCallback
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
          }
        );
        $ionicLoading.show({
          template: 'Loading issues',
          animation: 'fade-in',
          noBackdrop: true
        });
    }
    $rootScope.$on('addedfilter', function(event, data ) {
        IssueService.filterByType(data,
            function(data) {
                $scope.issues = data;
            },
            function(err) {
                return err;
            },
            function() {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }
        );
        $ionicLoading.show({
            template:'Filtering issues',
            animation: 'fade-in',
            noBackdrop: true
        });

    })

})

// Get specific issue controller
.controller('GetSpecificIssueCtrl', function(apiUrl, $scope, $state, $http, $ionicLoading, $stateParams) {
    $ionicLoading.show({
      template: 'Loading Issue',
      animation: 'fade-in',
      noBackdrop: true,
      delay: 200
    });
    $http({
      method: 'GET',
      url: apiUrl + '/issues/' + $stateParams.issueId
    }).success(function(issue) {
      $scope.issue = issue;
    }).error(function(error) {
      console.log("error");
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });

    $scope.buttonClickAddTags = function() {
      console.log('coucou le formulaire de tags');
      $state.go('mainMenu.issueAddTags');
    };


  })
  // Add new issue controller
  .controller('AddIssueCtrl', function(apiUrl, $scope, $http, $state, $stateParams,
    $ionicLoading, $ionicHistory, geoService, storageService) {

    $scope.issue = {};
    console.log($stateParams); // TODO: Marche pas !!!
    if (storageService.getData()) {
      $scope.issue.imageUrl = storageService.getData().url;
    }
    // Get types
    $ionicLoading.show({
      template: 'Loading Types',
      animation: 'fade-in',
      noBackdrop: true,
      delay: 200
    });
    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes'
    }).success(function(data) {
      $scope.issueTypes = data;
    }).error(function(error) {
      console.log('Could not get types');
    }).finally(function() {
      $ionicLoading.hide();
    });
    // Show Map

    $scope.mapMarkers = [];

    function buildMap(coords) {
      geoService.buildMap($scope, coords);

    }

    var marker = {};
    geoService.getLocation().then(buildMap).then(function() {
      var marker = $scope.mapCenter
      marker.draggable = true;
      //$scope.mapMarkers.push(marker); // Comment to disable the real marker when the css marker is ok
      $scope.$broadcast('leafletDirectiveMarker.move');

    }); // Add center marker

    $scope.$on('leafletDirectiveMarker.move', function(e, args) {
      $scope.issue.lat = $scope.mapCenter.lat;
      $scope.issue.lng = $scope.mapCenter.lng;
    });

    // Send issue on click
    $scope.sendIssue = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true // Disable back button on next view
      });
      $ionicLoading.show({
        template: 'Saving Issue',
        animation: 'fade-in',
        noBackdrop: true,
        delay: 200
      });
      $http({
        method: 'POST',
        url: apiUrl + '/issues',
        data: $scope.issue
      }).success(function(data) {
        $ionicLoading.hide();
        $state.go('mainMenu.issueDetails', {
          issueId: data.id
        });
      }).error(function(error) {
        console.log("error...");
      });
    }
  })

/**
 * List user own issues
 */
.controller('ListMyIssuesCtrl', function(apiUrl, $scope, $http, $ionicLoading) {

        $scope.getIssues = function() {
          $ionicLoading.show({
            template: 'Loading your issues',
            animation: 'fade-in',
            noBackdrop: true,
            delay: 200
          });
          $http({
            method: 'GET',
            url: apiUrl + '/me/issues'
          }).success(function(issues) {
            $ionicLoading.hide();
            $scope.issues = issues;
          }).error(function(error) {
            $ionicLoading.hide();
            console.log(error);
          }).finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
        }
        $scope.getIssues();



})

.controller('FilterIssuesCtrl', function($scope, $rootScope, $ionicPopover, $ionicLoading, $http, apiUrl, storageService) {
    $scope.issue = {};

    $ionicPopover.fromTemplateUrl('templates/issueFilters.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  /*
   * Get all issue types
   */
  $http({
    method: 'GET',
    url: apiUrl + '/issueTypes',
  }).success(function(data) {
    $scope.issueTypes = data;
  }).error(function(error) {
    console.log('Could not get types');
  }).finally(function() {
    $ionicLoading.hide();
  });


  $scope.filter = function() {
      // Send the types to the rootscope
      $rootScope.$emit('addedfilter', $scope.issue.type);
      $scope.closePopover();
  }
})

/**
 * Add tags to issue controller
 */
.controller('AddTagsCtrl', function(apiUrl, $scope, $http, $state, $stateParams,
  $ionicLoading) {
  $scope.addTags = function() {
    console.log('button click send tags');
  }

})

;
