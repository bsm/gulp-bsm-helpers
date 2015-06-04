var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');

module.exports = (name, gulp, opts) => {
  gulp.task(name, () => {
    return gulp.src(opts.paths)
      .pipe(jshint({esnext: 6}))
      .pipe(jshint.reporter(stylish));
  });
};
