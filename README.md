# Pattern Lab Node - Gulp Edition

Visit current master at [Sparkle-Thunder](http://sparkle-thunder.internal.superpedestrian.com).

The Gulp wrapper around [Pattern Lab Node Core](https://github.com/pattern-lab/patternlab-node) providing tasks to interact with the core library and move supporting frontend assets.

## Packaged Components

The Gulp Edition comes with the following components:

* `patternlab-node`: [GitHub](https://github.com/pattern-lab/patternlab-node), [npm](https://www.npmjs.com/package/patternlab-node)
* `patternengine-node-mustache`: [GitHub](https://github.com/pattern-lab/patternengine-node-mustache), [npm](https://www.npmjs.com/package/patternengine-node-mustache)
* `pattern-lab/styleguidekit-assets-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-assets-default)
* `pattern-lab/styleguidekit-mustache-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-mustache-default)

## Prerequisites

The Pattern Lab Node - Gulp Edition uses [Node](https://nodejs.org) for core processing, [npm](https://www.npmjs.com/) to manage project dependencies, and [gulp.js](http://gulpjs.com/) to run tasks and interface with the core library. Node version 4 through 6 appears to work. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include npm.

You will also need to install bower for the bootstrap components.
```
npm install -g bower
```


It's also highly recommended that you [install gulp](hhttps://github.com/gulpjs/gulp/blob/4.0/docs/getting-started.md) globally.

> Note: The Gulp Edition of Pattern Lab uses Gulp 4, which may require a new global install of the Gulp command line interface. Follow the [gulp upgrade instructions](https://github.com/pattern-lab/edition-node-gulp/wiki/Updating-to-Gulp-4) if you already have gulp installed and need to upgrade. Gulp 4 is in alpha, but brings many benefits to the table and is relatively stable. You can alternatively [run with local gulp instead of global gulp](https://github.com/pattern-lab/patternlab-node/wiki/Running-with-Local-Gulp-Instead-of-Global-Gulp), but commands are a bit more verbose. The rest of this documentation assumes a global install.

## Installing

There are two methods for downloading and installing the Gulp Edition:

* [Download a pre-built package](#download-a-pre-built-package)
* [Use npm](#use-npm)

### Download a pre-built package

The fastest way to get started with the Gulp Edition is to [download the pre-built version](https://github.com/pattern-lab/edition-node-gulp/releases) from the [releases page](https://github.com/pattern-lab/edition-node-gulp/releases). The pre-built project comes with the [Base Starterkit for Mustache](https://github.com/pattern-lab/starterkit-mustache-base) installed by default.

**Please note:** Pattern Lab Node uses [npm](https://www.npmjs.com/) to manage project dependencies. To upgrade the Gulp Edition or to install plug-ins you'll need to be familiar with npm.

### Use npm

`npm` is a dependency management and package system which can pull in all of the Gulp Edition's dependencies for you. To accomplish this:

* download or `git clone` this repository to an install location.

* run the following

    ```
    cd install/location
    npm install
    bower install
    ```

Running `npm install` from a directory containing a `package.json` file will download all dependencies defined within.

#### Install the Gulp Edition of Pattern Lab Node as a Dependency

Most people want to run Pattern Lab Node standalone and not as a dependency. If you wish to install as a dependency you can do the following:

Use npm's [`install` command](https://docs.npmjs.com/cli/install) with an argument to install the Gulp Edition into a location of your choosing. In Terminal type:

    cd install/location/
    npm install edition-node-gulp

This will install the Gulp Edition into a directory called `node_modules` in `install/location/`.

## Getting Started

The Pattern Lab Node - Gulp Edition ships with a [base experience](https://github.com/pattern-lab/starterkit-mustache-base) which serves as clean place to start from scratch with Pattern Lab. But if you want to get rolling with a starterkit of your own, or use the [demo starterkit](https://github.com/pattern-lab/starterkit-mustache-demo) like the one on [demo.patternlab.io](http://demo.patternlab.io), you can do so automatically at time of `npm install` by adding your starterkit to the `package.json` file.

You can also [work with starterkits using the command line](https://github.com/pattern-lab/patternlab-node/wiki/Importing-Starterkits).

## Updating Pattern Lab

To update Pattern Lab please refer to each component's GitHub repository, and the [master instructions for core](https://github.com/pattern-lab/patternlab-node/wiki/Upgrading). The components are listed at the top of the README.

## Helpful Commands

These are some helpful commands you can use on the command line for working with Pattern Lab.

> Reminder: These commands assume a global installation of gulp 4.X, instead of a local installation. Depending on your preference, you may need to [upgrade your global version of gulp](https://github.com/pattern-lab/edition-node-gulp/wiki/Updating-to-Gulp-4) or [run with local gulp](https://github.com/pattern-lab/patternlab-node/wiki/Running-with-Local-Gulp-Instead-of-Global-Gulp).

### List all of the available commands

To list all available commands type:

    gulp patternlab:help

### Generate Pattern Lab

To generate the front-end for Pattern Lab type:

    gulp patternlab:build

### Watch for changes and re-generate Pattern Lab

To watch for changes, re-generate the front-end, and server it via a BrowserSync server,  type:

    gulp patternlab:serve

BrowserSync should open [http://localhost:3000](http://localhost:3000) in your browser.

### Install a StarterKit

To install a specific StarterKit from GitHub type:

    npm install [starterkit-vendor/starterkit-name]

    gulp patternlab:loadstarterkit --kit=[starterkit-name]

### Problems building PatternLab / How to Fix

As of October 2018, we all got a similar error when running `gulp patternlab:serve`. If you get the following error:

```
====[ Pattern Lab / Node - v2.12.0 ]====

[13:01:03] Using gulpfile ~/sp-design-pattern-library/gulpfile.js
/usr/local/lib/node_modules/gulp/bin/gulp.js:129
    gulpInst.start.apply(gulpInst, toRun);

TypeError: Cannot read property 'apply' of undefined
at /usr/local/lib/node_modules/gulp/bin/gulp.js:129:19
at nextTickCallbackWith0Args (node.js:452:9)
at process._tickCallback (node.js:381:13)
at Function.Module.runMain (module.js:431:11)
at startup (node.js:139:18)
at node.js:999:3
```

Fix it as follows:

1) `nvm use 9`

2) `npm install gulpjs/gulp-cli -g`

3) Delete your `node_modules` folder and run `npm install`