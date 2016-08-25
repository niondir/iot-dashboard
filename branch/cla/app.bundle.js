webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	__webpack_require__(2);
	__webpack_require__(12);
	__webpack_require__(15);
	__webpack_require__(17);
	__webpack_require__(19);
	__webpack_require__(23);
	__webpack_require__(24);
	__webpack_require__(27);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(38);
	var Renderer = __webpack_require__(40);
	var Store = __webpack_require__(105);
	var Persist = __webpack_require__(104);
	var dashboard_1 = __webpack_require__(56);
	var $ = __webpack_require__(13);
	var loadPredefinedState = $.get('./dashboard.json');
	loadPredefinedState.then(function (data) {
	    console.log("Starting dashboard with predefined state");
	    runWithState(data);
	}).fail(function (error) {
	    if (error.status === 404) {
	        // When the file is not available just start the dashboard in devMode
	        console.warn("There is no ./dashboard.json - The Dashboard will be loaded in Developer Mode and everything can be edited.\n" +
	            "To run the board with a predefined configuration go to 'Board > Import / Export'\n" +
	            "and save the exported content in a file named 'dashboard.json' next to the index.html (i.e. './dist/dashboard.json')");
	        runWithState();
	    }
	    else if (confirm("Failed to load Dashboard from dashboard.json\n" +
	        "\n" +
	        "Try to load in developer mode instated?")) {
	        runWithState();
	    }
	});
	function runWithState(configuredState) {
	    var initialState = configuredState;
	    var storeOptions = Store.defaultStoreOptions();
	    if (!initialState) {
	        initialState = Persist.loadFromLocalStorage();
	    }
	    else {
	        var devMode = false;
	        if (configuredState.config) {
	            devMode = configuredState.config.devMode;
	        }
	        if (devMode) {
	            console.log("Dashboard running in devMode. Set config.devMode = false to deliver dashboard as 'view only'");
	        }
	        storeOptions.persist = devMode;
	        initialState.global = {
	            isReadOnly: !devMode
	        };
	    }
	    var dashboardStore = Store.create(initialState, storeOptions);
	    var appElement = document.getElementById('app');
	    if (!appElement) {
	        throw new Error("Can not get element '#app' from DOM. Okay for headless execution.");
	    }
	    function handleError(dashboard, error) {
	        console.warn("Fatal error. Asking user to wipe data and retry. The error will be printed below...");
	        if (confirm("Fatal error. Reset all Data?\n\nPress cancel and check the browser console for more details.")) {
	            dashboardStore.dispatch(Store.clearState());
	            dashboard.dispose();
	            start();
	        }
	        else {
	            dashboard.dispose();
	            window.onerror = function () { return false; };
	            throw error;
	        }
	    }
	    function start() {
	        var dashboard = new dashboard_1.default(dashboardStore);
	        window.onerror = function errorHandler(message, filename, lineno, colno, error) {
	            handleError(dashboard, error);
	            return false;
	        };
	        dashboard.init();
	        try {
	            renderDashboard(appElement, dashboardStore);
	        }
	        catch (error) {
	            handleError(dashboard, error);
	        }
	    }
	    start();
	    function renderDashboard(element, store) {
	        Renderer.render(element, store);
	    }
	}


/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(18);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(13);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["React"] = __webpack_require__(20);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["_"] = __webpack_require__(21);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["c3"] = __webpack_require__(25);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 25 */,
/* 26 */,
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var FreeboardDatasource = __webpack_require__(28);
	var PluginCache = __webpack_require__(29);
	function mapSettings(settings) {
	    return settings.map(function (setting) {
	        return {
	            id: setting["name"],
	            name: setting["display_name"],
	            description: setting["description"],
	            type: setting["type"],
	            defaultValue: setting["default_value"],
	            required: setting["required"]
	        };
	    });
	}
	var freeboardPluginApi = {
	    /**
	     * Method to register a DatasourcePlugin as you would with the IoT-Dashboard API
	     * But supporting the Freeboard syntax
	     * @param plugin A Freeboard Datasource Plugin.
	     * See: https://freeboard.github.io/freeboard/docs/plugin_example.html
	     */
	    loadDatasourcePlugin: function (plugin) {
	        console.log("Loading freeboard Plugin: ", plugin);
	        var typeName = plugin["type_name"];
	        var displayName = plugin["display_name"];
	        var description = plugin["description"];
	        var externalScripts = plugin["external_scripts"];
	        var settings = plugin["settings"];
	        var newInstance = plugin["newInstance"];
	        var TYPE_INFO = {
	            type: typeName,
	            name: displayName,
	            description: description,
	            dependencies: externalScripts,
	            settings: mapSettings(settings)
	        };
	        var dsPlugin = {
	            TYPE_INFO: TYPE_INFO,
	            Datasource: FreeboardDatasource.create(newInstance, TYPE_INFO)
	        };
	        PluginCache.registerDatasourcePlugin(dsPlugin.TYPE_INFO, dsPlugin.Datasource);
	    }
	};
	window.freeboard = freeboardPluginApi;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = freeboardPluginApi;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(21);
	// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
	// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
	// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
	// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
	function create(newInstance, TYPE_INFO) {
	    return function FreeboardDatasource(props) {
	        if (props === void 0) { props = {}; }
	        this.instance = null;
	        this.data = history;
	        this.fetchData = function (resolve, reject) {
	            if (!this.data) {
	                resolve();
	                return;
	            }
	            var data = this.data;
	            this.data = null;
	            if (_.isArray(data)) {
	                resolve(data);
	            }
	            else {
	                return resolve([data]);
	            }
	        }.bind(this);
	        this.dispose = function () {
	            this.instance.onDispose();
	        }.bind(this);
	        this.datasourceWillReceiveProps = function (newProps) {
	            if (newProps.settings !== this.props.settings) {
	                console.log("Updating Datasource settings");
	                this.instance.onSettingsChanged(newProps);
	            }
	        }.bind(this);
	        var newInstanceCallback = function (instance) {
	            this.instance = instance;
	            instance.updateNow();
	        }.bind(this);
	        var updateCallback = function (newData) {
	            this.data = newData;
	        }.bind(this);
	        createNewInstance();
	        function createNewInstance() {
	            newInstance(props, newInstanceCallback, updateCallback);
	        }
	    }.bind(this);
	}
	exports.create = create;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	/**
	 * When a Plugin is loaded via the UI, an action is called to do so.
	 * The action will load an external script, containing the plugin code, which calls one of the API methods here.
	 * By calling the API method the plugin is put to the pluginCache where it can be fetched by the application to initialize it
	 *
	 * The application can not call the Plugin since it could (and should) be wrapped into a module.
	 * @type {null}
	 */
	var pluginCache = null;
	function popLoadedPlugin() {
	    var plugin = pluginCache;
	    pluginCache = null;
	    return plugin;
	}
	exports.popLoadedPlugin = popLoadedPlugin;
	function hasPlugin() {
	    return pluginCache !== null;
	}
	exports.hasPlugin = hasPlugin;
	function registerDatasourcePlugin(typeInfo, datasource) {
	    console.assert(!hasPlugin(), "Plugin must be finished loading before another can be registered", pluginCache);
	    pluginCache = ({
	        TYPE_INFO: typeInfo,
	        Datasource: datasource
	    });
	}
	exports.registerDatasourcePlugin = registerDatasourcePlugin;
	// TODO: type Widget as soon as it is in typescript
	function registerWidgetPlugin(typeInfo, widget) {
	    console.assert(!hasPlugin(), "Plugin must be finished loading before another can be registered", pluginCache);
	    pluginCache = ({
	        TYPE_INFO: typeInfo,
	        Widget: widget
	    });
	}
	exports.registerWidgetPlugin = registerWidgetPlugin;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var PluginCache = __webpack_require__(29);
	var pluginApi = {
	    registerDatasourcePlugin: PluginCache.registerDatasourcePlugin,
	    registerWidgetPlugin: PluginCache.registerWidgetPlugin
	};
	// TO be robust during tests in node and server side rendering
	if (window) {
	    window.iotDashboardApi = pluginApi;
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = pluginApi;


/***/ },
/* 31 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 32 */,
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var ReactDOM = __webpack_require__(41);
	var react_redux_1 = __webpack_require__(42);
	var pageLayout_1 = __webpack_require__(44);
	function render(element, store) {
	    ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, React.createElement(pageLayout_1.default, null)), element);
	}
	exports.render = render;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)))

/***/ },
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_1 = __webpack_require__(20);
	var ReactDOM = __webpack_require__(41);
	var react_redux_1 = __webpack_require__(42);
	var Global = __webpack_require__(45);
	var widgetGrid_ui_js_1 = __webpack_require__(47);
	var layouts_ui_js_1 = __webpack_require__(87);
	var widgetConfigDialog_ui_js_1 = __webpack_require__(90);
	var dashboardMenuEntry_ui_js_1 = __webpack_require__(95);
	var importExportDialog_ui_js_1 = __webpack_require__(96);
	var datasourceConfigDialog_ui_js_1 = __webpack_require__(98);
	var datasourceNavItem_ui_js_1 = __webpack_require__(99);
	var widgetsNavItem_ui_js_1 = __webpack_require__(100);
	var pluginNavItem_ui_js_1 = __webpack_require__(101);
	var pluginsDialog_ui_js_1 = __webpack_require__(102);
	var Persistence = __webpack_require__(104);
	var Layout = (function (_super) {
	    __extends(Layout, _super);
	    function Layout(props) {
	        _super.call(this, props);
	        this.state = { hover: false };
	    }
	    Layout.prototype.onReadOnlyModeKeyPress = function (e) {
	        //console.log("key pressed", event.keyCode);
	        var intKey = (window.event) ? e.which : e.keyCode;
	        if (intKey === 27) {
	            this.props.setReadOnly(!this.props.isReadOnly);
	        }
	    };
	    Layout.prototype.componentDidMount = function () {
	        if (this.props.devMode) {
	            this.onReadOnlyModeKeyPress = this.onReadOnlyModeKeyPress.bind(this);
	            ReactDOM.findDOMNode(this)
	                .offsetParent
	                .addEventListener('keydown', this.onReadOnlyModeKeyPress);
	        }
	    };
	    Layout.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var showMenu = props.devMode && (!props.isReadOnly || this.state.hover);
	        return React.createElement("div", {onKeyUp: function (event) { return _this.onReadOnlyModeKeyPress(event); }}, React.createElement("div", null, React.createElement(widgetConfigDialog_ui_js_1.default, null), React.createElement(importExportDialog_ui_js_1.default, null), React.createElement(datasourceConfigDialog_ui_js_1.default, null), React.createElement(pluginsDialog_ui_js_1.default, null)), React.createElement("div", {className: "container"}, React.createElement("div", {className: showMenu ? "menu-trigger" : "menu-trigger", onMouseOver: function () { _this.setState({ hover: true }); }, onMouseEnter: function () { _this.setState({ hover: true }); }}), React.createElement("div", {className: "ui inverted fixed main menu " + (showMenu ? "topnav--visible" : "topnav--hidden"), onMouseOver: function () { _this.setState({ hover: true }); }, onMouseLeave: function () { _this.setState({ hover: false }); }}, React.createElement("div", {className: "ui container"}, React.createElement("a", {href: "#", className: "header item"}, "Dashboard"), React.createElement(dashboardMenuEntry_ui_js_1.default, null), React.createElement(widgetsNavItem_ui_js_1.default, null), React.createElement(datasourceNavItem_ui_js_1.default, null), React.createElement(pluginNavItem_ui_js_1.default, null), React.createElement(layouts_ui_js_1.default, null), React.createElement("a", {className: "item", onClick: function () { return Persistence.clearData(); }}, React.createElement("i", {className: "red bomb icon"}), "Reset Everything!"), React.createElement("a", {className: "item", onClick: function () { return props.setReadOnly(!props.isReadOnly); }}, React.createElement("i", {className: (props.isReadOnly ? "lock" : "unlock alternate") + " icon"}), " "), React.createElement("div", {className: "header selectable right item"}, "v", this.props.config.version, " ", this.props.config.revisionShort))), React.createElement("div", {className: "ui grid"}, React.createElement(widgetGrid_ui_js_1.default, null))));
	    };
	    return Layout;
	}(react_1.Component));
	exports.Layout = Layout;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        isReadOnly: state.global.isReadOnly,
	        devMode: state.config.devMode,
	        config: state.config
	    };
	}, function (dispatch) {
	    return {
	        setReadOnly: function (isReadOnly) { return dispatch(Global.setReadOnly(isReadOnly)); }
	    };
	})(Layout);


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	exports.initialState = {
	    isReadOnly: false,
	    devMode: true
	};
	function setReadOnly(isReadOnly) {
	    return function (dispatch) {
	        dispatch(setReadOnlyAction(isReadOnly));
	    };
	}
	exports.setReadOnly = setReadOnly;
	function setReadOnlyAction(isReadOnly) {
	    return {
	        type: Action.SET_READONLY,
	        isReadOnly: isReadOnly
	    };
	}
	function global(state, action) {
	    if (state === void 0) { state = exports.initialState; }
	    switch (action.type) {
	        case Action.SET_READONLY:
	            return Object.assign({}, state, {
	                isReadOnly: action.isReadOnly
	            });
	        default:
	            return state;
	    }
	}
	exports.global = global;


/***/ },
/* 46 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	/**
	 * Rules for action names
	 * ------------------------
	 * (many of them are not applied but try to follow them in future)
	 *
	 * - Try to name Action after what happened not what should happen
	 * -- i.e. "STARTED_LOADING_PLUGIN" rather than "START_LOADING_PLUGIN"
	 */
	exports.CLEAR_STATE = "CLEAR_STATE";
	// Dashboard
	exports.DASHBOARD_IMPORT = "DASHBOARD_IMPORT";
	exports.SET_READONLY = "SET_READONLY";
	// Layouts
	exports.ADD_LAYOUT = "ADD_LAYOUT";
	exports.UPDATE_LAYOUT = "UPDATE_LAYOUT";
	exports.DELETE_LAYOUT = "DELETE_LAYOUT";
	exports.LOAD_LAYOUT = "LOAD_LAYOUT";
	exports.SET_CURRENT_LAYOUT = "SET_CURRENT_LAYOUT";
	// Widgets
	exports.ADD_WIDGET = "ADD_WIDGET";
	exports.UPDATE_WIDGET_SETTINGS = "UPDATE_WIDGET_SETTINGS";
	exports.UPDATED_SINGLE_WIDGET_SETTING = "UPDATED_SINGLE_WIDGET_SETTING";
	exports.DELETE_WIDGET = "DELETE_WIDGET";
	exports.UPDATE_WIDGET_LAYOUT = "UPDATE_WIDGET_LAYOUT";
	exports.START_CREATE_WIDGET = "START_CREATE_WIDGET";
	exports.START_CONFIGURE_WIDGET = "START_CONFIGURE_WIDGET";
	// Datasources
	exports.ADD_DATASOURCE = "ADD_DATASOURCE";
	exports.UPDATE_DATASOURCE = "UPDATE_DATASOURCE";
	exports.DELETE_DATASOURCE = "DELETE_DATASOURCE";
	exports.SET_DATASOURCE_DATA = "SET_DATASOURCE_DATA";
	exports.FETCHED_DATASOURCE_DATA = "FETCHED_DATASOURCE_DATA";
	exports.DATASOURCE_FINISHED_LOADING = "DATASOURCE_FINISHED_LOADING";
	exports.UPDATED_MAX_VALUES = "UPDATED_MAX_VALUES";
	exports.UPDATED_FETCH_REPLACE_DATA = "UPDATED_FETCH_REPLACE_DATA";
	// Plugins
	exports.WIDGET_PLUGIN_FINISHED_LOADING = "WIDGET_PLUGIN_FINISHED_LOADING";
	exports.DATASOURCE_PLUGIN_FINISHED_LOADING = "DATASOURCE_PLUGIN_FINISHED_LOADING";
	exports.DELETE_WIDGET_PLUGIN = "DELETE_WIDGET_PLUGIN";
	exports.DELETE_DATASOURCE_PLUGIN = "DELETE_DATASOURCE_PLUGIN";
	exports.STARTED_LOADING_PLUGIN_FROM_URL = "STARTED_LOADING_PLUGIN_FROM_URL";
	// Modal
	exports.SHOW_MODAL = "SHOW_MODAL";
	exports.HIDE_MODAL = "HIDE_MODAL";


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_1 = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var _ = __webpack_require__(21);
	var Widgets = __webpack_require__(48);
	var widgetFrame_ui_1 = __webpack_require__(51);
	var widthProvider_ui_1 = __webpack_require__(73);
	var react_grid_layout_1 = __webpack_require__(74);
	var ResponsiveGrid = widthProvider_ui_1.default(react_grid_layout_1.Responsive);
	var breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
	var cols = { lg: 12, md: 12, sm: 12, xs: 6, xxs: 3 };
	var WidgetGrid = (function (_super) {
	    __extends(WidgetGrid, _super);
	    function WidgetGrid() {
	        _super.apply(this, arguments);
	    }
	    WidgetGrid.prototype.onLayoutChange = function (layout) {
	        if (this.props.onLayoutChange) {
	            this.props.onLayoutChange(layout);
	        }
	    };
	    WidgetGrid.prototype.render = function () {
	        var props = this.props;
	        var widgetStates = this.props.widgets;
	        // TODO: Remove unknown widget from state
	        var widgets = widgetStates.map(function (widgetState) {
	            var widgetPlugin = props.widgetPlugins[widgetState.type];
	            /*
	             if (!widgetPlugin) {
	             // TODO: Render widget with error message - currently a loading indicator is displayed and the setting button is hidden
	             console.warn("No WidgetPluginFactory for type '" + widgetState.type + "'! Skipping rendering.");
	             return null;
	             } */
	            // WidgetFrame must be loaded as function, else the grid is not working properly.
	            return widgetFrame_ui_1.default({ widget: widgetState, widgetPlugin: widgetPlugin, isReadOnly: props.isReadOnly });
	        }).filter(function (frame) { return frame !== null; });
	        /* //Does NOT work that way:
	         let widgets = widgetData.map((data) => <WidgetFrame {...data}
	         key={data.id}
	         _grid={{x: data.col, y: data.row, w: data.width, h: data.height}}
	         />);*/
	        return (React.createElement(ResponsiveGrid, {className: "column", rowHeight: Widgets.ROW_HEIGHT, breakpoints: breakpoints, cols: cols, draggableCancel: ".no-drag", draggableHandle: ".drag", onLayoutChange: this.onLayoutChange.bind(this)}, widgets));
	    };
	    return WidgetGrid;
	}(react_1.Component));
	WidgetGrid.propTypes = {
	    widgets: react_1.PropTypes.array.isRequired,
	    datasources: react_1.PropTypes.object.isRequired,
	    widgetPlugins: react_1.PropTypes.object.isRequired,
	    onLayoutChange: react_1.PropTypes.func,
	    deleteWidget: react_1.PropTypes.func,
	    isReadOnly: react_1.PropTypes.bool.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgets: _.valuesIn(state.widgets) || [],
	        datasources: state.datasources || {},
	        widgetPlugins: state.widgetPlugins || {},
	        isReadOnly: state.global.isReadOnly
	    };
	}, function (dispatch) {
	    return {
	        onLayoutChange: function (layout) {
	            dispatch(Widgets.updateLayout(layout));
	        },
	        deleteWidget: function (id) { return dispatch(Widgets.deleteWidget(id)); }
	    };
	})(WidgetGrid);


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Uuid = __webpack_require__(49);
	var _ = __webpack_require__(21);
	var reducer_js_1 = __webpack_require__(50);
	var Action = __webpack_require__(46);
	exports.HEADER_HEIGHT = 77;
	exports.ROW_HEIGHT = 100;
	exports.initialWidgets = {
	    "initial_chart": {
	        "id": "initial_chart",
	        "type": "chart",
	        "settings": {
	            "name": "Random Values",
	            "datasource": "initial_random_source",
	            "chartType": "area-spline",
	            "dataKeys": "[\"value\"]",
	            "xKey": "x",
	            "names": "{\"value\": \"My Value\"}",
	            "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
	        },
	        "row": 0,
	        "col": 0,
	        "width": 6,
	        "height": 2,
	        "availableHeightPx": 123
	    },
	    "initial_text": {
	        "id": "initial_text",
	        "type": "text",
	        "settings": {
	            "name": "Random data",
	            "datasource": "initial_random_source"
	        },
	        "row": 0,
	        "col": 6,
	        "width": 6,
	        "height": 3,
	        "availableHeightPx": 223
	    },
	    "106913f4-44fb-4f69-ab89-5d5ae857cf3c": {
	        "id": "106913f4-44fb-4f69-ab89-5d5ae857cf3c",
	        "type": "chart",
	        "settings": {
	            "name": "Bars",
	            "datasource": "initial_random_source",
	            "chartType": "spline",
	            "dataKeys": "[\"value\", \"value2\"]",
	            "xKey": "x",
	            "names": "{\"value\": \"My Value\"}",
	            "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
	        },
	        "row": 2,
	        "col": 0,
	        "width": 6,
	        "height": 2,
	        "availableHeightPx": 123
	    }
	};
	/* // TODO: better explicitly create initial state? But when? ...
	 export function createInitialWidgets() {
	 return function(dispatch: AppState.Dispatch) {
	 dispatch(addWidget('chart', {
	 "name": "Random Values",
	 "datasource": "initial_random_source",
	 "chartType": "area-spline",
	 "dataKeys": "[\"value\"]",
	 "xKey": "x",
	 "names": "{\"value\": \"My Value\"}",
	 "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
	 }, 0, 0, 6, 2));
	
	 dispatch(addWidget('text', {
	 "name": "Random data",
	 "datasource": "initial_random_source"
	 }, 0, 6, 6, 3));
	
	
	 dispatch(addWidget('text', {
	 "name": "Bars",
	 "datasource": "initial_random_source",
	 "chartType": "spline",
	 "dataKeys": "[\"value\", \"value2\"]",
	 "xKey": "x",
	 "names": "{\"value\": \"My Value\"}",
	 "gaugeData": "{\"min\":0,\"max\":100,\"units\":\" %\"}"
	 }, 2, 0, 6, 2));
	 }
	 }
	 */
	function createWidget(widgetType, widgetSettings) {
	    return function (dispatch, getState) {
	        var widgets = getState().widgets;
	        var widgetPositions = calcNewWidgetPosition(widgets);
	        return dispatch(addWidget(widgetType, widgetSettings, widgetPositions.row, widgetPositions.col));
	    };
	}
	exports.createWidget = createWidget;
	function addWidget(widgetType, widgetSettings, row, col, width, height, id) {
	    if (widgetSettings === void 0) { widgetSettings = {}; }
	    if (width === void 0) { width = 3; }
	    if (height === void 0) { height = 3; }
	    if (!id) {
	        id = Uuid.generate();
	    }
	    return {
	        type: Action.ADD_WIDGET,
	        id: id,
	        col: col,
	        row: row,
	        width: width,
	        height: height,
	        widgetType: widgetType,
	        widgetSettings: widgetSettings
	    };
	}
	exports.addWidget = addWidget;
	function updateWidgetSettings(id, widgetSettings) {
	    return {
	        type: Action.UPDATE_WIDGET_SETTINGS,
	        id: id,
	        widgetSettings: widgetSettings
	    };
	}
	exports.updateWidgetSettings = updateWidgetSettings;
	function updatedSingleSetting(id, settingId, settingValue) {
	    return {
	        type: Action.UPDATED_SINGLE_WIDGET_SETTING,
	        id: id,
	        settingId: settingId,
	        settingValue: settingValue
	    };
	}
	exports.updatedSingleSetting = updatedSingleSetting;
	function deleteWidget(id) {
	    return {
	        type: Action.DELETE_WIDGET,
	        id: id
	    };
	}
	exports.deleteWidget = deleteWidget;
	function updateLayout(layouts) {
	    return {
	        type: Action.UPDATE_WIDGET_LAYOUT,
	        layouts: layouts
	    };
	}
	exports.updateLayout = updateLayout;
	var widgetsCrudReducer = reducer_js_1.genCrudReducer([Action.ADD_WIDGET, Action.DELETE_WIDGET], widget);
	function widgets(state, action) {
	    if (state === void 0) { state = exports.initialWidgets; }
	    state = widgetsCrudReducer(state, action);
	    switch (action.type) {
	        case Action.UPDATE_WIDGET_LAYOUT:
	            return _.valuesIn(state)
	                .reduce(function (newState, _a) {
	                var id = _a.id;
	                newState[id] = widget(newState[id], action);
	                return newState;
	            }, _.assign({}, state));
	        case Action.LOAD_LAYOUT:
	            console.assert(action.layout.widgets, "Layout is missing Widgets, id: " + action.layout.id);
	            return action.layout.widgets || {};
	        case Action.DELETE_WIDGET_PLUGIN:
	            var toDelete = _.valuesIn(state).filter(function (widgetState) {
	                return widgetState.type === action.id;
	            });
	            var newState_1 = _.assign({}, state);
	            toDelete.forEach(function (widgetState) {
	                delete newState_1[widgetState.id];
	            });
	            return newState_1;
	        default:
	            return state;
	    }
	}
	exports.widgets = widgets;
	function calcAvaliableHeight(heightUnits) {
	    // The 10 px extra seem to be based on a bug in the grid layout ...
	    return (heightUnits * (exports.ROW_HEIGHT + 10)) - exports.HEADER_HEIGHT;
	}
	function widget(state, action) {
	    switch (action.type) {
	        case Action.ADD_WIDGET:
	            return {
	                id: action.id,
	                type: action.widgetType,
	                settings: action.widgetSettings,
	                row: action.row,
	                col: action.col,
	                width: action.width,
	                height: action.height,
	                availableHeightPx: calcAvaliableHeight(action.height)
	            };
	        case Action.UPDATE_WIDGET_SETTINGS:
	            return _.assign({}, state, { settings: action.widgetSettings });
	        case Action.UPDATED_SINGLE_WIDGET_SETTING: {
	            var newSettings = _.clone(state.settings);
	            newSettings[action.settingId] = action.settingValue;
	            return _.assign({}, state, { settings: newSettings });
	        }
	        case Action.UPDATE_WIDGET_LAYOUT:
	            var layout = layoutById(action.layouts, state.id);
	            if (layout == null) {
	                console.warn("No layout for widget. Skipping position update of widget with id: " + state.id);
	                return state;
	            }
	            return _.assign({}, state, {
	                row: layout.y,
	                col: layout.x,
	                width: layout.w,
	                height: layout.h,
	                availableHeightPx: calcAvaliableHeight(layout.h)
	            });
	        default:
	            return state;
	    }
	}
	// Local functions
	function layoutById(layout, id) {
	    return _.find(layout, function (l) {
	        return l.i === id;
	    });
	}
	function calcNewWidgetPosition(widgets) {
	    var colHeights = {};
	    // TODO: Replace 12 with constant for number of columns
	    // This is different on different breaking points...
	    for (var i = 0; i < 12; i++) {
	        colHeights[i] = 0;
	    }
	    colHeights = _.valuesIn(widgets).reduce(function (prev, curr) {
	        prev[curr.col] = prev[curr.col] || 0;
	        var currHeight = curr.row + curr.height || 0;
	        if (prev[curr.col] < currHeight) {
	            for (var i = curr.col; i < curr.col + curr.width; i++) {
	                prev[i] = currHeight;
	            }
	        }
	        return prev;
	    }, colHeights);
	    var heights = _.valuesIn(colHeights);
	    var col = _.keysIn(colHeights).reduce(function (a, b, index, array) {
	        return Number(colHeights[a] <= colHeights[b] ? a : b);
	    }, 0);
	    //Math.min(...colHeights);
	    return { col: col, row: Math.min.apply(Math, heights) };
	}
	exports.calcNewWidgetPosition = calcNewWidgetPosition;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	function generate() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = Math.random() * 16 | 0;
	        var v = c == 'x' ? r : (r & 0x3 | 0x8);
	        return v.toString(16);
	    });
	}
	exports.generate = generate;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	/**
	 * Creates an reducer that works on an object where you can create, delete and update properties of type Object.
	 * The key of properties always matches the id property of the value object.
	 *
	 * @param actionNames
	 * Object with: create, update, delete action names
	 * @param elementReducer
	 * A reducer for a single object that supports the actionNames.create and actionNames.update action.
	 * @param initialState (optional)
	 * @param idProperty
	 * The name of the property to fetch the id from the action. Default: 'id'
	 * @returns {crudReducer}
	 */
	function genCrudReducer(actionNames, elementReducer, idProperty) {
	    if (idProperty === void 0) { idProperty = 'id'; }
	    console.assert(actionNames.length === 2, "ActionNames must contain 2 names for create, delete in that order");
	    var CREATE_ACTION = actionNames[0], DELETE_ACTION = actionNames[1];
	    return function crudReducer(state, action) {
	        var id = action[idProperty];
	        switch (action.type) {
	            case CREATE_ACTION:
	                return Object.assign({}, state, (_a = {}, _a[id] = elementReducer(undefined, action), _a));
	            case DELETE_ACTION:
	                var newState = Object.assign({}, state);
	                delete newState[id];
	                return newState;
	            default:
	                if (id === undefined)
	                    return state;
	                var elementState = state[id];
	                if (elementState == undefined) {
	                    // Do not update what we don't have.
	                    // TODO: Log warning, or document why not.
	                    return state;
	                }
	                var updatedElement = elementReducer(elementState, action);
	                if (updatedElement == undefined) {
	                    console.error("ElementReducer has some problem: ", elementReducer, " with action: ", action);
	                    throw new Error("Reducer must return the original state if they not implement the action. Check action " + action.type + ".");
	                }
	                return Object.assign({}, state, (_b = {},
	                    _b[id] = updatedElement,
	                    _b
	                ));
	        }
	        var _a, _b;
	    };
	}
	exports.genCrudReducer = genCrudReducer;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var WidgetConfig = __webpack_require__(52);
	var WidgetPlugins = __webpack_require__(55);
	var widgets_1 = __webpack_require__(48);
	var react_1 = __webpack_require__(20);
	var dashboard_1 = __webpack_require__(56);
	/**
	 * The Dragable Frame of a Widget.
	 * Contains generic UI controls, shared by all Widgets
	 */
	var WidgetFrame = function (props) {
	    var widgetState = props.widget;
	    // If the plugin is not in the registry, we assume it's currently loading
	    var pluginLoaded = dashboard_1.default.getInstance().widgetPluginRegistry.hasPlugin(widgetState.type);
	    var widgetFactory;
	    if (pluginLoaded) {
	        widgetFactory = dashboard_1.default.getInstance().widgetPluginRegistry.getPlugin(widgetState.type);
	    }
	    return (React.createElement("div", {className: "ui raised segments", style: { margin: 0, overflow: "hidden" }, key: widgetState.id, _grid: { x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height }}, React.createElement("div", {className: "ui inverted segment" + (props.isReadOnly ? "" : " drag")}, props.isReadOnly ? null :
	        React.createElement("div", {className: "ui tiny horizontal right floated inverted list"}, React.createElement(ConfigWidgetButton, {className: "right item no-drag", widgetState: widgetState, visible: (props.widgetPlugin && props.widgetPlugin.typeInfo.settings ? true : false), icon: "configure"}), React.createElement(DeleteWidgetButton, {className: "right floated item no-drag", widgetState: widgetState, icon: "remove"})), React.createElement("div", {className: "ui item top attached" + (props.isReadOnly ? "" : " drag")}, widgetState.settings.name || "\u00a0")), React.createElement("div", {className: "ui segment", style: { height: widgetState.availableHeightPx, padding: 0, border: "red dashed 0px" }}, pluginLoaded ? widgetFactory.getInstance(widgetState.id)
	        : React.createElement(LoadingWidget, {widget: widgetState}))));
	};
	exports.widgetPropType = react_1.PropTypes.shape({
	    id: react_1.PropTypes.string.isRequired,
	    col: react_1.PropTypes.number.isRequired,
	    row: react_1.PropTypes.number.isRequired,
	    width: react_1.PropTypes.number.isRequired,
	    height: react_1.PropTypes.number.isRequired,
	    settings: react_1.PropTypes.shape({
	        name: react_1.PropTypes.string.isRequired
	    }).isRequired
	});
	WidgetFrame.propTypes = {
	    widget: exports.widgetPropType.isRequired,
	    widgetPlugin: WidgetPlugins.widgetPluginType.isRequired,
	    isReadOnly: react_1.PropTypes.bool.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetFrame;
	var LoadingWidget = function (props) {
	    return React.createElement("div", {className: "ui active text loader"}, "Loading ", props.widget.type, " Widget ...");
	};
	LoadingWidget.propTypes = {
	    widget: exports.widgetPropType.isRequired
	};
	var WidgetButton = (function (_super) {
	    __extends(WidgetButton, _super);
	    function WidgetButton() {
	        _super.apply(this, arguments);
	    }
	    WidgetButton.prototype.render = function () {
	        var _this = this;
	        var data = this.props.widgetState;
	        return React.createElement("a", {className: this.props.className + (this.props.visible !== false ? "" : " hidden transition"), onClick: function () { return _this.props.onClick(data); }}, React.createElement("i", {className: this.props.icon + " icon"}));
	    };
	    return WidgetButton;
	}(React.Component));
	WidgetButton.propTypes = {
	    widgetState: exports.widgetPropType.isRequired,
	    icon: react_1.PropTypes.string.isRequired,
	    visible: react_1.PropTypes.bool,
	    className: react_1.PropTypes.string.isRequired,
	    onClick: react_1.PropTypes.func.isRequired
	};
	var DeleteWidgetButton = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        onClick: function (widgetState) {
	            dispatch(widgets_1.deleteWidget(widgetState.id));
	        }
	    };
	})(WidgetButton);
	var ConfigWidgetButton = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        onClick: function (widgetState) {
	            dispatch(WidgetConfig.openWidgetConfigDialog(widgetState.id));
	        }
	    };
	})(WidgetButton);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Widgets = __webpack_require__(48);
	var actionNames_1 = __webpack_require__(46);
	var Modal = __webpack_require__(53);
	var ModalIds = __webpack_require__(54);
	var initialState = {
	    type: null,
	    name: null,
	    settings: {}
	};
	/**
	 * Triggered when the user intends to create a widget of a certain type
	 */
	function createWidget(type) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var widgetPlugin = state.widgetPlugins[type];
	        if (!widgetPlugin.typeInfo.settings && widgetPlugin.typeInfo.settings.length > 0) {
	            dispatch(Widgets.createWidget(type));
	            return;
	        }
	        dispatch(openWidgetCreateDialog(type));
	    };
	}
	exports.createWidget = createWidget;
	/**
	 * Creates or updates an actual widget
	 */
	function createOrUpdateWidget(id, type, settings) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var widget = state.widgets[id];
	        if (widget && widget.type !== type) {
	            throw new Error("Can not update widget of type " + widget.type + " with props of type " + type);
	        }
	        if (widget) {
	            dispatch(Widgets.updateWidgetSettings(id, settings));
	        }
	        else {
	            dispatch(Widgets.createWidget(type, settings));
	        }
	    };
	}
	exports.createOrUpdateWidget = createOrUpdateWidget;
	function openWidgetCreateDialog(type) {
	    return function (dispatch) {
	        dispatch({
	            type: actionNames_1.START_CREATE_WIDGET,
	            widgetType: type
	        });
	        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
	    };
	}
	exports.openWidgetCreateDialog = openWidgetCreateDialog;
	/**
	 * Open the dialog with the settings and values of the given widget
	 */
	function openWidgetConfigDialog(id) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var widget = state.widgets[id];
	        dispatch({
	            type: actionNames_1.START_CONFIGURE_WIDGET,
	            widget: widget
	        });
	        dispatch(Modal.showModal(ModalIds.WIDGET_CONFIG));
	    };
	}
	exports.openWidgetConfigDialog = openWidgetConfigDialog;
	function widgetConfigDialog(state, action) {
	    if (state === void 0) { state = initialState; }
	    switch (action.type) {
	        case actionNames_1.START_CREATE_WIDGET:
	            return Object.assign({}, state, {
	                type: action.widgetType,
	                id: null,
	                name: action.widgetType,
	                settings: {}
	            });
	        case actionNames_1.START_CONFIGURE_WIDGET:
	            return Object.assign({}, state, {
	                type: action.widget.type,
	                id: action.widget.id,
	                name: action.widget.name,
	                settings: action.widget.settings
	            });
	        default:
	            return state;
	    }
	}
	exports.widgetConfigDialog = widgetConfigDialog;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	var initialState = {
	    dialogId: null,
	    isVisible: false,
	    data: {}
	};
	function showModalSideeffect(id) {
	    var $modal = $('.ui.modal.' + id);
	    if (!$modal.length) {
	        throw new Error("Can not find Modal with id", id, $modal);
	    }
	    $modal.modal('show');
	}
	function closeModalSideeffect(id) {
	    $('.ui.modal.' + id).modal('hide');
	}
	function updateModalVisibility(stateAfter, stateBefore) {
	    var dialogBefore = stateBefore.modalDialog;
	    var dialogAfter = stateAfter.modalDialog;
	    if (dialogBefore.isVisible !== dialogAfter.isVisible) {
	        if (stateAfter.modalDialog.isVisible) {
	            showModalSideeffect(dialogAfter.dialogId);
	        }
	        else {
	            closeModalSideeffect(dialogBefore.dialogId);
	        }
	    }
	    else if (dialogBefore.dialogId && dialogAfter.dialogId && dialogBefore.dialogId !== dialogAfter.dialogId) {
	        closeModalSideeffect(dialogBefore.dialogId);
	        showModalSideeffect(dialogAfter.dialogId);
	    }
	}
	function showModal(id, data) {
	    if (data === void 0) { data = {}; }
	    return function (dispatch, getState) {
	        var stateBefore = getState();
	        dispatch({
	            type: Action.SHOW_MODAL,
	            dialogId: id,
	            data: data
	        });
	        var stateAfter = getState();
	        updateModalVisibility(stateAfter, stateBefore);
	    };
	}
	exports.showModal = showModal;
	function closeModal() {
	    return function (dispatch, getState) {
	        var stateBefore = getState();
	        dispatch({
	            type: Action.HIDE_MODAL
	        });
	        var stateAfter = getState();
	        updateModalVisibility(stateAfter, stateBefore);
	    };
	}
	exports.closeModal = closeModal;
	function modalDialog(state, action) {
	    if (state === void 0) { state = initialState; }
	    switch (action.type) {
	        case Action.SHOW_MODAL:
	            return Object.assign({}, state, {
	                dialogId: action.dialogId,
	                data: action.data,
	                isVisible: true
	            });
	        case Action.HIDE_MODAL:
	            return Object.assign({}, state, {
	                dialogId: null,
	                data: null,
	                isVisible: false
	            });
	        default:
	            return state;
	    }
	}
	exports.modalDialog = modalDialog;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 54 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	exports.DASHBOARD_IMPORT_EXPORT = "dashboard-import-export-dialog";
	exports.DATASOURCE_CONFIG = "datasource-config-dialog";
	exports.WIDGET_CONFIG = "widget-config-dialog";
	exports.PLUGINS = "plugins-dialog";


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	var reducer_js_1 = __webpack_require__(50);
	var react_1 = __webpack_require__(20);
	var dashboard_1 = __webpack_require__(56);
	// TODO: Later load all plugins from external URL's ?
	var initialState = {
	    "chart": {
	        id: "chart",
	        url: "./plugins/widgets/chartWidget.js",
	        typeInfo: {
	            type: "will-be-loaded",
	            name: "chart (not loaded yet)"
	        },
	        isLoading: true
	    },
	    "text": {
	        id: "text",
	        url: "./plugins/widgets/textWidget.js",
	        typeInfo: {
	            type: "will-be-loaded",
	            name: "text (not loaded yet)"
	        },
	        isLoading: true
	    }
	};
	// TODO: Remove when not used anymore
	exports.widgetPluginType = react_1.PropTypes.shape({
	    id: react_1.PropTypes.string.isRequired,
	    typeInfo: react_1.PropTypes.shape({
	        type: react_1.PropTypes.string.isRequired,
	        name: react_1.PropTypes.string.isRequired,
	        settings: react_1.PropTypes.array
	    })
	});
	function unloadPlugin(type) {
	    return function (dispatch) {
	        var widgetPlugin = dashboard_1.default.getInstance().widgetPluginRegistry.getPlugin(type);
	        widgetPlugin.dispose();
	        dispatch(deletePlugin(type));
	    };
	}
	exports.unloadPlugin = unloadPlugin;
	function deletePlugin(type) {
	    return {
	        type: Action.DELETE_WIDGET_PLUGIN,
	        id: type
	    };
	}
	var pluginsCrudReducer = reducer_js_1.genCrudReducer([Action.WIDGET_PLUGIN_FINISHED_LOADING, Action.DELETE_WIDGET_PLUGIN], widgetPlugin);
	function widgetPlugins(state, action) {
	    if (state === void 0) { state = initialState; }
	    state = pluginsCrudReducer(state, action);
	    switch (action.type) {
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            if (state[action.id]) {
	                return _.assign({}, state, (_a = {},
	                    _a[action.id] = widgetPlugin(state[action.id], action),
	                    _a
	                ));
	            }
	            else {
	                return state;
	            }
	        default:
	            return state;
	    }
	    var _a;
	}
	exports.widgetPlugins = widgetPlugins;
	function widgetPlugin(state, action) {
	    switch (action.type) {
	        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
	            if (!action.typeInfo.type) {
	                // TODO: Catch this earlier
	                throw new Error("A Plugin needs a type name.");
	            }
	            return {
	                id: action.typeInfo.type,
	                url: action.url,
	                typeInfo: action.typeInfo,
	                isLoading: false
	            };
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            return _.assign({}, state, {
	                isLoading: true
	            });
	        default:
	            return state;
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var datasourcePluginRegistry_1 = __webpack_require__(57);
	var _ = __webpack_require__(21);
	var Plugins = __webpack_require__(63);
	var PluginCache = __webpack_require__(29);
	var scriptLoader_1 = __webpack_require__(64);
	var URI = __webpack_require__(66);
	var widgetPluginRegistry_1 = __webpack_require__(70);
	/**
	 * The root of the Dashboard business Logic
	 * Defines the lifecycle of the Dashboard from creation till disposal
	 */
	var Dashboard = (function () {
	    function Dashboard(_store) {
	        var _this = this;
	        this._store = _store;
	        this._initialized = false;
	        this._scriptsLoading = {};
	        this._datasourcePluginRegistry = new datasourcePluginRegistry_1.default(_store);
	        this._widgetPluginRegistry = new widgetPluginRegistry_1.default(_store);
	        _store.subscribe(function () {
	            // Whenever a datasource is added that is still loading, we create an instance and update the loading state
	            var state = _store.getState();
	            state.pluginLoader.loadingUrls.forEach(function (urlToLoad) {
	                if (!_this._scriptsLoading[urlToLoad]) {
	                    _this.loadPluginScript(urlToLoad);
	                }
	            });
	        });
	    }
	    Dashboard.setInstance = function (dashboard) {
	        Dashboard._instance = dashboard;
	    };
	    /**
	     * We have some code that depends on this global instance of the Dashboard
	     * This is bad, but better that static references
	     * we have at least the chance to influence the instance during tests
	     *
	     * @returns {Dashboard}
	     */
	    Dashboard.getInstance = function () {
	        if (!Dashboard._instance) {
	            throw new Error("No global dashboard created. Call setInstance(dashboard) before!");
	        }
	        return Dashboard._instance;
	    };
	    Object.defineProperty(Dashboard.prototype, "datasourcePluginRegistry", {
	        get: function () {
	            return this._datasourcePluginRegistry;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Dashboard.prototype, "widgetPluginRegistry", {
	        get: function () {
	            return this._widgetPluginRegistry;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dashboard.prototype.init = function () {
	        var _this = this;
	        if (this._initialized) {
	            throw new Error("Dashboard was already initialized. Can not call init() twice.");
	        }
	        this._initialized = true;
	        // TODO: Should not be needed but is still needed for unloading plugins and in some widget code
	        Dashboard.setInstance(this);
	        var state = this._store.getState();
	        var plugins = _.valuesIn(state.datasourcePlugins)
	            .concat(_.valuesIn(state.widgetPlugins));
	        plugins.forEach(function (plugin) {
	            _this._store.dispatch(Plugins.startLoadingPluginFromUrl(plugin.url, plugin.id));
	        });
	    };
	    Dashboard.prototype.dispose = function () {
	        this._datasourcePluginRegistry.dispose();
	        // TODO: this._widgetPluginRegistry.dispose();
	    };
	    Dashboard.prototype.loadPluginScript = function (url) {
	        var _this = this;
	        var loadScriptsPromise = scriptLoader_1.default.loadScript([url]);
	        loadScriptsPromise.catch(function (error) {
	            console.warn("Failed to load script: " + error.message);
	        });
	        this._scriptsLoading[url] = loadScriptsPromise.then(function () {
	            if (PluginCache.hasPlugin()) {
	                // TODO: use a reference to the pluginCache and only bind that instance to the window object while the script is loaded
	                // TODO: The scriploader can ensure that only one script is loaded at a time
	                var plugin = PluginCache.popLoadedPlugin();
	                return _this.loadPluginScriptDependencies(plugin, url);
	            }
	            else {
	                return Promise.reject(new Error("Failed to load Plugin. Make sure it called window.iotDashboardApi.register***Plugin from url " + url));
	            }
	        })
	            .then(function (plugin) {
	            if (plugin.Datasource) {
	                _this._datasourcePluginRegistry.registerDatasourcePlugin(plugin, url);
	            }
	            else if (plugin.Widget) {
	                _this._widgetPluginRegistry.register(plugin);
	                _this._store.dispatch(Plugins.widgetPluginFinishedLoading(plugin, url));
	            }
	            delete _this._scriptsLoading[url];
	            return Promise.resolve();
	        });
	        /*.catch((error) => {
	         console.error(error.message);
	         delete this._scriptsLoading[url];
	         throw error;
	         }); */
	        return this._scriptsLoading[url];
	    };
	    Dashboard.prototype.loadPluginScriptDependencies = function (plugin, url) {
	        var dependencies = plugin.TYPE_INFO.dependencies;
	        if (_.isArray(dependencies) && dependencies.length !== 0) {
	            var dependencyPaths = dependencies.map(function (dependency) {
	                return URI(dependency).absoluteTo(url).toString();
	            });
	            console.log("Loading Dependencies for Plugin", dependencyPaths);
	            return scriptLoader_1.default.loadScript(dependencyPaths).then(function () {
	                return Promise.resolve(plugin);
	            });
	        }
	        else {
	            return Promise.resolve(plugin);
	        }
	    };
	    return Dashboard;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Dashboard;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var pluginRegistry_1 = __webpack_require__(58);
	var datasourcePluginFactory_1 = __webpack_require__(59);
	var Plugins = __webpack_require__(63);
	var DatasourcePluginRegistry = (function (_super) {
	    __extends(DatasourcePluginRegistry, _super);
	    function DatasourcePluginRegistry(_store) {
	        _super.call(this, _store);
	        this._disposed = false;
	    }
	    Object.defineProperty(DatasourcePluginRegistry.prototype, "disposed", {
	        get: function () {
	            return this._disposed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DatasourcePluginRegistry.prototype.registerDatasourcePlugin = function (plugin, url) {
	        _super.prototype.register.call(this, plugin);
	        this.store.dispatch(Plugins.datasourcePluginFinishedLoading(plugin, url));
	    };
	    DatasourcePluginRegistry.prototype.createPluginFromModule = function (module) {
	        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
	        return new datasourcePluginFactory_1.default(module.TYPE_INFO.type, module.Datasource, this.store);
	    };
	    DatasourcePluginRegistry.prototype.dispose = function () {
	        if (!this._disposed) {
	            this._disposed = true;
	            clearInterval(this._fetchIntervalRef);
	            this._fetchIntervalRef = null;
	            _super.prototype.dispose.call(this);
	        }
	    };
	    return DatasourcePluginRegistry;
	}(pluginRegistry_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DatasourcePluginRegistry;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(21);
	var PluginRegistry = (function () {
	    function PluginRegistry(_store) {
	        this._store = _store;
	        this._plugins = {};
	        if (!_store) {
	            throw new Error("PluginRegistry must be initialized with a Store");
	        }
	    }
	    Object.defineProperty(PluginRegistry.prototype, "store", {
	        get: function () {
	            return this._store;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PluginRegistry.prototype.register = function (module) {
	        if (!this._store === undefined) {
	            throw new Error("PluginRegistry has no store. Set the store property before registering modules!");
	        }
	        console.assert(module.TYPE_INFO !== undefined, "Missing TYPE_INFO on plugin module. Every module must export TYPE_INFO");
	        console.assert(module.TYPE_INFO.type !== undefined, "Missing TYPE_INFO.type on plugin TYPE_INFO.");
	        this._plugins[module.TYPE_INFO.type] = this.createPluginFromModule(module);
	    };
	    PluginRegistry.prototype.createPluginFromModule = function (module) {
	        throw new Error("PluginRegistry must implement createPluginFromModule");
	    };
	    PluginRegistry.prototype.hasPlugin = function (type) {
	        return this._plugins[type] !== undefined;
	    };
	    // TODO: rename to getPluginFactory() when also widgets are in TypeScript?
	    PluginRegistry.prototype.getPlugin = function (type) {
	        var plugin = this._plugins[type];
	        if (!plugin) {
	            throw new Error("Can not find plugin with type '" + type + "' in plugin registry.");
	        }
	        return plugin;
	    };
	    PluginRegistry.prototype.getPlugins = function () {
	        return _.assign({}, this._plugins);
	    };
	    PluginRegistry.prototype.dispose = function () {
	        _.valuesIn(this._plugins).forEach(function (plugin) {
	            if (_.isFunction(plugin.dispose)) {
	                plugin.dispose();
	            }
	        });
	        this._plugins = {};
	    };
	    return PluginRegistry;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PluginRegistry;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(21);
	var Datasource = __webpack_require__(60);
	var datasourcePluginInstance_1 = __webpack_require__(61);
	/**
	 * Connects a datasource to the application state
	 */
	var DataSourcePluginFactory = (function () {
	    function DataSourcePluginFactory(_type, _datasource, _store) {
	        var _this = this;
	        this._type = _type;
	        this._datasource = _datasource;
	        this._store = _store;
	        this._pluginInstances = {};
	        this._disposed = false;
	        this._unsubscribe = _store.subscribe(function () { return _this.handleStateChange(); });
	    }
	    Object.defineProperty(DataSourcePluginFactory.prototype, "type", {
	        get: function () {
	            return this._type;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(DataSourcePluginFactory.prototype, "disposed", {
	        get: function () {
	            return this._disposed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DataSourcePluginFactory.prototype.getInstance = function (id) {
	        if (this._disposed === true) {
	            throw new Error("Try to get datasource of destroyed type. " + JSON.stringify({ id: id, type: this.type }));
	        }
	        if (!this._pluginInstances[id]) {
	            throw new Error("No running instance of datasource. " + JSON.stringify({ id: id, type: this.type }));
	        }
	        return this._pluginInstances[id];
	    };
	    DataSourcePluginFactory.prototype.dispose = function () {
	        this._disposed = true;
	        _.valuesIn(this._pluginInstances).forEach(function (plugin) {
	            if (_.isFunction(plugin.dispose)) {
	                try {
	                    plugin.dispose();
	                }
	                catch (e) {
	                    console.error("Failed to destroy Datasource instance", plugin);
	                }
	            }
	        });
	        this._pluginInstances = {};
	        this._unsubscribe();
	    };
	    DataSourcePluginFactory.prototype.handleStateChange = function () {
	        var _this = this;
	        var state = this._store.getState();
	        if (this.oldDatasourcesState === state.datasources) {
	            return;
	        }
	        // Create Datasource instances for missing data sources in store
	        _.valuesIn(state.datasources)
	            .filter(function (dsState) { return dsState.type === _this.type; })
	            .forEach(function (dsState) {
	            if (_this._pluginInstances[dsState.id] === undefined) {
	                _this._pluginInstances[dsState.id] = _this.createInstance(dsState.id);
	                _this._pluginInstances[dsState.id].initialize();
	                _this._store.dispatch(Datasource.finishedLoading(dsState.id));
	            }
	        });
	        // For all running datasources we notify them about setting changes
	        // TODO: make it more explicit for settings and state, only update on real changes
	        _.valuesIn(state.datasources).forEach(function (dsState) { return _this.updateDatasource(dsState); });
	        this.oldDatasourcesState = state.datasources;
	    };
	    DataSourcePluginFactory.prototype.updateDatasource = function (dsState) {
	        var plugin = this._pluginInstances[dsState.id];
	        if (!plugin) {
	            // This is normal to happen when the app starts,
	            // since the state already contains the id's before plugin instances are loaded
	            //console.warn("Can not find Datasource instance with id " + dsState.id + ". Skipping Update!");
	            return;
	        }
	        plugin.props = _.assign({}, plugin.props, { state: dsState });
	    };
	    DataSourcePluginFactory.prototype.createInstance = function (id) {
	        if (this._disposed === true) {
	            throw new Error("Try to create datasource of destroyed type: " + JSON.stringify({ id: id, type: this.type }));
	        }
	        if (this._pluginInstances[id] !== undefined) {
	            throw new Error("Can not create datasource instance. It already exists: " + JSON.stringify({
	                id: id,
	                type: this.type
	            }));
	        }
	        return new datasourcePluginInstance_1.DatasourcePluginInstance(id, this._datasource, this._store);
	    };
	    return DataSourcePluginFactory;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataSourcePluginFactory;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var reducer_js_1 = __webpack_require__(50);
	var ActionNames = __webpack_require__(46);
	var Uuid = __webpack_require__(49);
	var _ = __webpack_require__(21);
	var ModalIds = __webpack_require__(54);
	var Modal = __webpack_require__(53);
	var initialDatasources = {
	    "initial_random_source": {
	        id: "initial_random_source",
	        type: "random",
	        settings: {
	            name: "Random",
	            min: 10,
	            max: 20,
	            maxValues: 20
	        },
	        data: [],
	        isLoading: true,
	        replaceData: false
	    }
	};
	function createDatasource(type, settings, id) {
	    if (id === void 0) { id = Uuid.generate(); }
	    return addDatasource(type, settings, true, id);
	}
	exports.createDatasource = createDatasource;
	function updateDatasource(id, type, settings) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var dsState = state.datasources[id];
	        if (!dsState) {
	            throw new Error("Failed to update not existing datasource of type '" + type + "' with id '" + id + "'");
	        }
	        if (dsState.type !== type) {
	            throw new Error("Can not update datasource of type '" + dsState.type + "' with props of type '" + type + "'");
	        }
	        dispatch(updateDatasourceSettings(id, settings));
	    };
	}
	exports.updateDatasource = updateDatasource;
	function finishedLoading(id) {
	    return {
	        type: ActionNames.DATASOURCE_FINISHED_LOADING,
	        id: id
	    };
	}
	exports.finishedLoading = finishedLoading;
	function addDatasource(dsType, settings, isLoading, id) {
	    if (isLoading === void 0) { isLoading = true; }
	    if (id === void 0) { id = Uuid.generate(); }
	    if (!dsType) {
	        console.warn("dsType: ", dsType);
	        console.warn("settings: ", settings);
	        throw new Error("Can not add Datasource without Type");
	    }
	    return {
	        type: ActionNames.ADD_DATASOURCE,
	        id: id,
	        dsType: dsType,
	        settings: settings,
	        isLoading: isLoading
	    };
	}
	exports.addDatasource = addDatasource;
	function updateDatasourceSettings(id, settings) {
	    // TODO: Working on that copy does not work yet. We need to notify the Datasource about updated settings!
	    //let settingsCopy = {...settings};
	    return {
	        type: ActionNames.UPDATE_DATASOURCE,
	        id: id,
	        settings: settings
	    };
	}
	exports.updateDatasourceSettings = updateDatasourceSettings;
	function startCreateDatasource() {
	    return Modal.showModal(ModalIds.DATASOURCE_CONFIG);
	}
	exports.startCreateDatasource = startCreateDatasource;
	function startEditDatasource(id) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var dsState = state.datasources[id];
	        dispatch(Modal.showModal(ModalIds.DATASOURCE_CONFIG, { datasource: dsState }));
	    };
	}
	exports.startEditDatasource = startEditDatasource;
	function deleteDatasource(id) {
	    return {
	        type: ActionNames.DELETE_DATASOURCE,
	        id: id
	    };
	}
	exports.deleteDatasource = deleteDatasource;
	function fetchedDatasourceData(id, data) {
	    return {
	        type: ActionNames.FETCHED_DATASOURCE_DATA,
	        id: id,
	        data: data,
	        doNotLog: true,
	        doNotPersist: true
	    };
	}
	exports.fetchedDatasourceData = fetchedDatasourceData;
	function updatedMaxValues(id, maxValues) {
	    return {
	        type: ActionNames.UPDATED_MAX_VALUES,
	        id: id,
	        maxValues: maxValues
	    };
	}
	exports.updatedMaxValues = updatedMaxValues;
	function updatedFetchReplaceData(id, replaceData) {
	    return {
	        type: ActionNames.UPDATED_FETCH_REPLACE_DATA,
	        id: id,
	        replaceData: replaceData
	    };
	}
	exports.updatedFetchReplaceData = updatedFetchReplaceData;
	var datasourceCrudReducer = reducer_js_1.genCrudReducer([ActionNames.ADD_DATASOURCE, ActionNames.DELETE_DATASOURCE], datasource);
	function datasources(state, action) {
	    if (state === void 0) { state = initialDatasources; }
	    state = datasourceCrudReducer(state, action);
	    switch (action.type) {
	        case ActionNames.DELETE_DATASOURCE_PLUGIN: {
	            var toDelete = _.valuesIn(state).filter(function (dsState) {
	                return dsState.type === action.id;
	            });
	            var newState_1 = _.assign({}, state);
	            toDelete.forEach(function (dsState) {
	                delete newState_1[dsState.id];
	            });
	            return newState_1;
	        }
	        case ActionNames.UPDATED_MAX_VALUES: {
	            var newState = _.assign({}, state);
	            return _.assign({}, state, (_a = {},
	                _a[action.id] = datasource(newState[action.id], action),
	                _a
	            ));
	        }
	        case ActionNames.UPDATED_FETCH_REPLACE_DATA: {
	            var newState = _.assign({}, state);
	            return _.assign({}, state, (_b = {},
	                _b[action.id] = datasource(newState[action.id], action),
	                _b
	            ));
	        }
	        default:
	            return state;
	    }
	    var _a, _b;
	}
	exports.datasources = datasources;
	function datasource(state, action) {
	    switch (action.type) {
	        case ActionNames.ADD_DATASOURCE:
	            return {
	                id: action.id,
	                type: action.dsType,
	                settings: action.settings,
	                data: [],
	                isLoading: true,
	                replaceData: false
	            };
	        case ActionNames.SET_DATASOURCE_DATA:
	            return _.assign({}, state, {
	                data: action.data || []
	            });
	        case ActionNames.UPDATED_MAX_VALUES:
	            var maxValues = action.maxValues;
	            if (maxValues < 1) {
	                maxValues = 1;
	            }
	            return _.assign({}, state, {
	                settings: _.assign({}, state.settings, { maxValues: maxValues })
	            });
	        case ActionNames.FETCHED_DATASOURCE_DATA:
	            var newData = void 0;
	            if (state.replaceData) {
	                newData = action.data;
	            }
	            else {
	                newData = _.clone(state.data).concat(action.data);
	            }
	            if (state.settings.maxValues) {
	                newData = _.takeRight(newData, state.settings.maxValues);
	            }
	            return _.assign({}, state, {
	                data: newData
	            });
	        case ActionNames.UPDATE_DATASOURCE:
	            return _.assign({}, state, {
	                settings: action.settings
	            });
	        case ActionNames.DATASOURCE_FINISHED_LOADING: {
	            var newState = _.assign({}, state);
	            newState.isLoading = false;
	            return newState;
	        }
	        case ActionNames.UPDATED_FETCH_REPLACE_DATA: {
	            var newState = _.clone(state);
	            newState.replaceData = action.replaceData;
	            return newState;
	        }
	        default:
	            return state;
	    }
	}


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var datasourceScheduler_1 = __webpack_require__(62);
	var Datasource = __webpack_require__(60);
	/**
	 * Represents a plugin instance, state should be saved in store!
	 */
	var DatasourcePluginInstance = (function () {
	    function DatasourcePluginInstance(id, dsConstructor, store) {
	        this.id = id;
	        this.dsConstructor = dsConstructor;
	        this.store = store;
	        this.scheduler = new datasourceScheduler_1.DatasourceScheduler(this, this.store);
	        this.initializePluginInstance();
	    }
	    DatasourcePluginInstance.prototype.initializePluginInstance = function () {
	        var _this = this;
	        var dsState = this.state;
	        var props = {
	            state: dsState,
	            setFetchInterval: function (ms) { return _this.setFetchInterval(ms); },
	            setFetchReplaceData: function (replace) { return _this.setFetchReplaceData(replace); }
	        };
	        console.log("dsConstructor", this.dsConstructor);
	        var pluginInstance = new this.dsConstructor();
	        this.dsInstance = pluginInstance;
	        pluginInstance.props = props;
	        // Bind API functions to instance
	        if (_.isFunction(pluginInstance.datasourceWillReceiveProps)) {
	            pluginInstance.datasourceWillReceiveProps = pluginInstance.datasourceWillReceiveProps.bind(pluginInstance);
	        }
	        if (_.isFunction(pluginInstance.datasourceWillReceiveSettings)) {
	            pluginInstance.datasourceWillReceiveSettings = pluginInstance.datasourceWillReceiveSettings.bind(pluginInstance);
	        }
	        if (_.isFunction(pluginInstance.dispose)) {
	            pluginInstance.dispose = pluginInstance.dispose.bind(pluginInstance);
	        }
	        if (_.isFunction(pluginInstance.fetchData)) {
	            pluginInstance.fetchData = pluginInstance.fetchData.bind(pluginInstance);
	        }
	        if (_.isFunction(pluginInstance.initialize)) {
	            pluginInstance.initialize = pluginInstance.initialize.bind(pluginInstance);
	        }
	    };
	    Object.defineProperty(DatasourcePluginInstance.prototype, "props", {
	        get: function () {
	            return this.dsInstance.props;
	        },
	        set: function (newProps) {
	            var oldProps = this.dsInstance.props;
	            if (oldProps !== newProps) {
	                this.datasourceWillReceiveProps(newProps);
	                this.dsInstance.props = newProps;
	                if (newProps.state.settings !== oldProps.state.settings) {
	                    this.scheduler.forceUpdate();
	                }
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DatasourcePluginInstance.prototype.setFetchInterval = function (intervalMs) {
	        this.scheduler.fetchInterval = intervalMs;
	    };
	    DatasourcePluginInstance.prototype.setFetchReplaceData = function (replace) {
	        this.store.dispatch(Datasource.updatedFetchReplaceData(this.id, replace));
	    };
	    /**
	     * The the number of values stored in the datasource
	     * @param maxValues
	     */
	    DatasourcePluginInstance.prototype.setMaxValues = function (maxValues) {
	        this.store.dispatch(Datasource.updatedMaxValues(this.id, maxValues));
	    };
	    Object.defineProperty(DatasourcePluginInstance.prototype, "state", {
	        get: function () {
	            var state = this.store.getState();
	            var dsState = state.datasources[this.id];
	            if (!dsState) {
	                throw new Error("Can not get state of non existing datasource with id " + this.id);
	            }
	            return dsState;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(DatasourcePluginInstance.prototype, "pluginState", {
	        get: function () {
	            return this.store.getState().datasourcePlugins[this.state.type];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DatasourcePluginInstance.prototype.initialize = function () {
	        if (_.isFunction(this.dsInstance.initialize)) {
	            this.dsInstance.initialize(this.props);
	        }
	        this.scheduler.start();
	    };
	    DatasourcePluginInstance.prototype.datasourceWillReceiveProps = function (newProps) {
	        if (newProps.state.settings !== this.props.state.settings) {
	            if (_.isFunction(this.dsInstance.datasourceWillReceiveSettings)) {
	                this.dsInstance.datasourceWillReceiveSettings(this.props.state.settings);
	            }
	        }
	        if (_.isFunction(this.dsInstance.datasourceWillReceiveProps)) {
	            this.dsInstance.datasourceWillReceiveProps(newProps);
	        }
	    };
	    DatasourcePluginInstance.prototype.fetchData = function (resolve, reject) {
	        if (!this.dsInstance.fetchData) {
	            console.warn("fetchData(resolve, reject) is not implemented in Datasource ", this.dsInstance);
	            reject(new Error("fetchData(resolve, reject) is not implemented in Datasource " + this.pluginState.id));
	        }
	        this.dsInstance.fetchData(resolve, reject);
	    };
	    DatasourcePluginInstance.prototype.dispose = function () {
	        this.scheduler.dispose();
	    };
	    return DatasourcePluginInstance;
	}());
	exports.DatasourcePluginInstance = DatasourcePluginInstance;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Datasource = __webpack_require__(60);
	var DatasourceScheduler = (function () {
	    function DatasourceScheduler(dsInstance, store) {
	        this.dsInstance = dsInstance;
	        this.store = store;
	        this._fetchInterval = 1000;
	        this.disposed = false;
	        this.running = false;
	    }
	    Object.defineProperty(DatasourceScheduler.prototype, "fetchInterval", {
	        set: function (ms) {
	            this._fetchInterval = ms;
	            if (this._fetchInterval < 1000) {
	                this.fetchInterval = 1000;
	                console.warn("Datasource has fetch interval below 1000ms, it was forced to 1000ms\n" +
	                    "Please do not set intervals shorter than 1000ms. If you really need this, file a ticket with explanation!");
	            }
	            this.clearFetchTimeout();
	            this.scheduleFetch(this._fetchInterval);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DatasourceScheduler.prototype.start = function () {
	        this.running = true;
	        // Fetch once as soon as possible
	        this.scheduleFetch(0);
	    };
	    DatasourceScheduler.prototype.forceUpdate = function () {
	        console.log("Force Update!");
	        this.scheduleFetch(0);
	    };
	    DatasourceScheduler.prototype.dispose = function () {
	        this.clearFetchTimeout();
	        this.disposed = true;
	        this.running = false;
	    };
	    DatasourceScheduler.prototype.scheduleFetch = function (ms) {
	        var _this = this;
	        if (ms === Infinity) {
	            return;
	        }
	        if (!this.running) {
	            return;
	        }
	        this.fetchTimeoutRef = setTimeout(function () {
	            _this.doFetchData();
	        }, ms);
	    };
	    DatasourceScheduler.prototype.clearFetchTimeout = function () {
	        if (this.fetchTimeoutRef) {
	            clearTimeout(this.fetchTimeoutRef);
	            this.fetchTimeoutRef = null;
	        }
	    };
	    DatasourceScheduler.prototype.doFetchData = function () {
	        var _this = this;
	        var dsState = this.store.getState().datasources[this.dsInstance.id];
	        if (!dsState) {
	            console.log("Skipping fetchData because plugin does not exists - it's time to dispose?");
	            this.scheduleFetch(this._fetchInterval);
	        }
	        if (dsState.isLoading) {
	            console.log("Skipping fetchData because plugin is still loading");
	            this.scheduleFetch(this._fetchInterval);
	            return;
	        }
	        if (this.fetchPromise) {
	            console.warn("Do not fetch data because a fetch is currently running on Datasource", dsState);
	            return;
	        }
	        var fetchPromise = new Promise(function (resolve, reject) {
	            _this.dsInstance.fetchData(resolve, reject);
	            setTimeout(function () {
	                if (_this.fetchPromise === fetchPromise) {
	                    reject(new Error("Timeout! Datasource fetchData() took longer than 5 seconds."));
	                }
	            }, 5000);
	        });
	        this.fetchPromise = fetchPromise;
	        fetchPromise.then(function (result) {
	            _this.fetchPromise = null;
	            if (!_this.disposed) {
	                //console.log("fetData plugin finished", dsState, result);
	                if (result !== undefined) {
	                    _this.store.dispatch(Datasource.fetchedDatasourceData(dsState.id, result));
	                }
	                _this.scheduleFetch(_this._fetchInterval);
	            }
	            else {
	                console.error("fetchData of disposed plugin finished - result discarded", dsState, result);
	            }
	        }).catch(function (error) {
	            console.warn("Failed to fetch data for Datasource " + dsState.type, dsState);
	            console.error(error);
	            _this.fetchPromise = null;
	            _this.scheduleFetch(_this._fetchInterval);
	        });
	    };
	    return DatasourceScheduler;
	}());
	exports.DatasourceScheduler = DatasourceScheduler;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	var initialState = {
	    loadingUrls: []
	};
	function startLoadingPluginFromUrl(url, id) {
	    return {
	        type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
	        id: id,
	        url: url
	    };
	}
	exports.startLoadingPluginFromUrl = startLoadingPluginFromUrl;
	function widgetPluginFinishedLoading(plugin, url) {
	    if (url === void 0) { url = null; }
	    return {
	        type: Action.WIDGET_PLUGIN_FINISHED_LOADING,
	        id: plugin.TYPE_INFO.type,
	        typeInfo: plugin.TYPE_INFO,
	        isLoading: false,
	        url: url
	    };
	}
	exports.widgetPluginFinishedLoading = widgetPluginFinishedLoading;
	function datasourcePluginFinishedLoading(plugin, url) {
	    if (url === void 0) { url = null; }
	    return {
	        type: Action.DATASOURCE_PLUGIN_FINISHED_LOADING,
	        id: plugin.TYPE_INFO.type,
	        typeInfo: plugin.TYPE_INFO,
	        isLoading: false,
	        url: url
	    };
	}
	exports.datasourcePluginFinishedLoading = datasourcePluginFinishedLoading;
	function pluginLoaderReducer(state, action) {
	    if (state === void 0) { state = initialState; }
	    switch (action.type) {
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            {
	                var newState = _.assign({}, state);
	                newState.loadingUrls = urlsReducer(state.loadingUrls, action);
	                return newState;
	            }
	        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
	        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
	            {
	                var newState = _.assign({}, state);
	                newState.loadingUrls = urlsReducer(state.loadingUrls, action);
	                return newState;
	            }
	        default:
	            return state;
	    }
	}
	exports.pluginLoaderReducer = pluginLoaderReducer;
	function urlsReducer(state, action) {
	    switch (action.type) {
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            if (!action.url) {
	                throw new Error("Can not load plugin from empty URL");
	            }
	            return state.slice().concat([action.url]);
	        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
	        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
	            return state.slice().filter(function (url) { return url !== action.url; });
	        default:
	            return state;
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var loadjs = __webpack_require__(65);
	// This is a class because we can not mock it on module level.
	var ScriptLoader = (function () {
	    function ScriptLoader() {
	    }
	    ScriptLoader.loadScript = function (paths) {
	        return new Promise(function (resolve, reject) {
	            try {
	                loadjs(paths, {
	                    success: function () {
	                        resolve();
	                    },
	                    error: function (error) {
	                        reject(error);
	                    }
	                });
	            }
	            catch (error) {
	                reject(error);
	            }
	        });
	    };
	    return ScriptLoader;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScriptLoader;


/***/ },
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var pluginRegistry_1 = __webpack_require__(58);
	var widgetPluginFactory_1 = __webpack_require__(71);
	var WidgetPluginRegistry = (function (_super) {
	    __extends(WidgetPluginRegistry, _super);
	    function WidgetPluginRegistry(store) {
	        _super.call(this, store);
	    }
	    WidgetPluginRegistry.prototype.createPluginFromModule = function (module) {
	        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
	        return new widgetPluginFactory_1.default(module.TYPE_INFO.type, module.Widget, this.store);
	    };
	    return WidgetPluginRegistry;
	}(pluginRegistry_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetPluginRegistry;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var react_redux_1 = __webpack_require__(42);
	var React = __webpack_require__(20);
	var domWidgetContainer_1 = __webpack_require__(72);
	var Widgets = __webpack_require__(48);
	var WidgetPluginFactory = (function () {
	    function WidgetPluginFactory(type, widget, store) {
	        this.type = type;
	        this.widget = widget;
	        this.store = store;
	        this.instances = {};
	        this.disposed = false;
	        // only bind the getData function once, so it can be safely used in the connect function
	        this.getData = function (getState, dsId) {
	            var ds = getState().datasources[dsId];
	            if (!ds) {
	                return [];
	            }
	            return ds.data || [];
	        }.bind(this, this.store.getState);
	    }
	    WidgetPluginFactory.prototype.updateSetting = function (widgetId, settingId, value) {
	        console.log("update", settingId, "to", value, 'of', widgetId);
	        this.store.dispatch(Widgets.updatedSingleSetting(widgetId, settingId, value));
	    };
	    WidgetPluginFactory.prototype.getInstance = function (id) {
	        var _this = this;
	        if (this.disposed === true) {
	            throw new Error("Try to create widget of destroyed type: " + this.type);
	        }
	        if (this.instances[id]) {
	            return this.instances[id];
	        }
	        // TODO: check if module.Widget is a react component
	        var widgetPlugin = this.store.getState().widgetPlugins[this.type];
	        var rendering = widgetPlugin.typeInfo.rendering || "react";
	        var widgetComponent = this.widget;
	        if (rendering.toLowerCase() === "dom") {
	            // TODO: any batter way to avoid the any cast?
	            widgetComponent = domWidgetContainer_1.DomWidgetContainer;
	        }
	        var widget = react_redux_1.connect(function () {
	            // This method will be used as mapStateToProps, leading to a constant "getData()" function per instance
	            // Therefor the update is only called when actual state changes
	            return function (state) {
	                var widgetState = state.widgets[id];
	                return {
	                    state: widgetState,
	                    // This is used to trigger re-rendering on Datasource change
	                    // TODO: in future only the datasources the Widget is interested in should trigger re-rendering
	                    _datasources: state.datasources,
	                    getData: _this.getData,
	                    updateSetting: _this.updateSetting.bind(_this, id)
	                };
	            };
	        })(widgetComponent); // TODO: get rid of the any?
	        this.instances[id] = React.createElement(widget, { _widgetClass: this.widget });
	        // Should we create here or always outside?
	        return this.instances[id];
	    };
	    WidgetPluginFactory.prototype.dispose = function () {
	        this.disposed = true;
	        this.instances = {};
	    };
	    return WidgetPluginFactory;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetPluginFactory;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var DomWidgetContainer = (function (_super) {
	    __extends(DomWidgetContainer, _super);
	    function DomWidgetContainer(props) {
	        _super.call(this, props);
	        this.state = {
	            widget: new props._widgetClass(props)
	        };
	    }
	    Object.defineProperty(DomWidgetContainer.prototype, "element", {
	        get: function () {
	            return this.refs['container'];
	        },
	        set: function (element) {
	            throw new Error("Can not change element");
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DomWidgetContainer.prototype.componentWillMount = function () {
	        if (this.state.widget.componentWillMount) {
	            this.state.widget.componentWillMount();
	        }
	    };
	    DomWidgetContainer.prototype.componentDidMount = function () {
	        this.state.widget.element = this.element;
	        this.state.widget.render();
	        if (this.state.widget.componentDidMount) {
	            this.state.widget.componentDidMount();
	        }
	    };
	    DomWidgetContainer.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
	        if (this.state.widget.componentWillReceiveProps) {
	            this.state.widget.componentWillReceiveProps(nextProps, nextContext);
	        }
	    };
	    DomWidgetContainer.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
	        if (this.state.widget.shouldComponentUpdate) {
	            return this.state.widget.shouldComponentUpdate(nextProps, nextState, nextContext);
	        }
	        return true;
	    };
	    DomWidgetContainer.prototype.componentWillUpdate = function (nextProps, nextState, nextContext) {
	        if (this.state.widget.componentWillUpdate) {
	            this.state.widget.componentWillUpdate(nextProps, nextState, nextContext);
	        }
	    };
	    DomWidgetContainer.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
	        this.state.widget.element = this.element;
	        this.state.widget.render();
	        if (this.state.widget.componentDidUpdate) {
	            this.state.widget.componentDidUpdate(prevProps, prevState, prevContext);
	        }
	    };
	    DomWidgetContainer.prototype.componentWillUnmount = function () {
	        if (this.state.widget.componentWillUnmount) {
	            this.state.widget.componentWillUnmount();
	        }
	    };
	    DomWidgetContainer.prototype.render = function () {
	        return React.createElement("div", {ref: "container"}, "Widget Plugin missing rendering!");
	    };
	    return DomWidgetContainer;
	}(React.Component));
	exports.DomWidgetContainer = DomWidgetContainer;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	// @noflow
	// Intentional; Flow can't handle the bind on L20
	var React = __webpack_require__(20);
	var ReactDOM = __webpack_require__(41);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = function (ComposedComponent) {
	    var WidthProvider = (function (_super) {
	        __extends(WidthProvider, _super);
	        function WidthProvider(props) {
	            _super.call(this, props);
	            this.state = {
	                mounted: false,
	                width: 1280
	            };
	        }
	        WidthProvider.prototype.componentDidMount = function () {
	            this.setState({ mounted: true });
	            window.addEventListener('resize', this.onWindowResize.bind(this));
	            // Call to properly set the breakpoint and resize the elements.
	            // Note that if you're doing a full-width element, this can get a little wonky if a scrollbar
	            // appears because of the grid. In that case, fire your own resize event, or set `overflow: scroll` on your body.
	            this.onWindowResize();
	        };
	        WidthProvider.prototype.componentWillUnmount = function () {
	            window.removeEventListener('resize', this.onWindowResize);
	        };
	        WidthProvider.prototype.onWindowResize = function (_event, cb) {
	            var node = ReactDOM.findDOMNode(this);
	            var padLeft = window.getComputedStyle(node, null).getPropertyValue('padding-left') || 0;
	            padLeft = parseInt(padLeft) || 0;
	            var padRight = window.getComputedStyle(node, null).getPropertyValue('padding-right') || 0;
	            padRight = parseInt(padRight) || 0;
	            this.setState({ width: node.offsetWidth - padLeft - padRight }, cb);
	        };
	        WidthProvider.prototype.render = function () {
	            if (this.props.measureBeforeMount && !this.state.mounted)
	                return React.createElement("div", __assign({}, this.props, this.state));
	            return React.createElement(ComposedComponent, __assign({}, this.props, this.state));
	        };
	        return WidthProvider;
	    }(React.Component));
	    WidthProvider.defaultProps = {
	        measureBeforeMount: false
	    };
	    WidthProvider.propTypes = {
	        // If true, will not render children until mounted. Useful for getting the exact width before
	        // rendering, to prevent any unsightly resizing.
	        measureBeforeMount: React.PropTypes.bool
	    };
	    return WidthProvider;
	};


/***/ },
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var _ = __webpack_require__(21);
	var Layouts = __webpack_require__(88);
	var ui = __webpack_require__(89);
	var react_1 = __webpack_require__(20);
	/*TODO: Add remove button next to each loadable layout
	 * - Connect with Actions
	 * */
	var LayoutsTopNavItem = function (props) {
	    return React.createElement("div", {className: "ui simple dropdown item"}, "Layout", React.createElement("i", {className: "dropdown icon"}), React.createElement("div", {className: "ui menu"}, React.createElement(SaveLayout, null), React.createElement(ResetLayoutButton, {text: "Reset Current Layout", icon: "undo"}), React.createElement(SaveLayoutButton, {text: "Save Layout", icon: "save"}), React.createElement("div", {className: "ui divider"}), React.createElement("div", {className: "header"}, "Load Layout"), props.layouts.map(function (layout) {
	        return React.createElement(LayoutItem, {text: layout.name, icon: "plus", layout: layout, key: layout.id});
	    })));
	};
	LayoutsTopNavItem.propTypes = {
	    layouts: react_1.PropTypes.arrayOf(react_1.PropTypes.shape({
	        name: react_1.PropTypes.string
	    })),
	    widgets: react_1.PropTypes.object,
	    currentLayout: react_1.PropTypes.object
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        layouts: _.valuesIn(state.layouts),
	        currentLayout: state.currentLayout,
	        widgets: state.widgets
	    };
	}, function (dispatch) {
	    return {};
	})(LayoutsTopNavItem);
	var SaveInput = (function (_super) {
	    __extends(SaveInput, _super);
	    function SaveInput() {
	        _super.apply(this, arguments);
	    }
	    SaveInput.prototype.onEnter = function (e) {
	        if (e.key === 'Enter') {
	            this.props.onEnter(this.refs.input.value, this.props);
	            this.refs.input.value = '';
	        }
	    };
	    SaveInput.prototype.render = function () {
	        return React.createElement("div", {className: "item"}, React.createElement("div", {className: "ui icon input"}, React.createElement("input", {type: "text", placeholder: "Save as...", ref: "input", onKeyPress: this.onEnter.bind(this)}), React.createElement("i", {className: "save icon", onClick: this.onEnter.bind(this), style: { cursor: "pointer", zIndex: 90000 }})));
	    };
	    return SaveInput;
	}(React.Component));
	SaveInput.propTypes = {
	    onEnter: react_1.PropTypes.func,
	    widgets: react_1.PropTypes.object
	};
	var SaveLayout = react_redux_1.connect(function (state) {
	    return {
	        layouts: _.valuesIn(state.layouts),
	        widgets: state.widgets
	    };
	}, function (dispatch, props) {
	    return {
	        onEnter: function (name, props) {
	            dispatch(Layouts.addLayout(name, props.widgets));
	        }
	    };
	})(SaveInput);
	var MyLayoutItem = (function (_super) {
	    __extends(MyLayoutItem, _super);
	    function MyLayoutItem() {
	        _super.apply(this, arguments);
	    }
	    MyLayoutItem.prototype.render = function () {
	        var props = this.props;
	        var indexIconClass = null;
	        if (props.currentLayout.id == props.layout.id) {
	            indexIconClass = "tiny selected radio icon";
	        }
	        else {
	            indexIconClass = "tiny radio icon";
	        }
	        return React.createElement("a", {className: "item", href: "#", onClick: function () { return props.onClick(props); }}, React.createElement("i", {className: indexIconClass}), React.createElement("i", {className: "right floated remove huge icon", onClick: function (e) {
	            props.deleteLayout(props);
	            e.stopPropagation();
	        }}), " ", props.text);
	    };
	    return MyLayoutItem;
	}(React.Component));
	MyLayoutItem.propTypes = {
	    deleteLayout: react_1.PropTypes.func.isRequired,
	    onClick: react_1.PropTypes.func.isRequired,
	    layout: react_1.PropTypes.object.isRequired,
	    currentLayout: react_1.PropTypes.object
	};
	var LayoutItem = react_redux_1.connect(function (state) {
	    return {
	        currentLayout: state.currentLayout
	    };
	}, function (dispatch, props) {
	    return {
	        deleteLayout: function (props) { return dispatch(Layouts.deleteLayout(props.layout.id)); },
	        onClick: function (props) { return dispatch(Layouts.loadLayout(props.layout.id)); }
	    };
	})(MyLayoutItem);
	/*
	 const ResetLayoutButtonc = (props) => {
	 return <ui.LinkItem
	 onClick={this.props.resetLayout.bind(this, this.props)}></ui.LinkItem>
	 };*/
	var ResetLayoutButton = react_redux_1.connect(function (state) {
	    return {
	        id: state.currentLayout.id,
	        disabled: !state.currentLayout.id
	    };
	}, function (dispatch, props) {
	    return {
	        onClick: function (props) { return dispatch(Layouts.loadLayout(props.id)); }
	    };
	})(ui.LinkItem);
	var SaveLayoutButton = react_redux_1.connect(function (state) {
	    return {
	        id: state.currentLayout.id,
	        widgets: state.widgets,
	        disabled: !state.currentLayout.id
	    };
	}, function (dispatch) {
	    return {
	        onClick: function (props) { return dispatch(Layouts.updateLayout(props.id, props.widgets)); }
	    };
	})(ui.LinkItem);


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Widgets = __webpack_require__(48);
	var uuid_1 = __webpack_require__(49);
	var reducer_1 = __webpack_require__(50);
	var actionNames_1 = __webpack_require__(46);
	var initialLayouts = {
	    "default": {
	        id: "default",
	        name: "Default Layout",
	        widgets: Widgets.initialWidgets
	    }
	};
	function addLayout(name, widgets) {
	    return function (dispatch) {
	        var addLayout = dispatch({
	            type: actionNames_1.ADD_LAYOUT,
	            id: uuid_1.generate(),
	            name: name,
	            widgets: widgets
	        });
	        dispatch(setCurrentLayout(addLayout.id));
	    };
	}
	exports.addLayout = addLayout;
	function updateLayout(id, widgets) {
	    return {
	        type: actionNames_1.UPDATE_LAYOUT,
	        id: id,
	        widgets: widgets
	    };
	}
	exports.updateLayout = updateLayout;
	function deleteLayout(id) {
	    return {
	        type: actionNames_1.DELETE_LAYOUT,
	        id: id
	    };
	}
	exports.deleteLayout = deleteLayout;
	function setCurrentLayout(id) {
	    return {
	        type: actionNames_1.SET_CURRENT_LAYOUT,
	        id: id
	    };
	}
	exports.setCurrentLayout = setCurrentLayout;
	function loadEmptyLayout() {
	    return {
	        type: actionNames_1.LOAD_LAYOUT,
	        layout: {
	            id: "empty",
	            widgets: {}
	        }
	    };
	}
	exports.loadEmptyLayout = loadEmptyLayout;
	function loadLayout(id) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var layout = state.layouts[id];
	        // Bad hack to force the grid layout to update correctly
	        dispatch(loadEmptyLayout());
	        if (!layout) {
	            return;
	        }
	        setTimeout(function () {
	            dispatch(setCurrentLayout(layout.id));
	            dispatch({
	                type: actionNames_1.LOAD_LAYOUT,
	                layout: layout
	            });
	        }, 0);
	    };
	}
	exports.loadLayout = loadLayout;
	var layoutCrudReducer = reducer_1.genCrudReducer([actionNames_1.ADD_LAYOUT, actionNames_1.DELETE_LAYOUT], layout);
	function layouts(state, action) {
	    if (state === void 0) { state = initialLayouts; }
	    state = layoutCrudReducer(state, action);
	    switch (action.type) {
	        default:
	            return state;
	    }
	}
	exports.layouts = layouts;
	function layout(state, action) {
	    switch (action.type) {
	        case actionNames_1.ADD_LAYOUT:
	            return {
	                id: action.id,
	                name: action.name,
	                widgets: action.widgets
	            };
	        case actionNames_1.UPDATE_LAYOUT:
	            return Object.assign({}, state, {
	                widgets: action.widgets
	            });
	        default:
	            return state;
	    }
	}
	exports.layout = layout;
	function currentLayout(state, action) {
	    if (state === void 0) { state = {}; }
	    switch (action.type) {
	        case actionNames_1.SET_CURRENT_LAYOUT:
	            return Object.assign({}, state, {
	                id: action.id
	            });
	        case actionNames_1.DELETE_LAYOUT:
	            if (action.id == state.id) {
	                return Object.assign({}, state, {
	                    id: undefined
	                });
	            }
	            return state;
	        default:
	            return state;
	    }
	}
	exports.currentLayout = currentLayout;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(20);
	var react_1 = __webpack_require__(20);
	/**
	 * This module contains generic UI Elements reuse in the app
	 */
	exports.LinkItem = function (props) {
	    var icon;
	    if (props.icon) {
	        icon = React.createElement("i", {className: props.icon + " icon"});
	    }
	    return React.createElement("a", {className: "item" + (props.disabled ? " disabled" : ""), href: "#", onClick: function (e) {
	        e.stopPropagation();
	        e.preventDefault();
	        props.onClick(props);
	    }}, icon, " ", props.children, " ", props.text);
	};
	exports.LinkItem.propTypes = {
	    onClick: react_1.PropTypes.func.isRequired,
	    text: react_1.PropTypes.string,
	    icon: react_1.PropTypes.string,
	    disabled: react_1.PropTypes.bool,
	    children: react_1.PropTypes.any
	};
	exports.Icon = function (props) {
	    var classes = [];
	    classes.push(props.type);
	    if (props.align === 'right') {
	        classes.push('right floated');
	    }
	    if (props.size !== "normal") {
	        classes.push(props.size);
	    }
	    classes.push('icon');
	    return React.createElement("i", __assign({}, props, {className: classes.join(" ")}));
	};
	exports.Icon.propTypes = {
	    type: react_1.PropTypes.string.isRequired,
	    onClick: react_1.PropTypes.func,
	    align: react_1.PropTypes.oneOf(["left", "right"]),
	    size: react_1.PropTypes.oneOf(["mini", "tiny", "small", "normal", "large", "huge", "massive"])
	};
	exports.Divider = function (props) {
	    return React.createElement("div", {className: "ui divider"});
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var modalDialog_ui_js_1 = __webpack_require__(91);
	var WidgetPlugins = __webpack_require__(55);
	var WidgetConfig = __webpack_require__(52);
	var react_redux_1 = __webpack_require__(42);
	var settingsForm_ui_1 = __webpack_require__(92);
	var redux_form_1 = __webpack_require__(93);
	var ModalIds = __webpack_require__(54);
	var react_1 = __webpack_require__(20);
	var DIALOG_ID = ModalIds.WIDGET_CONFIG;
	var FORM_ID = "widget-settings-form";
	function unshiftIfNotExists(array, element, isEqual) {
	    if (isEqual === void 0) { isEqual = function (a, b) { return a.id == b.id; }; }
	    if (array.find(function (e) { return isEqual(e, element); }) == undefined) {
	        array.unshift(element);
	    }
	}
	exports.unshiftIfNotExists = unshiftIfNotExists;
	var WidgetConfigModal = (function (_super) {
	    __extends(WidgetConfigModal, _super);
	    function WidgetConfigModal(props) {
	        _super.call(this, props);
	    }
	    WidgetConfigModal.prototype.onSubmit = function (formData, dispatch) {
	        dispatch(WidgetConfig.createOrUpdateWidget(this.props.widgetId, this.props.widgetType, formData));
	        return true;
	    };
	    WidgetConfigModal.prototype.resetForm = function () {
	        this.props.resetForm(FORM_ID);
	    };
	    WidgetConfigModal.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var actions = [
	            {
	                className: "ui right button",
	                label: "Reset",
	                onClick: function () {
	                    _this.resetForm();
	                    return false;
	                }
	            },
	            {
	                className: "ui right red button",
	                label: "Cancel",
	                onClick: function () {
	                    _this.resetForm();
	                    return true;
	                }
	            },
	            {
	                className: "ui right labeled icon positive button",
	                iconClass: "save icon",
	                label: "Save",
	                onClick: function () {
	                    var success = _this.refs.form.submit();
	                    if (success)
	                        _this.resetForm();
	                    return success;
	                }
	            }
	        ];
	        //const selectedWidgetPlugin = WidgetPlugins.getPlugin(this.props.widgetType) || {settings: []};
	        var selectedWidgetPlugin = props.widgetPlugin;
	        // TODO: Get typeInfo from selectedWidgetPlugin.typeInfo
	        if (!selectedWidgetPlugin) {
	            // TODO: Find a better (more generic way) to deal with uninitialized data for modals
	            // TODO: The widgetConfig in the state is a bad idea. Solve this via state.modalDialog.data
	            // This is needed for the very first time the page is rendered and the selected widget type is undefined
	            return React.createElement(modalDialog_ui_js_1.default, {id: DIALOG_ID, title: "Configure Widget: " + props.widgetType, actions: actions}, React.createElement("div", null, "Unknown WidgetType: ", props.widgetType));
	        }
	        // Add additional fields
	        var settings = selectedWidgetPlugin ? selectedWidgetPlugin.typeInfo.settings.slice() : [];
	        unshiftIfNotExists(settings, {
	            id: 'name',
	            name: 'Name',
	            type: 'string',
	            defaultValue: selectedWidgetPlugin.typeInfo.name
	        });
	        var fields = settings.map(function (setting) { return setting.id; });
	        var initialValues = settings.reduce(function (initialValues, setting) {
	            if (setting.defaultValue !== undefined) {
	                initialValues[setting.id] = setting.defaultValue;
	            }
	            return initialValues;
	        }, {});
	        // Overwrite with current widget props
	        initialValues = Object.assign({}, initialValues, props.widgetSettings);
	        return React.createElement(modalDialog_ui_js_1.default, {id: DIALOG_ID, title: "Configure Widget: " + selectedWidgetPlugin.typeInfo.name, actions: actions}, React.createElement("div", {className: "ui one column grid"}, React.createElement("div", {className: "column"}, selectedWidgetPlugin.description ?
	            React.createElement("div", {className: "ui icon message"}, React.createElement("i", {className: "idea icon"}), React.createElement("div", {className: "content"}, selectedWidgetPlugin.description))
	            : null, React.createElement(settingsForm_ui_1.default, {ref: "form", form: FORM_ID, settings: settings, onSubmit: this.onSubmit.bind(this), fields: fields.slice(), initialValues: initialValues}))));
	    };
	    return WidgetConfigModal;
	}(React.Component));
	WidgetConfigModal.propTypes = {
	    widgetId: react_1.PropTypes.string,
	    resetForm: react_1.PropTypes.func.isRequired,
	    widgetType: react_1.PropTypes.string,
	    widgetSettings: react_1.PropTypes.object.isRequired,
	    widgetPlugin: WidgetPlugins.widgetPluginType
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgetId: state.widgetConfig.id,
	        widgetType: state.widgetConfig.type,
	        widgetSettings: state.widgetConfig.settings,
	        widgetPlugin: state.widgetPlugins[state.widgetConfig.type]
	    };
	}, function (dispatch) {
	    return {
	        resetForm: function (id) { return dispatch(redux_form_1.reset(id)); }
	    };
	})(WidgetConfigModal);


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var Modal = __webpack_require__(53);
	var react_1 = __webpack_require__(20);
	var ModalDialog = (function (_super) {
	    __extends(ModalDialog, _super);
	    function ModalDialog() {
	        _super.apply(this, arguments);
	    }
	    ModalDialog.prototype.componentDidMount = function () {
	        var $modal = $('.ui.modal.' + this.props.id);
	        $modal.modal({
	            detachable: false,
	            closable: false,
	            observeChanges: true,
	            onApprove: function ($element) { return false; },
	            onDeny: function ($element) { return false; },
	            onVisible: function () {
	                // This is to update the Browser Scrollbar, at least needed in WebKit
	                if (typeof document !== 'undefined') {
	                    var n_1 = document.createTextNode(' ');
	                    $modal.append(n_1);
	                    setTimeout(function () {
	                        n_1.parentNode.removeChild(n_1);
	                    }, 0);
	                }
	            }
	        });
	    };
	    ModalDialog.prototype.onClick = function (e, action) {
	        if (action.onClick(e)) {
	            // Closing is done externally (by redux)
	            this.props.closeDialog();
	        }
	    };
	    ModalDialog.prototype.render = function () {
	        var _this = this;
	        var key = 0;
	        var actions = this.props.actions.map(function (action) {
	            return React.createElement("div", {key: key++, className: action.className, onClick: function (e) { return _this.onClick(e, action); }}, action.label, action.iconClass ? React.createElement("i", {className: action.iconClass}) : null);
	        });
	        var props = this.props;
	        return React.createElement("div", {id: this.props.id, className: 'ui modal ' + this.props.id}, React.createElement("div", {className: "header"}, props.title), React.createElement("div", {className: "content"}, props.children), React.createElement("div", {className: "actions"}, actions));
	    };
	    return ModalDialog;
	}(React.Component));
	ModalDialog.propTypes = {
	    children: React.PropTypes.element.isRequired,
	    title: react_1.PropTypes.string.isRequired,
	    id: react_1.PropTypes.string.isRequired,
	    actions: react_1.PropTypes.arrayOf(react_1.PropTypes.shape({
	        className: react_1.PropTypes.string.isRequired,
	        iconClass: react_1.PropTypes.string,
	        label: react_1.PropTypes.string.isRequired,
	        onClick: react_1.PropTypes.func.isRequired
	    })).isRequired,
	    handlePositive: react_1.PropTypes.func,
	    handleDeny: react_1.PropTypes.func,
	    closeDialog: react_1.PropTypes.func
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        closeDialog: function () { return dispatch(Modal.closeModal()); }
	    };
	})(ModalDialog);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var ui = __webpack_require__(89);
	var redux_form_1 = __webpack_require__(93);
	var collection_1 = __webpack_require__(94);
	var _ = __webpack_require__(21);
	var react_1 = __webpack_require__(20);
	var SettingsForm = (function (_super) {
	    __extends(SettingsForm, _super);
	    function SettingsForm() {
	        _super.apply(this, arguments);
	    }
	    SettingsForm.prototype.componentDidMount = function () {
	        this._initSemanticUi();
	    };
	    SettingsForm.prototype.componentDidUpdate = function () {
	        this._initSemanticUi();
	    };
	    SettingsForm.prototype._initSemanticUi = function () {
	        $('.icon.help.circle')
	            .popup({
	            position: "top left",
	            offset: -10
	        });
	        $('.ui.checkbox')
	            .checkbox();
	    };
	    SettingsForm.prototype.render = function () {
	        var props = this.props;
	        var fields = props.fields;
	        return React.createElement("form", {className: "ui form"}, collection_1.chunk(this.props.settings, 1).map(function (chunk) {
	            return React.createElement("div", {key: chunk[0].id, className: "field"}, chunk.map(function (setting) {
	                return React.createElement(Field, __assign({key: setting.id}, setting, {field: fields[setting.id]}));
	            }));
	        }));
	    };
	    return SettingsForm;
	}(React.Component));
	SettingsForm.propTypes = {
	    settings: react_1.PropTypes.arrayOf(react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        type: react_1.PropTypes.string.isRequired,
	        name: react_1.PropTypes.string.isRequired
	    })).isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = redux_form_1.reduxForm({})(SettingsForm);
	function Field(props) {
	    return React.createElement("div", {className: "field"}, React.createElement("label", null, props.name, props.description && props.type !== 'boolean' ?
	        React.createElement(ui.Icon, {type: "help circle", "data-content": props.description}) : null), React.createElement(SettingsInput, __assign({}, props)));
	}
	Field.propTypes = {
	    field: react_1.PropTypes.object.isRequired,
	    name: react_1.PropTypes.string.isRequired,
	    type: react_1.PropTypes.string.isRequired,
	    description: react_1.PropTypes.string
	};
	function SettingsInput(props) {
	    switch (props.type) {
	        case "text":
	            return React.createElement("textarea", __assign({rows: "3", placeholder: props.description}, props.field));
	        case "string":
	            return React.createElement("input", __assign({placeholder: props.description}, props.field));
	        case "json":
	            return React.createElement("textarea", __assign({rows: "3", placeholder: props.description}, props.field));
	        case "number":
	            return React.createElement("input", __assign({type: "number", min: props.min, max: props.max, placeholder: props.description}, props.field));
	        case "boolean":
	            return React.createElement("input", __assign({type: "checkbox"}, props.field));
	        case "option":
	            return React.createElement("select", __assign({className: "ui fluid dropdown"}, props.field), React.createElement("option", null, "Select " + props.name + " ..."), props.options.map(function (option) {
	                var optionValue = _.isObject(option) ? option.value : option;
	                var optionName = _.isObject(option) ? option.name : option;
	                return React.createElement("option", {key: optionValue, value: optionValue}, optionName);
	            }));
	        case "datasource":
	            return React.createElement(DatasourceInputContainer, __assign({}, props));
	        default:
	            console.error("Unknown type for settings field with id '" + props.id + "': " + props.type);
	            return React.createElement("input", {placeholder: props.description, readonly: true, value: "Unknown field type: " + props.type});
	    }
	}
	SettingsInput.propTypes = {
	    field: react_1.PropTypes.object.isRequired,
	    type: react_1.PropTypes.string.isRequired,
	    id: react_1.PropTypes.string.isRequired,
	    name: react_1.PropTypes.string.isRequired,
	    description: react_1.PropTypes.string,
	    min: react_1.PropTypes.number,
	    max: react_1.PropTypes.number,
	    options: react_1.PropTypes.oneOfType([
	        react_1.PropTypes.arrayOf(// For option
	        react_1.PropTypes.shape({
	            name: react_1.PropTypes.string,
	            value: react_1.PropTypes.string.isRequired
	        }.isRequired)).isRequired,
	        react_1.PropTypes.arrayOf(react_1.PropTypes.string).isRequired
	    ])
	};
	var DatasourceInput = function (props) {
	    var datasources = props.datasources;
	    return React.createElement("select", __assign({className: "ui fluid dropdown"}, props.field), React.createElement("option", null, "Select " + props.name + " ..."), _.toPairs(datasources).map(function (_a) {
	        var id = _a[0], ds = _a[1];
	        return React.createElement("option", {key: id, value: id}, ds.settings.name + " (" + ds.type + ")");
	    }));
	};
	DatasourceInput.propTypes = {
	    datasources: react_1.PropTypes.object.isRequired,
	    field: react_1.PropTypes.object.isRequired,
	    name: react_1.PropTypes.string.isRequired
	};
	var DatasourceInputContainer = react_redux_1.connect(function (state) {
	    return {
	        datasources: state.datasources
	    };
	})(DatasourceInput);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 93 */,
/* 94 */
/***/ function(module, exports) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	function chunk(array, chunkSize, handle) {
	    var i, j, chunk;
	    var chunkNum = 0;
	    var chunks = [];
	    if (!array) {
	        return chunks;
	    }
	    for (i = 0, j = array.length; i < j; i += chunkSize) {
	        chunk = array.slice(i, i + chunkSize);
	        if (handle) {
	            handle(chunk, chunkNum);
	        }
	        chunkNum++;
	        chunks.push(chunk);
	    }
	    return chunks;
	}
	exports.chunk = chunk;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var Modal = __webpack_require__(53);
	var ModalIds = __webpack_require__(54);
	var react_1 = __webpack_require__(20);
	var DashboardTopNavItem = function (props) {
	    return React.createElement("div", {className: "ui simple dropdown item"}, "Board", React.createElement("i", {className: "dropdown icon"}), React.createElement("div", {className: "ui menu"}, React.createElement("a", {className: "item", onClick: function () { return props.showModal(ModalIds.DASHBOARD_IMPORT_EXPORT); }}, React.createElement("i", {className: "folder open outline icon"}), "Import / Export")));
	};
	DashboardTopNavItem.propTypes = {
	    showModal: react_1.PropTypes.func.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        state: state
	    };
	}, function (dispatch) {
	    return {
	        showModal: function (id) { return dispatch(Modal.showModal(id)); }
	    };
	})(DashboardTopNavItem);


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var Import = __webpack_require__(97);
	var modalDialog_ui_js_1 = __webpack_require__(91);
	var ModalIds = __webpack_require__(54);
	var react_1 = __webpack_require__(20);
	var ImportExportDialog = (function (_super) {
	    __extends(ImportExportDialog, _super);
	    function ImportExportDialog(props) {
	        _super.call(this, props);
	        this.state = { state: null };
	    }
	    ImportExportDialog.prototype.componentWillReceiveProps = function (nextProps) {
	        //this.refs.data.value = Import.serialize(nextProps.state);
	    };
	    ImportExportDialog.prototype.componentDidMount = function () {
	    };
	    ImportExportDialog.prototype._loadData = function () {
	        this.refs.data.value = Import.serialize(this.props.state);
	        this.refs.data.focus();
	        this.refs.data.select();
	    };
	    ImportExportDialog.prototype._clearData = function () {
	        this.refs.data.value = "";
	        this.refs.data.focus();
	        this.refs.data.select();
	    };
	    ImportExportDialog.prototype._exportToClipboard = function () {
	        this.refs.data.focus();
	        this.refs.data.select();
	        try {
	            var successful = document.execCommand('copy');
	            var msg = successful ? 'successful' : 'unsuccessful';
	            console.log('Copying text command was ' + msg);
	        }
	        catch (err) {
	            alert('Oops, unable to copy');
	        }
	    };
	    ImportExportDialog.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var actions = [
	            {
	                className: "ui right black button",
	                label: "Close",
	                onClick: function () { return true; }
	            },
	            {
	                className: "ui right labeled icon positive button",
	                iconClass: "folder open icon",
	                label: "Import",
	                onClick: function () {
	                    props.doImport(_this.refs.data.value);
	                    return true;
	                }
	            }
	        ];
	        return React.createElement(modalDialog_ui_js_1.default, {id: ModalIds.DASHBOARD_IMPORT_EXPORT, title: "Import / Export Dashboard", actions: actions}, React.createElement("div", {className: "ui one column grid"}, React.createElement("div", {className: "column"}, React.createElement("button", {className: "ui compact labeled icon button", onClick: this._loadData.bind(this)}, React.createElement("i", {className: "refresh icon"}), "Load Data"), React.createElement("button", {className: "ui compact labeled icon button", onClick: this._exportToClipboard.bind(this)}, React.createElement("i", {className: "upload icon"}), "Copy to Clipboard"), React.createElement("button", {className: "ui compact labeled icon button", onClick: this._clearData.bind(this)}, React.createElement("i", {className: "erase icon"}), "Clear Data")), React.createElement("div", {className: "column"}, React.createElement("form", {className: "ui form"}, React.createElement("div", {className: "field"}, React.createElement("label", null, "Data"), React.createElement("textarea", {className: "monospace", ref: "data", rows: "10", onFocus: function (e) { return e.target.select(); }, placeholder: 'Click "Load Data" to get data for export or paste your data here ...'}))))));
	    };
	    return ImportExportDialog;
	}(React.Component));
	ImportExportDialog.propTypes = {
	    state: react_1.PropTypes.object,
	    doImport: react_1.PropTypes.func.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        state: state
	    };
	}, function (dispatch) {
	    return {
	        doImport: function (state) { return dispatch(Import.doImport(state)); }
	    };
	})(ImportExportDialog);


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	var actionNames_1 = __webpack_require__(46);
	var layouts_1 = __webpack_require__(88);
	var Plugins = __webpack_require__(63);
	/**
	 * To extend the import/export by another property you just need to add the property to the exported data
	 * See: serialize()
	 *
	 * If there are any action needed after a property got imported, call them after the import.
	 * See: afterImport()
	 */
	function serialize(state) {
	    return JSON.stringify({
	        widgets: state.widgets,
	        datasources: state.datasources,
	        datasourcePlugins: state.datasourcePlugins,
	        widgetPlugins: state.widgetPlugins
	    });
	}
	exports.serialize = serialize;
	function afterImport(dispatch, getState) {
	    dispatch(Plugins.initializeExternalPlugins());
	}
	function importReducer(state, action) {
	    switch (action.type) {
	        case Action.DASHBOARD_IMPORT:
	            var newState = Object.assign({}, state, action.state);
	            console.log("new State:", state, action.state, newState);
	            return newState;
	        default:
	            return state;
	    }
	}
	exports.importReducer = importReducer;
	function deserialize(data) {
	    if (typeof data === "string") {
	        return JSON.parse(data);
	    }
	    else {
	        throw new Error("Dashboard data for import must be of type string but is " + typeof data);
	    }
	}
	exports.deserialize = deserialize;
	function doImport(data) {
	    var state = deserialize(data);
	    return function (dispatch, getState) {
	        // Bad hack to force the grid layout to update correctly
	        dispatch(layouts_1.loadEmptyLayout());
	        setTimeout(function () {
	            dispatch({
	                type: actionNames_1.DASHBOARD_IMPORT,
	                state: state
	            });
	            afterImport(dispatch, getState);
	        }, 0);
	    };
	}
	exports.doImport = doImport;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(20);
	var modalDialog_ui_js_1 = __webpack_require__(91);
	var Datasource = __webpack_require__(60);
	var react_redux_1 = __webpack_require__(42);
	var _ = __webpack_require__(21);
	var ui = __webpack_require__(89);
	var settingsForm_ui_1 = __webpack_require__(92);
	var redux_form_1 = __webpack_require__(93);
	var ModalIds = __webpack_require__(54);
	var react_1 = __webpack_require__(20);
	var DIALOG_ID = ModalIds.DATASOURCE_CONFIG;
	var FORM_ID = "datasource-settings-form";
	function unshiftIfNotExists(array, element, isEqual) {
	    if (isEqual === void 0) { isEqual = function (a, b) { return a.id == b.id; }; }
	    if (array.find(function (e) { return isEqual(e, element); }) == undefined) {
	        array.unshift(element);
	    }
	}
	exports.unshiftIfNotExists = unshiftIfNotExists;
	var DatasourceConfigModal = (function (_super) {
	    __extends(DatasourceConfigModal, _super);
	    function DatasourceConfigModal(props) {
	        _super.call(this, props);
	        this.state = {
	            selectedType: ''
	        };
	    }
	    DatasourceConfigModal.prototype.componentWillReceiveProps = function (nextProps) {
	        if (nextProps.dialogData.datasource) {
	            var selectedType = nextProps.dialogData.datasource.type;
	            this.state = {
	                selectedType: selectedType
	            };
	        }
	    };
	    DatasourceConfigModal.prototype.onSubmit = function (formData, dispatch) {
	        if (this._isEditing()) {
	            var id = this._getEditingDatasource().id;
	            this.props.updateDatasource(id, this.state.selectedType, formData);
	        }
	        else {
	            this.props.createDatasource(this.state.selectedType, formData);
	        }
	        return true;
	    };
	    DatasourceConfigModal.prototype.resetForm = function () {
	        this.props.resetForm(FORM_ID);
	    };
	    DatasourceConfigModal.prototype._isEditing = function () {
	        return !!this.props.dialogData.datasource;
	    };
	    DatasourceConfigModal.prototype._getEditingDatasource = function () {
	        return this.props.dialogData.datasource;
	    };
	    DatasourceConfigModal.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var actions = [
	            {
	                className: "ui right button",
	                label: "Reset",
	                onClick: function () {
	                    _this.resetForm();
	                    return false;
	                }
	            },
	            {
	                className: "ui right red button",
	                label: "Cancel",
	                onClick: function () {
	                    _this.resetForm();
	                    return true;
	                }
	            },
	            {
	                className: "ui right labeled icon positive button",
	                iconClass: "save icon",
	                label: this._isEditing() ? "Save" : "Create",
	                onClick: function () {
	                    var success = _this.refs.form.submit();
	                    if (success)
	                        _this.resetForm();
	                    return success;
	                }
	            }
	        ];
	        var selectedDsPluginState;
	        if (this.state.selectedType) {
	            selectedDsPluginState = props.datasourcePlugins[this.state.selectedType];
	        }
	        var settings = [];
	        if (selectedDsPluginState && selectedDsPluginState.typeInfo.settings) {
	            settings = selectedDsPluginState.typeInfo.settings.slice();
	        }
	        else {
	            settings = [];
	        }
	        unshiftIfNotExists(settings, {
	            id: 'maxValues',
	            name: 'MaxValues',
	            type: 'number',
	            description: "Maximum number of values stored",
	            defaultValue: 100
	        });
	        unshiftIfNotExists(settings, {
	            id: 'name',
	            name: 'Name',
	            type: 'string',
	            defaultValue: selectedDsPluginState ? selectedDsPluginState.typeInfo.name : ""
	        });
	        var fields = settings.map(function (setting) { return setting.id; });
	        var initialValues = {};
	        if (this._isEditing()) {
	            initialValues = Object.assign({}, this._getEditingDatasource().settings);
	        }
	        else {
	            initialValues = settings.reduce(function (initialValues, setting) {
	                if (setting.defaultValue !== undefined) {
	                    initialValues[setting.id] = setting.defaultValue;
	                }
	                return initialValues;
	            }, {});
	        }
	        var title = "Create Datasource";
	        if (this._isEditing()) {
	            title = "Edit Datasource";
	        }
	        return React.createElement(modalDialog_ui_js_1.default, {id: DIALOG_ID, title: title, actions: actions}, React.createElement("div", {className: "ui one column grid"}, React.createElement("div", {className: "column"}, selectedDsPluginState && selectedDsPluginState.typeInfo.description ?
	            React.createElement("div", {className: "ui icon message"}, React.createElement("i", {className: "idea icon"}), React.createElement("div", {className: "content"}, selectedDsPluginState.typeInfo.description))
	            : null, React.createElement("div", {className: "field"}, React.createElement("label", null, "Type"), React.createElement("select", __assign({className: "ui fluid dropdown", name: "type", value: this.state.selectedType, onChange: function (e) { _this.setState({ selectedType: e.target.value }); }}, fields.type), React.createElement("option", {key: "none", value: ""}, "Select Type..."), _.valuesIn(props.datasourcePlugins).map(function (dsPlugin) {
	            return React.createElement("option", {key: dsPlugin.id, value: dsPlugin.id}, dsPlugin.typeInfo.name);
	        }))), React.createElement(ui.Divider, null), React.createElement(settingsForm_ui_1.default, {ref: "form", form: FORM_ID, onSubmit: this.onSubmit.bind(this), fields: ["type", "name", "interval"].concat(fields), settings: settings, initialValues: initialValues}))));
	    };
	    return DatasourceConfigModal;
	}(React.Component));
	DatasourceConfigModal.propTypes = {
	    createDatasource: react_1.PropTypes.func.isRequired,
	    updateDatasource: react_1.PropTypes.func.isRequired,
	    resetForm: react_1.PropTypes.func.isRequired,
	    dialogData: react_1.PropTypes.object.isRequired,
	    datasourcePlugins: react_1.PropTypes.object.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        dialogData: state.modalDialog.data || {},
	        datasourcePlugins: state.datasourcePlugins
	    };
	}, function (dispatch) {
	    return {
	        resetForm: function (id) { return dispatch(redux_form_1.reset(id)); },
	        createDatasource: function (type, dsSettings) {
	            dispatch(Datasource.createDatasource(type, dsSettings));
	        },
	        updateDatasource: function (id, type, dsSettings) {
	            dispatch(Datasource.updateDatasource(id, type, dsSettings));
	        }
	    };
	})(DatasourceConfigModal);


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(20);
	var Datasource = __webpack_require__(60);
	var react_redux_1 = __webpack_require__(42);
	var _ = __webpack_require__(21);
	var ui = __webpack_require__(89);
	var react_1 = __webpack_require__(20);
	var DatasourceTopNavItem = function (props) {
	    return React.createElement("div", {className: "ui simple dropdown item"}, "Datasources", React.createElement("i", {className: "dropdown icon"}), React.createElement("div", {className: "ui menu"}, React.createElement(ui.LinkItem, {icon: "plus", onClick: function () { props.createDatasource(); }}, "Add Datasource"), React.createElement(ui.Divider, null), _.valuesIn(props.datasources).map(function (ds) {
	        return React.createElement(ui.LinkItem, {key: ds.id, onClick: function () { props.editDatasource(ds.id); }}, React.createElement(ui.Icon, {type: "delete", size: "huge", align: "right", onClick: function (e) {
	            e.stopPropagation();
	            e.preventDefault();
	            props.deleteDatasource(ds.id);
	        }}), ds.settings.name);
	    })));
	};
	DatasourceTopNavItem.propTypes = {
	    createDatasource: react_1.PropTypes.func.isRequired,
	    editDatasource: react_1.PropTypes.func.isRequired,
	    deleteDatasource: react_1.PropTypes.func.isRequired,
	    datasources: react_1.PropTypes.objectOf(react_1.PropTypes.shape({
	        type: react_1.PropTypes.string.isRequired,
	        id: react_1.PropTypes.string.isRequired,
	        settings: react_1.PropTypes.object.isRequired
	    })).isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        datasources: state.datasources
	    };
	}, function (dispatch) {
	    return {
	        createDatasource: function () { return dispatch(Datasource.startCreateDatasource()); },
	        editDatasource: function (id) { return dispatch(Datasource.startEditDatasource(id)); },
	        deleteDatasource: function (id) { return dispatch(Datasource.deleteDatasource(id)); }
	    };
	})(DatasourceTopNavItem);


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var WidgetConfig = __webpack_require__(52);
	var _ = __webpack_require__(21);
	var ui = __webpack_require__(89);
	var WidgetPlugins = __webpack_require__(55);
	var react_1 = __webpack_require__(20);
	var WidgetsNavItem = function (props) {
	    return React.createElement("div", {className: "ui simple dropdown item"}, "Add Widget", React.createElement("i", {className: "dropdown icon"}), React.createElement("div", {className: "ui menu"}, React.createElement(ui.Divider, null), _.valuesIn(props.widgetPlugins).map(function (widgetPlugin) {
	        return React.createElement(AddWidget, {key: widgetPlugin.id, text: widgetPlugin.typeInfo.name, type: widgetPlugin.typeInfo.type});
	    })));
	};
	WidgetsNavItem.propTypes = {
	    widgetPlugins: react_1.PropTypes.objectOf(WidgetPlugins.widgetPluginType)
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgetPlugins: state.widgetPlugins
	    };
	})(WidgetsNavItem);
	var AddWidget = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        onClick: function (props) {
	            dispatch(WidgetConfig.createWidget(props.type));
	        }
	    };
	})(ui.LinkItem);


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(20);
	var react_redux_1 = __webpack_require__(42);
	var ModalIds = __webpack_require__(54);
	var Modal = __webpack_require__(53);
	var react_1 = __webpack_require__(20);
	var PluginsTopNavItem = function (props) {
	    return React.createElement("a", {className: "item", onClick: function () { return props.showPluginsDialog(); }}, "Plugins");
	};
	PluginsTopNavItem.propTypes = {
	    showPluginsDialog: react_1.PropTypes.func.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        showPluginsDialog: function () {
	            dispatch(Modal.showModal(ModalIds.PLUGINS));
	        }
	    };
	})(PluginsTopNavItem);


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var React = __webpack_require__(20);
	var modalDialog_ui_js_1 = __webpack_require__(91);
	var react_redux_1 = __webpack_require__(42);
	var _ = __webpack_require__(21);
	var ModalIds = __webpack_require__(54);
	var Modal = __webpack_require__(53);
	var Plugins = __webpack_require__(63);
	var WidgetsPlugins = __webpack_require__(55);
	var DatasourcePlugins = __webpack_require__(103);
	var react_1 = __webpack_require__(20);
	var PluginsModal = (function (_super) {
	    __extends(PluginsModal, _super);
	    function PluginsModal() {
	        _super.apply(this, arguments);
	    }
	    PluginsModal.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var actions = [
	            {
	                className: "ui right labeled icon positive button",
	                iconClass: "save icon",
	                label: "Close",
	                onClick: function () {
	                    props.closeDialog();
	                }
	            }
	        ];
	        var datasourcePluginStates = _.valuesIn(props.datasourcePlugins);
	        var widgetPluginStates = _.valuesIn(props.widgetPlugins);
	        return React.createElement(modalDialog_ui_js_1.default, {id: ModalIds.PLUGINS, title: "Plugins", actions: actions}, React.createElement("div", {className: "ui one column grid"}, React.createElement("div", {className: "column"}, React.createElement("form", {className: "ui form"}, React.createElement("h4", {className: "ui dividing header"}, "Load Plugin"), React.createElement("div", {className: "field"}, React.createElement("label", null, "From URL"), React.createElement("input", {ref: "pluginUrl", type: "text", name: "plugin-url", placeholder: "http://my-page.com/myPlugin.js", defaultValue: "plugins/TestWidgetPlugin.js"})), React.createElement("div", {className: "ui button", onClick: function () { return props.loadPlugin(_this.refs.pluginUrl.value); }, tabIndex: "0"}, "Load Plugin")), React.createElement("h4", {className: "ui dividing header"}, "Datasource Plugins"), React.createElement(DatasourcePluginList, __assign({datasourceStates: datasourcePluginStates}, props)), React.createElement("h4", {className: "ui dividing header"}, "Widget Plugins"), React.createElement(WidgetPluginList, __assign({widgetPluginStates: widgetPluginStates}, props)))));
	    };
	    return PluginsModal;
	}(React.Component));
	PluginsModal.propTypes = {
	    datasourcePlugins: react_1.PropTypes.object.isRequired,
	    widgetPlugins: react_1.PropTypes.object.isRequired,
	    closeDialog: react_1.PropTypes.func.isRequired,
	    loadPlugin: react_1.PropTypes.func.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgetPlugins: state.widgetPlugins,
	        datasourcePlugins: state.datasourcePlugins
	    };
	}, function (dispatch) {
	    return {
	        closeDialog: function () { return dispatch(Modal.closeModal()); },
	        // TODO: Render loading indicator while Plugin loads
	        // maybe build some generic solution for Ajax calls where the state can hold all information to render loading indicators / retry buttons etc...
	        loadPlugin: function (url) { return dispatch(Plugins.startLoadingPluginFromUrl(url)); }
	    };
	})(PluginsModal);
	var DatasourcePluginList = function (props) {
	    return React.createElement("div", {className: "ui five cards"}, props.datasourceStates.map(function (dsState) {
	        return React.createElement(DatasourcePluginCard, __assign({key: dsState.id, pluginState: dsState}, props));
	    }));
	};
	DatasourcePluginList.propTypes = {
	    datasourceStates: react_1.PropTypes.arrayOf(react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired
	    })).isRequired
	};
	var WidgetPluginList = function (props) {
	    return React.createElement("div", {className: "ui five cards"}, props.widgetPluginStates.map(function (dsState) {
	        return React.createElement(WidgetPluginCard, __assign({key: dsState.id, pluginState: dsState}, props));
	    }));
	};
	WidgetPluginList.propTypes = {
	    widgetPluginStates: react_1.PropTypes.arrayOf(WidgetsPlugins.widgetPluginType)
	};
	var PluginCard = (function (_super) {
	    __extends(PluginCard, _super);
	    function PluginCard() {
	        _super.apply(this, arguments);
	    }
	    PluginCard.prototype._copyUrl = function () {
	        this.refs.url.focus();
	        this.refs.url.select();
	        document.execCommand('copy');
	    };
	    PluginCard.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var pluginState = props.pluginState;
	        return React.createElement("div", {className: "card"}, React.createElement("div", {className: "content"}, React.createElement("div", {className: "header"}, pluginState.typeInfo.name), React.createElement("div", {className: "description"}, React.createElement("p", null, "Type: ", pluginState.typeInfo.type), React.createElement("p", null, pluginState.typeInfo.description ? pluginState.typeInfo.description : "No Description."))), React.createElement("div", {className: "extra content"}, React.createElement("i", {className: "copy outline icon", onClick: function () {
	            _this._copyUrl();
	        }, style: { display: "inline" }}), React.createElement("div", {className: "ui large transparent input"}, React.createElement("input", {type: "text", ref: "url", readOnly: true, style: { width: "100%", paddingLeft: 0, paddingRight: 0 }, placeholder: "Plugin Url ...", defaultValue: pluginState.url ? pluginState.url : "Packaged"}))), React.createElement("div", {className: "ui bottom attached button", onClick: function () { return props.removePlugin(pluginState.id); }}, React.createElement("i", {className: "trash icon"}), "Remove"));
	    };
	    return PluginCard;
	}(React.Component));
	PluginCard.propTypes = {
	    pluginState: react_1.PropTypes.object.isRequired,
	    removePlugin: react_1.PropTypes.func.isRequired
	};
	var WidgetPluginCard = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        removePlugin: function (type) { return dispatch(WidgetsPlugins.unloadPlugin(type)); }
	    };
	})(PluginCard);
	var DatasourcePluginCard = react_redux_1.connect(function (state) {
	    return {};
	}, function (dispatch) {
	    return {
	        removePlugin: function (type) { return dispatch(DatasourcePlugins.unloadPlugin(type)); }
	    };
	})(PluginCard);


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(46);
	var reducer_js_1 = __webpack_require__(50);
	var dashboard_1 = __webpack_require__(56);
	// TODO: does it work to have the URL as ID?
	var initialState = {
	    "random": {
	        id: "random",
	        url: "./plugins/datasources/randomDatasource.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        }
	    },
	    "time": {
	        id: "time",
	        url: "./plugins/datasources/timeDatasource.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        }
	    },
	    "static-data": {
	        id: "static-data",
	        url: "./plugins/datasources/staticData.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        }
	    },
	    "digimondo-gps-datasource": {
	        id: "digimondo-gps-datasource",
	        url: "./plugins/datasources/DigimondoGpsDatasource.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        }
	    }
	};
	function unloadPlugin(type) {
	    return function (dispatch) {
	        var dsFactory = dashboard_1.default.getInstance().datasourcePluginRegistry.getPlugin(type);
	        dsFactory.dispose();
	        dispatch(deletePlugin(type));
	    };
	}
	exports.unloadPlugin = unloadPlugin;
	function deletePlugin(type) {
	    return {
	        type: Action.DELETE_DATASOURCE_PLUGIN,
	        id: type
	    };
	}
	var pluginsCrudReducer = reducer_js_1.genCrudReducer([Action.DATASOURCE_PLUGIN_FINISHED_LOADING, Action.DELETE_DATASOURCE_PLUGIN], datasourcePlugin);
	function datasourcePlugins(state, action) {
	    if (state === void 0) { state = initialState; }
	    state = pluginsCrudReducer(state, action);
	    switch (action.type) {
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            if (state[action.id]) {
	                return _.assign({}, state, (_a = {},
	                    _a[action.id] = datasourcePlugin(state[action.id], action),
	                    _a
	                ));
	            }
	            else {
	                return state;
	            }
	        default:
	            return state;
	    }
	    var _a;
	}
	exports.datasourcePlugins = datasourcePlugins;
	function datasourcePlugin(state, action) {
	    switch (action.type) {
	        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
	            if (!action.typeInfo.type) {
	                // TODO: Catch this earlier
	                throw new Error("A Plugin needs a type name. Please define TYPE_INFO.type");
	            }
	            return {
	                id: action.typeInfo.type,
	                url: action.url,
	                typeInfo: action.typeInfo
	            };
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            return _.assign({}, state, {
	                isLoading: true
	            });
	        default:
	            return state;
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(21)))

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(21);
	var $ = __webpack_require__(13);
	var lastAction = { type: "NONE" };
	var allowSave = true;
	var saveTimeout;
	function clearData() {
	    if (window.confirm("Wipe app data and reload page?")) {
	        if (saveTimeout) {
	            clearTimeout(saveTimeout);
	        }
	        window.localStorage.setItem("appState", undefined);
	        location.reload();
	    }
	}
	exports.clearData = clearData;
	// TODO: type middleware
	function persistenceMiddleware(_a) {
	    var getState = _a.getState;
	    return function (next) { return function (action) {
	        var nextState = next(action);
	        if (!allowSave) {
	            lastAction = action;
	            return nextState;
	        }
	        if (!action.doNotPersist) {
	            // we wait some before we save
	            // this leads to less saving (max every 100ms) without loosing actions
	            // if we would just block saving for some time after saving an action we would loose the last actions
	            allowSave = false;
	            saveTimeout = setTimeout(function () {
	                save(getState());
	                console.log('Saved state @' + lastAction.type);
	                allowSave = true;
	            }, 100);
	        }
	        lastAction = action;
	        return nextState;
	    }; };
	}
	exports.persistenceMiddleware = persistenceMiddleware;
	function save(state) {
	    var target = state.config.persistenceTarget;
	    var savableState = _.assign({}, state);
	    delete savableState.form;
	    delete savableState.modalDialog;
	    if (target === "local-storage") {
	        saveToLocalStorage(savableState);
	    }
	    else if (target) {
	        saveToServer(target, savableState);
	    }
	}
	function saveToServer(target, state) {
	    $.post({
	        url: target,
	        data: JSON.stringify(state),
	        dataType: 'json',
	        contentType: "application/json; charset=utf-8"
	    });
	}
	function saveToLocalStorage(state) {
	    if (typeof window === 'undefined') {
	        console.warn("Can not save to local storage in current environment.");
	        return;
	    }
	    window.localStorage.setItem("appState", JSON.stringify(state));
	}
	function loadFromLocalStorage() {
	    if (typeof window === 'undefined') {
	        console.warn("Can not load from local storage in current environment.");
	        return undefined;
	    }
	    var stateString = window.localStorage.getItem("appState");
	    var state = undefined;
	    try {
	        if (stateString !== undefined && stateString !== "undefined") {
	            state = JSON.parse(stateString);
	        }
	    }
	    catch (e) {
	        console.error("Failed to load state from local storage. Data:", stateString, e.message);
	    }
	    console.log("Loaded state:", state);
	    return state !== null ? state : undefined;
	}
	exports.loadFromLocalStorage = loadFromLocalStorage;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Redux = __webpack_require__(43);
	var redux_thunk_1 = __webpack_require__(106);
	var createLogger = __webpack_require__(107);
	var Widgets = __webpack_require__(48);
	var WidgetConfig = __webpack_require__(52);
	var Layouts = __webpack_require__(88);
	var Datasource = __webpack_require__(60);
	var Global = __webpack_require__(45);
	var Import = __webpack_require__(97);
	var Modal = __webpack_require__(53);
	var Persist = __webpack_require__(104);
	var Plugins = __webpack_require__(63);
	var redux_form_1 = __webpack_require__(93);
	var Action = __webpack_require__(46);
	var WidgetPlugins = __webpack_require__(55);
	var DatasourcePlugins = __webpack_require__(103);
	var Config = __webpack_require__(108);
	// TODO: name all reducers ***Reducer
	var appReducer = Redux.combineReducers({
	    config: Config.config,
	    widgets: Widgets.widgets,
	    widgetConfig: WidgetConfig.widgetConfigDialog,
	    layouts: Layouts.layouts,
	    currentLayout: Layouts.currentLayout,
	    datasources: Datasource.datasources,
	    form: redux_form_1.reducer,
	    modalDialog: Modal.modalDialog,
	    pluginLoader: Plugins.pluginLoaderReducer,
	    widgetPlugins: WidgetPlugins.widgetPlugins,
	    datasourcePlugins: DatasourcePlugins.datasourcePlugins,
	    global: Global.global
	});
	var reducer = function (state, action) {
	    if (action.type === Action.CLEAR_STATE) {
	        state = undefined;
	    }
	    state = Import.importReducer(state, action);
	    return appReducer(state, action);
	};
	var logger = createLogger({
	    duration: false,
	    timestamp: true,
	    logErrors: true,
	    predicate: function (getState, action) {
	        if (action.type.startsWith("redux-form")) {
	            return false;
	        }
	        return !action.doNotLog;
	    }
	});
	function emptyState() {
	    return {
	        config: null,
	        widgets: {},
	        datasources: {},
	        datasourcePlugins: {},
	        widgetPlugins: {},
	        pluginLoader: {
	            loadingUrls: []
	        }
	    };
	}
	exports.emptyState = emptyState;
	/**
	 * Create a store as empty as possible
	 */
	function createEmpty(options) {
	    if (options === void 0) { options = { log: true }; }
	    return create(emptyState(), options);
	}
	exports.createEmpty = createEmpty;
	/**
	 * Create a store with default values
	 */
	function createDefault(options) {
	    if (options === void 0) { options = { log: true }; }
	    return create(undefined, options);
	}
	exports.createDefault = createDefault;
	function testStoreOptions() {
	    return { log: false, persist: false };
	}
	exports.testStoreOptions = testStoreOptions;
	function defaultStoreOptions() {
	    return { log: true, persist: true };
	}
	exports.defaultStoreOptions = defaultStoreOptions;
	/**
	 * Create a store and execute all side-effects to have a consistent app
	 */
	function create(initialState, options) {
	    if (!initialState) {
	        initialState = Persist.loadFromLocalStorage();
	    }
	    var middleware = [];
	    middleware.push(redux_thunk_1.default);
	    if (options.persist) {
	        middleware.push(Persist.persistenceMiddleware);
	    }
	    if (options.log) {
	        middleware.push(logger); // must be last
	    }
	    return Redux.createStore(reducer, initialState, Redux.applyMiddleware.apply(Redux, middleware));
	}
	exports.create = create;
	function clearState() {
	    return {
	        type: Action.CLEAR_STATE
	    };
	}
	exports.clearState = clearState;


/***/ },
/* 106 */,
/* 107 */,
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	var _ = __webpack_require__(21);
	var configJson = __webpack_require__(109);
	var defaultConfig = {
	    version: "",
	    revision: "",
	    revisionShort: "",
	    branch: "",
	    persistenceTarget: "local-storage",
	    devMode: true
	};
	function config(state, action) {
	    if (state === void 0) { state = configJson; }
	    switch (action.type) {
	        default:
	            // Content of configJson overrides everything else!
	            return _.assign({}, defaultConfig, state, configJson);
	    }
	}
	exports.config = config;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = config;


/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = {
		"version": "0.1.8",
		"revision": "17ff079f336f3bc074c39b00d37166be3758b243",
		"revisionShort": "17ff079",
		"branch": "Detatched: 17ff079f336f3bc074c39b00d37166be3758b243"
	};

/***/ }
]);
//# sourceMappingURL=app.bundle.js.map