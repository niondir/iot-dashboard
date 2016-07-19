**Master:**  [![Build Status](https://travis-ci.org/Niondir/iot-dashboard.svg?branch=master)](https://travis-ci.org/Niondir/iot-dashboard) [![codecov](https://codecov.io/gh/Niondir/iot-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Niondir/iot-dashboard) [![Dependencies](https://david-dm.org/niondir/iot-dashboard.svg)](https://david-dm.org/niondir/iot-dashboard)  [![Dev-Dependencies](https://david-dm.org/niondir/iot-dashboard/dev-status.svg)](https://david-dm.org/niondir/iot-dashboard#info=devDependencies)

**Dev:** [![Build Status](https://travis-ci.org/Niondir/iot-dashboard.svg?branch=dev)](https://travis-ci.org/Niondir/iot-dashboard)

# Individual Open Technology - Dashboard
Free Dashboard for your Data

A generic dashboard application based on JavaScript, HTML and CSS that runs in modern browsers.
Allows to arrange and configure widgets to display data from any datasource.
A Plugin API that allows easy widget and datasource development to keep the dashboard as extensible as possible.

Can be used as free alternative to [geckoboard](https://www.geckoboard.com), [kibana](https://www.elastic.co/products/kibana), or [freeboard](https://freeboard.io/).
And of course for all other IoT, M2M, Industry 4.0, BigData, whatever dashboards you have to pay for out there.

---

**Not Done Yet**
This Project is still in Development and can not be used for production. Subscribe to get updates.

The **latest stable version** is on the `master` branch.
The **latest development snapshot** is on the `dev` branch.

## Demo ##

* [Live Demo Stable](http://demo.iot-dashboard.org/) of the `master` branch.
* [Live Demo Dev](http://demo.iot-dashboard.org/branch/dev/) of the `dev` branch.

## Motivation ##
Why just another Dashboard?

I was looking for a Dashboard with the following properties:

- OpenSource, royalty free, with code that I can understand and extend for full customization
- Easy to setup, maintain and extend - even for unusual datasources and widgets
- A Reasonable set of default widgets, to be used out of the box
- Simple API and development setup to write custom widgets and datasources, as a solid base for community driven development and extensions
- Running locally/offline without the need of any server, keeping the server optional until I really need one
- Having a community that extends the Dashboard for their own needs

If you find something that comes close to the above requirements, please let me know!

## Setup ##

We have just a development setup yet, since there is no need for more :)
to keep everything simple all the important tasks are based on scripts in package.json. Use `npm run <script-name>` to run any of them.

### Run the Dashboard locally from source ###

Prerequisite: Download & install [NodeJs](https://nodejs.org)

    npm install
    npm run compile
    npm start

* Dashboard: http://localhost:8081/
* Tests: http://localhost:8081/tests.html
* Testcoverage: http://localhost:8081/coverage/

### Development ###

For preparation run

    npm install

Run the Webpack Server with live-reload and hot module replacement

    npm run dev

Open your browser at: `http://localhost:8080` and for developing tests: `http://localhost:8080/webpack-dev-server/tests.html`

Run a second watch task to keep some other files up to date (optional)
See `gulpfile.js` -> `watch` task for details.

    npm run watch

To make sure all you changes will survive the CI build

    npm run build

To just run the tests (not enough to survive the CI build!)

    npm test

Find the coverage report in `dist/coverage` or while the server is running at `http://localhost:8080/coverage/`

#### Webpack Analysis ####

Useful to check problems in the Webpack build.

- Execute: `webpack --profile --json > stats.json`
- Goto: https://webpack.github.io/analyse/
- Load the generated stats.json

## License ##
I have not applied any OpenSource license yet.
In case you want to use or modify the code or parts of it outside of GitHub, **you have to ask for permissions**.
Feel free to fork or modify the code on GitHub or distribute it in any non-commercial way. Contributions are very welcome.

The code will most likely be available under [MPL](https://www.mozilla.org/en-US/MPL/) in future.

## Documentation ##

Check out the [Documentation](https://github.com/Niondir/iot-dashboard/blob/master/docs/index.md) in `/docs`

