import cache      from 'gulp-cached';
import plumber    from 'gulp-plumber';
import flatten    from 'gulp-flatten';

module.exports = (name, gulp, opts) => {
  gulp.task(name, () => {
    let chain = gulp.src(opts.src)
      .pipe(cache(name))
      .pipe(plumber());

    if (opts.flatten) {
      chain = chain.pipe(flatten());
    }

    return chain
      .pipe(gulp.dest(opts.dest))
      .pipe(opts.sync.reload({stream: true}));
  });
};
