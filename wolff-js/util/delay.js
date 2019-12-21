/**
 * @param {number} timeout
 */
function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

exports.delay = delay;
