
// # Building a Freeboard Plugin
//
// A freeboard plugin is simply a javascript file that is loaded into a web page after the main freeboard.js file is loaded.
//
// Let's get started with an example of a datasource plugin and a widget plugin.
//
// -------------------

// Best to encapsulate your plugin in a closure, although not required.
(function()
{
    // ## A Datasource Plugin
    //
    // -------------------
    // ### Datasource Definition
    //
    // -------------------
    // **freeboard.loadDatasourcePlugin(definition)** tells freeboard that we are giving it a datasource plugin. It expects an object with the following:
    freeboard.loadDatasourcePlugin({
        // **type_name** (required) : A unique name for this plugin. This name should be as unique as possible to avoid collisions with other plugins, and should follow naming conventions for javascript variable and function declarations.
        "type_name"   : "meshblu",
        // **display_name** : The pretty name that will be used for display purposes for this plugin. If the name is not defined, type_name will be used instead.
        "display_name": "Octoblu",
        // **description** : A description of the plugin. This description will be displayed when the plugin is selected or within search results (in the future). The description may contain HTML if needed.
        "description" : "app.octoblu.com",
        // **external_scripts** : Any external scripts that should be loaded before the plugin instance is created.
        "external_scripts" : [
            "https://cdn.octoblu.com/js/meshblu/latest/meshblu.bundle.js"
        ],
        // **settings** : An array of settings that will be displayed for this plugin when the user adds it.
        "settings"    : [
            {
                // **name** (required) : The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
                "name"         : "uuid",
                // **display_name** : The pretty name that will be shown to the user when they adjust this setting.
                "display_name" : "UUID",
                // **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
                "type"         : "text",
                // **default_value** : A default value for this setting.
                "default_value": "device uuid",
                // **description** : Text that will be displayed below the setting to give the user any extra information.
                "description"  : "your device UUID",
                // **required** : Set to true if this setting is required for the datasource to be created.
                "required" : true
            },
            {
                // **name** (required) : The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
                "name"         : "token",
                // **display_name** : The pretty name that will be shown to the user when they adjust this setting.
                "display_name" : "Token",
                // **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
                "type"         : "text",
                // **default_value** : A default value for this setting.
                "default_value": "device token",
                // **description** : Text that will be displayed below the setting to give the user any extra information.
                "description"  : "your device TOKEN",
                // **required** : Set to true if this setting is required for the datasource to be created.
                "required" : true
            },
            {
                // **name** (required) : The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
                "name"         : "server",
                // **display_name** : The pretty name that will be shown to the user when they adjust this setting.
                "display_name" : "Server",
                // **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
                "type"         : "text",
                // **default_value** : A default value for this setting.
                "default_value": "meshblu.octoblu.com",
                // **description** : Text that will be displayed below the setting to give the user any extra information.
                "description"  : "your server",
                // **required** : Set to true if this setting is required for the datasource to be created.
                "required" : true
            },
            {
                // **name** (required) : The name of the setting. This value will be used in your code to retrieve the value specified by the user. This should follow naming conventions for javascript variable and function declarations.
                "name"         : "port",
                // **display_name** : The pretty name that will be shown to the user when they adjust this setting.
                "display_name" : "Port",
                // **type** (required) : The type of input expected for this setting. "text" will display a single text box input. Examples of other types will follow in this documentation.
                "type"         : "number",
                // **default_value** : A default value for this setting.
                "default_value": 443,
                // **description** : Text that will be displayed below the setting to give the user any extra information.
                "description"  : "server port",
                // **required** : Set to true if this setting is required for the datasource to be created.
                "required" : true
            }

        ],
        // **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
        // * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
        // * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
        // * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
        newInstance   : function(settings, newInstanceCallback, updateCallback)
        {
            // myDatasourcePlugin is defined below.
            newInstanceCallback(new meshbluSource(settings, updateCallback));
        }
    });


    // ### Datasource Implementation
    //
    // -------------------
    // Here we implement the actual datasource plugin. We pass in the settings and updateCallback.
    const meshbluSource = function(settings, updateCallback)
    {
        // Always a good idea...
        const self = this;

        // Good idea to create a variable to hold on to our settings, because they might change in the future. See below.
        let currentSettings = settings;



        /* This is some function where I'll get my data from somewhere */


        function getData()
        {


            const conn = meshblu.createConnection({
                "uuid": currentSettings.uuid,
                "token": currentSettings.token,
                "server": currentSettings.server,
                "port": currentSettings.port
            });

            conn.on('ready', function(data){

                conn.on('message', function(message){

                    const newData = message;
                    updateCallback(newData);

                });

            });
        }



        // **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
        self.onSettingsChanged = function(newSettings)
        {
            // Here we update our current settings with the variable that is passed in.
            currentSettings = newSettings;
        }

        // **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
        self.updateNow = function()
        {
            // Most likely I'll just call getData() here.
            getData();
        }

        // **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
        self.onDispose = function()
        {

            //conn.close();
        }

        // Here we call createRefreshTimer with our current settings, to kick things off, initially. Notice how we make use of one of the user defined settings that we setup earlier.
        //	createRefreshTimer(currentSettings.refresh_time);
    }

}());