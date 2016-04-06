angular.module('citizen-engagement.listIssues',[])
.service('IssueService', function($http,apiUrl){ 
    //get the issues
    this.getIssues = function(offset,limit,callback){
      $http({
        method: 'GET',
        url: apiUrl+ '/issues',
        headers: {'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='} 
      }).success(callback);
    }
})

//to do : pagniation, headers, 
.controller('ListIssueCtrl', function(IssueService,$scope) {
  var offset = 0;
  $scope.issues = [];

  //Gestion de la pagination
  $scope.addIssues = function() {
    IssueService.getIssues(offset,30,function(data){
      $scope.issues = $scope.issues.concat(data);
    });

    offset+=30;
  }

  $scope.addIssues();

})
