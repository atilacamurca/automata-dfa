'use strict';

/**
 * @ngdoc function
 * @name automataDfaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the automataDfaApp
 */
angular.module('automataDfaApp')
    .controller('MainCtrl', ['$scope', 'DFA', function ($scope, DFA) {
        $scope.delta = [{
            'state': 's1',
            't': [{
                'value': '0',
                'transition': 's2'
            }, {
                'value': '1',
                'transition': 's1'
            }]
        }, {
            'state': 's2',
            't': [{
                'value': '0',
                'transition': 's1'
            }, {
                'value': '1',
                'transition': 's2'
            }]
        }];
        $scope.startState = 's1';
        $scope.finalStates = ['s2'];
        var dfa = new DFA($scope.delta, 's1', ['s2']);
        $scope.str = '0001';

        $scope.parse = function() {
            //dfa.startState = $scope.startState;
            //dfa.finalStates = $scope.finalStates;
            //dfa.delta = $scope.delta;

            var passed = dfa.processString($scope.str);
            if (passed) {
                console.log('string aceita.');
            } else {
                console.log('string não aceita.');
            }
        };
        $scope.parse();
    }]);
