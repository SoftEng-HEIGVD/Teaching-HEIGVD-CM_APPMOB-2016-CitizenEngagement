angular.module('citizen-engagement.mapIssues',[])

//main controller to display the issues on the map
.controller('MapIssueCtrl',  function(IssueService,$scope,leafletData,$http,geolocation,mapboxMapId, mapboxAccessToken) {
    $scope.mapDefaults ={};
    $scope.mapMarkers = [];
    $scope.query = {};

    //default center of the map
    $scope.bern = {
                lng: 7.4474,
                lat: 46.9480,
                zoom: 8
            };

    //get and set the issues markers according to the given coordinates
    function getSetIssuesMarkers(longitude,latitude){
        $scope.finishedLoading = false;    
        //get the bounding box
        var bBox = {};

        //displays the map (we need that to set the new center)
        $scope.finishedLoading = true;    

        leafletData.getMap("map").then(function(map) {
            //set the center with the given lat and long
            var center = [latitude,longitude];
            map.setView(center,12);

            //update the view of the map (the markers in the bouding box will be shown)
            updateView();   
            
        });
  
    }

    //updates the view, loads the issues contained in the BoundingBox
    function updateView(){
        leafletData.getMap("map").then(function(map) {

            //get the bounding box and convert it to work with the API
            bBox = boundsToBboxQuery(map.getBounds());

            //get 100 issues contained within the bBox, note : we use the custom query search
            IssueService.getIssues(0,10000,function(data){
                 $scope.mapMarkers = [];
                for(var i=0;i<data.length;i++){

                    //create an object for each marker
                    var container = Object.create(null);

                    container.issue = data[i];

                    /*
                    Note : The button is not working
                    */
                    $scope.mapMarkers.push({
                        lat: container.issue.lat,
                        lng: container.issue.lng,
                        message: "<p>" + container.issue.description+ "</p><img src='"+ container.issue.imageUrl + "' width='200px' /> <button ng-click='open("+10+")' class='button button-full'>lol</button>",
                        getMessageScope: function() {
                            var scope = $scope.$new();
                            scope.issue = container.issue;
                            scope.open = function(test){
                               console.log(scope.issue);
                            }
                            return scope;
                        }
                     }); 
                          
                }
            },bBox);
        });
    }

    //changes the view when map moves (zoom or drag)
    $scope.$on('leafletDirectiveMap.map.focus', function(event){
       updateView();
    });

    $scope.$on('leafletDirectiveMap.map.drag', function(event){
       updateView();
    });
    
    
    //converts leaflets' bounds to a compatible bBox for the API
    function boundsToBboxQuery(bounds){
       return  {
            "$and": [ {
                "lat": {
                  "$gte": bounds._southWest.lat,
                  "$lte": bounds._northEast.lat
                }
                }, {
                  "lng": {
                    "$gte": bounds._southWest.lng,
                    "$lte": bounds._northEast.lng
                  }
                 }
            ]
        }
    }

    //updates the map when the user types a location
    $scope.updateMap = function (){

        //get the nearby location --> api Mapbox
        if($scope.query.location !=""){
            $http({
                method: 'GET',
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/"+$scope.query.location+".json?access_token=" + mapboxAccessToken
            }).success(function(data){
                //access the results of mapBox
                if(data.features!=undefined){
                    var longitude = data.features[0].center[0];
                    var latitude = data.features[0].center[1];
                    $scope.mapCenter = {
                         lat: latitude,
                         lng: longitude,
                         zoom: 12
                    };

                    //set the center and the markers
                    getSetIssuesMarkers(longitude,latitude);
                }            
            });   
        }
        
    }

    //default pos (Bern)
    var longitude = 7.4474;
    var latitude = 46.9480;


    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
    
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };

    //web app geoloc
    geolocation.getLocation().then(function(data) {
        longitude = data.coords.longitude;
        latitude = data.coords.latitude;

        getSetIssuesMarkers(longitude,latitude);
     
    }, function(error) {
       console.log("error with the geoloc");
    });

    //native geoloc
    navigator.geolocation.getCurrentPosition(function(position){
         getSetIssuesMarkers(position.coords.latitude,position.coords.longitude);
    });

    //set default
    getSetIssuesMarkers(longitude,latitude);
    
});
  
