const qs = require('qs')

/**
 * Creates promise request
 * @param args
 * @returns {Promise<*> | PromiseLike<*>}
 */
const createRequest = (args = {}) => {
  const { url, config, query, fetcher } = args;
  let stringified = query && qs.stringify(query);
  stringified = (stringified) ? `?${stringified}` : '';
  return fetcher(`${url}${stringified}`, config).then(res =>
    res.json()
  )
}

const sanitizeIdAndSymbol = (id, symbol) => {
  if (id && symbol) {
    throw new Error('ID and symbol cannot be passed in at the same time.')
  }

  if (!id && !symbol) {
    throw new Error('Either ID or symbol is required to be passed in.')
  }

  if (id instanceof Array) {
    id = id.join(',')
  }

  if (symbol instanceof Array) {
    symbol = symbol.join(',')
  }

  return { id, symbol }
}

module.exports = { createRequest, sanitizeIdAndSymbol }
