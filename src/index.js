import browserSync  from 'browser-sync';
import gutil        from 'gulp-util';

class DSL {

  constructor(gulp) {
    this.gulp = gulp;
    this.browserSync = browserSync.create();
  }

  task(kind, name, ...args) {
    try {
      require(`./tasks/${kind}.js`)(name, this.gulp, ...args);
    } catch (e) {
      gutil.log(gutil.colors.red(e));
      throw e;
    }
  }

  loadTask(name, ...args) {
    this.task(name, name, ...args);
  }

  defaultOpts() {
    return {
      path: {
        app:   './app',
        build: './build',
        dist:  './dist',

        js:     ['app/**/*.js', '!app/**/*_test.js'],
        coffee: ['app/**/*.coffee', '!app/**/*_test.coffee'],
        html:   ['app/**/*.{html,jade}', '!app/**/_*.{html,jade}'],
        css:    ['app/**/*.{less,css}'],
        assets: ['{app,vendor}/**/*.{jpg,png,gif,css,svg,woff*,ttf,eot,pdf}'],
        json:   ['app/**/*.json'],
      },

      server: {
        open:       false,
        ui:         false,
        notify:     false,
        ghostMode:  false,
        port:       9000,
        server: {
          baseDir: ['./build'],
          routes: {
            '/system.config.js':  './system.config.js',
            '/jspm_packages':     './jspm_packages'
          },
        },
      },
    };
  }

  defineClean(opts) {
    opts = opts || this.defaultOpts();

    this.loadTask('clean', {src: [opts.path.build, opts.path.dist]});
  }

  defineBuild(opts) {
    opts = opts || this.defaultOpts();

    this.loadTask('build-js',    {src: opts.path.js.concat(opts.path.coffee), dest: opts.path.build, sync: this.browserSync});
    this.loadTask('build-css',   {src: opts.path.css,    dest: opts.path.build, sync: this.browserSync});
    this.loadTask('build-html',  {src: opts.path.html,   dest: opts.path.build, sync: this.browserSync});
    this.loadTask('copy-assets', {src: opts.path.assets, dest: opts.path.build + '/assets', sync: this.browserSync, flatten: true});
  }

  defineLint(opts) {
    let gulp = this.gulp;
    opts = opts || this.defaultOpts();

    this.loadTask('lint-js', {src: opts.path.js});
    this.loadTask('lint-coffee', {src: opts.path.coffee});
    gulp.task('lint', gulp.parallel('lint-js', 'lint-coffee'));
  }

  defineWatch(opts) {
    let gulp = this.gulp;
    opts = opts || this.defaultOpts();

    gulp.task('watch', () => {
      return gulp.watch(opts.path.app + '/**', gulp.series('build', 'lint'));
    });
  }

  defineServe(opts) {
    let gulp = this.gulp;
    opts = opts || this.defaultOpts();

    gulp.task('serve', (cb) => {
      return this.browserSync.init(opts.server, cb);
    });
  }

  defineCombos() {
    let gulp = this.gulp;

    gulp.task('build',   gulp.parallel('build-html', 'build-css', 'build-js', 'copy-assets'));
    gulp.task('rebuild', gulp.series('clean', 'build'));
    gulp.task('run',     gulp.series('rebuild', gulp.parallel('lint', 'serve', 'watch')));
  }

  fullNelson(opts) {
    opts = opts || this.defaultOpts();

    this.defineClean(opts);
    this.defineBuild(opts);
    this.defineLint(opts);
    this.defineWatch(opts);
    this.defineServe(opts);
    this.defineCombos();
  }
}

module.exports = (gulp) => { return new DSL(gulp); };
