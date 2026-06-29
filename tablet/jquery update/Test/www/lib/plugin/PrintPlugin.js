
/**
 * Print Plugin rewritten for Cordova 2.8.1
 */
 
var PrintPlugin = (function() {               
    var pluginName = "com.aspiring.PrintPlugin";
    
    var print = function (data) {
        var deferred = $.Deferred();
        Cordova.exec(
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject();
            },
            pluginName, "print", [data]);

        return deferred.promise();
    }
    var isPrintingAvailable = function() {
        var deferred = $.Deferred();
        Cordova.exec(
            function(result) {
                deferred.resolve(result);
            },
            function(error) {
                deferred.reject(error);
            },
            pluginName, "isPrintingAvailable", [""]);
        return deferred.promise();
    }
    
    return {
        print: print,
        isPrintingAvailable: isPrintingAvailable
    }
               
}());

