'use strict';

//Using IIFE syntax to avoid variable conflicts and ensure that it has a variable scope for each file
(function (angular) {
    
    angular.module('app').controller('showController', ShowController);

    function ShowController($scope, $rootScope, videoService, $state, $stateParams, $resource, globalConfig) {
        //Shows the text related to a specific video time
        function showTxt() {
            //Instantiates overlay text and audio elements
            var overlay = document.getElementById('overlay');
            var audio = document.getElementById('pbAudio');

            if(audio && overlay){
                //Gets the current video
                var currentVideo = $scope.currentVideo;
                //If the current video has the 'txts' object
                if (currentVideo && (currentVideo.txts !== '' && currentVideo.txts !== undefined)) {                
                    //Iterates the video 'txts' objects
                    for (var i = 0; i < currentVideo.txts.length; i++) {
                        //If the audio current time is the current video txts time
                        if (audio.currentTime >= currentVideo.txts[i].time && audio.currentTime <= currentVideo.txts[i].time + 2) {
                            //Gets the message from video 'txts' > txt element 
                            overlay.innerHTML = '<h1>' + currentVideo.txts[i].txt + '</h1>';
                            //Shows the overlay element
                            overlay.classList.remove('hidden');
                            break;
                        }
                        //If the audio current time is not the current video txts time
                        else {
                            //Hides the overlay element
                            overlay.classList.add('hidden');
                        }
                    }
                }
            }
        }

        //When the audio ends, stops the video
        function stopPlaying() {
            //Stops the video
            var video = document.getElementById('pbVideo');

            if(video){
                video.pause();
                //Sets the current time to the beggining
                video.currentTime = 0;
            }            
        }

        //Plays the video when the audio is playing
        function playVideo() {
            var video = document.getElementById('pbVideo');
            
            if(video){
                video.play();
            }
        }

        //Stops the video when the audio is paused
        function pauseVideo() {
            var video = document.getElementById('pbVideo');
            
            if(video){
                video.pause();
            }
        }

        //When the video is ended, play it again if the audio is still playing
        function keepItPlaying() {
            //If the audio is paused, play it
            var audio = document.getElementById('pbAudio');
            if (audio && audio.paused) {
                audio.play();
            }

            //If the video is paused (ended), play it again
            var video = document.getElementById('pbVideo');
            if (video && video.paused) {
                video.play();
            }
        }

        //Plays the audio when the video is loaded
        function playAudio() {
            var audio = document.getElementById('pbAudio');
            
            if(audio){
                audio.play();
            }
        }

        //Checks if the videos list has a next video to play 
        function getNext(currentVideo) {
            var next = document.getElementById('next');
            if(next){
                //If the list contains videos
                if ($scope.videos.length > 0) {
                    var videos = $scope.videos;
                    //Iterates the videos list to check if it has a next video
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i].name == currentVideo.name) {
                            //If it has a next video
                            if (videos[i + 1]) {
                                //Shows the next icon
                                document.getElementById('next').classList.remove('hidden');
                                //Gets the next video name
                                $scope.nextName = videos[i + 1].name;
                            }
                            else {
                                //Hides the next icon
                                document.getElementById('next').classList.add('hidden');
                            }
                        }
                    }
                }
            }
        }

        //Checks if the videos list has a previous video to play
        function getPrev(currentVideo) {
            var prev = document.getElementById('previous');
            if(prev){
                //If the list contains videos
                if ($scope.videos.length > 0) {
                    var videos = $scope.videos;
                    //Iterates the videos list to check if it has a prev video
                    for (var i = 0; i < videos.length; i++) {
                        if (videos[i].name == currentVideo.name) {
                            //If it has a prev video
                            if (videos[i - 1]) {
                                //Shows the prev icon
                                document.getElementById('previous').classList.remove('hidden');
                                //Gets the prev video name
                                $scope.prevName = videos[i - 1].name;
                            }
                            else {
                                //Hides the prev icon
                                document.getElementById('previous').classList.add('hidden');
                            }
                        }
                    }
                }
            }
        }

        //Retrieves the list of videos
        function getVideos() {
            //If there are videos at rootScope
            if ($rootScope.videos) {
                //Gets the videos list
                $scope.videos = $rootScope.videos;
            }
            //If there is no videos list, gets from the server
            else {
                videoService.getVideos().$promise.then(function (data) {
                    $scope.videos = data.objects;
                    getNext($scope.currentVideo);
                    getPrev($scope.currentVideo);
                }).catch(function (err) {
                    console.log(err);
                });
            }

            //Sets the previous and next icons
            if ($scope.videos) {
                getNext($scope.currentVideo);
                getPrev($scope.currentVideo);
            }
        }

        //Plays the selected video
        function showVideo() {
            if ($state.current.name === 'show') {
                var name = $stateParams.name;
                //Sets to hidden the overlay text
                document.getElementById('overlay').classList.add('hidden');
                //Gets the selected video
                $scope.getVideoByName(name);
            }

            //Scrolls to the center of the view
            document.getElementById('videoWrapper').scrollIntoView();
        }

        //Adding listeners to audio and video events
        function addMediaListeners() {
            document.getElementById('pbVideo').addEventListener('loadeddata', playAudio, false); //When the video is loaded
            document.getElementById('pbVideo').addEventListener('ended', keepItPlaying, false); //When the video is ended
            document.getElementById('pbAudio').addEventListener('playing', playVideo, false); //When the audio is playing
            document.getElementById('pbAudio').addEventListener('pause', pauseVideo, false); //When the audio is paused
            document.getElementById('pbAudio').addEventListener('ended', stopPlaying, false); //When the audio is ended
            document.getElementById('pbAudio').addEventListener('timeupdate', showTxt, false); //When the audio time is changed
        }

        //Initializes the controller
        function init() {
            //Gets the assets address from the global variable
            $scope.assetsAddress = globalConfig.assetsAddress;
            //Initializes the listeners
            addMediaListeners();
            //Shows the selected video
            showVideo();
        }

        //Uses Angular '$sce' service to 'whitelist' the urls we want
        $scope.trustSrcurl = function(data) 
        {
            return videoService.trustSrcurl(data);
        }

        //Gets a video by name
        $scope.getVideoByName = function (name) {
            videoService.getVideoByName(name).$promise.then(function (data) {
                //Sets the current video data
                $scope.currentVideo = data;
                //Gets the list videos list
                getVideos();
            }).catch(function (err) {
                console.log(err);
            });
        };

        //Initializing
        init();

    }

    //Using dependency injection to avoid any minification problem
    ShowController.$inject = ['$scope', '$rootScope', 'videoService', '$state', '$stateParams', '$resource', 'globalConfig'];

})(angular);