(function () {
    'use strict';
    var App = angular.module('app');
   App.controller('ChartController',function($scope,$q,$rootScope,appConfig,$state,$stateParams,$timeout,site,$http,$location,$uibModal,$log,Area,Sensor){
        
           $scope.loading = 1;
           $scope.selected_step = $stateParams.step;
           $scope.selected_from = $stateParams.from;
           $scope.selected_to = $stateParams.to;

        
        var t_site = $http({
                    url: 'http://150.140.5.64:8080/gaia-building-knowledge-base/sites/'+$stateParams.id+'/siteInfo',
                    method: 'GET',
                    headers: {"Content-Type": "application/hal+json","Authorization":$rootScope.getToken()}
        });
        t_site.then(function(site){
            console.log(site);
           $scope.building = {};    
           $scope.building.details = site.data;
           $scope.sitename = site.data.englishLocalizedName;
           var json = JSON.parse(site.data.json);           
            
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
    .controller('AppCtrl',function($scope, $rootScope, $state, $document, appConfig,$http,buildings,$location,$stateParams){
        $rootScope.recommendations=0;
        appConfig.main.auth_token = $stateParams.token;
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

