import vinylPaths from 'vinyl-paths';
import del from 'del';

module.exports = (name, gulp, opts) => {
  gulp.task(name, () => {
    return gulp.src(opts.src)
      .pipe(vinylPaths(del));
  });
};
