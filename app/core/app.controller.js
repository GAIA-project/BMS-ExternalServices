(function () {
    'use strict';
    var App = angular.module('app');
<<<<<<< HEAD
   App.controller('ChartController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
=======
    App.controller('RuleCtrl',function($scope,$state){
     

        $scope.rules = [];
        $scope.sensors = ('sensor1 sensor2 sensor3 sensor4 sensor5').split(' ').map(function(state) {
            return {name: state};
        });


            $scope.verbs = ('> < =').split(' ').map(function(state) {
                return {verbname: state};
            })


            $scope.add_condition = function(){
                $scope.rules.push({name:'',sensor:''});
            }
            
            if($scope.rules.length==0)
                $scope.add_condition();



           

    })
    .controller('RuleEngineCtrl',function($scope,$state){
        $scope.add_a_rule = function(){
            $state.go('page/add-a-rule');
        }

      
    })
    .controller('RecommendationsCtrl',function($scope){
        $scope.recommendations = [];
        $scope.recommendations.push({title:'Turn-off the light', content:'Turn-off the light when leaving'});
        $scope.recommendations.push({title:'Natural Light',      content:'Make the most of the natural light'});
        $scope.recommendations.push({title:'Thermostat',         content:'Change the thermostat settings in rooms to 26°C during warmer months and 20°C during cooler months. Doing so will rationalise the heating and air conditioning use'});
        $scope.recommendations.push({title:'Doors',              content:'keep your classroom doors closed whenever possible.'});
        
    })
    .controller('ClassInstanceCtrl',function($scope, $uibModalInstance){
        $scope.sensors = [];
       
       $scope.sensors.push({uri:'site-141587/Atmospheric Pressure',resourceId:'144991',name:'Temperature Sensor'});
       $scope.sensors.push({uri:'site-141587/External Ammonia Concentration',resourceId:'146628',name:'Ammonia Concentration'});
       $scope.sensors.push({uri:'libelium-00066650456e/hum',resourceId:'144119',name:'Humidity Sensor'});
       $scope.sensors.push({uri:'libelium-00066650456e/co',resourceId:'144122',name:'CO Sensor'});
       $scope.sensors.push({uri:'Power Consumption',resourceId:'144123',name:'Power Consumption Sensor'});
       $scope.sensors.push({uri:'Radiation',resourceId:'144124',name:'Radiation Sensor'});

        $scope.ok = function() {
            $uibModalInstance.close($scope.new_class); 
            $scope.$parent.$broadcast('new_class_created', $scope.new_class);           
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    })
    .controller('AlertCtrl',function($scope, $mdDialog){

        $scope.alerts = [
            { name: 'The Light in ClassRoom 5 is switched on',     newMessage: true,id:1 },
            { name: 'The Temperature sensor is not sending measurements',       newMessage: false,id:2 },
            { name: 'It is too hot in classroom 4',     newMessage: false,id:3 }
        ];        
        $scope.goToAlert = function(person, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .content('Inspect ' + person)
                    .ariaLabel('Person inspect demo')
                    .ok('Ok!')
                    .targetEvent(event)
            );
        };
        $scope.navigateTo = function(to, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .content('Imagine being taken to ' + to)
                    .ariaLabel('Navigation demo')
                    .ok('Ok!')
                    .targetEvent(event)
            );
        };
        $scope.doSecondaryAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Secondary Action')
                    .content('Secondary actions can be used for one click actions')
                    .ariaLabel('Secondary click demo')
                    .ok('Neat!')
                    .targetEvent(event)
            );
        };
    })
    .controller('authCtrl',function($scope,$window,$location,appConfig,authentication){
        
        appConfig.main.auth_token = '';
        $scope.user = {};

        $scope.authenticate= function(){
            $scope.login_error = 0;
            if($scope.user.username!='' && $scope.user.password!=''){

                appConfig.main.username = $scope.user.username;
                appConfig.main.password = $scope.user.password;
                var auth  = authentication.authenticate();
                
                auth.then(function(auth) {
                    console.log(auth.data.access_token);
                    appConfig.main.auth_token = auth.data.access_token;                
                    var role = authentication.getRole();
                    role.then(function(a){
                        if(a.data.authenticated){
                            appConfig.main.auth_role = a.data.authorities[0].authority;
                            console.log("Authority: "+appConfig.main.auth_role);
                            $location.url('/page/buildings');
                        }
                    });
                    

                }, function(err) {
                    $scope.login_error = 1;
                }); 



            }else{
                    $location.path('page/signin');

            }


        }
        
        $scope.login = function() {
            $location.url('/')
        }

        $scope.signup = function() {
            $location.url('/')
        }

        $scope.reset =    function() {
            $location.url('/')
        }

        $scope.unlock =    function() {
            $location.url('/')
        } 
    })
    .controller('BuildingRulesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter){
        $scope.add_a_rule_form = 0;
        $scope.building = {};
        $scope.rules = [];

        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
            });
        }


        $scope.getSensors = function(){

            var area_sensors = Area.getSensors($scope.selected_area);
            area_sensors.then(function(sensors){

                $scope.selected_area_sensors = sensors.data.items;  
                console.log($scope.selected_area_sensors);
                            
            }).catch(function(error){
              console.log(error);  
                /*$scope.error = 1;
                $scope.error_text = "Currently there is an error with the database connection. Please try it later";*/
            });
        
        }

        $scope.addRule = function(){
            $scope.add_a_rule_form = 1;
            $scope.getSensors();
        }

        $scope.getRules = function(area){
            $scope.sel_area = area;
            var area_id = area.id;
            $scope.selected_area_name = area.name;
            $scope.add_a_rule_form = 0;
            $scope.selected_area = area_id;
            var req = {
                 method: 'GET',
                 url: appConfig.main.apis.cnit+'area/'+area_id+'/rules',
                 headers: {
                   'Content-Type': 'application/json'
                 }
            }
            $http(req).then(function(d){
                  console.log(d);
                  $scope.rulesList = d.data;
            }, function(e){
                console.log(e);
            });
        }
        $scope.deleteRule = function(rule){
            console.log(rule);
            console.log(rule.rid);
            console.log();
            var req = {
                 method: "DELETE",
                 url: appConfig.main.apis.cnit+'rules/'+rule.rid.replace('#',''),
                 headers: {
                   'Content-Type': 'application/json'
                 }
            }
            $http(req).then(function(d){
                  $scope.rule = {};
                  $scope.getRules($scope.sel_area);
                  
            }, function(e){
                console.log(e);
            });
        
        }
        $scope.editRule = function(rule){
            $scope.add_a_rule_form = 1;
            $scope.getSensors();
            console.log(rule);
            $scope.rule = {};
            $scope.rule.name = rule.fields.name;
            $scope.rule.description = rule.fields.description;
            $scope.rule.operator = rule.fields.operator;
            $scope.rule.suggestion = rule.fields.suggestion;
            $scope.rule.threshold = rule.fields.threshold;
            $scope.rule.uri = rule.fields.uri;
            $scope.rule.rid = rule.rid;
            $scope.rule.edit = 1;
        }
        $scope.cancel_new_rule = function(){
            $scope.rule = {};
            $scope.add_a_rule_form=0;
        }
        $scope.save_new_rule = function(){

            if($scope.rule.edit==1){
                var method = "PUT";
                var url = appConfig.main.apis.cnit+'rules/'+$scope.rule.rid.replace('#','');
            }
            else{
                var url = appConfig.main.apis.cnit+'area/'+$scope.selected_area+'/rules';
                var method = "POST";
            }

            var data = {
                "class":"SimpleThresholdRule",
                "fields":{
                    "name":             $scope.rule.name,
                    "description":      $scope.rule.description,
                    "operator":         $scope.rule.operator,
                    "suggestion":       $scope.rule.suggestion,
                    "threshold":        $scope.rule.threshold,
                    "uri":              $scope.rule.uri
                }
            };

            var req = {
                 method: method,
                 url: url,
                 headers: {
                   'Content-Type': 'application/json'
                 },
                 data:data
            }
            $http(req).then(function(d){
                  $scope.rule = {};
                  $scope.getRules($scope.sel_area);
                  
            }, function(e){
                console.log(e);
            });
        }



    })
    .controller('SitesController',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location,site,Area){
        
      
        $scope.loading = 0;
        var init = function(){
            $scope.loading = 1;

            appConfig.main.selected_building = 0;
            var x = buildings.getAllBuildings();
            var m = buildings.getSites();
            m.then(function(bs){
               $scope.loading = 0;
                $scope.abuildings = [];
                bs.data.sites.forEach(function(ssite,index){
                    if(ssite.master){                    
                        $scope.abuildings.push(ssite);
                    }
                });
            }).catch(function(error){
                $scope.loading = 0;
                $scope.error = 1;
                $scope.error_text = "Currently there is an error with the database connection. Please try it later";
            });
        }

        $scope.details = function(id){
            appConfig.main.selected_building = id;
            $location.path('page/building/view/'+id);
        }
        
        $scope.add_new = function(){
            $state.go('page/building/new');
        }
        init();
        
    })
    .controller('AnomaliesController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Anomaly){
        

        $scope.getAnomalies=function(){
            var anomalies = Anomaly.getAnomalies($stateParams.id,1489442400000,1489142400000);
            anomalies.then(function(tanomalies){
                console.log('The Anomalies');
                console.log(tanomalies);    
            });
            
        }
        $scope.openAnomaly = function(id){
            
  
            $location.path('page/anomaly/view/'+id);   
        }
        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(site){
           $scope.site = site.data; 
           
        });


    })
    .controller('AnomalyCtrl',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log){
        $scope.goToAnomalies = function(){
            $location.path('page/building/anomalies/141587');   
        }


        $scope.atags = [];
        $scope.atags.push({"id":1,"value":"tag1"});
        $scope.atags.push({"id":2,"value":"tag2"});
        $scope.atags.push({"id":3,"value":"tag3"});
        $scope.atags.push({"id":4,"value":"tag4"});
        
        $scope.addTag = function(){
            var a = {};
            a.id = $scope.atags.length+1;
            a.value = $scope.new_tag;
            $scope.atags.push(a);
            $scope.new_tag = "";
            
        }
        $scope.line3 = {};
        $scope.line3.options = {
            title : {
                text: 'Energy Consumption',
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['kWh']
            },
            toolbox: $rootScope.toolbox,
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['9:50','9:51','9:52','9:53','9:54','9:55','9:56','9:57','9:58','9:59','10:00','10:01','10:02','10:03','10:04','10:05','10:06']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'kWh',
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:[10, 11, 12, 54, 12,10.5, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
                },
              
            ]
        };
        

    })
    .controller('SiteAreasController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,$filter){
        
        $scope.building = {};
        $scope.new_virtual_sensor = {};
        
        $scope.available_observes = [];
        $scope.available_observes.push({'name':'Light2','encoded_name':'light2','uom':'lux2'});
        $scope.available_observes.push({'name':'Light','encoded_name':'light','uom':'lux'});

        $scope.available_types = [];
        $scope.available_types.push({'name':'BUILDING','id':'1'});
        $scope.available_types.push({'name':'FLOOR','id':'1'});
        $scope.available_types.push({'name':'ROOM','id':'1'});
        $scope.available_types.push({'name':'LAB','id':'1'});
        $scope.available_types.push({'name':'CLASSROOM','id':'1'});
        $scope.available_types.push({'name':'GYM','id':'1'});
        $scope.available_types.push({'name':'HALL','id':'1'});
        $scope.available_types.push({'name':'CORRIDOR','id':'1'});
        $scope.available_types.push({'name':'ELEVATOR','id':'1'});
        $scope.available_types.push({'name':'OTHER','id':'1'});




        $scope.translations = {};
        $scope.translations.el = {};
        $scope.translations.en = {};
        $scope.translations.sw = {};
        $scope.translations.it = {};

        $scope.translations.el.description = "Περιγραφή";
        $scope.translations.el.subareas = "Υποπεριοχές";
        $scope.translations.el.sensors = "Αισθητήρες";


        $scope.translations.it.description = "description";
        $scope.translations.it.subareas = "subareas";
        $scope.translations.it.sensors = "sensors";

        switch ($rootScope.lang) {
            case 'en':
                $scope.language = $scope.translations.en;                        
                break; 
            case 'el':
                $scope.language = $scope.translations.el; 
                break; 
            case 'sw':
                $scope.language = $scope.translations.sw; 
                break; 
            case 'it':
                $scope.language = $scope.translations.it; 
                break; 
            default: 
                $scope.language = $scope.translations.el;                         
        }


        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(tsite){            
            $scope.building.details = tsite.data;
        });



        
        


        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
            });
        }

       $scope.createSiteInfo = function(area){
        
        
        var k = Area.createSiteInfo(area);
            k.then(function(info){
                console.log(info);
            }).catch(function(e){
                console.log(e);
                $scope.error_view = 1;
                $scope.error_text +=e.statusText;
               
            });


       }

        $scope.details = function(area){
            console.log(area);
            $scope.selected_area_view = 1;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 0;

            $scope.error_view = 0;
            $scope.error_text = "";

            $scope.selected_area = area;
            
            var resources = Area.getResources(area.id);
            resources.then(function(info){

                $scope.selected_area.resources = info.data.resources;
                $scope.selected_area.subareas = info.data.subsites;
                $scope.selected_area.name = area.name;

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                console.log(e);
            });

            var k = Area.getSiteInfo(area.id);
            k.then(function(info){


                $scope.selected_area_view=1;
                $scope.selected_area.siteInfoId = info.data.siteInfoId;
                $scope.selected_area.overObj = info.data;

                var tjson = JSON.parse(info.data.json);

                
                $scope.selected_area.description    = (!$rootScope.isUndefined(tjson)?tjson.description:'');
                $scope.selected_area.type           = (!$rootScope.isUndefined(info.data.type)?info.data.type:'');
                $scope.selected_area.width          = (!$rootScope.isUndefined(tjson)?tjson.width:'');
                $scope.selected_area.length         = (!$rootScope.isUndefined(tjson)?tjson.length:'');
                $scope.selected_area.height         = (!$rootScope.isUndefined(tjson)?tjson.height:'');

            }).catch(function(e){
                console.log(e);
                if(e.status==404){
                    $scope.createSiteInfo(area);
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;
                }
            });

        }

    
   
        $scope.updateArea = function(){
            console.log($scope.selected_area);
            $scope.selected_area.overObj.json=JSON.stringify({width:$scope.selected_area.width,height:$scope.selected_area.height,length:$scope.selected_area.length,description:$scope.selected_area.description});
            $scope.selected_area.overObj.type = $scope.selected_area.type;
            
            var k = Area.updateSiteInfo($scope.selected_area.siteInfoId,$scope.selected_area.overObj);
            k.then(function(a){
                $rootScope.saved();
                $scope.details($scope.selected_area);

            }).catch(function(err){
                $scope.error_view =true;
                $scope.error_text = err.statusText;
            });
        }

        
        $scope.edit = function(){
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 1;
            
        }
        $scope.add_an_area = function(){
            $scope.new_area = {};
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 1;  
            $scope.selected_area_edit = 0;
        }
        $scope.cancel_edit_area = function(){
            $scope.selected_area_view = 1;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 0;
           $scope.details($scope.selected_area);
        }
        $scope.cancel_new_area = function(){
            
            $scope.selected_area_view = 0;
            $scope.add_an_area_form = 0;  
            $scope.selected_area_edit = 1;
        }
       

        $scope.update = function(){

            var data = {"json":JSON.stringify({width:$scope.selected_area.width,height:$scope.selected_area.height,length:$scope.selected_area.length}),"building_id":$stateParams.id,"name":$scope.selected_area.name,"description":$scope.selected_area.description,"type":$scope.selected_area.type,"id":$scope.selected_area.id};

            var req = {
                 method: 'PUT',
                 url: appConfig.main.apis.over_db+appConfig.main.apis.areas,
                 headers: {
                   'Content-Type': 'application/json'
                 },
                 data: data
            }

            $http(req).then(function(d){
                    
                    $scope.selected_area = d.data.area;
                    $scope.getInitAreas();
                    $scope.details($scope.selected_area.id);

            }, function(e){console.log(e)});
        }

      
        
        

    
    })
    .controller('SiteEditController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Sensor,UoM,Area){
        



        $scope.add_a_chart_visible_form = 0;
        $scope.new_chart = {};
        $scope.extra_charts = [];       
        $scope.school = {};
        $scope.error_view=false;
        $scope.error_text="";
        $scope.jjson = {};


        $scope.translations = {};
        $scope.translations.el = {};
        $scope.translations.en = {};
        $scope.translations.sw = {};
        $scope.translations.it = {};

        $scope.translations.el.general_characteristic = "Γενικά Χαρακτηριστικά";
        $scope.translations.el.construction_characteristics = "Κατασκευαστικά Χαρακτηριστικά";
        $scope.translations.el.resources = "Γραφήματα & Αισθητήρες";
        $scope.translations.el.psiksi = "Σύστημα Ψύξης";
        $scope.translations.el.thermansi = "Σύστημα Θέρμανσης";

        $scope.translations.en.general_characteristic = "Genelar Characteristics";
        $scope.translations.en.construction_characteristics = "Construction Characteristics";
        $scope.translations.en.resources = "Resources";
        $scope.translations.en.psiksi = "Cooling System";
        $scope.translations.en.thermansi = "Heating System";

        switch ($rootScope.lang) {
            case 'en':
                $scope.language = $scope.translations.en;                        
                break; 
            case 'el':
                $scope.language = $scope.translations.el; 
                break; 
            case 'sw':
                $scope.language = $scope.translations.sw; 
                break; 
            case 'it':
                $scope.language = $scope.translations.it; 
                break; 
            default: 
                $scope.language = $scope.translations.el;                         
        }


        $scope.available_uom = [];


        $scope.getAvailableUoM = function(){
            
            var m = UoM.getUoMs();
            m.then(function(datas){
                console.log(datas);
                $scope.available_uom = datas.data.unitConversions;
                $scope.available_uom.push({'target':''});

            });   
        }

             

        $scope.getUOMForExtraResource = function(ch){
            console.log(ch);

            var deta = Sensor.getDetailsFromSparks(ch.resource_id);
                deta.then(function(det){
                    console.log(det);
                    ch.default_uom = det.data.uom;
                    ch.default_uom = ch.default_uom;
                    var x = UoM.getAvailableTargets(ch.default_uom);
                    x.then(function(results){
                        console.log(results);
                        ch.available_uoms = results.data.unitConversions;
                        ch.available_uoms.push({'target':det.data.uom});
                        
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })
        }



          $scope.getUOMForResource = function(resource,where){
            console.log(resource);
            console.log(where);
            
            if(where=="energy"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log("DET");
                    console.log(det);
                    $scope.jjson.energy_consumption_resource_default_uom = det.data.uom;
                    console.log($scope.jjson.energy_consumption_resource_default_uom);
                    console.log("DET UOM: "+det.data.uom);


                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        console.log(results);
                        $scope.available_energy_uoms = results.data.unitConversions;
                        $scope.available_energy_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


             if(where=="temperature"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.temperature_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.temperature_resource_uoms = results.data.unitConversions;
                        $scope.temperature_resource_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


            if(where=="luminosity"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.luminosity_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.available_luminosity_uoms = results.data.unitConversions;
                        $scope.available_luminosity_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }


            if(where=="relative_humidity"){
                
                var deta = Sensor.getDetailsFromSparks(resource);
                deta.then(function(det){
                    console.log(det);
                    $scope.jjson.relative_humidity_resource_uom = det.data.uom;
                    var x = UoM.getAvailableTargets(det.data.uom);
                    x.then(function(results){
                        $scope.available_relative_humidity_uoms = results.data.unitConversions;
                        $scope.available_relative_humidity_uoms.push({'target':det.data.uom});
                        console.log("RESULTS");
                        console.log(results);
                    }).catch(function(error){
                        $scope.error_view=1;
                        $scope.error_text = error.statusText;    
                    })
                }).catch(function(err){
                    $scope.error_view=1;
                    $scope.error_text = err.statusText;
                })

            }

        }
        $scope.getResources = function(){ 

            var available_resources = site.getResources($stateParams.id);
                available_resources.then(function(resources,index){
                    $scope.available_resources = [];
                    resources.data.resources.forEach(function(tresource){                        
                        $scope.available_resources.push({id:tresource.resourceId,uri:tresource.uri});
                    });
                });
        }
        
        $scope.getSparkDetails = function(){
            $scope.loading = 1;
            var t_site = site.getSparkDetails($stateParams.id);
            t_site.then(function(site) {
                $scope.sparkworks_details = site.data;
            }).catch(function(e){
                $scope.loading = 0;
                $scope.error_view=true;
                $scope.error_text = e.statusText;
            });
        }
        $scope.getSparkDetails();
        $scope.createSiteInfo = function(area){
            $scope.loading = 1;
        
                    var area = {
                        "id":$scope.site_id,
                        "greekLocalizedName": $scope.sparkworks_details.name,
                        "italianLocalizedName": $scope.sparkworks_details.name,
                        "swedishLocalizedName": $scope.sparkworks_details.name,
                        "englishLocalizedName": $scope.sparkworks_details.name
                    };
        
        var k = Area.createSiteInfo(area);
            k.then(function(info){
                $scope.getInfo();
                $scope.loading = 0;
            }).catch(function(e){
                console.log(e);
                $scope.loading = 0;
                $scope.error_view = 1;
                $scope.error_text +=e.statusText;
               
            });


       }

        $scope.getInfo = function(){
            $scope.loading = 1;
            $scope.site_id = $stateParams.id;

            var k = Area.getSiteInfo($scope.site_id);
            k.then(function(info){
                $scope.loading = 0;
                console.log("Info");
                console.log(info);
                $scope.info = info.data;

                
                
                if($rootScope.isUndefined(info.data.json))
                    $scope.school.json = {};
                else
                    $scope.school.json = JSON.parse(info.data.json);

                $scope.jjson = $scope.school.json;
                if(!$rootScope.isUndefined($scope.jjson)){
                    console.log("JJJSON");
                    console.log($scope.jjson);
                    if(!$rootScope.isUndefined($scope.jjson.energy_consumption_resource)){
                        $scope.getUOMForResource($scope.jjson.energy_consumption_resource,"energy");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.luminosity_resource)){
                        $scope.getUOMForResource($scope.jjson.luminosity_resource,"luminosity");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.relative_humidity_resource)){
                        $scope.getUOMForResource($scope.jjson.relative_humidity_resource,"relative_humidity");
                    }
                    if(!$rootScope.isUndefined($scope.jjson.temperature_resource)){
                        $scope.getUOMForResource($scope.jjson.temperature_resource,"temperature");
                    }
                
                        if($rootScope.isUndefined($scope.jjson.extra_charts)){
                            
                            $scope.jjson.extra_charts = [];
                        
                        }else{
                            
                            console.log($scope.jjson.extra_charts);
                            $scope.jjson.extra_charts.forEach(function(ch,index){
                                $scope.getUOMForExtraResource(ch);
                            });
                        }
                }

                $scope.school = info.data;

            }).catch(function(e){
                $scope.loading = 0;
                if(e.status==404){
                    $scope.createSiteInfo();
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;                    
                    $scope.createSiteInfo();
                }
            });
        }
        
        
        $scope.saveBuilding = function(){
           $scope.loading = 1;
           $scope.error_text ="";
           $scope.school.json = JSON.stringify($scope.jjson);
           $scope.school.siteId = $scope.site_id;
           $scope.school.siteInfoId = $scope.info.siteInfoId;
           delete $scope.school.overObj;
           
           console.log($scope.school);
           var area = Area.updateSiteInfo($scope.info.siteInfoId,$scope.school);
           area.then(function(dot){
            $scope.loading = 0;
            $scope.saved();
            $scope.getInfo();
           }).catch(function(err){

                console.log(err);
                $scope.loading = 0;
                $scope.error_view = 1;
                $scope.error_text +=err.statusText;
           })
        }

        $scope.addExtraChart = function(){            
            $scope.add_a_chart_visible_form = 1;
        }

        $scope.cancel_new_chart = function(){
            $scope.add_a_chart_visible_form = 0;
            $scope.new_chart = {};
        }
        
        $scope.save_new_chart = function(){
         
            var chart = $scope.new_chart;
            $scope.jjson.extra_charts.push(chart);
            $scope.new_chart = {};
            $scope.add_a_chart_visible_form = 0;

        }
        $scope.removeThisChart = function(chart){

            var index = $scope.jjson.extra_charts.indexOf(chart);
            $scope.jjson.extra_charts.splice(index, 1);    
        }


       
        $scope.saved = function(){
            
            $('.saved').show();
            $('.saved').delay(3000).fadeOut('slow');
        }
      
    })
    .controller('SiteTopViewController',function($scope,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){

        $scope.building = {};
        $scope.zoom = 1;
        $scope.$on('onRepeatLast', function(scope, element, attrs){
            
            $( ".draggable" ).draggable({
                drag: function(){
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    console.log($(this).attr('data-area_id')+":"+offset.top);
                }
            });

              $('.draggable').each(function(){
                    
                var area_id = 'v2'+$(this).attr('data-area_id');
                $(this).offset({ top: localStorage.getItem('gaia_area_'+area_id+'_y'), left: localStorage.getItem('gaia_area_'+area_id+'_x') });

              });

              $scope.zoom = ($rootScope.isUndefined(localStorage.getItem('gaia_v4_zoom'))?1:localStorage.getItem('gaia_v4_zoom'));

        });
        


        
        $scope.zoomIn = function(){
            $scope.zoom=parseFloat(Number(Number(parseFloat($scope.zoom).toFixed(1))+0.1)).toFixed(1);
            console.log($scope.zoom);
            $scope.refreshAreas();
        }
        $scope.zoomOut = function(){
            $scope.zoom=parseFloat(Number(Number(parseFloat($scope.zoom).toFixed(1))-0.1)).toFixed(1);
            console.log($scope.zoom);
            $scope.refreshAreas();
        }
        $scope.refreshAreas = function(){
            $scope.building.areas.forEach(function(area){
                    
                area.style={
                    'width':area.element_width*$scope.zoom+'px',
                    'height':area.element_length*$scope.zoom+'px'
                };

            })
        }

        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id); 
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
                $scope.building.areas.forEach(function(area){
                    $scope.details(area);
                })
            });
        }

       
        $scope.details = function(area){
            console.log(area);
          
            $scope.error_view = 0;
            $scope.error_text = "";

           
            var k = Area.getSiteInfo(area.id);
            k.then(function(info){

               area.info = info.data;
               console.log(area);


               if(!$rootScope.isUndefined(area.info.json)){
                    var js = area.info.json; 
                        js = JSON.parse(js);
                        console.log("AREA ID:"+area.id);
                        console.log(js.length)
                        area.element_width  = (!$rootScope.isUndefined(js.width)?js.width:'200');
                        area.element_length = (!$rootScope.isUndefined(js.length)?js.length:'200');
                        area.element_height = (!$rootScope.isUndefined(js.height)?js.height:'200');
                      

                }else{
                    area.element_width='200';
                    area.element_height='200';
                    area.element_length='300';
                }
                
                area.style={
                    'width':area.element_width*$scope.zoom+'px',
                    'height':area.element_length*$scope.zoom+'px'
                };




            }).catch(function(e){
                console.log(e);
                
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.data.message+"\n";
                
            });

        }





        $scope.openNav = function(area) {
            
            $scope.selected_area = area;
            var resources = Area.getResources(area.id);
            resources.then(function(info){

                $scope.selected_area.resources = info.data.resources;
                $scope.selected_area.resources.forEach(function(sensor,index){
                        var m = Sensor.getMeasurementsByResourceId(sensor.resourceId);
                            m.then(function(datas){
                                sensor.metrics = datas.data;
                            });                           
                    });
                document.getElementById("myNav").style.width = "100%";

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                console.log(e);
            });
}

        $scope.closeNav = function () {
            document.getElementById("myNav").style.width = "0%";
        }



        
       

        $scope.saveTopView = function(){
           
            $('.draggable').each(function(){
                    var area_id = 'v2'+$(this).attr('data-area_id');
                    
                    var offset = $(this).offset();
                    var xPos = offset.left;
                    var yPos = offset.top;
                    
                    localStorage.setItem('gaia_area_'+area_id+'_x', xPos);
                    localStorage.setItem('gaia_area_'+area_id+'_y', yPos);
                    localStorage.setItem('gaia_v4_zoom',$scope.zoom);

            })
            alert('OK');
           
        }

        

         

    })
    .controller('SiteNotificationsController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){



       $scope.building = {};
       var t_areas = site.getAreas($stateParams.id);
       

       var t_site = site.getDetails($stateParams.id);
        t_site.then(function(tsite){            
            $scope.building.details = tsite.data;
            $scope.building_sync();
            $scope.getRules();
        });
        


        $scope.building_sync = function(){
            var m = site.syncCNIT($stateParams.id);
            m.then(function(data){
                console.log("Synced");
                console.log(data);
            })
        }

        $scope.getRules = function(){
            var g = site.getRules($stateParams.id);
            g.then(function(events){
                console.log("Events");
                console.log(events);
                $scope.events = events.data;

            })
        }







    })
    .controller('SiteSensorsController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){


        $scope.building = {};
        
        $scope.getInitAreas = function(){
            var spark_areas = site.getSparkAreas($stateParams.id);
            spark_areas.then(function(areas){
                $scope.building.areas = areas.data.sites;
                console.log($scope.building.areas);

                $scope.building.areas.forEach(function(area){
                    $scope.details(area);
                })
            });
        }

       
        $scope.details = function(area){
            console.log(area);
          
            $scope.error_view = 0;
            $scope.error_text = "";
            var resources = Area.getResources(area.id);
            resources.then(function(info){
                area.resources = info.data.resources;
                area.resources.forEach(function(sensor,index){
                        var m = Sensor.getMeasurementsByResourceId(sensor.resourceId);
                            m.then(function(datas){
                                console.log(datas);
                                sensor.metrics = datas.data;
                            });                           
                    });

            }).catch(function(e){

                $scope.error_view = 1;
                $scope.error_text +="Sparkworks:"+e.data.message;
                console.log(e);
            });
        }









        
       




        $scope.available_observes = [];
        $scope.available_observes.push({'name':'Light','encoded_name':'Light','uom':'lux'});
        $scope.available_observes.push({'name':'Energy','encoded_name':'Energy','uom':'mWh'});
        $scope.available_observes.push({'name':'Temperature','encoded_name':'Temperature','uom':'C'});
        $scope.available_observes.push({'name':'ComfortLevel','encoded_name':'comfort level','uom':'Raw'});
        $scope.available_observes.push({'name':'SharedResource','encoded_name':'shared resource','uom':'Raw'});
        $scope.virtual_sensors = [];

        $scope.save_new_virtual_sensor = function(){
            
            console.log("Filter Name:"+$scope.new_virtual_sensor.observes);


            var obs = $scope.available_observes.filter(function(item) {
                        return item.name === $scope.new_virtual_sensor.observes;
                        })[0];
             console.log(obs);

             
             
             var data = {
                "name":         $scope.new_virtual_sensor.name,
                "observes":     $scope.new_virtual_sensor.observes,
                "uom":          obs.uom
            };
            var req = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'ps/resource',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: data
            }
            $http(req).then(function(d){
                console.log(d);
                var nj = {
                    "resources":[d.data]
                };
                

             var req2 = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'location/site/'+$stateParams.id+'/resource/add',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: nj
            }
            $http(req2).then(function(d){
                console.log(d);
                $scope.add_a_virtual_sensor_form = 0;
                $scope.new_virtual_sensor = {};
                $scope.getPSResources();

            }, function(e){
                console.log(e);
            });

        });

}
        /*$scope.building = {};
       var t_areas = site.getAreas($stateParams.id);*/
       

       var t_site = site.getDetails($stateParams.id);
        t_site.then(function(tsite){            
            $scope.building.details = tsite.data;
        });


        $scope.getPSResources = function(){

            var senss = site.getResources($stateParams.id);
                senss.then(function(sites){
        
                $scope.virtual_sensors = [];

                sites.data.resources.forEach(function(thesensor,index){
                console.log(thesensor.uri + " : " + thesensor.name);                            
                        if(thesensor.uri.startsWith("gaia-ps")){
                            $scope.virtual_sensors.push(thesensor);
                        
                        }                       
               
                    });

                });
        }

        



     /*   t_areas.then(function(areas){
            $scope.building.areas = areas.data.items;

            $scope.building.areas.forEach(function(area,index){
                  
                  var the_area = {};
                  
                var area_sensors = Area.getSensors(area.id);
                    area_sensors.then(function(sensors){

                        area.sensors = sensors.data.items;    
                        
                        area.sensors.forEach(function(thesensor,index){                            
                            var t = Sensor.getDetailsFromSparks(thesensor.id);
                            t.then(function(metrics){
                               
                            });
                            var meas = Sensor.getMeasurementsByResourceId(thesensor.id);
                                meas.then(function(measurements){
                                    thesensor.meatrics = measurements.data;
                                }); 

                        });
                    });                  
                });
            console.log($scope.building.areas);
        });*/



        $scope.goToSensor = function(sensor_id){
            $location.path('page/sensor/view/'+sensor_id);   
        }


        $scope.addVirtualSensor = function(){
            console.log("Virtual Sensor");
            $scope.add_a_virtual_sensor_form = 1;
            $scope.new_virtual_sensor = {};
        }







    })
    .controller('SensorController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,UoM){
        $scope.sensor_measurements = {};
        $scope.dates_one = [];
        $scope.available_uoms = [];

        $scope.sensor = {
            id:$stateParams.id
        };
      

        var chart_details = Sensor.getDetailsFromSparks($scope.sensor.id);
            chart_details.then(function(chartdetails){
                $scope.measurementUnit = chartdetails.data.uom;
                $scope.available_uoms.push(chartdetails.data.uom);
                $scope.selected_uom = chartdetails.data.uom;
                $scope.selected_granularity = 'day';
                var available_uom = UoM.getAvailableTargets(chartdetails.data.uom);
                available_uom.then(function(av_uoms){
                    var avi = av_uoms.data.unitConversions;
                    avi.forEach(function(uom){

                        $scope.available_uoms.push(uom.target);
                    })
                });
                        

        var meas = Sensor.getMeasurementsByResourceId($scope.sensor.id);
        meas.then(function(measurements){

     
                if(measurements.data.keyName.startsWith("gaia-ps")){
                    $scope.add_measurements_btn_view = true;
                }

                $scope.sensor.meatrics = measurements.data;                  
                var the_data = measurements.data.day;                

                the_data.forEach(function(d,index){
                    the_data[index] = $rootScope.addCommas(parseFloat(d).toFixed(2));
                     var m= new Date(measurements.data.latestTime-index*1000*3600*24);
                    $scope.dates_one[index] = $rootScope.convertForTimeAxis(m,'day');
                });
             
            $q.all(the_data).then(function(){
                $scope.dates_one.reverse();
                the_data.reverse();
              

              $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} <br/> {c}"+$scope.measurementUnit
                    },
                    legend: {
                        data:['Mesurements']
                    },
                    toolbox:$rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : $scope.dates_one
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+$scope.measurementUnit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'Measurements',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:the_data
                        }
                    ]
                    };

                
            });
               
            }); 
         });

            
        $scope.open_new_measurements = function(){
            $scope.new_measurements_form = 1;
            $scope.virtual = {};
            $scope.virtual.time = new Date().getTime();
        }
        

        

        $scope.save_value_virtual = function(){
            console.log($scope.virtual);

            var data = [];
            data.push({
                "resourceId": $scope.sensor.id,
                "time": $scope.virtual.time,
                "value": $scope.virtual.value
            });
            var x = {data:data};


            var req = {
                 method: 'POST',
                 url: appConfig.main.apis.main+'ps/data',
                 headers: {
                   'Content-Type': 'application/json',"Authorization":"bearer "+appConfig.main.auth_token
                 },
                 data: x
            }
            $http(req).then(function(d){
                console.log(d);
                $scope.new_measurements_form = 0;
                $scope.virtual = {};
                $scope.update();
            }).catch(function(error){
                    console.log("error");
                    console.log(error);
                    
                }); 
            

        }

        $scope.cancel_virtual_value = function(){
            $scope.virtual = {};
            $scope.new_measurements_form = 0;
        }

        
        $scope.update = function(){
            
            $scope.loading = 1;
            

            

            console.log($scope.second_period_to_time);
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.first_period_from_time);
            $scope.obj.one.to = $rootScope.convertToMiliseconds($scope.second_period_to_time)+((1000*60*60*24)-2000);
            $scope.obj.one.resourceID= $scope.sensor.id;
            $scope.obj.one.granularity = $scope.selected_granularity;
            $scope.obj.one.targetUom = $scope.selected_uom;

           /* $scope.obj.one.string = $scope.first_period_from_time+" TO "+$scope.second_period_to_time;*/

            console.log($scope.obj.one);           

            
            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
              first.then(function(vals){
                
                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                    vals1 = vals1.data;

                var vals    = [];
                $scope.vals1 = [];
                
                $scope.tdates   = [];             

                vals1.forEach(function(val,index){                            
                    $scope.vals1.push($rootScope.addCommas(parseFloat(val.reading).toFixed(2)));
                    var m = new Date(val.timestamp);                        
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.obj.one.granularity));
                });
                $scope.setChartValues();
                $scope.loading = 0;

            });


        }


        $scope.setChartValues = function(){

                    $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} <br/> {c}"+$scope.measurementUnit
                    },
                    legend: {
                        data:['Mesurements']
                    },
                    toolbox:{show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: true,title:"DataView",lang: ['Data View', 'Close', 'Refresh']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }},
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : $scope.tdates
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+$scope.measurementUnit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'Measurements',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:$scope.vals1
                        }
                    ]
                    };
                }

        
        
     


    })
    .controller('SiteSensorsComparisonController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings,$filter){

        
        $scope.selected_sensors = [];
        $scope.available_sensors = [];
        $scope.line3 = {};

 
        
        $scope.selected_sensors = [];


        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };        



        var t_site = Area.getSiteInfo($stateParams.id);
            t_site.then(function(respo){
                
             
            if(!$rootScope.isUndefined(respo.data.json)){    

                var json = JSON.parse(respo.data.json);
                
                if(!$rootScope.isUndefined(json.energy_consumption_resource)){
                    $scope.available_sensors.push({'name':'energy','resource_id':json.energy_consumption_resource,'uom':json.energy_consumption_resource_uom});
                }
                if(!$rootScope.isUndefined(json.luminosity_resource)){
                    $scope.available_sensors.push({'name':'luminosity','resource_id':json.luminosity_resource,'uom':json.luminosity_resource_uom});
                }
                if(!$rootScope.isUndefined(json.relative_humidity_resource)){
                    $scope.available_sensors.push({'name':'relative_humidity','resource_id':json.relative_humidity_resource,'uom':json.relative_humidity_resource_uom});
                }
                if(!$rootScope.isUndefined(json.temperature_resource)){
                    $scope.available_sensors.push({'name':'temperature','resource_id':json.temperature_resource,'uom':json.temperature_resource_uom});
                }

            
                if(!$rootScope.isUndefined(json) && !$rootScope.isUndefined(json.extra_charts)){
                    
                    json.extra_charts.forEach(function(chart,index){            
                        $scope.available_sensors.push({'name':chart.name,'resource_id':chart.resource_id,'uom':chart.uom});
                    });    
                }
            
            }
            

        });

       


        $scope.getChart = function(){
            $scope.loading=1;

            $scope.counter = 0;
            var date_from = $scope.from_time.getTime();
            var date_to = $scope.to_time.getTime();

            var granularity  = $scope.granularity;
            var varseries = [];
            $scope.chart_times = [];
            var legends = [];            
            $scope.ress = [];
            $scope.data = [];
            $scope.chart = {};
            $scope.chart.options = {};
            $scope.chart.options.title = "";
            $scope.chart.options.tooltip = {trigger: 'axis'};
            $scope.chart.options.legend = {data:[]};
            $scope.chart.options.toolbox=$rootScope.toolbox;
            $scope.chart.options.calculable=true;
            $scope.chart.options.xAxis = [{
                type : 'category',
                boundaryGap : false,
                data : $scope.chart_times
            }];

            $scope.chart.options.yAxis =[{
                type : 'value',
                axisLabel : {
                    formatter: '{value} '+$scope.measurementUnit
                }
            }];

            $scope.chart.options.series = [];                        

            $scope.selected_sensors.forEach(function(sensor,index){
                console.log(sensor);
                
                    sensor.chart = Sensor.getComparingQueryTimeRange({
                      "from": date_from,
                      "granularity": $scope.granularity,
                      "resourceID": sensor.resource_id,
                      "targetUom": sensor.uom,
                      "to": date_to
                    });
                               

                
                sensor.chart.then(function(vals){
                    var obj     = vals.data.results;
                    var thevals   = obj[Object.keys(obj)[0]];
                    $scope.ress.push({'sensor':sensor,'vals':thevals});
                    $scope.counter++;                    

                    if($scope.counter===($scope.selected_sensors.length)){
                        $scope.drawchart();
                    }
                    
                }).catch(function(error){
                    console.log(error);
                    $scope.error = "error";
                    $scope.counter++;

                    if($scope.counter===($scope.selected_sensors.length)){
                       
                        $scope.drawchart();
                    }
                });           

                

            });
            

            
        }


        $scope.drawchart=  function(){
            $scope.legends = [];
            $scope.datas = [];
            $scope.tdates = [];
            $scope.time = [];

            $scope.ress.forEach(function(res,index){
                $scope.legends.push($filter('translate')(res.sensor.name));
                var d = [];

                res.vals.data.forEach(function(dat,index){ 
                    d.push(parseFloat(dat.reading).toFixed(2));
                    var m = new Date(dat.timestamp);
                    if(res.sensor.resource_id==$scope.ress[0].sensor.resource_id)
                        $scope.time.push($rootScope.convertForTimeAxis(m,$scope.granularity));                         
                });
                $scope.datas.push({
                    name:$filter('translate')(res.sensor.name),
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:d
                });  
            });
            
            
            $scope.line3.options={
                       title : {
                            text: "",
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend:{data:$scope.legends},
                        toolbox:$rootScope.toolbox,
                        calculable : true,
                     
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                scale : true,
                                data : $scope.time
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                scale : true,
                                axisLabel : {
                                    formatter: '{value} '
                                }
                            }
                        ],
                        series : $scope.datas
                    };

            $scope.loading=0;
        }


    })

.controller('SchoolCompareController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings){
    
    $scope.comp_site = 0;
    $scope.loading = 0;
    $scope.line3 = {};


    $scope.getAllSites = function(){
        var schools = site.getAllSites();
        schools.then(function(respo){
            $scope.allSites = respo.data.sites;
        }).catch(function(e){
            $scope.error_view = 1;
            $scope.error_text = "We can not read the list of the other schools";
        });
    }

    $scope.getChart = function(this_school,other_school){
        $scope.loading = 1;
        $scope.ress = [];
        $scope.legends= {};
        $scope.legends.data = [];
        var x = 0;
        
        var chart_other_school = Sensor.getComparingQueryTimeRange(other_school);
        var chart_this_school = Sensor.getComparingQueryTimeRange(this_school);

                    

        chart_this_school.then(function(vals){
            console.log(vals);
            $scope.loading = 1;
            
            var obj     = vals.data.results;
            var thevals   = obj[Object.keys(obj)[0]];
            $scope.ress.push({'sensor':'A','vals':thevals,'name':$scope.school_this_name});
            $scope.legends.data.push($scope.school_this_name);

            x++;

            if(x==2)
                $scope.drawchart();
        }).catch(function(error){
            $scope.error_view = 1;
            $scope.error_text = error.statusText;
        });

        chart_other_school.then(function(vals){
            console.log(vals);
            var obj     = vals.data.results;
            var thevals   = obj[Object.keys(obj)[0]];
            $scope.ress.push({'sensor':'B','vals':thevals,'name':$scope.school_other_name});
            $scope.legends.data.push($scope.school_other_name);

            $scope.loading = 1;
            x++;
            
            if(x==2)
                $scope.drawchart();
            

        }).catch(function(error){
            $scope.error_view = 1;
            $scope.error_text = error.statusText;
        });

    }

    $scope.drawchart=  function(){
            
            $scope.datas = [];
            $scope.tdates = [];
            $scope.time = [];

            $scope.ress.forEach(function(res,index){
                var d = []; 

                res.vals.data.forEach(function(dat,index){
                    d.push(parseFloat(dat.reading).toFixed(2));
                    var m = new Date(dat.timestamp);
                    if(res.sensor.resource_id==$scope.ress[0].sensor.resource_id){
                        if($scope.time.indexOf($rootScope.convertForTimeAxis(m,$scope.granularity))<0)
                            $scope.time.push($rootScope.convertForTimeAxis(m,$scope.granularity));                         
                    }
                });
                $scope.datas.push({
                    name:res.name,
                    type:'line',
                    smooth:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:d
                });  
            });
            
            
            $scope.line3.options={
                       title : {
                            text: "",
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend:$scope.legends,
                        toolbox:$rootScope.toolbox,
                        calculable : true,
                     
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                scale : true,
                                data : $scope.time
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                scale : true,
                                axisLabel : {
                                    formatter: '{value} '
                                }
                            }
                        ],
                        series : $scope.datas
                    };

            console.log($scope.line3.options);
            $scope.loading=0;
        }

    $scope.compare = function(){
        
        $scope.error_view = 0;
        $scope.loading = 1;
        $scope.school_this_name = "AS";
        $scope.school_other_name = "VS";

        if(!$scope.type_of_measurement>0){
            $scope.error_view = 1;
            $scope.error_text = "You should select a measurement type from corresponding dropdown";
            $scope.loading = 0;
        }
        else if($rootScope.isUndefined($scope.from_time) || $rootScope.isUndefined($scope.to_time)){
            $scope.error_view = 1;
            $scope.error_text = "You should set the time range";   
            $scope.loading = 0;
        }
        else if(!$scope.comp_site>0){
            
            $scope.error_view = 1;
            $scope.error_text = "You should select a school from the site list";
            $scope.loading = 0;

        }else{
                
                var tsite =  Area.getSiteInfo($scope.comp_site);
                    
                    tsite.then(function(site) {
                    console.log(site);
                    $scope.school_other_name = $rootScope.getTranslatedName(site);
                    $scope.school_this_name = $rootScope.getTranslatedName(site); //TODO change the "site" inside parameter with the current one (where we are = id from url)

                    if($rootScope.isUndefined(site.data.json) || site.data.json === null || site.data.json==null || site.data.json=="null" || site.data.json === " " || site.data.json === ""){
                        $scope.error_view = 1;
                        $scope.error_text = "The school you selected needs some configuration";
                    }
                    else{

                        $scope.jjson = JSON.parse(site.data.json);
                        console.log($scope.jjson);
                        console.log($scope.type_of_measurement);
                        switch(parseInt($scope.type_of_measurement)){ 
                            case 4:
                                
                                if($scope.jjson.energy_consumption_resource>0){
                                    var other_school = {
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.energy_consumption_resource
                                    }; 
                                    var this_school = {
                                        from:$scope.from_time.getTime(),
                                        to:$scope.to_time.getTime(),
                                        granularity:$scope.granularity,
                                        resourceID:$scope.jjson.energy_consumption_resource
                                    };
                                    $scope.getChart(this_school,other_school);
                                    
                                }else{
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration in order to set the energy Consumption resource";
                                }
                                break;
                            case 1:
                                if($scope.jjson.energy_consumption_resource>0){

                                }else{
                                    $scope.error_view = 1;
                                    $scope.error_text = "The school you selected needs some configuration";
                                }
                                break;
                            case 2:
                                console.log(2);
                                break;
                            default:
                                console.log('Default');
                                console.log($scope.type_of_measurement);
                        }
                        
                            
                    }
                }).catch(function(error){
                    $scope.error_view = 1;
                    $scope.error_text = error.statusText;
                });

        }

        
    }
    

    $scope.comp_choices = $rootScope.compare_strings;
    $scope.available_measurements = [];

    $scope.comp_choices.forEach(function(choice,index){
        $scope.available_measurements.push(choice);
    });


          

        

}).controller('SiteComparisonController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor,buildings,$filter){
        
    var todate = new Date().getTime();
        $scope.right_side_visible = 0;
        $scope.line3 = {};
        $scope.line4 = {};
        $scope.line4 = {};
        $scope.line4.options={};
        $scope.loading = 0;

        $scope.first_period_from_time   = new Date(todate-100*1000*60*60*24).getTime();
        $scope.first_period_to_time     = todate;

        $scope.second_period_from_time  = new Date(todate-200*1000*60*60*24).getTime();
        $scope.second_period_to_time    = new Date(todate-100*1000*60*60*24).getTime();

        $scope.measurementUnit = "";

        var vals    = [];      
        $scope.metrics = [];
        $scope.schools = [];

        
        var t_site = Area.getSiteInfo($stateParams.id);
            t_site.then(function(respo){
                
             var json = JSON.parse(respo.data.json);
                console.log(json);
                $scope.schools.push({"id":$stateParams.id,"name":respo.data.name});
                $scope.school_two = $stateParams.id;
                $scope.school_one = $stateParams.id;

            if(!$rootScope.isUndefined(json.energy_consumption_resource)){
                $scope.metrics.push({'name':'energy','resource_id':json.energy_consumption_resource,'uom':json.energy_consumption_resource_uom});
            }
            if(!$rootScope.isUndefined(json.luminosity_resource)){
                $scope.metrics.push({'name':'luminosity','resource_id':json.luminosity_resource,'uom':json.luminosity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.relative_humidity_resource)){
                $scope.metrics.push({'name':'relative_humidity','resource_id':json.relative_humidity_resource,'uom':json.relative_humidity_resource_uom});
            }
            if(!$rootScope.isUndefined(json.temperature_resource)){
                $scope.metrics.push({'name':'temperature','resource_id':json.temperature_resource,'uom':json.temperature_resource_uom});
            }

            
            
            json.extra_charts.forEach(function(chart,index){            
                    $scope.metrics.push({'name':chart.name,'resource_id':chart.resource_id,'uom':chart.uom});
            });

        });

        
        $scope.from = function(){
            console.log(0);
        }
        $scope.update = function(){
            $scope.right_side_visible = 1;
            $scope.vals1 = [];
            $scope.vals2 = [];
            $scope.tdates   = [];
            $scope.tdates2 = [];
            $scope.loading = 1;            


           
            var result = $filter('filter')($scope.metrics, {'resource_id':$scope.metric});             
            if(result.length>0)
                result = result[0];

            if(!$rootScope.isUndefined(result)){


                 

                var sensor = result;
                $scope.measurementUnit = sensor.uom;
                $scope.obj = {};
                $scope.obj.one = {};
                $scope.obj.one.from = $scope.first_period_from_time.getTime();
                $scope.obj.one.to = $scope.first_period_to_time.getTime();
                $scope.obj.one.resourceID= sensor.resource_id;
                $scope.obj.one.granularity = $scope.granularity; 
                $scope.obj.one.targetUom = sensor.uom;

                /*var month = $scope.first_period_from_time.getUTCMonth() + 1; //months from 1-12
                var day = $scope.first_period_from_time.getDate();
                var year = $scope.first_period_from_time.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;

                var month2 = $scope.first_period_to_time.getUTCMonth() + 1; //months from 1-12
                var day2 = $scope.first_period_to_time.getDate();
                var year2 = $scope.first_period_to_time.getUTCFullYear();
                var newdate2 = day2 + "/" + month2 + "/" + year2;
                $scope.obj.one.string = newdate+" to "+newdate2;  */

                /*$scope.obj.one.string = new Date($scope.first_period_from_time.getTime()).toLocaleDateString('en-US');*/
                $scope.obj.one.string = $filter('date')($scope.first_period_from_time.getTime(), 'dd/MM/yyyy')+'-'+$filter('date')($scope.first_period_to_time.getTime(), 'dd/MM/yyyy');


                $scope.obj.two = {};
                $scope.obj.two.to = $scope.second_period_to_time.getTime();
                $scope.obj.two.from = $scope.second_period_from_time.getTime();
                $scope.obj.two.resourceID = sensor.resource_id;
                $scope.obj.two.granularity = $scope.granularity;
                $scope.obj.two.targetUom = sensor.uom;

               /* var month = $scope.second_period_from_time.getUTCMonth() + 1; //months from 1-12
                var day = $scope.second_period_from_time.getDate();
                var year = $scope.second_period_from_time.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;

                var month = $scope.second_period_to_time.getUTCMonth() + 1; //months from 1-12
                var day = $scope.second_period_to_time.getDate();
                var year = $scope.second_period_to_time.getUTCFullYear();
                var newdate2 = day + "/" + month + "/" + year;


            $scope.obj.two.string = newdate+" to "+newdate2;  */        
                        $scope.obj.two.string = $filter('date')($scope.second_period_to_time.getTime(), 'dd/MM/yyyy')+'-'+$filter('date')($scope.second_period_to_time.getTime(), 'dd/MM/yyyy');

            
            $scope.obj.resourceID = sensor;
            


            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
            console.log($scope.obj.one);
            first.then(function(vals){
                console.log("VALS");
                console.log(vals);

                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                $scope.obj.one.sum = $rootScope.addCommas(parseFloat(vals1.summary).toFixed(2));
                $scope.obj.one.average = $rootScope.addCommas(parseFloat(vals1.average).toFixed(2));
                vals1 = vals1.data;
                

                vals1.forEach(function(val,index){ 
                    $scope.vals1.push(parseFloat(val.reading).toFixed(2));
                    var m = new Date(val.timestamp);                            
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.granularity));
                });


                    $scope.line3.options={
                       title : {
                            text: $scope.obj.one.string,
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                                data:[$scope.obj.one.string]
                            },
                        toolbox:$rootScope.toolbox,
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : $scope.tdates
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} '+$scope.measurementUnit
                                }
                            }
                        ],
                        series : [
                            {
                                name:$scope.obj.one.string,
                                type:'line',
                                smooth:true,
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:$scope.vals1
                            }                            
                        ]
                    };
                });

                var second = Sensor.getComparingQueryTimeRange($scope.obj.two);
                    second.then(function(vals_2){ 
                        
                        $scope.loading = 0;                                                                      

                        var obj = vals_2.data.results;

                        var vals2 = obj[Object.keys(obj)[0]];   
                        $scope.obj.two.sum = $rootScope.addCommas(parseFloat(vals2.summary).toFixed(2));
                        $scope.obj.two.average = $rootScope.addCommas(parseFloat(vals2.average).toFixed(2));
                        vals2 = vals2.data;
                        vals2.forEach(function(val,index){
                            $scope.vals2.push(parseFloat(val.reading).toFixed(2));
                            var m = new Date(val.timestamp);                            
                            $scope.tdates2.push($rootScope.convertForTimeAxis(m,$scope.granularity));
                        });
                                               
                        $scope.count++;

                        $scope.line4.options={
                           title : {
                                text: $scope.obj.two.string,
                            },
                            tooltip : {
                                trigger: 'axis'
                            },
                            legend: {
                                data:[$scope.obj.two.string]
                            },
                            toolbox:$rootScope.toolbox,
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'category',
                                    boundaryGap : false,
                                    data : $scope.tdates2
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLabel : {
                                        formatter: '{value} '+$scope.measurementUnit
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:$scope.obj.two.string,
                                    type:'line',
                                    smooth:true,
                                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                    data:$scope.vals2
                                }
                            ]
                        };
                        
                    });

            
            }else{
                $scope.loading = 0;
                alert("Please select metric");
            }
        }

        
    })
    .controller('SiteViewController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
        

        $scope.getbOptions = function(){
            
            var boptions = new Array;
            boptions.push({
                "class":'btn btn-secondary',
                "action":'5mins',
                "translate":'per_5mins'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'hour',
                "translate":'per_hour'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'day',
                "translate":'per_day'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'month',
                "translate":'per_month'
            });    
            console.log(boptions);
            return boptions;
        }
        
        
        $scope.building = {};
        $scope.line3 = {};
        $scope.extra_charts = [];
        $scope.additional_charts = [];        
        
        


            
            var k = Area.getSiteInfo($stateParams.id);
            k.then(function(info){
                $scope.loading = 0;
                console.log("Info");
                console.log(info);
                $scope.info = info.data;

                $scope.building = info.data;
                $scope.building.details = info.data;
                $scope.sitename = info.data.greekLocalizedName;
                var json = JSON.parse(info.data.json);

                $scope.building.json = JSON.parse(info.data.json);
                $scope.jjson = $scope.building.json;
                if($rootScope.isUndefined($scope.jjson.extra_charts)){
                    $scope.jjson.extra_charts = [];
                }

                $scope.energy_chart = {};
                $scope.energy_chart.resource_id = json.energy_consumption_resource;
                $scope.energy_chart.boptions = $scope.getbOptions();
                $scope.energy_chart.uom = json.energy_consumption_resource_uom;
                $scope.energy_chart.measurementUnit = json.energy_consumption_resource_uom;
                $scope.energy_chart.step = json.energy_consumption_resource_step;
                $scope.energy_chart.name = '';
           
                $scope.getCentralChart();



                if(!$rootScope.isUndefined(json.luminosity_resource)){            
                    
                     var vchart = {
                            'resource_id':json.luminosity_resource,
                            'step':json.luminosity_resource_step,
                            'uom':json.luminosity_resource_uom,
                            'name':'luminosity',
                            'translated_name':'luminosity',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.luminosity_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }
                if(!$rootScope.isUndefined(json.relative_humidity_resource)){            
                    
                     var vchart = {
                            'resource_id':json.relative_humidity_resource,
                            'step':json.relative_humidity_resource_step,
                            'uom':json.relative_humidity_resource_uom,
                            'name':'relative_humidity',
                            'translated_name':'relative_humidity',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.relative_humidity_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }
                if(!$rootScope.isUndefined(json.temperature_resource)){            
                    
                     var vchart = {
                            'resource_id':json.temperature_resource,
                            'step':json.temperature_resource_step,
                            'uom':json.temperature_resource_uom,
                            'name':'temperature',
                            'translated_name':'temperature',
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':json.temperature_resource_uom                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                }


                if(!$rootScope.isUndefined(json.extra_charts)){

                    json.extra_charts.forEach(function(chart){
                         var vchart = {
                            'resource_id':chart.resource_id,
                            'step':chart.step,
                            'uom':chart.uom,
                            'name':chart.name,
                            'boptions':$scope.getbOptions(),
                            'loading':1,
                            'measurementUnit':chart.uom
                    
                        };
                        $scope.additional_charts.push(vchart);
                        $scope.changeLineChartIn(vchart.step,vchart);
                    });                    
                }
                



            }).catch(function(e){
                $scope.loading = 0;
                if(e.status==404){
                    $scope.createSiteInfo();
                }else if(e.status==500){
                    $scope.error_view = 1;
                    $scope.error_text +="Over: "+e.statusText;                    
                    $scope.createSiteInfo();
                }
            });
        



        /*var t_site = site.getDetails($stateParams.id);       

        t_site.then(function(site){
            
           
           $scope.building.details = site.data;
           $scope.sitename = site.data.item.name;
           var json = JSON.parse(site.data.item.json);


            


           $scope.building.extra_charts = json.extra_charts;
           $scope.building.additional_charts = [];
           
            


           $scope.building.additional_charts.forEach(function(chart,index){

            var time_frame = 'day';
                chart.boptions = $scope.getbOptions();
                if(chart.step!='')
                    time_frame = chart.step;
            
                if(angular.isUndefined(chart.uom) || chart.uom==''){
                   
                   var chart_details = Sensor.getDetailsFromSparks(chart.resource_id);
                    chart_details.then(function(chartdetails){
                        chart.measurementUnit = chartdetails.data.uom;
                        $scope.changeLineChartIn(time_frame,chart);
                    });
                }
                else{
                    
                    chart.measurementUnit = chart.uom;
                    $scope.changeLineChartIn(time_frame,chart);                    
                }
           });

            $scope.building.extra_charts.forEach(function(chart,index){

            var time_frame = 'day';
                chart.boptions = $scope.getbOptions();
                if(chart.step!='')
                    time_frame = chart.step;
            
                if(angular.isUndefined(chart.uom)  || chart.uom==''){
                   
                   var chart_details = Sensor.getDetailsFromSparks(chart.resource_id);
                    chart_details.then(function(chartdetails){
                        chart.measurementUnit = chartdetails.data.uom;
                        $scope.changeLineChartIn(time_frame,chart);
                    });
                }
                else{
                    
                    chart.measurementUnit = chart.uom;
                    $scope.changeLineChartIn(time_frame,chart);                    
                }
           });

    
            
                
           




        }, function(reason) {
          console.log(reason);
        });*/

        $scope.changeRegularity = function(button,chartt){
            var chart = chartt;
            console.log(chart);

            chart.step = button.action;
            chart.loading = 1;

            
            $('*[data-attr="btn_'+chart.resource_id+'"]').removeClass('active');
            button.class+=" active";            
            
            console.log(chart);
            console.log("Chart MeasUnit:"+chart.measurementUnit);

           /* if(chart.uom=='' || angular.isUndefined(chart.uom))
                var latest = Sensor.getMeasurementsByResourceId(chart.resource_id);
            else*/
                var latest = Sensor.getMeasurementsByResourceIdAndUOM(chart.resource_id,chart.uom);

            
                latest.then(function(metrics){               

                var dates = [];
                var metrics_of_this = [];

                chart.average_per_day = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                chart.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));
                
                var dateObj = new Date(metrics.data.latestTime);
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;                


                chart.latest = {
                    time:newdate,
                    val:parseFloat(metrics.data.latest).toFixed(2)
                };
                chart.loading = 0;
                
                var d = new Date(metrics.data.latestTime).getTime();               

                switch (chart.step) {

                    case '5mins':                        
                        metrics_of_this = metrics.data.minutes5.reverse();
                        var i = 0;
                        while(i<metrics.data.minutes5.length){
                            
                            var m = new Date(d-i*1000*60*5);
                             dates.push(m.getHours()+":"+m.getMinutes()+":00");
                            i++;
                        }
                        break; 
                    case 'hour':
                         metrics_of_this = metrics.data.minutes60.reverse();  
                        var i = 0;
                        while(i<metrics.data.minutes60.length){
                            var m = new Date(d-i*1000*60*60);
                            dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                            i++;
                        }

                        break; 
                    case 'day':
                         metrics_of_this = metrics.data.day.reverse();

                         var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                            i++;
                        }

                        break; 
                    case 'month':
                         metrics_of_this = metrics.data.month.reverse(); 
                         var i = 0;
                        while(i<metrics.data.month.length){
                            var m = new Date(d-i*1000*60*60*24*30);
                            dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                            i++;
                        }            
                        break; 
                    default: 
                        var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m);
                            i++;
                        } 
                         metrics_of_this = metrics.data.day.reverse();

                }
                
                 chart.options ={
                
                   title : {
                        text: ($rootScope.isUndefined(chart.translated_name)?chart.name:"")+" ("+chart.measurementUnit+")",
                    },
                    legend : {
                        data:[chart.name]
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: $rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dates.reverse()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+chart.measurementUnit
                            }
                            
                        }
                    ],
                    series : [
                        {
                            name:$scope.sitename,
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                            data:metrics_of_this
                        }
                    ]
                };
               chart.loading = 0;

                }).catch(function(error) {
                        
                        chart.loading = 0;
                        chart.error = {};
                        chart.error.view = 1;
                        chart.error.text = error.status+" "+error.statusText;

                    });
        }
         $scope.changeLineChartIn = function(timeperiod,chart){
            console.log("Change Line Chart");
            console.log(chart);
            chart.loading = 1;
            chart.step = timeperiod;

            var latest = Sensor.getMeasurementsByResourceIdAndUOM(chart.resource_id,chart.uom);
                latest.then(function(metrics){               
                console.log("METRICS");
                console.log(chart.name);
                console.log(metrics);

                var dates = [];
                var metrics_of_this = [];

                chart.average_per_day = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                chart.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));
                
                var dateObj = new Date(metrics.data.latestTime);
                var month = dateObj.getUTCMonth() + 1;
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                var newdate = day + "/" + month + "/" + year;                


                chart.latest = {
                    time:newdate,
                    val:parseFloat(metrics.data.latest).toFixed(2)
                };
                
                var d = new Date(metrics.data.latestTime).getTime();               

                switch (chart.step) {
                    case '5mins':                        
                        metrics_of_this = metrics.data.minutes5.reverse();
                        var i = 0;
                        while(i<metrics.data.minutes5.length){
                            
                            var m = new Date(d-i*1000*60*5);
                             dates.push(m.getHours()+":"+m.getMinutes()+":00");
                            i++;
                        }
                        break; 
                    case 'hour':
                         metrics_of_this = metrics.data.minutes60.reverse();  
                        var i = 0;
                        while(i<metrics.data.minutes60.length){
                            var m = new Date(d-i*1000*60*60);
                            dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                            i++;
                        }

                        break; 
                    case 'day':
                         metrics_of_this = metrics.data.day.reverse();

                         var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                            i++;
                        }

                        break; 
                    case 'month':
                         metrics_of_this = metrics.data.month.reverse(); 
                         var i = 0;
                        while(i<metrics.data.month.length){
                            var m = new Date(d-i*1000*60*60*24*30);
                            dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                            i++;
                        }            
                        break; 
                    default: 
                        var i = 0;
                        while(i<metrics.data.day.length){
                            var m = new Date(d-i*1000*60*60*24);
                            dates.push(m);
                            i++;
                        } 
                         metrics_of_this = metrics.data.day.reverse();             
                }
                
                 chart.options ={
                
                   title : {
                        text: ($rootScope.isUndefined(chart.translated_name)?chart.name:"")+" ("+chart.measurementUnit+")",
                    },
                    legend : {
                        data:[chart.name]
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    toolbox: $rootScope.toolbox,
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : dates.reverse()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+chart.measurementUnit
                            }
                            
                        }
                    ],
                    series : [
                        {
                            name:$scope.sitename,
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                            data:metrics_of_this
                        }
                    ]
                };
               chart.loading = 0;

                }).catch(function(error) {
                        
                        chart.loading = 0;
                        chart.error = {};
                        chart.error.view = 1;
                        chart.error.text = error.status+" "+error.statusText;

                    });


           }



           $scope.getCentralChart = function(){
                
                $scope.energy_chart.loading = 1;
                var latest = Sensor.getMeasurementsByResourceIdAndUOM($scope.energy_chart.resource_id,$scope.energy_chart.uom);
                latest.then(function(metrics){
                        console.log(metrics);
                        $scope.average_per_day   = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                        $scope.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));

                        var dates = [];
                        var metrics_of_this = [];
                        var d = new Date(metrics.data.latestTime).getTime();
                        switch ($scope.energy_chart.step) {
                                case '5mins':                        
                                    metrics_of_this = metrics.data.minutes5.reverse();
                                    var i = 1;
                                    while(i<metrics.data.minutes5.length){
                                        
                                        var m = new Date(d-i*1000*60*5);
                                        dates.push(m.getHours()+":"+m.getMinutes()+":00");

                                        i++;
                                    }
                                    break; 
                                case 'hour':
                                     metrics_of_this = metrics.data.minutes60.reverse();  
                                    var i = 1;
                                    while(i<metrics.data.minutes60.length){
                                        var m = new Date(d-i*1000*60*60);
                                        dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                                        
                                        i++;
                                    }

                                    break; 
                                case 'day':
                                     metrics_of_this = metrics.data.day.reverse();

                                     var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                                        i++;
                                    }

                                    break; 
                                case 'month':
                                     metrics_of_this = metrics.data.month.reverse(); 
                                     var i = 1;
                                    while(i<metrics.data.month.length){
                                        var m = new Date(d-i*1000*60*60*24*30);

                                        dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                                        
                                        i++;
                                    }            
                                    break; 
                                default: 
                                    var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m);
                                        i++;
                                    } 
                                     metrics_of_this = metrics.data.day.reverse();  
                        }
                        metrics_of_this.forEach(function(metric,index){
                            metrics_of_this[index] = metric.toFixed(2);
                        })

                        $scope.energy_chart.options={
                
                               title : {
                                    text: "("+$scope.energy_chart.uom+")",
                                },
                                legend : {
                                    data:[$scope.sitename]
                                },
                                tooltip : {
                                    trigger: 'axis',
                                    formatter: "{a} <br/>{b} : {c} "+$scope.energy_chart.uom
                                },
                                toolbox: $rootScope.toolbox,
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : dates.reverse()

                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} '+$scope.energy_chart.uom
                                        }                                        
                                    }
                                ],
                                series : [
                                    {
                                        name:$scope.sitename,
                                        type:'line',
                                        smooth:true,
                                        itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                                        data:metrics_of_this
                                    }
                                ]
                            };


                            $scope.energy_chart.loading = 0;



                }).catch(function(error) {
                        
                        $scope.energy_chart.loading = 0;
                        $scope.energy_chart.error = {};
                        $scope.energy_chart.error.view = 1;
                        $scope.energy_chart.error.text = error.status+" "+error.statusText;

                    });
           }



    })
    .controller('SiteController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
        $rootScope.connectToRuleEngine($stateParams.id);
        $rootScope.recommendations = 0;

>>>>>>> 1f33542a8bb7acd77005ad0554190fe862995ca8
        

        /*$scope.getbOptions = function(){
            
            var boptions = new Array;
            boptions.push({
                "class":'btn btn-secondary',
                "action":'5mins',
                "translate":'per_5mins'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'hour',
                "translate":'per_hour'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'day',
                "translate":'per_day'
            });
            boptions.push({
                "class":'btn btn-secondary',
                "action":'month',
                "translate":'per_month'
            });    
            console.log(boptions);
            return boptions;
        }
        
        
        $scope.building = {};
        $scope.line3 = {};
        $scope.extra_charts = [];
        $scope.additional_charts = [];        
        
<<<<<<< HEAD
        
        $scope.selected_step = window.frameElement.getAttribute('data-step');
=======
        $scope.bar4 = {};
        $scope.visual_sources = [{id:1,texts:"Electricity"},
                                 {id:2,texts:"Petrol"},
                                 {id:3,texts:"Gas"}];

        var t_site = site.getDetails($stateParams.id);

        var available_resources = site.getResources($stateParams.id);
        available_resources.then(function(resources,index){
            $scope.available_resources = [];
            resources.data.resources.forEach(function(tresource){
                $scope.available_resources.push({id:tresource.resourceId,uri:tresource.uri});
            });
        });

        var t_areas = site.getAreas($stateParams.id);       
        t_areas.then(function(areas){

            $scope.building.areas = areas.data.items;
            $scope.building.areas.forEach(function(area,index){
                var the_area = {};
                $scope.areas.push(area.name);

                var area_sensors = Area.getSensors(area.id);
                
                    area_sensors.then(function(sensors){
>>>>>>> 1f33542a8bb7acd77005ad0554190fe862995ca8

        appConfig.main.auth_token = $stateParams.token;

        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(site){
            
           
           $scope.building.details = site.data;
           $scope.sitename = site.data.item.name;
           var json = JSON.parse(site.data.item.json);
<<<<<<< HEAD
=======
           console.log("*******************DETAILS***********");
           console.log(json);
           console.log(json);
           console.log(json);
           $scope.building.extra_charts = json.extra_charts;
           
>>>>>>> 1f33542a8bb7acd77005ad0554190fe862995ca8

           $scope.building.extra_charts = json.extra_charts;
           $scope.building.additional_charts = [];
           
            if(json.temperature_resource){
            
                $scope.building.additional_charts.push({
                    'resource_id':json.temperature_resource,
                    'step':$scope.selected_step,
                    'uom':json.temperature_resource_uom,
                    'name':'Θερμοκρασία'
                });
            }            
            console.log(json.energy_consumption_resource_step);
            console.log(json.energy_consumption_resource_step);
            console.log(json.energy_consumption_resource_step);
            console.log($scope.selected_step);
                
            $scope.energy_chart = {};
            $scope.energy_chart.resource_id = json.energy_consumption_resource;
            $scope.energy_chart.boptions = $scope.getbOptions();
            $scope.energy_chart.uom = json.energy_consumption_resource_uom;
            $scope.energy_chart.measurementUnit = json.energy_consumption_resource_uom;
            $scope.energy_chart.step = $scope.selected_step;
            $scope.energy_chart.name = '';
            $scope.getCentralChart();

        }, function(reason) {
          console.log(reason);
        });

       
           $scope.getCentralChart = function(){
                
                $scope.energy_chart.loading = 1;
                var latest = Sensor.getMeasurementsByResourceIdAndUOM($scope.energy_chart.resource_id,$scope.energy_chart.uom);
                latest.then(function(metrics){
                        console.log(metrics);
                        $scope.average_per_day   = $rootScope.addCommas(parseFloat(metrics.data.average.day).toFixed(2));
                        $scope.average_per_month = $rootScope.addCommas(parseFloat(metrics.data.average.month).toFixed(2));

                        var dates = [];
                        var metrics_of_this = [];
                        var d = new Date(metrics.data.latestTime).getTime();
                        console.log("ENERGY CHART STEP:"+$scope.energy_chart.step);
                        switch ($scope.energy_chart.step) {
                                case '5mins':                        
                                    metrics_of_this = metrics.data.minutes5.reverse();
                                    var i = 1;
                                    while(i<metrics.data.minutes5.length){
                                        
                                        var m = new Date(d-i*1000*60*5);
                                        dates.push(m.getHours()+":"+m.getMinutes()+":00");

                                        i++;
                                    }
                                    break; 
                                case 'hour':
                                     metrics_of_this = metrics.data.minutes60.reverse();  
                                    var i = 1;
                                    while(i<metrics.data.minutes60.length){
                                        var m = new Date(d-i*1000*60*60);
                                        dates.push(m.getHours()+":00 - "+parseInt(m.getHours()+1)+":00");
                                        
                                        i++;
                                    }

                                    break; 
                                case 'day':
                                     metrics_of_this = metrics.data.day.reverse();

                                     var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m.getDate()+"/"+parseInt(m.getUTCMonth()+1)+"/"+m.getUTCFullYear());
                                        i++;
                                    }

                                    break; 
                                case 'month':
                                     metrics_of_this = metrics.data.month.reverse(); 
                                     var i = 1;
                                    while(i<metrics.data.month.length){
                                        var m = new Date(d-i*1000*60*60*24*30);

                                        dates.push($rootScope.convertToTextMonth(parseInt(m.getUTCMonth()+1))+" "+m.getUTCFullYear());
                                        
                                        i++;
                                    }            
                                    break; 
                                default: 
                                    var i = 1;
                                    while(i<metrics.data.day.length){
                                        var m = new Date(d-i*1000*60*60*24);
                                        dates.push(m);
                                        i++;
                                    } 
                                     metrics_of_this = metrics.data.day.reverse();  
                        }
                        metrics_of_this.forEach(function(metric,index){
                            metrics_of_this[index] = metric.toFixed(2);
                        })

                        $scope.energy_chart.options={
                
                               title : {
                                    text: "("+$scope.energy_chart.uom+")",
                                },
                                legend : {
                                    data:[$scope.sitename]
                                },
                                tooltip : {
                                    trigger: 'axis',
                                    formatter: "{a} <br/>{b} : {c} "+$scope.energy_chart.uom
                                },
                                toolbox: $rootScope.toolbox,
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : dates.reverse()

                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} '+$scope.energy_chart.uom
                                        }                                        
                                    }
                                ],
                                series : [
                                    {
                                        name:$scope.sitename,
                                        type:'line',
                                        smooth:true,
                                        itemStyle: {normal: {areaStyle: {type: 'default'},color:'rgba(38,43,51,1)'}},
                                        data:metrics_of_this
                                    }
                                ]
                            };


                            $scope.energy_chart.loading = 0;



                }).catch(function(error) {
                        
                        $scope.energy_chart.loading = 0;
                        $scope.energy_chart.error = {};
                        $scope.energy_chart.error.view = 1;
                        $scope.energy_chart.error.text = error.status+" "+error.statusText;

                    });
           }*/




           $scope.loading = 1;
           $scope.selected_step = window.frameElement.getAttribute('data-step');
           $scope.selected_from = window.frameElement.getAttribute('data-from');
           $scope.selected_to = window.frameElement.getAttribute('data-to');

            
            appConfig.main.auth_token = $stateParams.token;

        var t_site = site.getDetails($stateParams.id);
        t_site.then(function(site){
            
           $scope.building = {};
           $scope.building.details = site.data;
           $scope.sitename = site.data.item.name;
           var json = JSON.parse(site.data.item.json);

           
            
            $scope.energy_consumption_resource = json.temperature_resource;
            $scope.measurementUnit = json.energy_consumption_resource_uom;
            
                
            $scope.energy_chart = {};
            $scope.energy_chart.resource_id = json.energy_consumption_resource;
            
            
            $scope.energy_chart.step = $scope.selected_step;
            $scope.energy_chart.name = '';
            $scope.getCentralChart();

        }, function(reason) {
          console.log(reason);
        });




        $scope.getCentralChart = function(){
            $scope.sensor_measurements = {};
            $scope.obj = {};
            $scope.obj.one = {};
            $scope.obj.one.from = $rootScope.convertToMiliseconds($scope.selected_from);
            $scope.obj.one.to = $rootScope.convertToMiliseconds($scope.selected_to)+((1000*60*60*24)-2000);
            $scope.obj.one.resourceID= $scope.energy_consumption_resource;
            $scope.obj.one.granularity = $scope.selected_step;

          
            var first = Sensor.getComparingQueryTimeRange($scope.obj.one);
              first.then(function(vals){
                console.log(vals);
                console.log(vals);
                console.log(vals);
                console.log(vals);
                console.log(vals);
                console.log(vals);
                var obj     = vals.data.results;
                var vals1   = obj[Object.keys(obj)[0]];
                    vals1 = vals1.data;

                var vals    = [];
                $scope.vals1 = [];
                
                $scope.tdates   = [];             

                vals1.forEach(function(val,index){                            
                    $scope.vals1.push($rootScope.addCommas(parseFloat(val.reading).toFixed(2)));
                    var m = new Date(val.timestamp);                        
                    $scope.tdates.push($rootScope.convertForTimeAxis(m,$scope.obj.one.granularity));
                });
                $scope.setChartValues();
                $scope.loading = 0;

            });
        }
            



            $scope.setChartValues = function(){

                    $scope.sensor_measurements.options = {
                    title : {
                        text: '',
                    },
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} <br/> {c}"+$scope.measurementUnit
                    },
                    legend: {
                        data:['Mesurements']
                    },
                    toolbox:{show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: true,title:"DataView",lang: ['Data View', 'Close', 'Refresh']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }},
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : $scope.tdates
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value} '+$scope.measurementUnit
                            }
                        }
                    ],
                    series : [
                        {
                            name:'Measurements',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:$scope.vals1
                        }
                    ]
                    };
                }



    })
    .controller('AppCtrl',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location){
        
        $rootScope.recommendations=0;
        $rootScope.toolbox = {
            show : true,
            feature : {
                restore : {show: true, title: "Restore"},
                saveAsImage : {show: true, title: "Save as image"},
                dataZoom : {show: true,title:{zoom:"Zoom",back:"Reset Zoom"}},
                dataView : {show: true,title:"DataView",lang: ['Data View', 'Close', 'Refresh']},
                magicType : {show: true, type: ['line', 'bar'],title:{
                    line: 'Line',
                    bar: 'Bar',
                    force: 'Force',
                    chord: 'Chord',
                    pie: 'Pie',
                    funnel: 'Funnel'
                }},
            }
        };
        
        
      
                     if(appConfig.main.auth_token==""){
                        $location.url('/page/signin');
                    }else{
                        console.log(appConfig.main.auth_token);
                    }

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;



        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);


        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });

        $rootScope.convertToTextMonth = function(month_num){

            if(month_num==1)
                return "Jan";
            else if(month_num==2)
                return "Feb";
            else if(month_num==3)
                return "Mar";
            else if(month_num==4)
                return "Apr";
            else if(month_num==5)
                return "May";
            else if(month_num==6)
                return "Jun";
            else if(month_num==7)
                return "Jul";
            else if(month_num==8)
                return "Aug";
            else if(month_num==9)
                return "Sep";
            else if(month_num==10)
                return "Oct";
            else if(month_num==11)
                return "Nov";
            else if(month_num==12)
                return "Dec";
            else
                return "Null";

        }
        
    })
       
    

})(); 

