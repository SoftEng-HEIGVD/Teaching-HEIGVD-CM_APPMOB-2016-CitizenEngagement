angular.module('FixYourStreet.listIssue', [])

.service('IssueService', ['$http', 'apiUrl', function($http, apiUrl) {

    this.getAllIssuesArea = function (bbox, callback) {
        $http({
          method: 'POST',
          url: apiUrl + '/issues/search',
          headers: {
            'x-sort': 'updatedOn',
            'x-pagination': '0;100'
          },
          data:{
            "$and": [ {
              "lat": {
                "$gte": bbox._southWest.lat,
                "$lte": bbox._northEast.lat
              }
              }, {
                "lng": {
                  "$gte": bbox._southWest.lng,
                  "$lte": bbox._northEast.lng
                }
              }
            ]
          }
      }).success(callback)
    }
}])

;
