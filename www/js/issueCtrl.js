/**
 * Created by Sabine on 05.04.2016.
 */

angular.module('citizen-engagement.issueCtrl',[])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl) {
            $scope.loadIssues = function() {
                console.log("ok");
                $http.get(apiUrl+'/issues').success(function(issues) {

                    $scope.issues = issues;

                    console.log(issues[0]);

                });
            };
            $scope.loadIssues();

            $scope.loadIssueType = function () {
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
            };

        })

.controller('PostsCtrl', function($scope,$state, $ionicLoading, $stateParams, $http){
    $scope.search = function(idPassedFromNgClick){
        // console.log(idPassedFromNgClick);
        $state.go('thepost', {id: idPassedFromNgClick})
    }
})


    .controller('PostCtrl', function($scope,$ionicLoading, $stateParams, $http){
        url = "http://monsupersite.fr//wp-json/posts/"+ $stateParams.id +"";
        $ionicLoading.show({template: 'Chargement...'});
        $http.get(url).success(function(response) {
            $ionicLoading.hide();
            $scope.post=response;
        })
    });