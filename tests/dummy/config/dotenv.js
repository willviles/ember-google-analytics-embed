/* eslint-env node */
'use strict';

module.exports = function() {
  return {
    clientAllowedKeys: ['GOOGLE_API_KEY', 'GOOGLE_CLIENT_ID'],
    // Fail build when there is missing any of clientAllowedKeys environment variables.
    // By default false.
    failOnMissingKey: true
  };
};
