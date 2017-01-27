# ACT.JS

<img src="https://s.yimg.com/dh/ap/actjs/imgs/90x71.png">

ACT.js - Advertising Creative Technology library.

## About ACT.js 
ACT.js is an ad development framework created for and by Ad Creative Technology to build display ads. Could we still create ads without ACT.js? Sure, but development would take longer and be more complex. It would be like building something from scratch over and over again without automation or tools. Imagine if every car in the country was custom built one at a time. To name a few challenges - we wouldn't have as many cars on the road, cars would cost more, and it would be difficult to establish standards for essentials, like safety.

Prior to ACT.js there were 2 main parallel paths for core ad development based on:
 * templates and configuration-based creation
 * core libraries and fundamental javascript expertise

When the development teams from the regions came together to form a global dev community, ACT.js naturally emerged. While there is no perfect solution for all scenarios and ads, ACT.js is the closest we've come to offering both flexibility, standardization, and extensibility, and it will continue to evolve and advance.

## Primary User Base
We touched upon who the primary users are in our last newsletter. We want to emphasize that ACT.js is for the global ad development community with intermediate to expert level javascript coding experience and knowledge.

 * Intermediate: often starts from a template and relies on configuration based development for repeatable executions
 * Advanced/Expert : near "from scratch" development writes code using a mix of her own code and libraries for a highly, custom single execution


## ACT.js Architecture and Flow

ACT.js offers 2 flows or paths - there is a standard or custom path that a developer can choose to take when creating an ad or template. When a developer takes a custom path, the approach closely resembles a traditional development approach, in which she writes code using a mix of her own self-written code and libraries to aid common functions and features.

One of the benefits of ACT.js is it is modular. Each component can work standalone or in concert with others to form a system. There is loose coupling among modules, and ACT.js offers an API that writes to a single configuration file that can hold all the information needed for a template.

There are two main groups of modules:
 * Core or common to include logic like device detection and cookies
 * Capabilities to include videos, buttons, carousels, and other components

"Standard Flow" occurs as follows:
 * Template html file starts flow by creating an instance of the framework and passes all the template settings in the configuration object and custom code
 * Core modules check for the browser HTML support and device detection, the default execution order is mobiles, tablet, html5 and finally, if those environments are not supported it falls to backup.
 * Safeframe communication begins and ad is registered.
 * Custom code is executed, if any
 * Render content begins with the main containers of templates, called layers. Layers help to accommodate content to different technologies like SafeFrame or positions. For instances of a simple 300x250 ad there will be one inline layer. An expandable would have an inline and an overlay layer for the floating unit.
 * Layers will gather their content from the content capabilities
 * Modules and capabilities make their actions available
 * Finally, the ad will play by triggering the actions for first play or capped events.
	
## HTML5 Capability

HTML5 ads themselves can have many components, such as HTML, Javascript, and CSS. When interactions like animations occur in an ad they can potentially disrupt a whole site's page, especially when the ad isn't contained and protected from the rest of the page's code. Since there's not a built-in container for HTML5 ads, we needed to create one. By developing a sandbox, much like the SafeFrame standard and our in-house third party capability, we created the HTML5 capability for ACT.js, a sandbox, which isolates and compartmentalizes an ad's code. The HTML5 capability prevents an ad from inflicting a poor user experience and malicious behavior, while offering memory clean-up and graceful exits from functions - it gives us both security and performance.  


## Setup

```
npm install
```

## Unit Test and code coverage

Tests are written using Mocha & Chai and are located in `test` folder. Tests can be run through `index.html` file or using phantomjs and/or Grunt.

When you run the tests, it also generates reporting with Istanbul for test coverage. You can check the results opening `artifacts/coverage/lcov-report/index.html` in your browser.

Functional test are written in Chai, they are located in the `test/integration` folder.

```
grunt test
```

## Documentation

 * [ACT.js Documentation](https://yahoo.github.io/ACT/docs/)
 * [ACT.js Enabler Documentation](https://yahoo.github.io/ACT/enabler/)

The code documentation is generated every time we run `grunt deploy`. All files can be found under `./docs`.

You can also generate the docs by simply running:

```
$ grunt docs
```

License
-------

Code licensed under the New BSD License.
See the [LICENSE file](LICENSE.md) for license text and copyright information.

Third-party references
-------

* Code found in [ACT_json.js](src/library/ACT_json.js) uses Public Domain code by Douglas Crockford from https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
* Code found in parts of [ACT_event.js](src/library/ACT_event.js) uses code from JQuery under the MIT license https://github.com/jquery/jquery
