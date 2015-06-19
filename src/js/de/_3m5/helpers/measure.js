/**
 * (c) Johannes Klauss <johannes.klauss@3m5.de>
 * created at 06.02.14
 */

function measure(msg, $scope)  {
    if($scope) {
        if(measure.scopes.hasOwnProperty($scope)) {
            var ms = new Date().getTime();

            if(measure.scopes[$scope].time !== null) {
                console.log(ms - measure.scopes[$scope].time, $scope + ' - ' + msg);
            }
            else {
                measure.scopes[$scope].startTime = ms;

                console.log(0, $scope + ' - ' + msg);
            }

            measure.scopes[$scope].time = ms;

            return;
        }

        measure.scopes[$scope] = {time: new Date().getTime(), startTime: new Date().getTime(), endTime: null};

        console.log('start scope', $scope);
        console.log(0, $scope + ' - ' + msg);

        return;
    }

    console.log(new Date().getTime(), msg);
}

measure.scopes = {};
measure.resetScope = function (scope) {
    if(measure.scopes.hasOwnProperty(scope)) {
        measure.scopes[scope].time = null;
        measure.scopes[scope].startTime = null;
        measure.scopes[scope].endTime = null;
    }
};

measure.endScope = function (scope, $reset) {
    if(measure.scopes.hasOwnProperty(scope)) {
        measure.scopes[scope].endTime = new Date().getTime();

        console.log('Total time of Scope ' + scope, measure.scopes[scope].endTime - measure.scopes[scope].startTime);

        if($reset !== false) {
            measure.resetScope(scope);
        }
    }
};

measure.getTotalTimeOfScope = function (scope) {
    if(measure.scopes.hasOwnProperty(scope)) {
        console.log('Total time of Scope ' + scope, measure.scopes[scope].endTime - measure.scopes[scope].startTime);
    }
};