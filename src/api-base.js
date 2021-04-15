'use strict'

const fetch = require('@vercel/fetch')(require('node-fetch'))

/**
 * @class CoinMarketApiBase
 */
class CoinMarketApiBase {
  /**
   * @param {String} apiKey API key for accessing the CoinMarketCap API
   * @param {String=} version  Version of API. Defaults to 'v1'
   * @param {Function=} fetcher fetch function to use. Defaults to @vercel/fetch
   * @param {Object=} config = Configuration for fetch request
   */
  constructor ({ apiKey, version = 'v1', fetcher = fetch, config = {} }) {
    if (!apiKey) {
      throw new Error('Auth token is required but was not provided !')
    }
    this.version = version;
    this.config = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
        'Accept-Encoding': 'deflate, gzip'
      },
      ...config
    }

    this.fetcher = fetcher;
  }
}

module.exports = CoinMarketApiBase
