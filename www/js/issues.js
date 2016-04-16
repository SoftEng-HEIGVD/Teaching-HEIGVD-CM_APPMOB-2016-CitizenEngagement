angular.module('citizen-engagement')


.service('IssueService', ['$http', 'apiUrl', function($http, apiUrl, $ionicLoading) {
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
  this.filterByType = function(issueType, successCallback, errorCallback, finallyCallback) {
      $http({
        method: 'POST',
        data: {
            "_issueType": issueType
        },
        url: apiUrl + '/issues/search'
    }).success(sucessCallback)
    .error(errorCallback)
    .finally(finallyCallback);
  }
}])

// Get all issues
.controller('ListIssuesCtrl', function(apiUrl, IssueService, $scope, $http, $ionicLoading) {
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
  }
  $scope.getIssues();
})

// Get specific issue
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
  // Add new issue
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
      $scope.mapMarkers.push(marker);
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

.controller('FilterIssuesCtrl', function($scope, $ionicPopover, $ionicLoading, $http, apiUrl, storageService) {
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
      $scope.closePopover();
      $ionicLoading.show({
        template: 'Loading your issues',
        animation: 'fade-in',
        noBackdrop: true,
        delay: 200
      });




  };
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
