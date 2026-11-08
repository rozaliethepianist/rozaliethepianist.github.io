/* Register repertoire definitions before the shared content script runs. */
(() => {
 'use strict';
 Object.assign(window.ROZALIE_CONTENT || (window.ROZALIE_CONTENT = {}), window.ROZALIE_REPERTOIRE || {});
})();
