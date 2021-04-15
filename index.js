'use strict'

const CoinMarketCapPrivateApi = require('./src/api-private')
const CoinMarketCapPublicApi = require('./src/api-public')

module.exports = CoinMarketCapPrivateApi
module.exports.CoinMarketCapPublicApi = CoinMarketCapPublicApi
