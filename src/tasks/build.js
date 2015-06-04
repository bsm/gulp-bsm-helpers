import cache      from 'gulp-cached';
import changed    from 'gulp-changed';
import plumber    from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';

module.exports = (name, gulp, opts, callback) => {
  gulp.task(name, () => {
    let chain = gulp.src(opts.src)
      .pipe(cache(name))
      .pipe(plumber())
      .pipe(changed(opts.dest, {extension: opts.ext}))
      .pipe(sourcemaps.init());

    if (callback) {
      chain = callback(chain);
    }

    return chain
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(opts.dest))
      .pipe(opts.sync.reload({stream: true}));
  });
};
