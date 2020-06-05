var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"',
  MOTOFUZE_API: '"https://stage-api.motofuze.com"',
  SSO_AUTHORITY: "'https://stage-login.autoalert.com/identity'",
  URL_PANDO_INBOX: '"http://localhost:9080/#/app"',
  CLIENT: "'PandoHR'",
    PANDOHR_API_BASEURL: "'https://stage-pandohr-api.autoalert.com'"
})
