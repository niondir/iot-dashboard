# Datasource Api

The `Datasource` implementation is based on a JavaScript function

    var Datasource = function(props, history) {
         // Implement the constructor to setup initial state
         // The constructor is called once for every datasource instance (new Datasource(...))
    }

You can define some functions to handle certain events.

    Datasource.prototype.updateProps = function (props) {
          // Handle updated props
     };

     Datasource.prototype.getValues = function () {
         // Return the data that is handed over to the Widgets.
         // Data must be an array containing JavaScript objects.
         return [{value: "foo"}, {value: "bar"}];
     };

     Datasource.prototype.dispose = function () {
         // Cleanup state when the datasource is unloaded (e.g. stop timers)
     }