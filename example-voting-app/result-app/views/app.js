var app = angular.module('javavspython', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var bg3 = document.getElementById('background-stats-3');

app.controller('statsCtrl', function($scope,$http){
  var animateStats = function(a,b,c){
    if(a+b+c>0){
      var percentA = a/(a+b+c)*100;
      var percentB = b/(a+b+c)*100;
      var percentC = c/(a+b+c)*100;
      bg1.style.width= percentA+"%";
      bg2.style.width = percentB+"%";
      bg3.style.width = percentC+"%";
    }
  };

  $scope.aPercent = 100 / 3;
  $scope.bPercent = 100 / 3;
  $scope.cPercent = 100 / 3;
  $scope.buttonPush = function() {
    $http({
  method: 'GET',
      url: '/postconfig'
    }).then(function successCallback(response) {
      console.log(response);
    }, function errorCallback(response) {
      console.log(response);
    });
  }
  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);
       var c = parseInt(data.c || 0);

       animateStats(a, b,c);

       $scope.$apply(function() {
         if(a + b + c> 0){
           $scope.aPercent = a/(a+b+c) * 100;
           $scope.bPercent = b/(a+b+c) * 100;
           $scope.cPercent = c/(a+b+c) * 100;
           $scope.total = a + b + c
         }
      });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});
