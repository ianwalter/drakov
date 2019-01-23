# @ianwalter/drakov
> Mock server that implements the [API Blueprint][apibUrl] specification

[![npm page][npmImage]][npmUrl]

## About

This is a fork of [Aconex/drakov][drakovUrl] with the goal of being actively
maintained and focusing on making debugging easier.

## Installation

Local:

```console
yarn add drakov
```

Global:

```console
yarn global add drakov
```


## MSON Support via Attribute elements

Since version 0.1.12 MSON support is now provided.


## Logging to assist with debugging request matching

Drakov provide some logging in the following situations:

 - When request's path does not match any documented endpoints
 - When request's headers does not match headers schema
 - When request's body does not match body schema (corresponding to request's content-type)

## Installation instructions

`npm install -g drakov`


## Running

`drakov -f <glob expression to your md files> -p <server port>`


**Argument Notes:**

- Glob expression is required
- Server port is optional and defaults to **3000**
- CORS headers are sent by default, you need to use the --disableCORS switch/property


## Running with configuration file

`drakov --config config.js`

**Important**

This mode of operation will load your configuration from a Javascript file that must export an object of arguments as
supported in the [arguments module](https://github.com/Aconex/drakov/blob/master/lib/arguments/arguments.js).

All command line arguments aside from `--config` will be ignored, and the defaults will be merged in.

## Running with .drakovrc configuration file

`drakov`

Similar to utilities such as JSHint, drakov will look for a `.drakovrc` file in the current path where `drakov` is executed
and walk up the path until `/` is reached.

The `.drakovrc` file should be a valid Node.js module that exports a valid Drakov configuration object such as would be
used with the `--config` switch.


## API discovery

`drakov -f <glob expression to your md files> --discover`

Enables the `/drakov` endpoint, which lists all the available endpoints currently being served by Drakov


## Examples with command line arguments

With only a glob expression

`drakov -f "../com/foo/contracts/*.md"`

With glob expression and specified server port

`drakov -f "../com/foo/contracts/*.md" -p 4007`

Running drakov privately (running on localhost only)

`drakov -f "../com/foo/contracts/*.md" --private`

## Reload Drakov when loaded specification files change

You can tell Drakov to watch for changes in the spec files that are loaded. When changes are detected, Drakov will reload.

`drakov -f "../com/foo/contracts/*.md" --watch`

## CORS Header

By default a CORS header is sent, you can disable it with the --disableCORS switch.

`drakov -f "../com/foo/contracts/*.md" --disableCORS`

## Automatic response to OPTIONS requests

When you run server for testing API on different port than your app it's handy to allow cross origin resource sharing (CORS).
For this to work you need also to listen on every route for OPTIONS requests.

`drakov -f "../com/foo/contracts/*.md" --autoOptions`

## SSL Support

To enable SSL you must provide both key and certificate. Use parameters --sslKeyFile and --sslCrtFile to specify the path to your key and certificate files.
Once SSL is enabled Drakov will only respond to HTTPS requests.

`drakov -f "../com/foo/contracts/*.md" --sslKeyFile="./ssl/server.key" --sslCrtFile="./ssl/server.crt"`

## Response Delay

In some case you may want to force Drakov to delay sending a response. To do this simple use the `--delay` argument followed by a number (ms).

`drakov -f "../com/foo/contracts/*.md" --delay 2000`

## Allow Methods Header

For HTTP methods such as DELETE, you may want Drakov to return them in the appropriate methods allow header. You can do this using the `--method` argument

`drakov -f "../com/foo/contracts/*.md" --method DELETE`

`drakov -f "../com/foo/contracts/*.md" --method DELETE --method OPTIONS`

## Allow Headers Header

For HTTP headers such as Authorization, you may want Drakov to return them in the appropriate methods allow header. You can do this using the `--header` argument

`drakov -f "../com/foo/contracts/*.md" --header Authorization`

`drakov -f "../com/foo/contracts/*.md" --header Authorization --header X-Csrf-Token`

Drakov includes many headers by default: `Origin, X-Requested-With, Content-Type, Accept` when CORS is enabled.

## Ignore Headers

In cases where strict HTTP headers matching against API blueprints is not necessary, you can use the `--ignoreHeader` argument:

`drakov -f "../com/foo/contracts/*.md" --ignoreHeader Cookie --ignoreHeader Authorization`

## Using as a Node.js module

    var drakov = require('drakov');

    var argv = {
        sourceFiles: 'path/to/files/**.md',
        serverPort: 3000,
        disableCORS: true,
        sslKeyFile: '/path/to/ssl/key.key',
        sslCrtFile: '/path/to/ssl/cert.crt',
        delay: 2000,
        method: ['DELETE','OPTIONS']
    };

    drakov.run(argv, function(){
        // started Drakov
        drakov.stop(function() {
            // stopped Drakov
        });
    });


## Using as an Express middleware

Due to protagonist parsing being async, we need to setup the middleware with an init function

    var drakovMiddleware = require('drakov').middleware;

    var argv = {
        sourceFiles: 'path/to/files/**.md',
        serverPort: 3000,
        disableCORS: true,
        sslKeyFile: '/path/to/ssl/key.key',
        sslCrtFile: '/path/to/ssl/cert.crt',
        delay: 2000,
        method: ['DELETE','OPTIONS']
    };

    var app = express();
    drakovMiddleware.init(app, argv, function(err, middlewareFunction) {
        if (err) {
            throw err;
        }
        app.use(middlewareFunction);
        app.listen(argv.serverPort);
    });

## FAQ

**Q:** If I have multiple requests/responses on the same API endpoint, which response will I get?

**A:** Drakov will respond first with any responses that have a JSON schema with the first response matching the request body for that API endpoint. You can request a specific response by adding a `Prefer` header to the request in the form `Prefer:status=XXX` where `XXX` is the status code of the desired response.  See [issue #88](https://github.com/Aconex/drakov/issues/88) for details.


**Q:** If I have multiple responses on a single request, which response will I get?

**A:** Drakov will respond with the first response.


## CONTRIBUTING

Pull requests with patches for fixes and enhancements are very welcome. We have a few requirements that will help us to quickly assess your contributions.

If you have any ideas or questions you are welcome to post an issue.

### Code conventions
* Setup your editor to use the `.editorconfig` and `.jshintrc` files included in the project
* We use 4 spaces for tabs
* Most of the style issues should be resolve as long as you run `npm test` and run against the jshinting rules
* We prefer readability over compact code

### Logging in your code
* Include the `lib/logger` module and use `logger.log()`, this allows your logging be properly disabled in Drakov's stealth mode
* Always have a type qualifier in square brackets in from of your message in white, `logger.log('[TYPE]'.white`, 'Something is happening');`
* We don't have any guidelines for how to log, except that you should have your type a different colour from your actual message (better logging is in our roadmap)

### Functionality that adds CLI arguments
* Make sure you add the new argument property to the `yargsConfigOptions` object in the [arguments module](https://github.com/Aconex/drakov/blob/master/lib/arguments.js#L3)

### Middleware functionality
* For functionality that does something with the request object add code to the [request module](https://github.com/Aconex/drakov/blob/master/lib/middleware/request.js)
* For functionality that does something with the response object add code to the [response module](https://github.com/Aconex/drakov/blob/master/lib/middleware/response.js)

### Testing
* If your contribution deals with API Blueprint request/response behaviour add an example into an existing or new markdown file in the `test/example/md` directory
* Always add a test in `test/api` for request/response behaviour tests, or `test/unit` if it is a unit test
* All test specification files must end in `-test.js`
* Always run `npm test` before you submit your build request

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[apibUrl]: http://apiblueprint.org/
[drakovUrl]: https://github.com/Aconex/drakov
[npmImage]: https://img.shields.io/npm/v/@ianwalter/drakov.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/drakov
[licenseUrl]: https://github.com/ianwalter/drakov/blob/master/LICENSE
