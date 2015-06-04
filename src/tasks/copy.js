import cache      from 'gulp-cached';
import plumber    from 'gulp-plumber';

module.exports = (name, gulp, opts) => {
  gulp.task(name, () => {
    let chain = gulp.src(opts.src)
      .pipe(cache(name))
      .pipe(plumber())
      .pipe(gulp.dest(opts.dest))
      .pipe(opts.sync.reload({stream: true}));
  });
};
