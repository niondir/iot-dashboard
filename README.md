**Master:**  [![Build Status](https://travis-ci.org/Niondir/iot-dashboard.svg?branch=master)](https://travis-ci.org/Niondir/iot-dashboard) [![codecov](https://codecov.io/gh/Niondir/iot-dashboard/branch/master/graph/badge.svg)](https://codecov.io/gh/Niondir/iot-dashboard) [![Dependencies](https://david-dm.org/niondir/iot-dashboard.svg)](https://david-dm.org/niondir/iot-dashboard)  [![Dev-Dependencies](https://david-dm.org/niondir/iot-dashboard/dev-status.svg)](https://david-dm.org/niondir/iot-dashboard#info=devDependencies)

**Dev:** [![Build Status](https://travis-ci.org/Niondir/iot-dashboard.svg?branch=dev)](https://travis-ci.org/Niondir/iot-dashboard)

# Individual Open Technology - Dashboard

[![Join the chat at https://gitter.im/Niondir/iot-dashboard](https://badges.gitter.im/Niondir/iot-dashboard.svg)](https://gitter.im/Niondir/iot-dashboard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
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

Online:

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

Prerequisite: Download & install [NodeJs](https://nodejs.org)

### Install from npm ###

Install the Dashboard

    npm install -g iot-dashboard

Start the dashboard server

    iot-dashboard

Open your browser at http://localhost:8081

### Run the Dashboard locally from source ###

    npm install
    npm run compile
    npm start

* Dashboard: http://localhost:8081/
* Tests: http://localhost:8081/tests.html
* Testcoverage: http://localhost:8081/coverage/

### Development ###

To keep everything simple all important tasks are based on scripts in package.json. Use `npm run <script-name>` to run any of them.

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

## Documentation ##

Check out the [Documentation](https://github.com/Niondir/iot-dashboard/blob/master/docs/index.md) in `/docs`

## License ##
The code is available under [Mozilla Public License 2.0](https://www.mozilla.org/en-US/MPL/) (MPL 2.0)
For more information you might want to read the [FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).

Contributors have to add a [License Header](https://www.mozilla.org/en-US/MPL/headers/) to new sourcecode files.

This means you can use and modify the code for private propose (personal or inside your organisation)
Outside of your Organisation you must make modified MPLed code available to your users and comply with all other requirements of the MPL 2.0.

If you need some of the code available under another license, do not hesitate to **contact me**.
