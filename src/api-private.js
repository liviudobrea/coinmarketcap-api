'use strict'

const { createRequest, sanitizeIdAndSymbol } = require('./lib')
const BaseClass = require('./api-base')

const BASE_URL = 'https://pro-api.coinmarketcap.com'

class CoinMarketCapPrivateApi extends BaseClass {
  constructor (props) {
    super(props)

    this.url = `${BASE_URL}/${this.version}`
    this.config.headers['X-CMC_PRO_API_KEY'] = props.apiKey
  }

  /**
   * Get a paginated list of all cryptocurrencies by CoinMarketCap ID.
   *
   * @param {Object=} args Options for the request:
   * @param {String=} [args.listingStatus="active"] active or inactive coins
   * @param {Number|String=} [args.start=1] Return results from rank start and above
   * @param {Number|String=} args.limit Only returns limit number of results
   * @param {String[]|String=} args.symbol Comma separated list of symbols, will ignore the other
   * options
   * @param {String=} [args.sort="id"] Sort results by the options at
   * https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
   *
   * @example
   * const client = new CoinMarketCap('api key')
   * client.getIdMap().then(console.log).catch(console.error)
   * client.getIdMap({listingStatus: 'inactive', limit: 10}).then(console.log).catch(console.error)
   * client.getIdMap({symbol: 'BTC,ETH'}).then(console.log).catch(console.error)
   * client.getIdMap({symbol: ['BTC', 'ETH']}).then(console.log).catch(console.error)
   * client.getIdMap({sort: 'cmc_rank'}).then(console.log).catch(console.error)
   */
  getIdMap (args = {}) {
    let { listingStatus, start, limit, symbol, sort } = args

    if (symbol instanceof Array) {
      symbol = symbol.join(',')
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/cryptocurrency/map`,
      config: this.config,
      query: { listing_status: listingStatus, start, limit, symbol, sort }
    })
  }

  /**
   * Get static metadata for one or more cryptocurrencies.
   * Either id or symbol is required, but passing in both is not allowed.
   *
   * @param {Object=} args Options for the request:
   * @param {Array|String|Number=} args.id One or more comma separated cryptocurrency IDs
   * @param {String[]|String} args.symbol One or more comma separated cryptocurrency symbols
   *
   * @example
   * const client = new CoinMarketCap('api key')
   * client.getMetadata({id: '1'}).then(console.log).catch(console.error)
   * client.getMetadata({id: [1, 2]}).then(console.log).catch(console.error)
   * client.getMetadata({symbol: 'BTC,ETH'}).then(console.log).catch(console.error)
   * client.getMetadata({symbol: ['BTC', 'ETH']}).then(console.log).catch(console.error)
   */
  getMetadata (args = {}) {
    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/cryptocurrency/info`,
      config: this.config,
      query: sanitizeIdAndSymbol(args.id, args.symbol)
    })
  }

  /**
   * Get information on all tickers.
   * Start and limit options can only be used when currency or ID is not given.
   * Currency and ID cannot be passed in at the same time.
   *
   * @param {Object=} args Options for the request
   * @param {Number|String=} [args.start=1] Return results from rank start and above
   * @param {Number|String=} [args.limit=100] Only returns limit number of results [1..5000]
   * @param {String[]|String=} [args.convert="USD"] Return info in terms of another currency
   * @param {String=} [args.sort="market_cap"] Sort results by the options at
   * https://pro.coinmarketcap.com/api/v1#operation/getV1CryptocurrencyListingsLatest
   * @param {String=} args.sortDir Direction in which to order cryptocurrencies ("asc" | "desc")
   * @param {String=} [args.cryptocurrencyType="all"] Type of cryptocurrency to include ("all" |
   * "coins" | "tokens")
   *
   * @example
   * const client = new CoinMarketCap('api key')
   * client.getTickers({limit: 3}).then(console.log).catch(console.error)
   * client.getTickers({convert: 'EUR'}).then(console.log).catch(console.error)
   * client.getTickers({start: 0, limit: 5}).then(console.log).catch(console.error)
   * client.getTickers({sort: 'name'}).then(console.log).catch(console.error)
   */
  getTickers (args = {}) {
    let { start, limit, convert, sort, sortDir, cryptocurrencyType } = args

    // eslint-disable-next-line
    if (start && (limit == 0)) {
      throw new Error('Start and limit = 0 cannot be passed in at the same time.')
    }

    // eslint-disable-next-line
    if (limit == 0) {
      limit = 5000
    }

    if (convert && convert instanceof Array) {
      convert = convert.join(',')
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/cryptocurrency/listings/latest`,
      config: this.config,
      query: {
        start,
        limit,
        convert,
        sort,
        sort_dir: sortDir,
        cryptocurrency_type: cryptocurrencyType
      }
    })
  }

  /**
   * Get latest market quote for 1 or more cryptocurrencies.
   *
   * @param {Object=} args Options for the request:
   * @param {Array|String|Number=} args.id One or more comma separated cryptocurrency IDs
   * @param {String[]|String=} args.symbol One or more comma separated cryptocurrency symbols
   * @param {String[]|String=} [args.convert="USD"] Return quotes in terms of another currency
   *
   * @example
   * const client = new CoinMarketCap('api key')
   * client.getQuotes({id: '1'}).then(console.log).catch(console.error)
   * client.getQuotes({id: [1, 2], convert: 'USD,EUR'}).then(console.log).catch(console.error)
   * client.getQuotes({symbol: 'BTC,ETH'}).then(console.log).catch(console.error)
   * client.getQuotes({symbol: ['BTC', 'ETH']}).then(console.log).catch(console.error)
   */
  getQuotes (args = {}) {
    let convert = args.convert
    const { id, symbol } = sanitizeIdAndSymbol(args.id, args.symbol)

    if (convert instanceof Array) {
      convert = convert.join(',')
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/cryptocurrency/quotes/latest`,
      config: this.config,
      query: { id, symbol, convert }
    })
  }

  /**
   * Get global information
   *
   * @param {Object|String[]|String=} convert Options for the request:
   * @param {String[]|String=} [convert.convert="USD"] Return quotes in terms of another currency
   *
   * @example
   * const client = new CoinMarketCap()
   * client.getGlobal('GBP').then(console.log).catch(console.error)
   * client.getGlobal({convert: 'GBP'}).then(console.log).catch(console.error)
   */
  getGlobal (convert) {
    if (typeof convert === 'string') {
      convert = { convert: convert.toUpperCase() }
    }

    if (convert instanceof Array) {
      convert = { convert: convert.map(currency => currency.toUpperCase()) }
    }

    if (convert && convert.convert instanceof Array) {
      convert.convert = convert.convert.join(',')
    }

    return createRequest({
      fetcher: this.fetcher,
      url: `${this.url}/global-metrics/quotes/latest`,
      config: this.config,
      query: convert
    })
  }

  /**
   *
   * @param args
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
      url: `${this.url}/tools/price-conversion`,
      config: this.config,
      query: opts
    })
  }
}

module.exports = CoinMarketCapPrivateApi
