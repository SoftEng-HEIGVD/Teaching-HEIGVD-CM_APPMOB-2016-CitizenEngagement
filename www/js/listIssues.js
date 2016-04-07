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
      else{
        $http({
          method: 'POST',
          url: apiUrl+ '/issues/search',
          headers: {
            'X-Pagination': offset+';'+limit,
            "X-Sort" : "-updatedOn -createdOn"
          },
          data:query
          }).success(callback);
        }
      };

})

//to do : pagniation, headers, 
.controller('ListIssueCtrl', function(IssueService,$scope) {
  var offset = 0;
  $scope.issues = [];

  //Gestion de la pagination
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
