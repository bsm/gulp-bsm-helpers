import gutil  from 'gulp-util';
import gulpif from 'gulp-if';
import jade   from 'gulp-jade';
import build  from './build';

module.exports = (name, gulp, opts) => {
  return build(name, gulp, '.html', opts, (chain) => {
    return chain
      .pipe(gulpif(/[.]jade$/, jade({pretty: true}), gutil.noop()));
  });
};
