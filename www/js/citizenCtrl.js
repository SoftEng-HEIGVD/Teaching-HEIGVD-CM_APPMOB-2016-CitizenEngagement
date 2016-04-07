angular.module('citizen-engagement.citizenCtrl',[])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl) {

            $scope.loadUsers = function() {
                $http.get(apiUrl+'/users').success(function(users) {

                    $scope.users = users;

                });
            };

            $scope.loadIssueType = function () {
                $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {
                    $scope.issueTypes = issueTypes;
                    //console.log(issueTypes[0].name);

                    index = 0;
                    while (index < issueTypes.length)
                    {
                        console.log(issueTypes[index].name);
                        index++;
                    }

                });


            };

            $scope.loadIssues=function(){
                $http.get(apiUrl+'/issues').success(function(issues){
                    $scope.issues=issues;

                })
            }

            $scope.loadIssues();
            $scope.loadIssueType();

        })



    .controller('PagesCtrl', function ($scope, $stateParams,$http,apiUrl) {

            var currentId = $stateParams.issueId;

            $scope.loadCurrentIssue=function(){
                $http.get(apiUrl+'/issues/'+currentId).success(function(issueCurrent){
                    $scope.issueCurrent=issueCurrent;

                    console.log(issueCurrent);

                })
            }

            $scope.loadCurrentIssue();
        }

    )

    .controller('MapController', function($log,$scope,geolocation){


    })



    .controller('AddIssueCtrl',
        function($scope,$resources,$http,apiUrl){

            $scope.description=myIssueAdd.description;
            $scope.lng.myIssueLng;
            $scope.lat.myIssueLat;
            $scope.imageUrl.myIssueUrl;
            $scope.issueTypeId.myIssueTypeId,


                $scope.pushNewIssue=function(){
                    $http.post(apiUrl+'/issues/').success(function(issueCurrent){

                    })
                }
        })