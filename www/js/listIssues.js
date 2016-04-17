/*
NOTE : THERE IS A BUG IN THE API
the coordinates are all the same when we use a "-" sort e.g -updatedOn sort
*/

angular.module('citizen-engagement.listIssues',['ionic'])
.service('IssueService', function($http,apiUrl){
    //get the issues
    this.getIssues = function(offset,limit,callback,query){
      //if the query is specified
      if(query==undefined){
        $http({
            method: 'GET',
            url: apiUrl+ '/issues',
            headers: {
              'X-Pagination': offset+';'+limit,
              "X-Sort" : "-updatedOn -createdOn"
            }
          }).success(callback);
        }
      //custom query  
      else{
        $http({
          method: 'POST',
          url: apiUrl+ '/issues/search',
          headers: {
            'X-Pagination': offset+';'+limit
          },
          data:query
          }).success(callback);
        }
      };

})


.controller('ListIssueCtrl', function(IssueService,$scope) {
  var offset = 0;
  $scope.issues = [];

  //ajax loading of the issues
  $scope.addIssues = function() {
    IssueService.getIssues(offset,10,function(data){
      //pretty dates
      for(var i=0; i<data.length;i++){
         data[i].prettyUpdatedOn = moment(data[i].updatedOn).fromNow();
      }
      $scope.issues = $scope.issues.concat(data);
    });

    offset+=1;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }




})
