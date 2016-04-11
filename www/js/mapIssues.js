angular.module('citizen-engagement.mapIssues',[])

//to do : pagniation, headers, 
.controller('MapIssueCtrl',  function(IssueService,$scope, $http,geolocation,mapboxMapId, mapboxAccessToken) {
    $scope.mapCenter={};
    $scope.mapDefaults ={};
    $scope.query = {};

    //get and set the issues markers   
    function getSetIssuesMarkers(longitude,latitude){
         //the geo query
        var query = {};
        query.loc = {
                "$geoWithin":{
                    "$centerSphere":[
                        [longitude,latitude],5
                    ]
                }
         };
        
        $scope.mapCenter = {
           lat: latitude,
           lng: longitude,
           zoom: 13  
        }

        IssueService.getIssues(0,10,function(data){

                for(var i=0;i<data.length;i++){
                    var issue = data[0];
                    $scope.mapMarkers = [];

                    $scope.mapMarkers.push({
                        lat: issue.lat,
                        lng: issue.lng,
                        message: "<p>{{ issue.description }}</p><img src='{{ issue.imageUrl }}' width='200px' />",
                        getMessageScope: function() {
                            var scope = $scope.$new();
                            scope.issue = issue;
                            return scope;
                        }
                     });        
                }
                $scope.finishedLoading = true;
            },query);
           
    }    


    $scope.updateMap = function (){

        //get the nearby location --> api Mapbox
        if($scope.query.location !=""){
            $http({
                method: 'GET',
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/"+$scope.query.location+".json?access_token=" + mapboxAccessToken
            }).success(function(data){
                if(data.features!=undefined){
                    var longitude = data.features[0].center[0];
                    var latitude = data.features[0].center[1];
                    $scope.mapCenter = {
                         lat: latitude,
                         lng: longitude,
                         zoom: 12
                    };
                    getSetIssuesMarkers(longitude,latitude);
                }            
            });   
        }
        
    }

    //default pos
    var longitude = 7.4474;
    var latitude = 46.9480;


    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };

    geolocation.getLocation().then(function(data) {
        longitude = data.coords.longitude;
        latitude = data.coords.latitude;

        getSetIssuesMarkers(longitude,latitude);
     
    }, function(error) {
       
    });

    navigator.geolocation.getCurrentPosition(function(position){
         getSetIssuesMarkers(position.coords.latitude,position.coords.longitude);
    });

    //set default
    getSetIssuesMarkers(longitude,latitude);
    
});
  
