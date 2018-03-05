'use strict';

//Using IIFE syntax to avoid variable conflicts and ensure that it has a variable scope for each file
(function (angular) {

    angular.module('app').service('videoService', VideoService);

    function VideoService($resource, $sce, globalConfig) {
        var url = '';
        return {
            //Gets the videos list from the server
            getVideos: function () {
                //Using angular-resource to make it easy when dealing with restful api's
                url = $resource(globalConfig.apiAddress + '/videos');                
                return url.get();
            },
            //Gets a specific video from the server by its name
            getVideoByName: function (name) {
                //Using angular-resource to make it easy when dealing with restful api's
                url = $resource(globalConfig.apiAddress + '/videoByName/' + name);
                return url.get();
            },
            //Uses Angular '$sce' service to 'whitelist' the urls we want
            trustSrcurl: function(data) 
            {
                return $sce.trustAsResourceUrl(data);
            }
        };
    }

    //Using dependency injection to avoid any minification problem
    VideoService.$inject = ['$resource', '$sce', 'globalConfig'];

})(angular);