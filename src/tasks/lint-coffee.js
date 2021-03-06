var coffeelint = require('gulp-coffeelint');
var stylish    = require('coffeelint-stylish');

module.exports = (name, gulp, opts) => {
  gulp.task(name, () => {
    return gulp.src(opts.src)
      .pipe(coffeelint())
      .pipe(coffeelint.reporter(stylish));
  });
};
