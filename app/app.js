'use strict';

angular.module('app', ['ui.router', 'ngResource'])
    //Configures the routes url, controllers and views
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('videos', {
            url: '/',
            templateUrl: '/views/videos/index.html',
            controller: 'videosController'
        }).state('show', {
            url: '/show/:name',
            templateUrl: '/views/videos/show.html',
            controller: 'showController'
        });
    })
    //Creates a global variable
    .constant('globalConfig', {
        apiAddress: 'http://localhost:3000',
        assetsAddress: 'http://pbmedia.pepblast.com/pz_challenge/assets/'
    });