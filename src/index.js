import browserSync  from 'browser-sync';
import gutil        from 'gulp-util';
import gulpif       from 'gulp-if';
import babel        from 'gulp-babel';
import ngAnnotate   from 'gulp-ng-annotate';

class DSL {

  constructor(gulp) {
    this.gulp = gulp;
    this.browserSync = browserSync.create();
  }

  defineTask(name, kind, ...args) {
    try {
      require(`./tasks/${kind}.js`)(name, this.gulp, ...args);
    } catch (e) {
      gutil.log(gutil.colors.red(e));
      throw e;
    }
  }

  defaultOpts() {
    return {
      path: {
        app:   './app',
        build: './build',
        dist:  './dist',

        js:     ['app/**/*.{js}', '!app/**/*_test.{js}'],
        coffee: ['app/**/*.{coffee}', '!app/**/*_test.{coffee}'],
        html:   ['app/**/*.{html,jade}'],
        css:    ['app/**/*.{less,css}'],
        assets: ['app/**/*.{jpg,png,gif,css,svg,woff,ttf,eot,pdf}'],
        json:   ['app/**/*.json'],
      },
    };
  }

  defineClean(opts) {
    opts = opts || this.defaultOpts();

    this.defineTask('clean', 'clean', {
      src: [opts.path.build, opts.path.dist],
    });
  }

  defineBuild(opts) {
    opts = opts || this.defaultOpts();

    this.defineTask('build-js', 'build', {
      src:  opts.path.js.concat(opts.path.coffee),
      dest: opts.path.build,
      ext:  '.js',
      sync: this.browserSync,
    }, (chain) => {
      return chain
        .pipe(gulpif(/[.]coffee$/, coffee({bare: true}), gutil.noop()))
        .pipe(babel({comments: true, compact: false}))
        .pipe(ngAnnotate({sourceMap: true}));
    });

    this.defineTask('build-css', 'build', {
      src:  opts.path.css,
      dest: opts.path.build,
      ext:  '.css',
      sync: this.browserSync,
    }, (chain) => {
      return chain
        .pipe(gulpif(/[.]less$/, less({compress: false}), gutil.noop()));
    });

    this.defineTask('build-html', 'build', {
      src:  opts.path.html,
      dest: opts.path.build,
      ext:  '.html',
      sync: this.browserSync,
    }, (chain) => {
      return chain
        .pipe(gulpif(/[.]jade$/, jade({pretty: true}), gutil.noop()));
    });
  }

  defineLint(opts) {
    opts = opts || this.defaultOpts();

    this.defineTask('lint-js', 'lint-js', {paths: opts.path.js});
    this.defineTask('lint-coffee', 'lint-coffee', {paths: opts.path.coffee});
  }

  defineAll(opts) {
    opts = opts || this.defaultOpts();

    this.defineClean(opts);
    this.defineBuild(opts);
    this.defineLint(opts);
  }
}

module.exports = (gulp) => { return new DSL(gulp); };
