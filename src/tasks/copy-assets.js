import copy from './copy';

module.exports = (name, gulp, opts) => {
  opts.dest = opts.dest + '/assets';
  opts.flatten = true;
  return copy(name, gulp, opts);
};
