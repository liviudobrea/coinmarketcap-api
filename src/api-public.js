'use strict'

const { createRequest } = require('./lib')
const BaseClass = require('./api-base')

const BASE_URL = 'https://api.coinmarketcap.com'

class CoinMarketCapPublicApi extends BaseClass {
  constructor (props) {
    super(props)

    this.url = `${BASE_URL}`
    this.config.headers.Authorization = `Basic ${props.apiKey}`
  }

  /**
   * Get account statistics information
   *
   * @param {Object} [options] Payload for the request
   * @param {int} options.cryptoUnit
   * @param {int} options.fiatUnit
   * @param {string} options.portfolioSourceId
   * @returns {Promise<*>} Info about portfolio
   */
  queryStatistics (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      cryptoUnit: 2790,
      fiatUnit: 3,
      ...options
    }

    const config = {
      ...this.config,
      body,
      method: 'POST'
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/queryStatistics`,
      config
    })
  }

  /**
   * Get a list of holdings from the portfolio
   *
   * @param {Object} [options] Payload for the request
   * @param {int} options.cryptoUnit
   * @param {int} options.currentPage
   * @param {int} options.pageSize
   * @param {string} options.portfolioSourceId
   * @returns {Promise<*>} Info about portfolio
   */
  queryAssets (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      cryptoUnit: 2790,
      currentPage: 1,
      pageSize: 16,
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/query`,
      config
    })
  }

  /**
   *
   * Gives detail about transactions of an asset
   * @param {object} options
   * @param {int} options.cryptoUnit
   * @param {int} options.fiatUnit
   * @param {int} options.cryptocurrencyId
   * @param {int} options.currentPage
   * @param {int} options.pageSize
   * @param {string} options.portfolioSourceId
   * @returns {Promise<*>|PromiseLike<*>}
   */
  queryTransactionsByCrypto (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      cryptoUnit: 2790,
      fiatUnit: 2790,
      currentPage: 1,
      pageSize: 16,
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/queryTransactionsByCrypto`,
      config
    })
  }

  /**
   *
   * Gives detail about current holdings of an asset
   * @param {object} options
   * @param {int} options.cryptocurrencyId
   * @param {int} options.cryptoUnit
   * @param {int} options.fiatUnit
   * @param {string} options.portfolioSourceId
   * @returns {Promise<*>|PromiseLike<*>}
   */
  portfolioCoinDetail (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      fiatUnit: 2790,
      cryptoUnit: 2790,
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/detail`,
      config
    })
  }

  /**
   * Returns a list of watched elements
   * @param {object} [options]
   * @param {string} options.watchListType
   * @param {int} options.aux
   * @returns {Promise<*>|PromiseLike<*>}
   */
  queryWatchlist (options = {}) {
    const body = {
      watchListType: 'ORDINARY',
      aux: 5,
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/watchlist/${this.version}/watchlist/query`,
      config
    })
  }

  /**
   * Returns a list of gainers and losers
   * @param {object} [args]
   * @param {int} args.dataType
   * @param {int} args.limit
   * @param {string} args.timeFrame
   * @param {int} args.rankRange
   * @returns {Promise<*>|PromiseLike<*>}
   */
  querySpotlight (args = {}) {
    const query = {
      dataType: 2,
      limit: 30,
      timeFrame: '24h',
      rankRange: 0
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/data-api/${this.version}/cryptocurrency/spotlight`,
      config: this.config,
      query
    })
  }

  /**
   * Adds an asset to the portfolio
   * @param {object} options
   * @param {string} options.amount
   * @param {int} options.cryptoUnit
   * @param {int} options.cryptocurrencyId
   * @param {string} options.fee
   * @param {int} options.fiatUnit
   * @param {string} options.note
   * @param {string} options.portfolioSourceId
   * @param {float} options.price
   * @param {string} options.transactionTime
   * @param {string} options.transactionType
   * @returns {Promise<*>} Confirmation
   */
  addAsset (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      cryptoUnit: 2790,
      fiatUnit: 2790,
      note: '',
      fee: '',
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/add`,
      config
    })
  }

  /**
   * Updates an asset in the portfolio. Same ass add
   * @param {object} options
   * @param {string} options.id
   * @param {string} options.amount
   * @param {int} options.cryptoUnit
   * @param {float} options.cryptoUnitPrice
   * @param {int} options.cryptocurrencyId
   * @param {string} options.fee
   * @param {int} options.fiatUnit
   * @param {int} options.inputUnit
   * @param {string} options.note
   * @param {string} options.portfolioSourceId
   * @param {float|string} options.price
   * @param {float} options.inputPrice
   * @param {string} options.transactionTime
   * @param {string} options.transactionType
   * @returns {Promise<*>} Confirmation
   */
  updateAsset (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      note: '',
      fee: '',
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/update`,
      config
    })
  }

  /**
   * Removes an asset (or an individual transaction) from the portfolio
   * @param {object} options
   * @param {int} [options.id] options.id
   * @param {int} options.cryptocurrencyId
   * @param {string} options.portfolioSourceId
   * @returns {Promise<*>} Confirmation
   */
  removeAsset (options = {}) {
    const body = {
      portfolioSourceId: 'default',
      ...options
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/asset/${this.version}/portfolio/delete`,
      config
    })
  }

  /**
   * Get crypto votes
   * @param {int} cryptoId
   * @returns {Promise<*>|PromiseLike<*>}
   */
  getVotes (cryptoId) {
    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/data-api/${this.version}/cryptocurrency/vote`,
      config: this.config,
      query: { id: cryptoId }
    })
  }

  /**
   * Vote for crypto
   * @param {object} options
   * @param {int} options.cryptoId
   * @param {int} options.vote (1 for Good, 2 for Bad)
   * @returns {Promise<*>|PromiseLike<*>}
   */
  vote (options = {}) {
    const body = {
      cryptoId: options.cryptoId,
      voted: options.vote
    }

    const config = {
      ...this.config,
      method: 'POST',
      body
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/data-api/${this.version}/cryptocurrency/vote`,
      config
    })
  }

  /**
   * Convert any crypto/currency pair at real time price
   *
   * @param {Object} args Options for the request
   *
   * @example
   * const client = new CoinMarketCap()
   * client.convertCurrency({ symbol: 'ETH', currency: 'eur', amount: 1 });
   */
  convertCurrency (args = {}) {
    const { amount, id, symbol, time, convert_id, convert } = args

    if (!(id || symbol)) {
      throw new Error('You need to provide at least id or symbol of base coin.')
    }

    if (!(convert_id || convert)) {
      throw new Error('You need to provide at least id or symbol of convert coin.')
    }

    const opts = {
      amount
    }

    if (time) {
      opts.time = time
    }

    if (id) {
      opts.id = id
    } else if (symbol) {
      opts.symbol = symbol
    }

    if (convert_id) {
      opts.convert_id = convert_id
    } else if (convert) {
      opts.convert = convert
    }

    return createRequest({
      fetcher: this.fetcher,
      url: 'https://web-api.coinmarketcap.com/v1/tools/price-conversion',
      config: this.config,
      query: opts
    })
  }
}

module.exports = CoinMarketCapPublicApi
