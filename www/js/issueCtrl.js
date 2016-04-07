/**
 * Created by Sabine on 05.04.2016.
 */

angular.module('citizen-engagement.issueCtrl',[])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl, $state) {
            $scope.loadIssues = function() {
                console.log("ok");
                $http.get(apiUrl+'/issues',{headers: {'x-sort': 'createdOn'}}).success(function(issues) {

                    $scope.issues = issues;

                    console.log("j'ai la première issue du tableau" +issues[0]);

                });
            };
            $scope.loadIssues();

           /* $scope.loadIssueType = function () {
                $http.get(apiUrl + '/issues').success(function (issues) {
                    $scope.issues = issues;
                    console.log(issueTypes[0].name);

                    index = 0;

                    while (index < issues.length)
                    {
                        console.log(issues[index].name);
                        index++;
                    }

                });
            };*/
        })

    .controller("issueDetailCtrl", function($scope, $http, apiUrl, $stateParams) {
        console.log("j'arrive à récupe le paramètre" + $stateParams);
        var id = $stateParams.issueId;
        console.log('id ' + id);
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+id
        }).success(function(issue) {
            console.log("okbla");

            $scope.issue = issue;
            console.log("j'ai mon issue" + issue);

        });



    })

    // Add new issue
    .controller('AddIssueCtrl', function(apiUrl, $scope, $http, $state,
                                         $ionicLoading, $ionicHistory, geoService) {

        $scope.issue = {};

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
        $scope.mapCenter = {};
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

        });    // Add center marker

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
    });



