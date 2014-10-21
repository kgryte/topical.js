Topical.js
==========
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> JavaScript PubSub library.


## Installation

``` bash
$ npm install topical
```

## Usage

To use the module,

``` javascript
var topical = require( 'topical' );
```

#### 


## Examples

``` javascript
var topical = require( 'topical' );
```

To run an example from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```



## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/topical.svg
[npm-url]: https://npmjs.org/package/topical

[travis-image]: http://img.shields.io/travis/kgryte/topical.js/master.svg
[travis-url]: https://travis-ci.org/kgryte/topical.js

[coveralls-image]: https://img.shields.io/coveralls/kgryte/topical.js/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/topical.js?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/topical.js.svg
[dependencies-url]: https://david-dm.org/kgryte/topical.js

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/topical.js.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/topical.js

[github-issues-image]: http://img.shields.io/github/issues/kgryte/topical.js.svg
[github-issues-url]: https://github.com/kgryte/topical.js/issues