'use strict';

angular.module('automataDfaApp')
    .controller('Regex2DfaCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.menu_active = 'r2d';
        $scope.string = '(01*1)*1';
        $scope.overview = '';
        $scope.str = '011\n\n01011\n11111\n00000\n1';

        var regex = null;

        $scope.parse = function () {
            regex = new Regex($scope.string);
            regex.buildNFA();
            var dfa = new DFA(regex.nfa);
            dfa.buildDFA();
            $scope.overview = dfa.dfa.overview();

            $scope.messages = ''; // clear messages
            var strings = $scope.str.split('\n');
            var len = strings.length;
            for (var i = 0; i < len; i++) {
                var passed = dfa.acceptsString(strings[i]);

                var s = strings[i];
                if (s === '') {
                    s = '&epsilon;';
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
        $scope.parse(); // initial parse
    }]);
