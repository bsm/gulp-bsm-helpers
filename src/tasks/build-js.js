import gutil  from 'gulp-util';
import gulpif from 'gulp-if';
import babel  from 'gulp-babel';
import coffee from 'gulp-coffee';
import ngAnnotate from 'gulp-ng-annotate';
import build  from './build';

module.exports = (name, gulp, opts) => {
  return build(name, gulp, '.js', opts, (chain) => {
    return chain
      .pipe(gulpif(/[.]coffee$/, coffee({bare: true}), gutil.noop()))
      .pipe(babel({comments: true, compact: false}))
      .pipe(ngAnnotate({sourceMap: true}));
  });
};
