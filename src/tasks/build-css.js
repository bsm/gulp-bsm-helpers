import gutil  from 'gulp-util';
import gulpif from 'gulp-if';
import less   from 'gulp-less';
import build  from './build';

module.exports = (name, gulp, opts) => {
  return build(name, gulp, '.less', opts, (chain) => {
    return chain
      .pipe(gulpif(/[.]less$/, less(opts.less), gutil.noop()));
  });
};
