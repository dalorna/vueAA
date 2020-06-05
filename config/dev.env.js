let merge = require('webpack-merge');
let prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOTOFUZE_API: '"https://dev-api.motofuze.com"',
  SSO_AUTHORITY: "'https://dev-login.autoalert.com/identity'",
  URL_PANDO_INBOX: '"http://localhost:9080/#/app"',
  CLIENT: "'PandoHR'",
  // PANDOHR_API_BASEURL: "'https://dev-pandohr-api.autoalert.com'"
  PANDOHR_API_BASEURL: "'https://localhost:44370'"
});
