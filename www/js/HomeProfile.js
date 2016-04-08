angular.module('citizen-engagement.homeProfile',[])

    .controller('HomeController',
        function ($scope, $http, apiUrl, IssueService) {

            $scope.loadIssuesByUser = function () {
                console.log("ok my issues");

                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    console.log(issues);
                });

            }
            $scope.$on('$ionicView.beforeEnter', function () {

                $scope.loadIssuesByUser();
            });


        })

    .controller('ProfileController',
        function ($scope, $http, apiUrl, AuthService, IssueService) {

            $scope.loadUserInfo = function () {
                console.log("ok my issues");

                userId = AuthService.currentUserId;
                $http.get(apiUrl + '/users/' + userId).success(function (user) {

                    $scope.user = user;

                    console.log(user);


                });
            }


            $scope.countIssues = function () {
                IssueService.findIssuesByUser().then(function (issues) {
                    $scope.issues = issues;
                    $scope.nbIssues = issues.data.length;


                });
            };
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.issues = null;
                $scope.loadUserInfo();
                $scope.countIssues();
            });


        })