'use strict';

//Using IIFE syntax to avoid variable conflicts and ensure that it has a variable scope for each file
(function (angular) {

    angular.module('app').controller('videosController', VideosController);

    function VideosController($rootScope, $scope, $resource, $state, videoService, globalConfig) {

        //Gets the videos list from the server
        function loadVideos() {
            if ($state.current.name == 'videos') {
                //Calls the videos service
                videoService.getVideos().$promise.then(function (data) {
                    //Sets the videos variable
                    $rootScope.videos = data.objects;
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }

        //Initializes the controller
        function init() {
            //Gets the assets address from the global variable
            $scope.assetsAddress = globalConfig.assetsAddress;
            //Loads the videos from the server
            loadVideos();
        }

        //Uses Angular '$sce' service to 'whitelist' the urls we want
        $scope.trustSrcurl = function(data) 
        {
            return videoService.trustSrcurl(data);
        }

        //Initializing
        init();

    }

    //Using dependency injection to avoid any minification problem
    VideosController.$inject = ['$rootScope', '$scope', '$resource', '$state', 'videoService', 'globalConfig'];

})(angular);