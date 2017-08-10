angular.module('app').factory('site', function($http,appConfig){
    
        return{
            getSparkDetails:function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id,
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            getAllSites:function(){
                 return $http({
                    url:appConfig.main.apis.main+'gaia/site',
                    method:'GET'                    
                })
            },
            getAreas:function(site_id){
                return $http({
                    url:appConfig.main.apis.over_db+appConfig.main.apis.areasByBuilding+'/'+site_id,
                    method:'GET'
                })
            },
            getSparkAreas:function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id+'/subsite',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            getGateways:function(site_id){
                return $http({
                    url:appConfig.main.apis.over_db+appConfig.main.apis.gatewaysByBuilding+site_id,
                    method:'GET'
                })
            },
            getSap:function(){
                return $http({
                    url:'https://api.sparkworks.net/v1/resource',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            getResources: function(site_id){
                return $http({
                    url:appConfig.main.apis.main+appConfig.main.apis.site+'/'+site_id+'/resource',
                    method:'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}                    
                })
            },
            getDetails : function(site_id) {
                return $http({
                    url: appConfig.main.apis.over_new_api+site_id+"/siteInfo",
                    method: 'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })
            },
            syncCNIT:function(site_id){
              return $http({
                    url: appConfig.main.apis.cnit+'building/'+site_id,
                    method: 'PUT',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })  
            },
            getRules:function(site_id){
                return $http({
                    url: appConfig.main.apis.cnit+'building/'+site_id+'/events',
                    method: 'GET',
                    headers: {"Accept": "application/json","Authorization":"bearer "+appConfig.main.auth_token}
                })    
            }                        
        }
       
});
