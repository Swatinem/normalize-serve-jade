# nlz serve-jade

This is a very opinionated nlz server that is mostly just a copy of
[normalize/koa.js](https://github.com/normalize/koa.js), plus a static file
server, and it renders the 'index.jade' file by default.

That `index.jade` file should include the following code or a variation thereof.
For more info please see normalize/koa.js.

```jade
each entrypoint in entrypoints
	!= entrypoint.html
script!= livereload
```

Install and then simply start it in your project directory:

    $ npm i -g normalize-serve-jade
    $ nlz serve-jade

