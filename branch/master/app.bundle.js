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
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(31);
	var es6promise = __webpack_require__(33);
	var Renderer = __webpack_require__(36);
	var Store = __webpack_require__(106);
	var Persist = __webpack_require__(104);
	var dashboard_1 = __webpack_require__(51);
	var $ = __webpack_require__(13);
	var loadPredefinedState = $.get('./dashboard.json');
	es6promise.polyfill();
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(16);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(13);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["React"] = __webpack_require__(18);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["_"] = __webpack_require__(19);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var FreeboardDatasource = __webpack_require__(23);
	var PluginCache = __webpack_require__(24);
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(19);
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
/* 24 */
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
	    pluginCache.TYPE_INFO.kind = "datasource";
	}
	exports.registerDatasourcePlugin = registerDatasourcePlugin;
	function registerWidgetPlugin(typeInfo, widget) {
	    console.assert(!hasPlugin(), "Plugin must be finished loading before another can be registered", pluginCache);
	    pluginCache = ({
	        TYPE_INFO: typeInfo,
	        Widget: widget
	    });
	    pluginCache.TYPE_INFO.kind = "widget";
	}
	exports.registerWidgetPlugin = registerWidgetPlugin;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var PluginCache = __webpack_require__(24);
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
/* 26 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 29 */,
/* 30 */,
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// the whatwg-fetch polyfill installs the fetch() function
	// on the global object (window or self)
	//
	// Return that as the export for use in Webpack, Browserify etc.
	__webpack_require__(32);
	module.exports = self.fetch.bind(self);


/***/ },
/* 32 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return
	      }
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(React) {/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var ReactDOM = __webpack_require__(37);
	var react_redux_1 = __webpack_require__(38);
	var pageLayout_1 = __webpack_require__(40);
	function render(element, store) {
	    ReactDOM.render(React.createElement(react_redux_1.Provider, {store: store}, 
	        React.createElement(pageLayout_1.default, null)
	    ), element);
	}
	exports.render = render;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ },
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
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
	var React = __webpack_require__(18);
	var react_1 = __webpack_require__(18);
	var ReactDOM = __webpack_require__(37);
	var react_redux_1 = __webpack_require__(38);
	var Global = __webpack_require__(41);
	var widgetGrid_ui_js_1 = __webpack_require__(43);
	var layouts_ui_js_1 = __webpack_require__(86);
	var widgetConfigDialog_ui_js_1 = __webpack_require__(89);
	var dashboardMenuEntry_ui_js_1 = __webpack_require__(94);
	var importExportDialog_ui_js_1 = __webpack_require__(95);
	var datasourceConfigDialog_ui_js_1 = __webpack_require__(97);
	var datasourceNavItem_ui_js_1 = __webpack_require__(98);
	var widgetsNavItem_ui_js_1 = __webpack_require__(99);
	var pluginNavItem_ui_1 = __webpack_require__(100);
	var pluginsDialog_ui_1 = __webpack_require__(101);
	var Persistence = __webpack_require__(104);
	var datasourceFrames_ui_1 = __webpack_require__(105);
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
	        var devMode = props.devMode;
	        var showMenu = props.devMode && (!props.isReadOnly || this.state.hover);
	        return React.createElement("div", {className: "slds-grid slds-wrap", onKeyUp: function (event) { return _this.onReadOnlyModeKeyPress(event); }}, 
	            devMode ? React.createElement("div", null, 
	                React.createElement(widgetConfigDialog_ui_js_1.default, null), 
	                React.createElement(importExportDialog_ui_js_1.default, null), 
	                React.createElement(datasourceConfigDialog_ui_js_1.default, null), 
	                React.createElement(pluginsDialog_ui_1.default, null))
	                : null, 
	            devMode ? React.createElement("div", {className: showMenu ? "menu-trigger" : "menu-trigger", onMouseOver: function () { _this.setState({ hover: true }); }, onMouseEnter: function () { _this.setState({ hover: true }); }})
	                : null, 
	            devMode ?
	                React.createElement("div", {className: "slds-size--1-of-1 slds-context-bar" + (showMenu ? " topnav--visible" : " topnav--hidden"), onMouseOver: function () { _this.setState({ hover: true }); }, onMouseLeave: function () { _this.setState({ hover: false }); }}, 
	                    React.createElement("div", {className: "slds-context-bar__primary slds-context-bar__item--divider-right"}, 
	                        React.createElement("div", {className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--click slds-no-hover"}, 
	                            React.createElement("span", {className: "slds-context-bar__label-action slds-context-bar__app-name"}, 
	                                React.createElement("span", {className: "slds-truncate"}, 
	                                    React.createElement("a", {href: this.props.config.title.url}, this.props.config.title.text)
	                                )
	                            )
	                        )
	                    ), 
	                    React.createElement("div", {className: "slds-context-bar__secondary", role: "navigation"}, 
	                        React.createElement("ul", {className: "slds-grid"}, 
	                            React.createElement(dashboardMenuEntry_ui_js_1.default, null), 
	                            React.createElement(pluginNavItem_ui_1.default, null), 
	                            React.createElement(widgetsNavItem_ui_js_1.default, null), 
	                            React.createElement(datasourceNavItem_ui_js_1.default, null), 
	                            React.createElement(layouts_ui_js_1.default, null), 
	                            React.createElement("div", {className: "slds-context-bar__vertical-divider"}), 
	                            React.createElement("li", {className: "slds-context-bar__item"}, 
	                                React.createElement("a", {href: "javascript:void(0);", onClick: function () { return Persistence.clearData(); }, className: "slds-context-bar__label-action", title: "Reset Everything!"}, 
	                                    React.createElement("span", {className: "slds-truncate"}, "Reset Everything!")
	                                )
	                            ), 
	                            React.createElement("li", {className: "slds-context-bar__item"}, 
	                                React.createElement("div", {className: "slds-context-bar__icon-action", onClick: function () { return props.setReadOnly(!props.isReadOnly); }}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--small slds-icon-text-default"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#" + (props.isReadOnly ? "lock" : "unlock")})
	                                    ), 
	                                    React.createElement("span", {className: "slds-assistive-text"}, "Lock / Unlock"))
	                            ))
	                    ), 
	                    React.createElement("div", {className: "slds-context-bar__tertiary"}, 
	                        React.createElement("ul", {className: "slds-grid slds-grid--vertical-align-center"}, 
	                            props.config.auth && props.config.auth.username ?
	                                React.createElement("div", {className: "slds-m-right--small"}, props.config.auth.username)
	                                : null, 
	                            props.config.auth && props.config.auth.logoutUrl ?
	                                React.createElement("a", {className: "slds-button slds-button--neutral", href: props.config.auth.logoutUrl}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon slds-button__icon--left"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#logout"})
	                                    ), 
	                                    "Logout")
	                                : null, 
	                            React.createElement("div", {className: "slds-context-bar__vertical-divider"}), 
	                            React.createElement("span", {className: "slds-truncate slds-m-left--small"}, 
	                                "v", 
	                                this.props.config.version))
	                    ))
	                : null, 
	            React.createElement("div", {className: "slds-size--1-of-1"}, 
	                React.createElement(widgetGrid_ui_js_1.default, null)
	            ), 
	            React.createElement(datasourceFrames_ui_1.default, null));
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
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
	exports.initialState = {
	    isReadOnly: false
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
/* 42 */
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
	// Config
	exports.SET_CONFIG_VALUE = "SET_CONFIG_VALUE";
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
	exports.DATASOURCE_FINISHED_LOADING = "DATASOURCE_FINISHED_LOADING";
	// Datasource data
	exports.FETCHED_DATASOURCE_DATA = "FETCHED_DATASOURCE_DATA";
	exports.CLEAR_DATASOURCE_DATA = "CLEAR_DATASOURCE_DATA";
	// Plugins
	exports.WIDGET_PLUGIN_FINISHED_LOADING = "WIDGET_PLUGIN_FINISHED_LOADING";
	exports.PLUGIN_FAILED_LOADING = "PLUGIN_FAILED_LOADING";
	exports.DATASOURCE_PLUGIN_FINISHED_LOADING = "DATASOURCE_PLUGIN_FINISHED_LOADING";
	exports.DELETE_WIDGET_PLUGIN = "DELETE_WIDGET_PLUGIN";
	exports.DELETE_DATASOURCE_PLUGIN = "DELETE_DATASOURCE_PLUGIN";
	exports.USE_PUBLISHED_DATASOURCE_PLUGIN = "USE_PUBLISHED_DATASOURCE_PLUGIN";
	exports.USE_PUBLISHED_WIDGET_PLUGIN = "USE_PUBLISHED_WIDGET_PLUGIN";
	exports.STARTED_LOADING_PLUGIN_FROM_URL = "STARTED_LOADING_PLUGIN_FROM_URL";
	// Modal
	exports.SHOW_MODAL = "SHOW_MODAL";
	exports.HIDE_MODAL = "HIDE_MODAL";
	exports.MODAL_ADD_USER_MESSAGE = "MODAL_ADD_USER_MESSAGE";
	exports.MODAL_DELETED_USER_MESSAGE = "MODAL_DELETED_USER_MESSAGE";


/***/ },
/* 43 */
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
	var React = __webpack_require__(18);
	var react_1 = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var Widgets = __webpack_require__(44);
	var widgetFrame_ui_1 = __webpack_require__(47);
	var widthProvider_ui_1 = __webpack_require__(72);
	var react_grid_layout_1 = __webpack_require__(73);
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
	        return (React.createElement(ResponsiveGrid, {className: "column", rowHeight: Widgets.ROW_HEIGHT, breakpoints: breakpoints, cols: cols, draggableCancel: ".no-drag", draggableHandle: ".drag", onLayoutChange: this.onLayoutChange.bind(this), isDraggable: !props.isReadOnly, isResizable: !props.isReadOnly}, widgets));
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Uuid = __webpack_require__(45);
	var _ = __webpack_require__(19);
	var reducer_js_1 = __webpack_require__(46);
	var Action = __webpack_require__(42);
	exports.HEADER_HEIGHT = 35;
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
	            "name": "Random Values",
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
	    return (heightUnits * (exports.ROW_HEIGHT + 10)) - exports.HEADER_HEIGHT - 10;
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
	            var heightInPx = calcAvaliableHeight(layout.h);
	            // Only change state when something actually changed!
	            if (state.row !== layout.y ||
	                state.col !== layout.x ||
	                state.width !== layout.w ||
	                state.height !== layout.h ||
	                state.availableHeightPx !== heightInPx) {
	                return _.assign({}, state, {
	                    row: layout.y,
	                    col: layout.x,
	                    width: layout.w,
	                    height: layout.h,
	                    availableHeightPx: heightInPx
	                });
	            }
	            else {
	                return state;
	            }
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
/* 45 */
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
/* 46 */
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
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var WidgetConfig = __webpack_require__(48);
	var widgets_1 = __webpack_require__(44);
	var react_1 = __webpack_require__(18);
	var dashboard_1 = __webpack_require__(51);
	var widgetIFrame_ui_tsx_1 = __webpack_require__(71);
	/**
	 * The Dragable Frame of a Widget.
	 * Contains generic UI controls, shared by all Widgets
	 */
	var WidgetFrame = function (props) {
	    var widgetState = props.widget;
	    var widgetPlugin = props.widgetPlugin;
	    // If the plugin is not in the registry, we assume it's currently loading
	    var pluginLoaded = dashboard_1.default.getInstance().widgetPluginRegistry.hasPlugin(widgetState.type);
	    return (React.createElement("div", {className: "lob-shadow--raised slds-card", style: { margin: 0, overflow: "hidden", backgroundColor: "#fff" }, key: widgetState.id, _grid: { x: widgetState.col, y: widgetState.row, w: widgetState.width, h: widgetState.height }}, 
	        React.createElement("div", {className: "slds-grid slds-wrap slds-has-dividers--bottom", style: { height: "100%" }}, 
	            React.createElement("div", {className: "slds-size--1-of-1 slds-item" + (props.isReadOnly ? "" : " drag"), style: { padding: 8 }}, 
	                props.isReadOnly ? null :
	                    React.createElement("div", {className: "slds-float--right"}, 
	                        React.createElement(ConfigWidgetButton, {widgetState: widgetState, description: "settings", visible: (props.widgetPlugin && props.widgetPlugin.typeInfo.settings ? true : false), icon: "settings"}), 
	                        React.createElement(DeleteWidgetButton, {widgetState: widgetState, description: "remove", icon: "remove", iconType: "action"})), 
	                React.createElement("div", {className: "" + (props.isReadOnly ? "" : " drag")}, widgetState.settings.name || "\u00a0")), 
	            React.createElement("div", {className: "slds-size--1-of-1 slds-is-relative", style: { height: widgetState.availableHeightPx, padding: 0, border: "red dashed 0px" }}, pluginLoaded ? React.createElement(widgetIFrame_ui_tsx_1.default, {widgetState: widgetState, widgetPluginState: widgetPlugin})
	                : React.createElement(LoadingWidget, {widget: widgetState})))
	    ));
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
	    widgetPlugin: react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        typeInfo: react_1.PropTypes.shape({
	            type: react_1.PropTypes.string.isRequired,
	            name: react_1.PropTypes.string.isRequired,
	            settings: react_1.PropTypes.array
	        })
	    }).isRequired,
	    isReadOnly: react_1.PropTypes.bool.isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetFrame;
	var LoadingWidget = function (props) {
	    return React.createElement("div", {className: "slds-is-relative", style: { height: "100%", padding: "10px" }}, 
	        "Loading ", 
	        props.widget.type, 
	        " Widget ...", 
	        React.createElement("div", {className: "slds-spinner_container"}, 
	            React.createElement("div", {className: "slds-spinner slds-spinner--medium", role: "alert"}, 
	                React.createElement("span", {className: "slds-assistive-text"}, "Loading"), 
	                React.createElement("div", {className: "slds-spinner__dot-a"}), 
	                React.createElement("div", {className: "slds-spinner__dot-b"}))
	        ));
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
	        var iconType = this.props.iconType || "utility";
	        var data = this.props.widgetState;
	        return React.createElement("button", {className: "slds-button slds-button--icon no-drag" + (this.props.visible !== false ? "" : " slds-hide"), onClick: function () { return _this.props.onClick(data); }}, 
	            React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon slds-button__icon--small"}, 
	                React.createElement("use", {xlinkHref: "assets/icons/" + iconType + "-sprite/svg/symbols.svg#" + this.props.icon})
	            ), 
	            React.createElement("span", {className: "slds-assistive-text"}, this.props.description));
	    };
	    return WidgetButton;
	}(React.Component));
	WidgetButton.propTypes = {
	    widgetState: exports.widgetPropType.isRequired,
	    icon: react_1.PropTypes.string.isRequired,
	    description: react_1.PropTypes.string,
	    iconType: react_1.PropTypes.string,
	    visible: react_1.PropTypes.bool,
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Widgets = __webpack_require__(44);
	var actionNames_1 = __webpack_require__(42);
	var Modal = __webpack_require__(49);
	var ModalIds = __webpack_require__(50);
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
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, _) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
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
	function addError(message) {
	    return {
	        type: Action.MODAL_ADD_USER_MESSAGE,
	        kind: "error",
	        message: message
	    };
	}
	exports.addError = addError;
	function addInfo(message) {
	    return {
	        type: Action.MODAL_ADD_USER_MESSAGE,
	        kind: "info",
	        message: message
	    };
	}
	exports.addInfo = addInfo;
	function deleteUserMessage(userMessage) {
	    return {
	        type: Action.MODAL_DELETED_USER_MESSAGE,
	        message: userMessage
	    };
	}
	exports.deleteUserMessage = deleteUserMessage;
	function modalDialog(state, action) {
	    if (state === void 0) { state = initialState; }
	    switch (action.type) {
	        case Action.SHOW_MODAL:
	            return Object.assign({}, state, {
	                dialogId: action.dialogId,
	                data: action.data,
	                isVisible: true,
	                errors: []
	            });
	        case Action.HIDE_MODAL:
	            return Object.assign({}, state, {
	                dialogId: null,
	                data: null,
	                isVisible: false,
	                errors: []
	            });
	        case Action.MODAL_ADD_USER_MESSAGE: {
	            var stateErrors = state.errors || [];
	            var errors = stateErrors.concat([{ text: action.message, kind: action.kind }]);
	            return Object.assign({}, state, {
	                errors: errors
	            });
	        }
	        case Action.MODAL_DELETED_USER_MESSAGE: {
	            var errors = _.filter(state.errors.slice(), function (e) { return e.text != action.message.text; });
	            return Object.assign({}, state, {
	                errors: errors
	            });
	        }
	        default:
	            return state;
	    }
	}
	exports.modalDialog = modalDialog;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(19)))

/***/ },
/* 50 */
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var datasourcePluginRegistry_1 = __webpack_require__(52);
	var _ = __webpack_require__(19);
	var Plugins = __webpack_require__(59);
	var PluginCache = __webpack_require__(24);
	var scriptLoader_1 = __webpack_require__(62);
	var URI = __webpack_require__(64);
	var widgetPluginRegistry_1 = __webpack_require__(68);
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
	            if (_this._lastLoadingUrls === state.pluginLoader.loadingUrls) {
	                return;
	            }
	            _this._lastLoadingUrls = state.pluginLoader.loadingUrls;
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
	    Object.defineProperty(Dashboard.prototype, "store", {
	        get: function () {
	            return this._store;
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	            _this._store.dispatch(Plugins.reloadExistingPlugin(plugin.url, plugin.id));
	        });
	    };
	    Dashboard.prototype.dispose = function () {
	        this._datasourcePluginRegistry.dispose();
	        this._widgetPluginRegistry.dispose();
	    };
	    /**
	     * Load plugin from URL
	     */
	    Dashboard.prototype.loadPluginScript = function (url) {
	        var _this = this;
	        var loadScriptsPromise = scriptLoader_1.default.loadScript([url]);
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
	        }).then(function (plugin) {
	            if (plugin.Datasource) {
	                _this._datasourcePluginRegistry.register(plugin);
	                _this._store.dispatch(Plugins.datasourcePluginFinishedLoading(plugin, url));
	            }
	            else if (plugin.Widget) {
	                _this._widgetPluginRegistry.register(plugin);
	                _this._store.dispatch(Plugins.widgetPluginFinishedLoading(plugin, url));
	            }
	            delete _this._scriptsLoading[url];
	            return Promise.resolve();
	        }).catch(function (error) {
	            console.warn("Failed to load script: ", error);
	            delete _this._scriptsLoading[url];
	            _this._store.dispatch(Plugins.pluginFailedLoading(url));
	        });
	        return this._scriptsLoading[url];
	    };
	    Dashboard.prototype.loadPluginScriptDependencies = function (plugin, url) {
	        // Do not load dependencies of widgets anymore, they are loaded inside the iFrame
	        if (plugin.TYPE_INFO.kind === "widget") {
	            return Promise.resolve(plugin);
	        }
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var pluginRegistry_1 = __webpack_require__(53);
	var datasourcePluginFactory_1 = __webpack_require__(54);
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(19);
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
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(19);
	var Datasource = __webpack_require__(55);
	var datasourcePluginInstance_1 = __webpack_require__(56);
	/**
	 * Connects a datasource to the application state
	 */
	var DataSourcePluginFactory = (function () {
	    function DataSourcePluginFactory(_type, _datasource, _store) {
	        this._type = _type;
	        this._datasource = _datasource;
	        this._store = _store;
	        this._pluginInstances = {};
	        this._disposed = false;
	        //this._unsubscribe = _store.subscribe(() => this.handleStateChange());
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
	            return this.createInstance(id);
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
	    };
	    DataSourcePluginFactory.prototype.handleStateChange = function () {
	        var _this = this;
	        var state = this._store.getState();
	        if (this.oldDatasourcesState === state.datasources) {
	            return;
	        }
	        this.oldDatasourcesState = state.datasources;
	        // Create Datasource instances for missing data sources in store
	        _.valuesIn(state.datasources)
	            .filter(function (dsState) { return dsState.type === _this.type; })
	            .forEach(function (dsState) {
	            if (_this._pluginInstances[dsState.id] === undefined) {
	                _this._pluginInstances[dsState.id] = _this.createInstance(dsState.id);
	                _this._store.dispatch(Datasource.finishedLoading(dsState.id));
	            }
	        });
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
	        var state = this._store.getState();
	        var dsState = state.datasources[id];
	        if (!dsState) {
	            throw new Error("Can not create instance of non existing datasource with id " + id);
	        }
	        return new datasourcePluginInstance_1.DatasourcePluginInstance(id, this._store);
	    };
	    return DataSourcePluginFactory;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = DataSourcePluginFactory;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var reducer_js_1 = __webpack_require__(46);
	var ActionNames = __webpack_require__(42);
	var Uuid = __webpack_require__(45);
	var _ = __webpack_require__(19);
	var ModalIds = __webpack_require__(50);
	var Modal = __webpack_require__(49);
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
	        isLoading: true
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
	        default:
	            return state;
	    }
	}
	exports.datasources = datasources;
	function datasource(state, action) {
	    switch (action.type) {
	        case ActionNames.ADD_DATASOURCE:
	            return {
	                id: action.id,
	                type: action.dsType,
	                settings: action.settings,
	                isLoading: true
	            };
	        case ActionNames.UPDATE_DATASOURCE:
	            return _.assign({}, state, {
	                settings: action.settings
	            });
	        case ActionNames.DATASOURCE_FINISHED_LOADING: {
	            var newState = _.assign({}, state);
	            newState.isLoading = false;
	            return newState;
	        }
	        default:
	            return state;
	    }
	}


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Datasource = __webpack_require__(55);
	var DatasourceData = __webpack_require__(57);
	var pluginTypes_1 = __webpack_require__(58);
	/**
	 * Represents a plugin instance, state should be saved in store!
	 */
	var DatasourcePluginInstance = (function () {
	    function DatasourcePluginInstance(id, store) {
	        var _this = this;
	        this.id = id;
	        this.store = store;
	        this.oldDsState = null;
	        this.frameInitialized = false;
	        this.disposed = false;
	        if (typeof window !== 'undefined') {
	            this.messageListener = function (e) {
	                if (_this.disposed) {
	                    // TODO: better unit test than runtime checking
	                    console.error("Message listener called but WidgetPluginInstance is already disposed");
	                    return;
	                }
	                if (!_this.iFrame && e.origin === "null") {
	                    console.log("Discarding message because iFrame not set yet", e.data);
	                }
	                if (_this.iFrame !== undefined && e.origin === "null" && e.source === _this.iFrame.contentWindow) {
	                    _this.handleMessage(e.data);
	                }
	            };
	            window.addEventListener('message', this.messageListener);
	        }
	        this.unsubscribeStore = store.subscribe(function () {
	            if (_this.disposed) {
	                // TODO: better unit test than runtime checking
	                console.error("Store change observed but WidgetPluginInstance is already disposed");
	                return;
	            }
	            if (!_this.frameInitialized) {
	                // We get invalid caches when we send state to the iFrame before it is ready
	                return;
	            }
	            var state = store.getState();
	            var dsState = state.datasources[id];
	            if (dsState === undefined) {
	                // This happens for example during import. Where the state is cleared but this class not yet disposed.
	                // So we just silently return.
	                return;
	            }
	            if (dsState !== _this.oldDsState) {
	                console.log("old state: ", _this.oldDsState);
	                _this.oldDsState = dsState;
	                console.log("old state: ", _this.oldDsState);
	                _this.sendDatasourceState();
	            }
	        });
	    }
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
	    DatasourcePluginInstance.prototype.handleMessage = function (msg) {
	        switch (msg.type) {
	            case pluginTypes_1.MESSAGE_INIT: {
	                this.frameInitialized = true;
	                this.sendInitialDatasourceState();
	                this.store.dispatch(Datasource.finishedLoading(this.id));
	                console.log("Datasource initialized");
	                break;
	            }
	            case pluginTypes_1.MESSAGE_DATA: {
	                this.store.dispatch(DatasourceData.fetchedDatasourceData(this.state.id, msg.payload));
	                break;
	            }
	            default:
	                break;
	        }
	    };
	    DatasourcePluginInstance.prototype.sendMessage = function (msg) {
	        if (!this.iFrame.contentWindow) {
	            // This happens during import. We ignore it silently and rely on later disposal to free memory.
	            // TODO: Find a way to dispose this instance before this happens.
	            return;
	        }
	        this.iFrame.contentWindow.postMessage(msg, '*');
	    };
	    DatasourcePluginInstance.prototype.dispose = function () {
	        if (!this.disposed && _.isFunction(this.unsubscribeStore)) {
	            this.unsubscribeStore();
	        }
	        if (!this.disposed && _.isFunction(this.messageListener)) {
	            window.removeEventListener("message", this.messageListener);
	        }
	        this.disposed = true;
	    };
	    DatasourcePluginInstance.prototype.sendDatasourceState = function () {
	        console.log("Send state to datasource");
	        var state = this.store.getState();
	        var dsState = state.datasources[this.id];
	        this.sendMessage({
	            type: pluginTypes_1.MESSAGE_STATE,
	            payload: dsState
	        });
	    };
	    DatasourcePluginInstance.prototype.sendInitialDatasourceState = function () {
	        var state = this.store.getState();
	        var dsState = state.datasources[this.id];
	        this.sendMessage({
	            type: pluginTypes_1.MESSAGE_INITIAL_STATE,
	            payload: dsState
	        });
	    };
	    return DatasourcePluginInstance;
	}());
	exports.DatasourcePluginInstance = DatasourcePluginInstance;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {"use strict";
	var ActionNames = __webpack_require__(42);
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
	function clearData(id) {
	    return {
	        type: ActionNames.CLEAR_DATASOURCE_DATA,
	        id: id
	    };
	}
	exports.clearData = clearData;
	function datasourceData(state, action) {
	    if (state === void 0) { state = {}; }
	    switch (action.type) {
	        case ActionNames.FETCHED_DATASOURCE_DATA:
	            return _.assign({}, state, (_a = {},
	                _a[action.id] = action.data,
	                _a
	            ));
	        case ActionNames.CLEAR_DATASOURCE_DATA: {
	            var newState = _.assign({}, state);
	            return _.assign({}, state, (_b = {},
	                _b[action.id] = [],
	                _b
	            ));
	        }
	        default:
	            return state;
	    }
	    var _a, _b;
	}
	exports.datasourceData = datasourceData;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 58 */
/***/ function(module, exports) {

	"use strict";
	// The message types
	exports.MESSAGE_INIT = "init"; // iframe -> app :: iFrame is ready
	exports.MESSAGE_INITIAL_STATE = "initialState"; // app -> iFrame :: send initial state to iFrame
	exports.MESSAGE_STATE = "state"; // app -> iFrame :: send state to iFrame
	exports.MESSAGE_DATA = "data"; // app <-> iFrame :: transfer datasource data from datasource or to widget
	exports.MESSAGE_UPDATE_SETTING = "updateSetting"; // iFrame -> app :: The plugin wants to update a setting


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
	var ModalDialog = __webpack_require__(49);
	var DatasourcePlugins = __webpack_require__(60);
	var WidgetPlugins = __webpack_require__(61);
	var initialState = {
	    loadingUrls: []
	};
	function isUrl(url) {
	    return _.startsWith(url, "/") || !_.startsWith(url, ".") || !_.startsWith(url, "http:") || !_.startsWith(url, "https:");
	}
	/**
	 *  Load plugin from URL or registry when starting with plugin://
	 */
	function startLoadingPluginFromUrl(url) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var registryBaseUrl = state.config.pluginRegistryUrl;
	        if (_.startsWith(url, "plugin://")) {
	            url = url.replace("plugin://", registryBaseUrl + "/api/plugin-files/");
	        }
	        // No absolute or relative URL
	        if (!isUrl(url)) {
	            url = registryBaseUrl + "/api/plugin-files/" + url;
	        }
	        if (_.some(_.valuesIn(state.datasourcePlugins), function (p) { return p.url === url && !p.isLoading; })) {
	            dispatch(ModalDialog.addError("Plugin already loaded: " + url));
	            return;
	        }
	        if (_.some(_.valuesIn(state.widgetPlugins), function (p) { return p.url === url && !p.isLoading; })) {
	            dispatch(ModalDialog.addError("Plugin already loaded: " + url));
	            return;
	        }
	        dispatch({
	            type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
	            url: url
	        });
	    };
	}
	exports.startLoadingPluginFromUrl = startLoadingPluginFromUrl;
	function reloadExistingPlugin(url, id) {
	    return {
	        type: Action.STARTED_LOADING_PLUGIN_FROM_URL,
	        id: id,
	        url: url
	    };
	}
	exports.reloadExistingPlugin = reloadExistingPlugin;
	function pluginFailedLoading(url) {
	    return function (dispatch) {
	        dispatch(ModalDialog.addError("Failed to load plugin from " + url));
	        dispatch({
	            type: Action.PLUGIN_FAILED_LOADING,
	            url: url
	        });
	    };
	}
	exports.pluginFailedLoading = pluginFailedLoading;
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
	    var newState = _.assign({}, state);
	    newState.loadingUrls = urlsReducer(state.loadingUrls, action);
	    return newState;
	}
	exports.pluginLoaderReducer = pluginLoaderReducer;
	function publishPlugin(id, usePlugin) {
	    return function (dispatch, getState) {
	        var state = getState();
	        var dsPlugin = state.datasourcePlugins[id];
	        var widgetPlugin = state.widgetPlugins[id];
	        var isDatasource = !!dsPlugin;
	        var plugin = isDatasource ? dsPlugin : widgetPlugin;
	        var registryBaseUrl = state.config.pluginRegistryUrl;
	        var apiKey = state.config.pluginRegistryApiKey;
	        fetch(plugin.url, {
	            method: 'get'
	        }).then(function (response) {
	            return response.text();
	        }).then(function (scriptContent) {
	            var data = {
	                "MetaInfo": plugin.typeInfo,
	                "Code": scriptContent
	            };
	            return fetch(registryBaseUrl + '/api/plugins/' + id, {
	                method: 'post',
	                body: JSON.stringify(data),
	                headers: {
	                    Authorization: apiKey
	                }
	            });
	        }).then(function (response) {
	            if (response.status >= 400) {
	                return response.json().then(function (json) {
	                    if (json.error) {
	                        throw new Error("Failed to publish Plugin: " + json.error);
	                    }
	                    throw new Error("Failed to publish Plugin");
	                });
	            }
	            return response.json();
	        }).then(function (json) {
	            dispatch(ModalDialog.addInfo("Published plugin: " + id + " at " + registryBaseUrl + json.url));
	            if (usePlugin) {
	                if (isDatasource) {
	                    dispatch(DatasourcePlugins.usePublishedDatasourcePlugin(id, registryBaseUrl + json.url, json.typeInfo));
	                }
	                else {
	                    dispatch(WidgetPlugins.usePublishedWidgetPlugin(id, registryBaseUrl + json.url, json.typeInfo));
	                }
	            }
	        }).catch(function (err) {
	            dispatch(ModalDialog.addError(err.message));
	        });
	    };
	}
	exports.publishPlugin = publishPlugin;
	function urlsReducer(state, action) {
	    switch (action.type) {
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            if (!action.url) {
	                throw new Error("Can not load plugin from empty URL");
	            }
	            return state.slice().concat([action.url]);
	        case Action.PLUGIN_FAILED_LOADING:
	        case Action.WIDGET_PLUGIN_FINISHED_LOADING:
	        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
	            return state.slice().filter(function (url) { return url !== action.url; });
	        default:
	            return state;
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
	var reducer_js_1 = __webpack_require__(46);
	var dashboard_1 = __webpack_require__(51);
	// TODO: does it work to have the URL as ID?
	var initialState = {
	    "random": {
	        id: "random",
	        url: "./plugins/datasources/randomDatasource.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        },
	        isLoading: true
	    },
	    "time": {
	        id: "time",
	        url: "./plugins/datasources/timeDatasource.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        },
	        isLoading: true
	    },
	    "static-data": {
	        id: "static-data",
	        url: "./plugins/datasources/staticData.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        },
	        isLoading: true
	    },
	    "digimondo-firefly-datasource": {
	        id: "digimondo-firefly-datasource",
	        url: "./plugins/datasources/digimondoFirefly.js",
	        typeInfo: {
	            type: "will-be-loaded"
	        },
	        isLoading: true
	    }
	};
	function unloadPlugin(type) {
	    return function (dispatch) {
	        // When the plugin is still loading, or never loaded successfully we can not find it
	        if (dashboard_1.default.getInstance().widgetPluginRegistry.hasPlugin(type)) {
	            var dsFactory = dashboard_1.default.getInstance().datasourcePluginRegistry.getPlugin(type);
	            dsFactory.dispose();
	        }
	        // TODO: Should we remove the url from plugin loader and cancel loading when the plugin is still loading?
	        dispatch(deletePlugin(type));
	    };
	}
	exports.unloadPlugin = unloadPlugin;
	function usePublishedDatasourcePlugin(type, url, typeInfo) {
	    return {
	        type: Action.USE_PUBLISHED_DATASOURCE_PLUGIN,
	        id: type,
	        url: url,
	        typeInfo: typeInfo
	    };
	}
	exports.usePublishedDatasourcePlugin = usePublishedDatasourcePlugin;
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
	        case Action.USE_PUBLISHED_DATASOURCE_PLUGIN: {
	            if (state[action.id]) {
	                return _.assign({}, state, (_a = {},
	                    _a[action.id] = datasourcePlugin(state[action.id], action),
	                    _a
	                ));
	            }
	            return state;
	        }
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL: {
	            if (state[action.id]) {
	                return _.assign({}, state, (_b = {},
	                    _b[action.id] = datasourcePlugin(state[action.id], action),
	                    _b
	                ));
	            }
	            return state;
	        }
	        default:
	            return state;
	    }
	    var _a, _b;
	}
	exports.datasourcePlugins = datasourcePlugins;
	function datasourcePlugin(state, action) {
	    switch (action.type) {
	        case Action.USE_PUBLISHED_DATASOURCE_PLUGIN: {
	            return _.assign({}, state, {
	                url: action.url,
	                typeInfo: action.typeInfo
	            });
	        }
	        case Action.DATASOURCE_PLUGIN_FINISHED_LOADING:
	            if (!action.typeInfo.type) {
	                // TODO: Catch this earlier
	                throw new Error("A Plugin needs a type name. Please define TYPE_INFO.type");
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
	var reducer_js_1 = __webpack_require__(46);
	var dashboard_1 = __webpack_require__(51);
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
	function unloadPlugin(type) {
	    return function (dispatch) {
	        // When the plugin is still loading, or never loaded successfully we can not find it
	        if (dashboard_1.default.getInstance().widgetPluginRegistry.hasPlugin(type)) {
	            var widgetPlugin_1 = dashboard_1.default.getInstance().widgetPluginRegistry.getPlugin(type);
	            widgetPlugin_1.dispose();
	        }
	        // TODO: Should we remove the url from plugin loader and cancel loading when the plugin is still loading?
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
	function usePublishedWidgetPlugin(type, url, typeInfo) {
	    return {
	        type: Action.USE_PUBLISHED_WIDGET_PLUGIN,
	        id: type,
	        url: url,
	        typeInfo: typeInfo
	    };
	}
	exports.usePublishedWidgetPlugin = usePublishedWidgetPlugin;
	var pluginsCrudReducer = reducer_js_1.genCrudReducer([Action.WIDGET_PLUGIN_FINISHED_LOADING, Action.DELETE_WIDGET_PLUGIN], widgetPlugin);
	function widgetPlugins(state, action) {
	    if (state === void 0) { state = initialState; }
	    state = pluginsCrudReducer(state, action);
	    switch (action.type) {
	        case Action.USE_PUBLISHED_WIDGET_PLUGIN: {
	            if (state[action.id]) {
	                return _.assign({}, state, (_a = {},
	                    _a[action.id] = widgetPlugin(state[action.id], action),
	                    _a
	                ));
	            }
	            return state;
	        }
	        case Action.STARTED_LOADING_PLUGIN_FROM_URL:
	            if (state[action.id]) {
	                return _.assign({}, state, (_b = {},
	                    _b[action.id] = widgetPlugin(state[action.id], action),
	                    _b
	                ));
	            }
	            else {
	                return state;
	            }
	        default:
	            return state;
	    }
	    var _a, _b;
	}
	exports.widgetPlugins = widgetPlugins;
	function widgetPlugin(state, action) {
	    switch (action.type) {
	        case Action.USE_PUBLISHED_WIDGET_PLUGIN: {
	            return _.assign({}, state, {
	                url: action.url,
	                typeInfo: action.typeInfo
	            });
	        }
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var loadjs = __webpack_require__(63);
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
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
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
	var pluginRegistry_1 = __webpack_require__(53);
	var widgetPluginFactory_1 = __webpack_require__(69);
	/**
	 * Describes how we expect the plugin module to be
	 */
	var WidgetPluginRegistry = (function (_super) {
	    __extends(WidgetPluginRegistry, _super);
	    function WidgetPluginRegistry(store) {
	        _super.call(this, store);
	    }
	    WidgetPluginRegistry.prototype.createPluginFromModule = function (module) {
	        console.assert(_.isObject(module.TYPE_INFO), "Missing TYPE_INFO on datasource module. Every module must export TYPE_INFO");
	        return new widgetPluginFactory_1.default(module.TYPE_INFO.type, this.store);
	    };
	    return WidgetPluginRegistry;
	}(pluginRegistry_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetPluginRegistry;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var widgetPluginInstance_1 = __webpack_require__(70);
	var WidgetPluginFactory = (function () {
	    function WidgetPluginFactory(type, store) {
	        this.type = type;
	        this.store = store;
	        // TODO: The WidgetPluginInstance should be a plain class that might have access to the underlying component
	        this.instances = {};
	        this.disposed = false;
	    }
	    WidgetPluginFactory.prototype.getInstance = function (id) {
	        if (this.disposed === true) {
	            throw new Error("Try to create widget of destroyed type: " + this.type);
	        }
	        if (this.instances[id]) {
	            return this.instances[id];
	        }
	        this.instances[id] = new widgetPluginInstance_1.WidgetPluginInstance(id, this.store);
	        return this.instances[id];
	    };
	    WidgetPluginFactory.prototype.dispose = function () {
	        this.disposed = true;
	        _.valuesIn(this.instances).forEach(function (widgetPluginInstance) {
	            widgetPluginInstance.dispose();
	        });
	        this.instances = {};
	    };
	    return WidgetPluginFactory;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetPluginFactory;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {"use strict";
	var Widgets = __webpack_require__(44);
	var pluginTypes_1 = __webpack_require__(58);
	var WidgetPluginInstance = (function () {
	    function WidgetPluginInstance(id, store) {
	        var _this = this;
	        this.id = id;
	        this.store = store;
	        this.frameInitialized = false;
	        this.disposed = false;
	        this.oldWidgetState = null;
	        this.oldDatasourceData = {};
	        if (typeof window !== 'undefined') {
	            this.messageListener = function (e) {
	                if (_this.disposed) {
	                    // TODO: better unit test than runtime checking
	                    console.error("Message listener called but WidgetPluginInstance is already disposed");
	                    return;
	                }
	                if (!_this._iFrame && e.origin === "null") {
	                    console.log("Discarding message because iFrame not set yet", e.data);
	                }
	                if (_this._iFrame !== undefined && e.origin === "null" && e.source === _this._iFrame.contentWindow) {
	                    _this.handleMessage(e.data);
	                }
	            };
	            window.addEventListener('message', this.messageListener);
	        }
	        this.unsubscribeStore = store.subscribe(function () {
	            if (_this.disposed) {
	                // TODO: better unit test than runtime checking
	                console.error("Store change observed but WidgetPluginInstance is already disposed");
	                return;
	            }
	            if (!_this.frameInitialized) {
	                // We get invalid caches when we send state to the iFrame before it is ready
	                return;
	            }
	            var state = store.getState();
	            var widgetState = state.widgets[id];
	            if (widgetState === undefined) {
	                // This happens for example during import. Where the state is cleared but this class not yet disposed.
	                // So we just silently return.
	                return;
	            }
	            if (widgetState !== _this.oldWidgetState) {
	                _this.oldWidgetState = widgetState;
	                _this.sendPluginState();
	            }
	            _this.updateDatasourceDataInFrame();
	        });
	    }
	    Object.defineProperty(WidgetPluginInstance.prototype, "iFrame", {
	        set: function (element) {
	            this._iFrame = element;
	            this.sendMessage({ type: pluginTypes_1.MESSAGE_INIT });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    WidgetPluginInstance.prototype.updateDatasourceDataInFrame = function () {
	        var _this = this;
	        var state = this.store.getState();
	        var widgetState = state.widgets[this.id];
	        var widgetPluginState = state.widgetPlugins[widgetState.type];
	        widgetPluginState.typeInfo.settings.filter(function (s) {
	            return s.type === "datasource";
	        }).map(function (s) {
	            return widgetState.settings[s.id];
	        }).forEach(function (dsId) {
	            if (state.datasources[dsId] === undefined) {
	                return;
	            }
	            var data = state.datasourceData[dsId];
	            if (data !== _this.oldDatasourceData[dsId]) {
	                _this.oldDatasourceData[dsId] = data;
	                _this.sendDatasourceData(dsId);
	            }
	        });
	    };
	    WidgetPluginInstance.prototype.handleMessage = function (msg) {
	        switch (msg.type) {
	            case 'init': {
	                this.frameInitialized = true;
	                this.sendPluginState();
	                this.updateDatasourceDataInFrame();
	                break;
	            }
	            case 'updateSetting': {
	                this.updateSetting(msg.payload.id, msg.payload.value);
	                break;
	            }
	            default:
	                break;
	        }
	    };
	    WidgetPluginInstance.prototype.sendMessage = function (msg) {
	        if (!this._iFrame.contentWindow) {
	            // This happens during import. We ignore it silently and rely on later disposal to free memory.
	            // TODO: Find a way to dispose this instance before this happens.
	            return;
	        }
	        this._iFrame.contentWindow.postMessage(msg, '*');
	    };
	    WidgetPluginInstance.prototype.sendPluginState = function () {
	        var state = this.store.getState();
	        var widgetState = state.widgets[this.id];
	        this.sendMessage({
	            type: pluginTypes_1.MESSAGE_STATE,
	            payload: widgetState
	        });
	    };
	    WidgetPluginInstance.prototype.sendDatasourceData = function (dsId) {
	        var state = this.store.getState();
	        this.sendMessage({
	            type: pluginTypes_1.MESSAGE_DATA,
	            payload: {
	                id: dsId,
	                data: state.datasourceData[dsId]
	            }
	        });
	    };
	    WidgetPluginInstance.prototype.updateSetting = function (settingId, value) {
	        this.store.dispatch(Widgets.updatedSingleSetting(this.id, settingId, value));
	    };
	    WidgetPluginInstance.prototype.dispose = function () {
	        if (!this.disposed && _.isFunction(this.unsubscribeStore)) {
	            this.unsubscribeStore();
	        }
	        if (!this.disposed && _.isFunction(this.messageListener)) {
	            window.removeEventListener("message", this.messageListener);
	        }
	        this.disposed = true;
	    };
	    return WidgetPluginInstance;
	}());
	exports.WidgetPluginInstance = WidgetPluginInstance;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ },
/* 71 */
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
	var React = __webpack_require__(18);
	var dashboard_1 = __webpack_require__(51);
	/**
	 * The Dragable Frame of a Widget.
	 * Contains generic UI controls, shared by all Widgets
	 */
	var WidgetIFrame = (function (_super) {
	    __extends(WidgetIFrame, _super);
	    function WidgetIFrame(props) {
	        _super.call(this, props);
	    }
	    WidgetIFrame.prototype.componentDidMount = function () {
	        var element = this.refs['frame'];
	        var widgetFactory = dashboard_1.default.getInstance().widgetPluginRegistry.getPlugin(this.props.widgetState.type);
	        var widgetInstance = widgetFactory.getInstance(this.props.widgetState.id);
	        widgetInstance.iFrame = element;
	    };
	    // allow-popups allow-same-origin allow-modals allow-forms
	    // A sandbox that includes both the allow-same-origin and allow-scripts flags,
	    // then the framed page can reach up into the parent, and remove the sandbox attribute entirely.
	    // Only if the framed content comes from the same origin of course.
	    WidgetIFrame.prototype.render = function () {
	        return React.createElement("iframe", {id: 'frame-' + this.props.widgetState.id, ref: "frame", src: "widget.html#" + this.props.widgetPluginState.url, frameBorder: "0", width: "100%", height: "100%", scrolling: "no", sandbox: "allow-scripts"}, "Browser does not support iFrames.");
	    };
	    ;
	    return WidgetIFrame;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = WidgetIFrame;


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
	var React = __webpack_require__(18);
	var ReactDOM = __webpack_require__(37);
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
/* 73 */,
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
/* 86 */
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
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var Layouts = __webpack_require__(87);
	var ui = __webpack_require__(88);
	var react_1 = __webpack_require__(18);
	var LayoutsTopNavItem = function (props) {
	    return React.createElement("li", {className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--hover", "aria-haspopup": "true"}, 
	        React.createElement("a", {href: "javascript:void(0);", className: "slds-context-bar__label-action", title: "Layouts"}, 
	            React.createElement("span", {className: "slds-truncate"}, "Layout")
	        ), 
	        React.createElement("div", {className: "slds-context-bar__icon-action slds-p-left--none", tabIndex: "0"}, 
	            React.createElement("button", {className: "slds-button slds-button--icon slds-context-bar__button", tabIndex: "-1"}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon"}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#chevrondown"})
	                ), 
	                React.createElement("span", {className: "slds-assistive-text"}, "Open Layout submenu"))
	        ), 
	        React.createElement("div", {className: "slds-dropdown slds-dropdown--right"}, 
	            React.createElement("ul", {className: "dropdown__list", role: "menu"}, 
	                React.createElement(SaveLayout, null), 
	                React.createElement(ResetLayoutButton, {text: "Reset Current Layout", icon: "undo"}), 
	                React.createElement(SaveLayoutButton, {text: "Save Layout", icon: "package"}), 
	                React.createElement("li", {className: "slds-dropdown__header slds-has-divider--top-space", role: "separator"}, 
	                    React.createElement("span", {className: "slds-text-title--caps"}, "Layouts")
	                ), 
	                props.layouts.map(function (layout) {
	                    return React.createElement(LayoutItem, {text: layout.name, icon: "plus", layout: layout, key: layout.id});
	                }))
	        ));
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
	            this.save();
	        }
	    };
	    SaveInput.prototype.save = function () {
	        this.props.onEnter(this.refs.input.value, this.props);
	        this.refs.input.value = '';
	    };
	    SaveInput.prototype.render = function () {
	        var _this = this;
	        return React.createElement("div", {className: "slds-form-element"}, 
	            React.createElement("div", {className: "slds-form-element__control slds-input-has-icon slds-input-has-icon--right"}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-input__icon slds-icon-text-default", onClick: function () { return _this.save(); }}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#add"})
	                ), 
	                React.createElement("input", {id: "text-input-save-layout", className: "slds-input", type: "text", placeholder: "Save as ...", ref: "input", onKeyPress: this.onEnter.bind(this)}))
	        );
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
	        var selected = props.currentLayout.id == props.layout.id;
	        return React.createElement(ui.DropdownItem, {onClick: function () { return props.onClick(props); }, selected: selected, isCheckbox: "true", icon: "check", iconRight: "delete", iconRightClick: function () {
	            props.deleteLayout(props);
	        }, text: props.text});
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
	var ResetLayoutButton = react_redux_1.connect(function (state) {
	    return {
	        id: state.currentLayout.id,
	        disabled: !state.currentLayout.id
	    };
	}, function (dispatch, props) {
	    return {
	        onClick: function (props) { return dispatch(Layouts.loadLayout(props.id)); }
	    };
	})(ui.DropdownItem);
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
	})(ui.DropdownItem);


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Widgets = __webpack_require__(44);
	var uuid_1 = __webpack_require__(45);
	var reducer_1 = __webpack_require__(46);
	var actionNames_1 = __webpack_require__(42);
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
/* 88 */
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
	var React = __webpack_require__(18);
	var react_1 = __webpack_require__(18);
	/**
	 * This module contains generic UI Elements reuse in the app
	 */
	exports.DropdownItem = function (props) {
	    var icon;
	    var iconRight;
	    if (props.icon) {
	        icon = React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default slds-m-right--x-small" + (props.isCheckbox ? " slds-icon--selected" : "")}, 
	            React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#" + props.icon})
	        );
	    }
	    if (props.iconRight) {
	        iconRight = React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default slds-m-left--small slds-shrink-none", onClick: function (e) {
	            if (props.iconRightClick) {
	                e.stopPropagation();
	                e.preventDefault();
	                props.iconRightClick(e);
	            }
	        }}, 
	            React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#" + props.iconRight})
	        );
	    }
	    return React.createElement("li", {className: "slds-dropdown__item" + (props.selected ? " slds-is-selected" : ""), role: "presentation"}, 
	        React.createElement("a", {href: "javascript:void(0);", role: props.isCheckbox ? "menuitemcheckbox" : "menuitem", "aria-checked": props.selected ? "true" : "false", onClick: function (e) {
	            e.stopPropagation();
	            e.preventDefault();
	            props.onClick(e);
	        }, tabIndex: "-1"}, 
	            React.createElement("span", {className: "slds-truncate"}, 
	                icon, 
	                " ", 
	                props.text), 
	            iconRight)
	    );
	};
	exports.DropdownItem.propTypes = {
	    onClick: react_1.PropTypes.func.isRequired,
	    iconRightClick: react_1.PropTypes.func,
	    text: react_1.PropTypes.string,
	    icon: react_1.PropTypes.string,
	    iconRight: react_1.PropTypes.string,
	    isCheckbox: react_1.PropTypes.string,
	    children: react_1.PropTypes.any,
	    selected: react_1.PropTypes.bool
	};
	exports.LinkItem = function (props) {
	    var icon;
	    if (props.icon) {
	        icon = React.createElement("i", {className: props.icon + " icon"});
	    }
	    return React.createElement("a", {className: "item" + (props.disabled ? " disabled" : ""), href: "#", onClick: function (e) {
	        e.stopPropagation();
	        e.preventDefault();
	        props.onClick(props);
	    }}, 
	        icon, 
	        " ", 
	        props.children, 
	        " ", 
	        props.text);
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
/* 89 */
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
	var React = __webpack_require__(18);
	var modalDialog_ui_tsx_1 = __webpack_require__(90);
	var WidgetConfig = __webpack_require__(48);
	var react_redux_1 = __webpack_require__(38);
	var settingsForm_ui_1 = __webpack_require__(91);
	var redux_form_1 = __webpack_require__(92);
	var ModalIds = __webpack_require__(50);
	var react_1 = __webpack_require__(18);
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
	            return React.createElement(modalDialog_ui_tsx_1.default, {id: DIALOG_ID, title: "Configure Widget: " + props.widgetType, actions: actions}, 
	                React.createElement("div", null, 
	                    "Unknown WidgetType: ", 
	                    props.widgetType)
	            );
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
	        return React.createElement(modalDialog_ui_tsx_1.default, {id: DIALOG_ID, title: "Configure Widget: " + selectedWidgetPlugin.typeInfo.name, actions: actions}, 
	            React.createElement("div", {className: "ui one column grid"}, 
	                React.createElement("div", {className: "column"}, 
	                    selectedWidgetPlugin.description ?
	                        React.createElement("div", {className: "ui icon message"}, 
	                            React.createElement("i", {className: "idea icon"}), 
	                            React.createElement("div", {className: "content"}, selectedWidgetPlugin.description))
	                        : null, 
	                    React.createElement(settingsForm_ui_1.default, {ref: "form", form: FORM_ID, settings: settings, onSubmit: this.onSubmit.bind(this), fields: fields.slice(), initialValues: initialValues}))
	            )
	        );
	    };
	    return WidgetConfigModal;
	}(React.Component));
	WidgetConfigModal.propTypes = {
	    widgetId: react_1.PropTypes.string,
	    resetForm: react_1.PropTypes.func.isRequired,
	    widgetType: react_1.PropTypes.string,
	    widgetSettings: react_1.PropTypes.object.isRequired,
	    widgetPlugin: react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        typeInfo: react_1.PropTypes.shape({
	            type: react_1.PropTypes.string.isRequired,
	            name: react_1.PropTypes.string.isRequired,
	            settings: react_1.PropTypes.array
	        })
	    })
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
/* 90 */
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
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var Modal = __webpack_require__(49);
	var ModalDialog = (function (_super) {
	    __extends(ModalDialog, _super);
	    function ModalDialog(props) {
	        _super.call(this, props);
	        this.state = { screen: this.screenSize() };
	    }
	    ModalDialog.prototype.componentDidMount = function () {
	        var _this = this;
	        var $modal = $('.ui.modal.' + this.props.id);
	        $modal.modal({
	            detachable: false,
	            closable: false,
	            observeChanges: true,
	            onApprove: function ($element) { return false; },
	            onDeny: function ($element) { return false; },
	            transition: "fade",
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
	        $(window).resize(function () {
	            _this.setState({ screen: _this.screenSize() });
	        });
	    };
	    ModalDialog.prototype.screenSize = function () {
	        if (typeof window === 'undefined') {
	            console.log("Running on nodeJS!");
	            return {
	                height: 500,
	                width: 500
	            };
	        }
	        return {
	            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
	            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
	        };
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
	            return React.createElement("div", {key: key++, className: action.className, onClick: function (e) { return _this.onClick(e, action); }}, 
	                action.label, 
	                action.iconClass ? React.createElement("i", {className: action.iconClass}) : null);
	        });
	        var props = this.props;
	        // TODO: realize Modals with React, then isOpen gets handy:
	        //const isOpen = props.dialogState.dialogId == props.id && props.dialogState.isVisible;
	        var height = this.state.screen.height;
	        var width = this.state.screen.width;
	        return React.createElement("div", {id: this.props.id, className: 'ui modal ' + this.props.id, style: { width: width - 80, top: 40, left: 40, margin: 1, minHeight: "500px" }}, 
	            React.createElement("div", {className: "header"}, props.title), 
	            this.props.dialogState.isVisible ?
	                React.createElement("div", {className: "content", style: { overflowY: 'scroll', height: height - 300, minHeight: "500px" }}, 
	                    this.props.dialogState.errors ?
	                        this.props.dialogState.errors.map(function (message, i) {
	                            return React.createElement(ModalUserMessageComponent, {key: i, userMessage: message});
	                        })
	                        : null, 
	                    props.children)
	                : null, 
	            React.createElement("div", {className: "actions"}, actions));
	    };
	    return ModalDialog;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state, ownProps) {
	    return {
	        dialogState: state.modalDialog
	    };
	}, function (dispatch) {
	    return {
	        closeDialog: function () { return dispatch(Modal.closeModal()); }
	    };
	})(ModalDialog);
	var ModalUserMessage = (function (_super) {
	    __extends(ModalUserMessage, _super);
	    function ModalUserMessage() {
	        _super.apply(this, arguments);
	    }
	    ModalUserMessage.prototype.close = function () {
	        this.props.close(this.props.userMessage);
	    };
	    ModalUserMessage.prototype.render = function () {
	        var _this = this;
	        var theme = "error";
	        if (this.props.userMessage.kind === "info") {
	            theme = "success";
	        }
	        if (this.props.userMessage.kind === "error") {
	            theme = "error";
	        }
	        return React.createElement("div", {className: "slds-notify_container slds-is-relative slds-m-bottom--x-small"}, 
	            React.createElement("div", {className: "slds-notify slds-notify--alert slds-theme--alert-texture slds-theme--" + theme, role: "alert"}, 
	                React.createElement("button", {className: "slds-button slds-notify__close slds-button--icon-inverse", onClick: function () { return _this.close(); }}, 
	                    React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon"}, 
	                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#close"})
	                    ), 
	                    React.createElement("span", {className: "slds-assistive-text"}, "Close")), 
	                React.createElement("span", {className: "slds-assistive-text"}, this.props.userMessage.kind), 
	                React.createElement("h2", null, this.props.userMessage.text))
	        );
	    };
	    return ModalUserMessage;
	}(React.Component));
	var ModalUserMessageComponent = react_redux_1.connect(function (state, ownProps) {
	    return {
	        userMessage: ownProps.userMessage
	    };
	}, function (dispatch) {
	    return {
	        close: function (message) {
	            dispatch(Modal.deleteUserMessage(message));
	        }
	    };
	})(ModalUserMessage);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

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
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var ui = __webpack_require__(88);
	var redux_form_1 = __webpack_require__(92);
	var collection_1 = __webpack_require__(93);
	var _ = __webpack_require__(19);
	var react_1 = __webpack_require__(18);
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
	        return React.createElement("form", {className: "ui form"}, collection_1.chunk(this.props.settings, 1).map(function (chunk) {
	            return React.createElement("div", {key: chunk[0].id, className: "field"}, chunk.map(function (setting) {
	                return React.createElement(LabeledField, {key: setting.id, setting: setting});
	            }));
	        }));
	    };
	    return SettingsForm;
	}(React.Component));
	SettingsForm.propTypes = {
	    initialValues: react_1.PropTypes.object.isRequired,
	    settings: react_1.PropTypes.arrayOf(react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired
	    })).isRequired
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = redux_form_1.reduxForm({ enableReinitialize: "true" })(SettingsForm);
	function LabeledField(props) {
	    var setting = props.setting;
	    return React.createElement("div", {className: "field"}, 
	        React.createElement("label", null, 
	            setting.name, 
	            setting.description && setting.type !== 'boolean' ?
	                React.createElement(ui.Icon, {type: "help circle", "data-content": setting.description}) : null), 
	        React.createElement(SettingsInput, {setting: props.setting}));
	}
	LabeledField.propTypes = {
	    setting: react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        type: react_1.PropTypes.string.isRequired,
	        name: react_1.PropTypes.string.isRequired,
	        description: react_1.PropTypes.string
	    }).isRequired
	};
	function SettingsInput(props) {
	    var setting = props.setting;
	    switch (setting.type) {
	        case "text":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "textarea", rows: "3", placeholder: setting.description});
	        case "string":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "input", type: "text", placeholder: setting.description});
	        case "json":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "textarea", rows: "3", placeholder: setting.description});
	        case "number":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "input", type: "number", min: setting.min, max: setting.max, placeholder: setting.description});
	        case "boolean":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "input", type: "checkbox"});
	        case "option":
	            return React.createElement(redux_form_1.Field, {name: setting.id, component: "select", className: "ui fluid dropdown"}, 
	                React.createElement("option", null, "Select " + props.name + " ..."), 
	                setting.options.map(function (option) {
	                    var optionValue = _.isObject(option) ? option.value : option;
	                    var optionName = _.isObject(option) ? option.name : option;
	                    return React.createElement("option", {key: optionValue, value: optionValue}, optionName);
	                }));
	        case "datasource":
	            return React.createElement(DatasourceInputContainer, {setting: setting});
	        default:
	            console.error("Unknown type for settings field with id '" + setting.id + "': " + setting.type);
	            return React.createElement("input", {placeholder: setting.description, readonly: true, value: "Unknown field type: " + setting.type});
	    }
	}
	SettingsInput.propTypes = {
	    setting: react_1.PropTypes.shape({
	        type: react_1.PropTypes.string.isRequired,
	        id: react_1.PropTypes.string.isRequired,
	        name: react_1.PropTypes.string.isRequired,
	        description: react_1.PropTypes.string,
	        defaultValue: react_1.PropTypes.any,
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
	    }).isRequired
	};
	var DatasourceInput = function (props) {
	    var datasources = props.datasources;
	    var setting = props.setting;
	    return React.createElement(redux_form_1.Field, {name: setting.id, component: "select", className: "ui fluid dropdown"}, 
	        React.createElement("option", null, "Select " + setting.name + " ..."), 
	        _.toPairs(datasources).map(function (_a) {
	            var id = _a[0], ds = _a[1];
	            return React.createElement("option", {key: id, value: id}, ds.settings.name + " (" + ds.type + ")");
	        }));
	};
	DatasourceInput.propTypes = {
	    datasources: react_1.PropTypes.object.isRequired,
	    setting: react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        type: react_1.PropTypes.string.isRequired,
	        name: react_1.PropTypes.string.isRequired
	    }).isRequired
	};
	var DatasourceInputContainer = react_redux_1.connect(function (state) {
	    return {
	        datasources: state.datasources
	    };
	})(DatasourceInput);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 92 */,
/* 93 */
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
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var ui = __webpack_require__(88);
	var Modal = __webpack_require__(49);
	var ModalIds = __webpack_require__(50);
	var react_1 = __webpack_require__(18);
	var DashboardTopNavItem = function (props) {
	    return React.createElement("li", {className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--hover", "aria-haspopup": "true"}, 
	        React.createElement("a", {href: "javascript:void(0);", className: "slds-context-bar__label-action", title: "Dashboard"}, 
	            React.createElement("span", {className: "slds-truncate"}, "Board")
	        ), 
	        React.createElement("div", {className: "slds-context-bar__icon-action slds-p-left--none", tabIndex: "0"}, 
	            React.createElement("button", {className: "slds-button slds-button--icon slds-context-bar__button", tabIndex: "-1"}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon"}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#chevrondown"})
	                ), 
	                React.createElement("span", {className: "slds-assistive-text"}, "Open Board submenu"))
	        ), 
	        React.createElement("div", {className: "slds-dropdown slds-dropdown--right"}, 
	            React.createElement("ul", {className: "dropdown__list", role: "menu"}, 
	                React.createElement(ui.DropdownItem, {text: "Import / Export", icon: "change_record_type", onClick: function () { return props.showModal(ModalIds.DASHBOARD_IMPORT_EXPORT); }})
	            )
	        ));
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
/* 95 */
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
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var Import = __webpack_require__(96);
	var modalDialog_ui_1 = __webpack_require__(90);
	var react_1 = __webpack_require__(18);
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
	        return React.createElement(modalDialog_ui_1.default, {id: "dashboard-import-export-dialog", title: "Import / Export Dashboard", actions: actions}, 
	            React.createElement("div", {className: "ui one column grid"}, 
	                React.createElement("div", {className: "column"}, 
	                    React.createElement("button", {className: "ui compact labeled icon button", onClick: this._loadData.bind(this)}, 
	                        React.createElement("i", {className: "refresh icon"}), 
	                        "Load Data"), 
	                    React.createElement("button", {className: "ui compact labeled icon button", onClick: this._exportToClipboard.bind(this)}, 
	                        React.createElement("i", {className: "upload icon"}), 
	                        "Copy to Clipboard"), 
	                    React.createElement("button", {className: "ui compact labeled icon button", onClick: this._clearData.bind(this)}, 
	                        React.createElement("i", {className: "erase icon"}), 
	                        "Clear Data")), 
	                React.createElement("div", {className: "column"}, 
	                    React.createElement("form", {className: "ui form"}, 
	                        React.createElement("div", {className: "field"}, 
	                            React.createElement("label", null, "Data"), 
	                            React.createElement("textarea", {className: "monospace", ref: "data", rows: "10", onFocus: function (e) { return e.target.select(); }, placeholder: 'Click "Load Data" to get data for export or paste your data here ...'}))
	                    )
	                ))
	        );
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
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Action = __webpack_require__(42);
	var actionNames_1 = __webpack_require__(42);
	var layouts_js_1 = __webpack_require__(87);
	var _ = __webpack_require__(19);
	var dashboard_1 = __webpack_require__(51);
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
	    var oldDashboard = dashboard_1.default.getInstance();
	    oldDashboard.dispose();
	    var newDashboard = new dashboard_1.default(oldDashboard.store);
	    newDashboard.init();
	}
	function importReducer(state, action) {
	    switch (action.type) {
	        case Action.DASHBOARD_IMPORT:
	            var newState = _.assign({}, state, action.state);
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
	        dispatch(layouts_js_1.loadEmptyLayout());
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
/* 97 */
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
	var React = __webpack_require__(18);
	var modalDialog_ui_1 = __webpack_require__(90);
	var Datasource = __webpack_require__(55);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var ui = __webpack_require__(88);
	var settingsForm_ui_1 = __webpack_require__(91);
	var redux_form_1 = __webpack_require__(92);
	var ModalIds = __webpack_require__(50);
	var react_1 = __webpack_require__(18);
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
	    DatasourceConfigModal.prototype.clearData = function () {
	        this.props.clearData(this._getEditingDatasource().id);
	    };
	    DatasourceConfigModal.prototype.render = function () {
	        /*
	         { this._isEditing() ?
	         <div className="ui right red button" onClick={(e) => this.clearData()}>
	         Clear Data
	         </div>
	         : null }
	         */
	        var _this = this;
	        var props = this.props;
	        var actions = [
	            {
	                className: "ui button",
	                label: "Clear Data",
	                onClick: function () {
	                    _this.clearData();
	                    return false;
	                }
	            },
	            {
	                className: "ui right button",
	                label: "Reset Form",
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
	        return React.createElement(modalDialog_ui_1.default, {id: DIALOG_ID, title: title, actions: actions}, 
	            React.createElement("div", {className: "ui one column grid"}, 
	                React.createElement("div", {className: "column"}, 
	                    selectedDsPluginState && selectedDsPluginState.typeInfo.description ?
	                        React.createElement("div", {className: "ui icon message"}, 
	                            React.createElement("i", {className: "idea icon"}), 
	                            React.createElement("div", {className: "content"}, selectedDsPluginState.typeInfo.description))
	                        : null, 
	                    React.createElement("div", {className: "field"}, 
	                        React.createElement("label", null, "Type"), 
	                        React.createElement("select", {className: "ui fluid dropdown", name: "type", value: this.state.selectedType, onChange: function (e) {
	                            _this.setState({ selectedType: e.target.value });
	                        }}, 
	                            React.createElement("option", {key: "none", value: ""}, "Select Type..."), 
	                            _.valuesIn(props.datasourcePlugins).map(function (dsPlugin) {
	                                return (!dsPlugin.isLoading ? React.createElement("option", {key: dsPlugin.id, value: dsPlugin.id}, dsPlugin.typeInfo.name)
	                                    : null);
	                            }))), 
	                    React.createElement(ui.Divider, null), 
	                    React.createElement(settingsForm_ui_1.default, {ref: "form", form: FORM_ID, onSubmit: this.onSubmit.bind(this), settings: settings, initialValues: initialValues}))
	            )
	        );
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
	        clearData: function (id) { return dispatch(Datasource.clearData(id)); },
	        createDatasource: function (type, dsSettings) {
	            dispatch(Datasource.createDatasource(type, dsSettings));
	        },
	        updateDatasource: function (id, type, dsSettings) {
	            dispatch(Datasource.updateDatasource(id, type, dsSettings));
	        }
	    };
	})(DatasourceConfigModal);


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(18);
	var Datasource = __webpack_require__(55);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var ui = __webpack_require__(88);
	var react_1 = __webpack_require__(18);
	var DatasourceTopNavItem = function (props) {
	    return React.createElement("li", {className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--hover", "aria-haspopup": "true"}, 
	        React.createElement("a", {href: "javascript:void(0);", className: "slds-context-bar__label-action", title: "Datasources"}, 
	            React.createElement("span", {className: "slds-truncate"}, "Datasources")
	        ), 
	        React.createElement("div", {className: "slds-context-bar__icon-action slds-p-left--none", tabIndex: "0"}, 
	            React.createElement("button", {className: "slds-button slds-button--icon slds-context-bar__button", tabIndex: "-1"}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon"}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#chevrondown"})
	                ), 
	                React.createElement("span", {className: "slds-assistive-text"}, "Open Datasources submenu"))
	        ), 
	        React.createElement("div", {className: "slds-dropdown slds-dropdown--right"}, 
	            React.createElement("ul", {className: "dropdown__list", role: "menu"}, 
	                React.createElement(ui.DropdownItem, {text: "Add Datasource", icon: "add", onClick: function () { return props.createDatasource(); }}), 
	                React.createElement("li", {className: "slds-dropdown__header slds-has-divider--top-space", role: "separator"}, 
	                    React.createElement("span", {className: "slds-text-title--caps"}, "Datasources")
	                ), 
	                _.valuesIn(props.datasources).map(function (ds) {
	                    return React.createElement(ui.DropdownItem, {key: ds.id, text: ds.settings.name, iconRight: "delete", iconRightClick: function () { return props.deleteDatasource(ds.id); }, onClick: function () { return props.editDatasource(ds.id); }});
	                }))
	        ));
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
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(18);
	var react_1 = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var WidgetConfig = __webpack_require__(48);
	var _ = __webpack_require__(19);
	var ui = __webpack_require__(88);
	var WidgetsNavItem = function (props) {
	    return React.createElement("li", {className: "slds-context-bar__item slds-context-bar__dropdown-trigger slds-dropdown-trigger slds-dropdown-trigger--hover", "aria-haspopup": "true"}, 
	        React.createElement("a", {href: "javascript:void(0);", className: "slds-context-bar__label-action", title: "Widgets"}, 
	            React.createElement("span", {className: "slds-truncate"}, "Add Widget")
	        ), 
	        React.createElement("div", {className: "slds-context-bar__icon-action slds-p-left--none", tabIndex: "0"}, 
	            React.createElement("button", {className: "slds-button slds-button--icon slds-context-bar__button", tabIndex: "-1"}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon"}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#chevrondown"})
	                ), 
	                React.createElement("span", {className: "slds-assistive-text"}, "Open Add Widget submenu"))
	        ), 
	        React.createElement("div", {className: "slds-dropdown slds-dropdown--right"}, 
	            React.createElement("ul", {className: "dropdown__list", role: "menu"}, _.valuesIn(props.widgetPlugins).map(function (widgetPlugin) {
	                return React.createElement(ui.DropdownItem, {key: widgetPlugin.id, text: widgetPlugin.typeInfo.name, icon: "add", onClick: function () { return props.createWidget(widgetPlugin.typeInfo.type); }});
	            }))
	        ));
	};
	WidgetsNavItem.propTypes = {
	    widgetPlugins: react_1.PropTypes.objectOf(react_1.PropTypes.shape({
	        id: react_1.PropTypes.string.isRequired,
	        typeInfo: react_1.PropTypes.shape({
	            type: react_1.PropTypes.string.isRequired,
	            name: react_1.PropTypes.string.isRequired,
	            settings: react_1.PropTypes.array
	        })
	    }))
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgetPlugins: state.widgetPlugins
	    };
	}, function (dispatch) {
	    return {
	        createWidget: function (type) {
	            dispatch(WidgetConfig.createWidget(type));
	        }
	    };
	})(WidgetsNavItem);


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var ModalIds = __webpack_require__(50);
	var Modal = __webpack_require__(49);
	var PluginsTopNavItem = function (props) {
	    return React.createElement("li", {className: "slds-context-bar__item"}, 
	        React.createElement("a", {href: "javascript:void(0);", onClick: function () { return props.showPluginsDialog(); }, className: "slds-context-bar__label-action", title: "Plugins"}, 
	            React.createElement("span", {className: "slds-truncate"}, "Plugin Manager")
	        )
	    );
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
/* 101 */
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
	var React = __webpack_require__(18);
	var modalDialog_ui_1 = __webpack_require__(90);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var Modal = __webpack_require__(49);
	var Config = __webpack_require__(102);
	var Plugins = __webpack_require__(59);
	var WidgetsPlugins = __webpack_require__(61);
	var DatasourcePlugins = __webpack_require__(60);
	var PluginsModal = (function (_super) {
	    __extends(PluginsModal, _super);
	    function PluginsModal(props) {
	        _super.call(this, props);
	        this.state = {
	            pluginUrl: "",
	            isSearchOpen: false
	        };
	    }
	    PluginsModal.prototype.pluginSearchValueChange = function (e) {
	        var url = this.pluginUrlValue();
	        if (this.isUrl(url)) {
	            this.setState({ isSearchOpen: false });
	        }
	        else {
	            this.setState({ isSearchOpen: true });
	        }
	        this.setState({ pluginUrl: this.pluginUrlValue() });
	    };
	    PluginsModal.prototype.onBlurPluginSearchInput = function (e) {
	        var _this = this;
	        setTimeout(function () {
	            _this.setState({ isSearchOpen: false });
	        }, 300);
	    };
	    PluginsModal.prototype.isUrl = function (url) {
	        return url === '' || _.startsWith(url, ".") || _.startsWith(url, "/") || _.startsWith(url, "http:") || _.startsWith(url, "https:");
	    };
	    PluginsModal.prototype.onFocusPluginSearchInput = function (e) {
	        var url = this.pluginUrlValue();
	        if (this.isUrl(url)) {
	            this.setState({ isSearchOpen: false });
	        }
	        else {
	            this.setState({ isSearchOpen: true });
	        }
	    };
	    PluginsModal.prototype.pluginUrlValue = function () {
	        var pluginUrlInput = this.refs['pluginUrl'];
	        return _.trim(pluginUrlInput.value);
	    };
	    PluginsModal.prototype.clearUrl = function () {
	        var pluginUrlInput = this.refs['pluginUrl'];
	        pluginUrlInput.value = "";
	        this.setState({ pluginUrl: "" });
	    };
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
	        var pluginUrlInput = this.refs['pluginUrl']; // HTMLInputElement
	        return React.createElement(modalDialog_ui_1.default, {id: "plugins-dialog", title: "Plugin Manager", actions: actions}, 
	            React.createElement("div", {className: "slds-grid"}, 
	                React.createElement("div", {className: "slds-size--1-of-1"}, 
	                    React.createElement("h2", {className: "slds-section-title--divider slds-m-bottom--medium"}, 
	                        "Load Plugin ", 
	                        React.createElement(PluginRegistrySettings, {pluginRegistryApiKey: props.pluginRegistryApiKey, pluginRegistryUrl: props.pluginRegistryUrl, onApiKeyChanged: function (key) { return _this.props.setConfigValue("pluginRegistryApiKey", key); }, onRegistryUrlChanged: function (url) { return _this.props.setConfigValue("pluginRegistryUrl", url); }})), 
	                    React.createElement("form", {className: "slds-form--inline slds-grid", onSubmit: function (e) {
	                        props.loadPlugin(pluginUrlInput.value);
	                        _this.clearUrl();
	                        e.preventDefault();
	                    }}, 
	                        React.createElement("div", {className: "slds-form-element slds-has-flexi-truncate slds-lookup" + (this.state.isSearchOpen ? " slds-is-open" : ""), "data-select": "single"}, 
	                            React.createElement("div", {className: "slds-form-element__control slds-size--1-of-1"}, 
	                                React.createElement("div", {className: "slds-input-has-icon slds-input-has-icon--right"}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-input__icon"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#search"})
	                                    ), 
	                                    React.createElement("input", {className: "slds-lookup__search-input slds-input", type: "search", placeholder: "URL or Id from Plugin Registry", id: "plugin-lookup-menu", ref: "pluginUrl", autoComplete: (this.state.isSearchOpen ? " off" : "on"), defaultValue: "", onChange: function (e) { return _this.pluginSearchValueChange(e); }, onBlur: function (e) { return _this.onBlurPluginSearchInput(e); }, onFocus: function (e) { return _this.onFocusPluginSearchInput(e); }, "aria-owns": "plugin-lookup-menu", role: "combobox", "aria-activedescendent": "", "aria-expanded": (this.state.isSearchOpen ? "true" : "false"), "aria-autocomplete": "list"}))
	                            ), 
	                            React.createElement(LookupMenu, {id: "plugin-lookup-menu", searchString: this.state.pluginUrl, pluginRegistryUrl: this.props.pluginRegistryUrl, onItemClicked: function (item) { return props.loadPlugin('plugin://' + item.type); }})), 
	                        React.createElement("div", {className: "slds-form-element slds-no-flex"}, 
	                            React.createElement("button", {className: "slds-button slds-button--brand", type: "submit", tabIndex: 0}, "Load Plugin")
	                        )), 
	                    React.createElement("h4", {className: "slds-section-title--divider slds-m-top--medium slds-m-bottom--medium"}, "Datasource Plugins (Installed)"), 
	                    React.createElement("div", {className: "slds-grid slds-grid--vertical-stretch slds-wrap slds-has-dividers--around-space"}, datasourcePluginStates.map(function (dsState) {
	                        return React.createElement(DatasourcePluginTile, {key: dsState.id, pluginId: dsState.id});
	                    })), 
	                    React.createElement("h4", {className: "slds-section-title--divider slds-m-top--medium slds-m-bottom--medium"}, "Widget Plugins (Installed)"), 
	                    React.createElement("div", {className: "slds-grid slds-grid--vertical-stretch slds-wrap slds-has-dividers--around-space"}, widgetPluginStates.map(function (dsState) {
	                        return React.createElement(WidgetPluginTile, {key: dsState.id, pluginId: dsState.id});
	                    })))
	            )
	        );
	    };
	    return PluginsModal;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        widgetPlugins: state.widgetPlugins,
	        datasourcePlugins: state.datasourcePlugins,
	        pluginRegistryApiKey: state.config.pluginRegistryApiKey,
	        pluginRegistryUrl: state.config.pluginRegistryUrl
	    };
	}, function (dispatch) {
	    return {
	        closeDialog: function () { return dispatch(Modal.closeModal()); },
	        // TODO: Render loading indicator while Plugin loads
	        // maybe build some generic solution for Ajax calls where the state can hold all information to render loading indicators / retry buttons etc...
	        loadPlugin: function (url) { return dispatch(Plugins.startLoadingPluginFromUrl(url)); },
	        setConfigValue: function (key, value) { return dispatch(Config.setConfigValue(key, value)); }
	    };
	})(PluginsModal);
	var PluginTileProps = (function () {
	    function PluginTileProps() {
	    }
	    return PluginTileProps;
	}());
	var PluginTile = (function (_super) {
	    __extends(PluginTile, _super);
	    function PluginTile(props) {
	        _super.call(this, props);
	        this.state = { actionMenuOpen: false };
	    }
	    PluginTile.prototype._copyUrl = function () {
	        var urlInput = this.refs['url'];
	        urlInput.focus();
	        urlInput.select();
	        document.execCommand('copy');
	    };
	    PluginTile.prototype.toggleActionMenu = function () {
	        this.setState({ actionMenuOpen: !this.state.actionMenuOpen });
	    };
	    PluginTile.prototype.closeActionMenu = function () {
	        this.setState({ actionMenuOpen: false });
	    };
	    PluginTile.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        var pluginState = props.pluginState;
	        var description = pluginState.typeInfo.description ? pluginState.typeInfo.description : "No Description.";
	        var url = pluginState.url ? pluginState.url : "Packaged";
	        return React.createElement("div", {className: "slds-tile slds-item slds-size--1-of-5 slds-m-around--x-small", style: { marginTop: "0.5rem" }}, 
	            React.createElement("div", {className: "slds-grid slds-grid--align-spread slds-has-flexi-truncate slds-m-bottom--x-small"}, 
	                React.createElement("h3", {className: "slds-text-heading--medium"}, pluginState.typeInfo.name), 
	                React.createElement("div", {className: "slds-shrink-none slds-dropdown-trigger slds-dropdown-trigger--click" + (this.state.actionMenuOpen ? " slds-is-open" : "")}, 
	                    React.createElement("button", {className: "slds-button slds-button--icon-border-filled slds-button--icon-x-small", "aria-haspopup": "true", onClick: function () { return _this.toggleActionMenu(); }, onBlur: function () { return setTimeout(function () { return _this.closeActionMenu(); }, 200); }}, 
	                        React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon slds-button__icon--hint"}, 
	                            React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#down"})
	                        ), 
	                        React.createElement("span", {className: "slds-assistive-text"}, "Actions")), 
	                    React.createElement("div", {className: "slds-dropdown slds-dropdown--left slds-dropdown--actions", style: { zIndex: 9003 }}, 
	                        React.createElement("ul", {className: "dropdown__list", role: "menu"}, 
	                            React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                                React.createElement("a", {href: "javascript:void(0);", role: "menuitem", tabIndex: 0, onClick: function () { return props.publishPlugin(pluginState.id); }}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default slds-m-right--x-small slds-shrink-none"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#upload"})
	                                    ), 
	                                    React.createElement("span", {className: "slds-truncate"}, "Publish"))
	                            ), 
	                            React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                                React.createElement("a", {href: "javascript:void(0);", role: "menuitem", tabIndex: 0, onClick: function () { return props.publishAndUsePlugin(pluginState.id); }}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default slds-m-right--x-small slds-shrink-none"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#upload"})
	                                    ), 
	                                    React.createElement("span", {className: "slds-truncate"}, "Publish and use"))
	                            ), 
	                            React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                                React.createElement("a", {href: "javascript:void(0);", role: "menuitem", tabIndex: 0, onClick: function () { return props.removePlugin(pluginState.id); }}, 
	                                    React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default slds-m-right--x-small slds-shrink-none"}, 
	                                        React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#delete"})
	                                    ), 
	                                    React.createElement("span", {className: "slds-truncate"}, "Remove"))
	                            ))
	                    ))), 
	            React.createElement("div", {className: "slds-tile__detail slds-is-relative"}, 
	                pluginState.isLoading ?
	                    React.createElement("div", {className: "slds-spinner_container"}, 
	                        React.createElement("div", {className: "slds-spinner slds-spinner--small", role: "alert"}, 
	                            React.createElement("span", {className: "slds-assistive-text"}, "Loading"), 
	                            React.createElement("div", {className: "slds-spinner__dot-a"}), 
	                            React.createElement("div", {className: "slds-spinner__dot-b"}))
	                    )
	                    : null, 
	                React.createElement("dl", {className: "slds-dl--horizontal"}, 
	                    React.createElement("dt", {className: "slds-dl--horizontal__label"}, 
	                        React.createElement("p", {className: "slds-truncate", title: "Type"}, "Type:")
	                    ), 
	                    React.createElement("dd", {className: "slds-dl--horizontal__detail slds-tile__meta"}, 
	                        React.createElement("p", {className: "slds-truncate", title: pluginState.typeInfo.type}, pluginState.typeInfo.type)
	                    ), 
	                    React.createElement("dt", {className: "slds-dl--horizontal__label"}, 
	                        React.createElement("p", {className: "slds-truncate", title: "Version"}, "Version:")
	                    ), 
	                    React.createElement("dd", {className: "slds-dl--horizontal__detail slds-tile__meta"}, 
	                        React.createElement("p", {className: "slds-truncate", title: pluginState.typeInfo.version}, pluginState.typeInfo.version)
	                    ), 
	                    React.createElement("dt", {className: "slds-dl--horizontal__label"}, 
	                        React.createElement("p", {className: "slds-truncate", title: "Author"}, "Author:")
	                    ), 
	                    React.createElement("dd", {className: "slds-dl--horizontal__detail slds-tile__meta"}, 
	                        React.createElement("p", {className: "slds-truncate", title: pluginState.typeInfo.author}, pluginState.typeInfo.author)
	                    ), 
	                    React.createElement("dt", {className: "slds-dl--horizontal__label"}, 
	                        React.createElement("p", {className: "slds-truncate", title: "Type"}, "Url:")
	                    ), 
	                    React.createElement("dd", {className: "slds-dl--horizontal__detail slds-tile__meta"}, 
	                        React.createElement("div", {className: "slds-form-element__control slds-input-has-icon slds-input-has-icon--left", title: url}, 
	                            React.createElement("svg", {"aria-hidden": "true", className: "slds-input__icon slds-icon-text-default", onClick: function () { return _this._copyUrl(); }}, 
	                                React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#copy"})
	                            ), 
	                            React.createElement("input", {className: "slds-input", type: "text", ref: "url", readOnly: true, style: { width: "100%", paddingRight: 0 }, placeholder: "Plugin Url ...", value: url}))
	                    )), 
	                React.createElement("p", {className: "slds-m-top--x-small"}, description)));
	    };
	    return PluginTile;
	}(React.Component));
	var WidgetPluginTile = react_redux_1.connect(function (state, ownProps) {
	    return {
	        pluginState: state.widgetPlugins[ownProps.pluginId]
	    };
	}, function (dispatch) {
	    return {
	        removePlugin: function (type) { return dispatch(WidgetsPlugins.unloadPlugin(type)); },
	        publishPlugin: function (type) { return dispatch(Plugins.publishPlugin(type, false)); },
	        publishAndUsePlugin: function (type) { return dispatch(Plugins.publishPlugin(type, true)); }
	    };
	})(PluginTile);
	var DatasourcePluginTile = react_redux_1.connect(function (state, ownProps) {
	    return {
	        pluginState: state.datasourcePlugins[ownProps.pluginId]
	    };
	}, function (dispatch) {
	    return {
	        removePlugin: function (type) { return dispatch(DatasourcePlugins.unloadPlugin(type)); },
	        publishPlugin: function (type) { return dispatch(Plugins.publishPlugin(type, false)); },
	        publishAndUsePlugin: function (type) { return dispatch(Plugins.publishPlugin(type, true)); }
	    };
	})(PluginTile);
	var LookupMenu = (function (_super) {
	    __extends(LookupMenu, _super);
	    function LookupMenu(props) {
	        _super.call(this, props);
	        this.state = {
	            searchResult: []
	        };
	    }
	    LookupMenu.prototype.componentWillReceiveProps = function (nextProps) {
	        var _this = this;
	        if (!nextProps.searchString) {
	            this.setState({
	                searchResult: []
	            });
	            return;
	        }
	        fetch(nextProps.pluginRegistryUrl + "/api/plugins/?q=" + nextProps.searchString)
	            .then(function (result) {
	            return result.json();
	        })
	            .then(function (json) {
	            _this.setState({
	                searchResult: json.plugins || []
	            });
	        });
	    };
	    LookupMenu.prototype.render = function () {
	        var _this = this;
	        var props = this.props;
	        /*Icons for Widget = dashboard, report, poll / Datasource = feed */
	        return React.createElement("div", {className: "slds-lookup__menu", id: props.id}, 
	            React.createElement("ul", {className: "slds-lookup__list", role: "presentation"}, 
	                React.createElement("li", {role: "presentation"}, 
	                    React.createElement("span", {className: "slds-lookup__item-action slds-lookup__item-action--label", id: props.id + "-header", role: "option"}, 
	                        React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon--x-small slds-icon-text-default"}, 
	                            React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#search"})
	                        ), 
	                        React.createElement("span", {className: "slds-truncate"}, 
	                            "\"", 
	                            props.searchString, 
	                            "\" in plugin registry"))
	                ), 
	                this.state.searchResult.map(function (item, i) {
	                    return React.createElement("li", {role: "presentation", key: item.type, onClick: function (e) { return _this.props.onItemClicked(item); }}, 
	                        React.createElement("span", {className: "slds-lookup__item-action slds-media slds-media--center", id: props.id + "-" + i, role: "option"}, 
	                            React.createElement("svg", {"aria-hidden": "true", className: "slds-icon slds-icon-standard-account slds-icon--small slds-media__figure"}, 
	                                React.createElement("use", {xlinkHref: "assets/icons/standard-sprite/svg/symbols.svg#dashboard"})
	                            ), 
	                            React.createElement("div", {className: "slds-media__body"}, 
	                                React.createElement("div", {className: "slds-lookup__result-text"}, 
	                                    React.createElement("mark", null, item.name), 
	                                    " (", 
	                                    item.type, 
	                                    ")"), 
	                                React.createElement("span", {className: "slds-lookup__result-meta slds-text-body--small"}, 
	                                    "DS/Widget • by ", 
	                                    item.author, 
	                                    " • ", 
	                                    item.description)))
	                    );
	                }))
	        );
	    };
	    return LookupMenu;
	}(React.Component));
	var PluginRegistrySettings = (function (_super) {
	    __extends(PluginRegistrySettings, _super);
	    function PluginRegistrySettings(props) {
	        _super.call(this, props);
	        this.state = { actionMenuOpen: false };
	    }
	    PluginRegistrySettings.prototype.toggleActionMenu = function () {
	        this.clearTimeout();
	        this.setState({ actionMenuOpen: !this.state.actionMenuOpen });
	    };
	    PluginRegistrySettings.prototype.closeActionMenu = function () {
	        this.clearTimeout();
	        this.setState({ actionMenuOpen: false });
	    };
	    PluginRegistrySettings.prototype.closeActionMenuIn = function (ms) {
	        var _this = this;
	        this.clearTimeout();
	        this.timeout = setTimeout(function () { return _this.closeActionMenu(); }, ms);
	    };
	    PluginRegistrySettings.prototype.clearTimeout = function () {
	        if (this.timeout) {
	            clearTimeout(this.timeout);
	        }
	    };
	    PluginRegistrySettings.prototype.onRegistryUrlChanged = function (e) {
	        var target = e.target;
	        this.props.onRegistryUrlChanged(target.value);
	    };
	    PluginRegistrySettings.prototype.onApiKeyChanged = function (e) {
	        var target = e.target;
	        this.props.onApiKeyChanged(target.value);
	    };
	    PluginRegistrySettings.prototype.render = function () {
	        var _this = this;
	        return React.createElement("div", {className: "slds-shrink-none slds-dropdown-trigger slds-dropdown-trigger--click" + (this.state.actionMenuOpen ? " slds-is-open" : "")}, 
	            React.createElement("button", {className: "slds-button slds-button--icon-border-filled slds-button--icon-x-small", "aria-haspopup": "true", onClick: function () { return _this.toggleActionMenu(); }, onBlur: function () { return _this.closeActionMenuIn(200); }}, 
	                React.createElement("svg", {"aria-hidden": "true", className: "slds-button__icon slds-button__icon--hint"}, 
	                    React.createElement("use", {xlinkHref: "assets/icons/utility-sprite/svg/symbols.svg#settings"})
	                ), 
	                React.createElement("span", {className: "slds-assistive-text"}, "Actions")), 
	            React.createElement("div", {className: "slds-dropdown slds-dropdown--left slds-dropdown--large"}, 
	                React.createElement("ul", {className: "dropdown__list", role: "menu"}, 
	                    React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                        React.createElement("span", {className: "slds-truncate slds-m-around--x-small"}, "Registry Url")
	                    ), 
	                    React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                        React.createElement("div", {className: "slds-form-element__control"}, 
	                            React.createElement("input", {className: "slds-input", type: "text", placeholder: "http://dashboard.lobaro.com", defaultValue: this.props.pluginRegistryUrl, onFocus: function () { return _this.clearTimeout(); }, onBlur: function () { return _this.closeActionMenuIn(200); }, onChange: function (e) { return _this.onRegistryUrlChanged(e); }})
	                        )
	                    ), 
	                    React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                        React.createElement("span", {className: "slds-truncate slds-m-around--x-small"}, "Api Key")
	                    ), 
	                    React.createElement("li", {className: "slds-dropdown__item", role: "presentation"}, 
	                        React.createElement("div", {className: "slds-form-element__control"}, 
	                            React.createElement("input", {className: "slds-input", type: "text", placeholder: "Api Key", defaultValue: this.props.pluginRegistryApiKey, onFocus: function () { return _this.clearTimeout(); }, onBlur: function () { return _this.closeActionMenuIn(200); }, onChange: function (e) { return _this.onApiKeyChanged(e); }})
	                        )
	                    ))
	            ));
	    };
	    return PluginRegistrySettings;
	}(React.Component));


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	var _ = __webpack_require__(19);
	var Action = __webpack_require__(42);
	var buildInfo = __webpack_require__(103);
	/**
	 * Override config values at runtime in dashboard.json, see: https://gitlab.com/lobaro/iot-dashboard/wikis/home#configuration
	 */
	var defaultConfig = {
	    version: "",
	    revision: "",
	    revisionShort: "",
	    branch: "",
	    persistenceTarget: "local-storage",
	    devMode: true,
	    auth: {
	        username: null,
	        logoutUrl: null
	    },
	    title: {
	        text: "IoT-Dashboard",
	        url: "http://iot-dashboard.org"
	    },
	    pluginRegistryApiKey: "",
	    pluginRegistryUrl: "https://dashboard.lobaro.com"
	};
	function setConfigValue(key, value) {
	    return {
	        type: Action.SET_CONFIG_VALUE,
	        key: key,
	        value: value
	    };
	}
	exports.setConfigValue = setConfigValue;
	function config(state, action) {
	    if (state === void 0) { state = buildInfo; }
	    switch (action.type) {
	        case Action.SET_CONFIG_VALUE: {
	            var value = action.value;
	            if (action.key === 'pluginRegistryUrl' && _.endsWith(value, '/')) {
	                value = value.replace(/\/+$/, "");
	            }
	            return _.assign({}, defaultConfig, state, (_a = {}, _a[action.key] = value, _a), buildInfo);
	        }
	        default:
	            // Content of configJson overrides everything else!
	            return _.assign({}, defaultConfig, state, buildInfo);
	    }
	    var _a;
	}
	exports.config = config;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = config;


/***/ },
/* 103 */
/***/ function(module, exports) {

	module.exports = {
		"version": "0.2.6",
		"revision": "9f2ce7cbb0169a71fd8ef99ea0ed2ee69e1afeb6",
		"revisionShort": "9f2ce7c",
		"branch": "Detatched: 9f2ce7cbb0169a71fd8ef99ea0ed2ee69e1afeb6"
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var _ = __webpack_require__(19);
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

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(18);
	var react_redux_1 = __webpack_require__(38);
	var _ = __webpack_require__(19);
	var dashboard_1 = __webpack_require__(51);
	var DatasourceFrames = (function (_super) {
	    __extends(DatasourceFrames, _super);
	    function DatasourceFrames() {
	        _super.apply(this, arguments);
	    }
	    DatasourceFrames.prototype.render = function () {
	        var _this = this;
	        return React.createElement("div", {style: { width: 1, height: 1, position: "fixed", left: 0, top: 0 }}, _.valuesIn(this.props.datasources).map(function (dsState) {
	            var pluginLoaded = dashboard_1.default.getInstance().datasourcePluginRegistry.hasPlugin(dsState.type);
	            var datasourcePluginState = _this.props.datasourcePlugins[dsState.type];
	            return pluginLoaded
	                ? React.createElement(DatasourceIFrame, {key: dsState.id, datasourcePluginState: datasourcePluginState, datasourceState: dsState})
	                : React.createElement("div", {key: dsState.id}, "Datasource Loading ...");
	        }));
	    };
	    return DatasourceFrames;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = react_redux_1.connect(function (state) {
	    return {
	        datasources: state.datasources,
	        datasourcePlugins: state.datasourcePlugins
	    };
	}, function (dispatch) {
	    return {};
	})(DatasourceFrames);
	var DatasourceIFrame = (function (_super) {
	    __extends(DatasourceIFrame, _super);
	    function DatasourceIFrame(props) {
	        _super.call(this, props);
	    }
	    DatasourceIFrame.prototype.componentDidMount = function () {
	        var element = this.refs['frame'];
	        // TODO: UI is loaded before the datasource is loaded to the registry, this throws then ...
	        var dsFactory = dashboard_1.default.getInstance().datasourcePluginRegistry.getPlugin(this.props.datasourceState.type);
	        var dsInstance = dsFactory.getInstance(this.props.datasourceState.id);
	        dsInstance.iFrame = element;
	    };
	    // allow-popups allow-same-origin allow-modals allow-forms
	    // A sandbox that includes both the allow-same-origin and allow-scripts flags,
	    // then the framed page can reach up into the parent, and remove the sandbox attribute entirely.
	    // Only if the framed content comes from the same origin of course.
	    DatasourceIFrame.prototype.render = function () {
	        return React.createElement("iframe", {id: 'frame-' + this.props.datasourceState.id, ref: "frame", src: "datasource.html#" + this.props.datasourcePluginState.url, frameBorder: "0", width: "100%", height: "100%", scrolling: "no", sandbox: "allow-scripts"}, "Browser does not support iFrames.");
	    };
	    ;
	    return DatasourceIFrame;
	}(React.Component));


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this
	 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
	"use strict";
	var Redux = __webpack_require__(39);
	var redux_thunk_1 = __webpack_require__(107);
	var createLogger = __webpack_require__(108);
	var Widgets = __webpack_require__(44);
	var WidgetConfig = __webpack_require__(48);
	var Layouts = __webpack_require__(87);
	var Datasource = __webpack_require__(55);
	var DatasourceData = __webpack_require__(57);
	var Global = __webpack_require__(41);
	var Import = __webpack_require__(96);
	var Modal = __webpack_require__(49);
	var Persist = __webpack_require__(104);
	var Plugins = __webpack_require__(59);
	var redux_form_1 = __webpack_require__(92);
	var Action = __webpack_require__(42);
	var WidgetPlugins = __webpack_require__(61);
	var DatasourcePlugins = __webpack_require__(60);
	var Config = __webpack_require__(102);
	// TODO: name all reducers ***Reducer
	var appReducer = Redux.combineReducers({
	    config: Config.config,
	    currentLayout: Layouts.currentLayout,
	    datasourceData: DatasourceData.datasourceData,
	    datasourcePlugins: DatasourcePlugins.datasourcePlugins,
	    datasources: Datasource.datasources,
	    form: redux_form_1.reducer,
	    global: Global.global,
	    layouts: Layouts.layouts,
	    modalDialog: Modal.modalDialog,
	    pluginLoader: Plugins.pluginLoaderReducer,
	    widgetConfig: WidgetConfig.widgetConfigDialog,
	    widgetPlugins: WidgetPlugins.widgetPlugins,
	    widgets: Widgets.widgets
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
	        datasourceData: {},
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


/***/ }
]);
//# sourceMappingURL=app.bundle.js.map