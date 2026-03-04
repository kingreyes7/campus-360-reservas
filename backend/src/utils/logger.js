const INFO = 'info';
const ERROR = 'error';

function _format(...args) {
  return args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
}

function info(...args) {
  console.log(new Date().toISOString(), INFO.toUpperCase(), _format(...args));
}

function error(...args) {
  console.error(new Date().toISOString(), ERROR.toUpperCase(), _format(...args));
}

module.exports = { info, error };
