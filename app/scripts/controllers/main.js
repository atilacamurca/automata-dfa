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
        var sTransitions = "[]";
        $scope.sFinalStates = "[\"s2\"]";
        $scope.messages = "";

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
        $scope.str = '0001\n\n10001\n11111\n00000\n101010';

        $scope.parse = function() {
            $scope.delta = JSON.parse(sTransitions);
            $scope.finalStates = JSON.parse($scope.sFinalStates);

            dfa.startState = $scope.startState;
            dfa.finalStates = $scope.finalStates;
            dfa.delta = $scope.delta;

            $scope.messages = ""; // clear messages
            var strings = $scope.str.split('\n');
            var len = strings.length;
            for (var i = 0; i < len; i++) {
                var passed = dfa.processString(strings[i]);

                var s = strings[i];
                if (s === "") {
                    s = "&epsilon;";
                }
                if (passed) {
                    console.log('string aceita.');
                    $scope.messages += s + ': Accepted string.<br>';
                } else {
                    console.log('string não aceita.');
                    $scope.messages += s + ': Not accepted string.<br>';
                }
            }
        };

        $scope.aceLoaded = function(_editor) {
            var _session = _editor.getSession();
            _editor.setFontSize('11pt');
            _session.setValue(JSON.stringify($scope.delta, undefined, 4));

            _session.on("change", function() {
                sTransitions = _session.getValue();
            });
        };
    }]);
