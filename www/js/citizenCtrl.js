angular.module('citizen-engagement.citizenCtrl',['geolocation'])

    .controller('IssueListCtrl',
        function ($scope, $http,apiUrl,geolocation) {

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
            $scope.issues=[];

            var counter=0;

            $scope.loadIssues=function(){



                $http.get(apiUrl+'/issues',
                    {
                        headers:{

                            'x-pagination':""+counter+";10"
                        }

                    }).success(function(issues){
                    $scope.issues=$scope.issues.concat(issues);

                    counter++;
                    console.log(counter);
                })
            };

            $scope.submitIssue= function(issue){

                geolocation.getLocation().then(function(data){
                    issue.lat=data.coords.latitude;
                    issue.lng=data.coords.longitude;



                    issue.imageUrl="http://marieclaudeducas.com/wp-content/uploads/2015/08/Cecil-the-Lion.jpg";

                    console.log(issue);


                })
                $http({
                    method: 'POST',
                    url: apiUrl+'/issues',
                    data: issue

                });







     /*         $scope.lng.myIssueLng;
                $scope.lat.myIssueLat;
                $scope.imageUrl.myIssueUrl;
                $scope.issueTypeId.myIssueTypeId,*/
/*

                    $scope.pushNewIssue=function(){
                        $http.post(apiUrl+'/issues/').success(function(issueCurrent){

                        })
                    }*/



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





        
