/**
 * Created by Sabine on 05.04.2016.
 */

angular.module('citizen-engagement.issue', [])

    .controller('IssueListCtrl',
        function ($scope, $http, apiUrl, $state) {

            /* scroll*/
            $scope.noMoreItemsAvailable = false;
            var i = 0;
            var currentPage = 0

            $scope.loadMore = function () {

                i++;
                $http({
                    method: 'GET',
                    url: apiUrl + '/issues',
                    headers: {
                        'x-pagination': currentPage + ";4",
                        'x-sort': '-createdOn'
                    }
                }).success(function (issues) {
                    $scope.issues = $scope.issues.concat(issues);

                    if (issues.length == 0) {
                        $scope.noMoreItemsAvailable = true;
                    }
                });

                currentPage++;


                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
            /* End scroll*/
            $scope.loadIssues = function () {
                console.log("ok");
                $http.get(apiUrl + '/issues', {headers: {'x-sort': '-createdOn'}}).success(function (issues) {

                    $scope.issues = issues;

                    console.log("j'ai la première issue du tableau" + issues[0]);

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

    .controller("issueDetailCtrl", function ($scope, $http, apiUrl, $stateParams) {
        console.log("j'arrive à récupe le paramètre" + $stateParams);
        var id = $stateParams.issueId;
        console.log('id ' + id);
        $http({
            method: 'GET',
            url: apiUrl + '/issues/' + id
        }).success(function (issue) {
            console.log("okbla");

            $scope.issue = issue;
            console.log("j'ai mon issue" + issue);

        });


    })


    .controller('NewCommentCtrl',
        function ($scope, $http, apiUrl, $stateParams) {
            console.log("j'arrive à récupe le paramètre" + $stateParams);
            var id = $stateParams.issueId;
            console.log('id ' + id);


            $scope.comment = {};

            $scope.submit = function () {
                console.log("je test")
                var link = apiUrl + '/issues/' + id + '/actions/'
                $http.post(link, {
                    type: "comment",
                    payload: {
                        text: $scope.action.payload.text
                    }


                }).then(function (res) {
                    console.log("0 " + $scope.action.payload.text);
                    $scope.response = res.comment;
                    console.log('voilà la réponse: ' + $scope.reponse);
                });
            };


        }
    )

    .controller('NewIssueCtrl',
        function ($scope, $http, apiUrl, GeolocServiceFla, CameraService, qimgUrl, qimgToken) {
            $scope.loadIssueTypes = function () {
                console.log("ok");
                $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {

                    $scope.issueTypes = issueTypes;

                    console.log(issueTypes[0]);

                });
            };
            $scope.loadIssueTypes();
            GeolocServiceFla.locateUser().then(function (coords) {
                console.log("lat 1:" + coords.latitude);
            });


            $scope.issue = {};

            $scope.submit = function () {

                console.log("je test")
                $http({
                    method: "POST",
                    url: qimgUrl + "/images",
                    headers: {
                        Authorization: "Bearer " + qimgToken
                    },
                    data: {
                        data: $scope.imageData
                    }
                }).success(function (data) {
                    var imageUrl = data.url;
                    $scope.issue.imageUrl = imageUrl;
                    console.log($scope.issue.imageUrl);

                    var link = apiUrl + '/issues'
                    $http.post(link, {
                        description: $scope.issue.description,
                        lng: $scope.issue.lng,
                        lat: $scope.issue.lat,
                        //imageUrl: $scope.issue.imageUrl,
                        imageUrl: $scope.issue.imageUrl,
                        issueTypeId: $scope.issue.issueTypeId,


                    }).then(function (res) {
                        console.log("0 " + $scope.issue.issueTypeId);
                        console.log("1 " + $scope.issue.description);
                        $scope.response = res.issue;
                        console.log('voilà la réponse: ' + $scope.response);
                    });

                }).error(function (error) {
                    console.log("error: " + JSON.stringify(arguments));
                });


            };
            $scope.takePicture = function () {
                console.log("picture");
                CameraService.getPicture({
                    quality: 75,
                    targetWidth: 400,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.DATA_URL
                }).then(function (imageData) {
                    $scope.imageData = imageData;
                    console.log($scope.imageData);


                });


            };


        }
    )




