require('jest-extended')
require('jest-chain')
const { CoinMarketCapPublicApi: CoinMarketCap } = require('../index')

require('dotenv').config()

const API_KEY = process.env.COINMARKETCAP_API_TOKEN;
const client = new CoinMarketCap({ apiKey: API_KEY, version: 'v3' })

test('should be defined', () => {
  expect(CoinMarketCap).toBeDefined()
})

test('should return new CoinMarketCap client', () => {
  expect(client.queryAssets).toBeDefined()
  expect(client.queryStatistics).toBeDefined()
  expect(client.portfolioCoinDetail).toBeDefined()
  expect(client.queryTransactionsByCrypto).toBeDefined()
  expect(client.addAsset).toBeDefined()
  expect(client.removeAsset).toBeDefined()
  expect(client.updateAsset).toBeDefined()
  expect(client.querySpotlight).toBeDefined()
  expect(client.queryWatchlist).toBeDefined()
})

test('queryAssets should have correct response structure and type', async () => {
  const response = await client.queryAssets();
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeArray()
  expect(response.data).not.toBeEmpty()
  expect(response.data[0]).toBeObject()
  expect(response.data[0]).toContainKey('list')
  expect(response.data[0].list).toBeArray();
  for (const listItem of response.data[0].list) {
    expect(listItem).toBeObject();
    expect(listItem).toContainAnyKeys(['amount', 'name', 'symbol', 'cryptocurrencyId']);
  }
  expect(response.status.timestamp).toBeString()
})

test('queryStatistics should have correct response structure and type', async () => {
  const response = await client.queryStatistics();
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeObject()
  expect(response.data).not.toBeEmpty()
  expect(response.data).toContainAnyKeys(['bestName', 'worstName', 'pieCharts']);
  expect(response.data.pieCharts).toBeArray();
  for (const chart of response.data.pieCharts) {
    expect(chart).toBeObject();
    expect(chart).toContainAnyKeys(['cryptoId', 'name', 'symbol', 'holdings']);
  }
  expect(response.status.timestamp).toBeString()
})

test('portfolioCoinDetail should have correct response structure and type', async () => {
  const response = await client.portfolioCoinDetail({ cryptocurrencyId: 74 });
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeObject()
  expect(response.data).not.toBeEmpty()
  expect(response.data).toContainAnyKeys(['amount', 'name', 'slug', 'symbol']);
  expect(response.status.timestamp).toBeString()
})

test('queryTransactionsByCrypto should have correct response structure and type', async () => {
  const response = await client.queryTransactionsByCrypto();
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeObject()
  expect(response.data).not.toBeEmpty()
  expect(response.data).toContainAnyKeys(['currentPage', 'list', 'totalNum']);
  expect(response.data.list).toBeArray();
  for (const item of response.data.list) {
    expect(item).toBeObject();
    expect(item).toContainAnyKeys(['id', 'amount', 'inputPrice', 'price']);
  }
  expect(response.status.timestamp).toBeString()
})

describe('Can manage assets by adding, editing then removing 1 BTC', () => {;
  let transactionId;
  const cryptocurrencyId = 1; // BTC
  const now = (new Date()).toISOString();
  const payload = {
    amount: 1,
    cryptoUnit: 2790,
    cryptocurrencyId: 1,
    fee: "",
    fiatUnit: 2790,
    note: "",
    portfolioSourceId: 'default',
    price: 53161.08973374,
    transactionTime: now,
    transactionType: 'buy'
  };

  test('Can add new asset', async () => {
    const response = await client.addAsset(payload);
    expect(response).toContainAllKeys(['data', 'status'])
    expect(response).toHaveProperty('status.timestamp')
    expect(response).toHaveProperty('status.credit_count')
    expect(response).toHaveProperty('status.error_code')
    expect(response.data).toBeObject();
    expect(response.data).toContainAnyKeys(['id', 'timeCreated', 'transactionType']);
    expect(response.data.id).toBeString();
    expect(response.data.id).not.toBeEmpty();
    expect(response.data.transactionType).toEqual('buy');
    transactionId = response.data.id;

    const assets = await client.queryAssets({ pageSize: 100 });
    expect(assets.data).toBeArray()
    expect(assets.data[0]).toBeObject()
    expect(assets.data[0]).toContainKey('list')
    expect(assets.data[0].list).toBeArray();
    const assetIds = assets.data[0].list.map(item => item.cryptocurrencyId);
    expect(assetIds.includes(cryptocurrencyId)).toBeTrue();

    const transactions = await client.queryTransactionsByCrypto({
      cryptocurrencyId,
      pageSize: 100,
    });
    expect(transactions.data).toBeObject();
    expect(transactions.data).toContainKey('list');
    expect(transactions.data.list).toBeArray();
    const transactionIds = transactions.data.list.map(trans => trans.id);
    expect(transactionIds.includes(transactionId)).toBeTrue();
  });

  test('Can edit asset', async () => {
    const response = await client.updateAsset({
      amount: 0.75,
      cryptoUnit: 2790,
      cryptoUnitPrice: 1.19688809096349,
      cryptocurrencyId,
      fee: "",
      fiatUnit: 2790,
      id: transactionId,
      inputPrice: 53161.08973374,
      inputUnit: 2790,
      note: "",
      portfolioSourceId: "default",
      price: "53161.08973374",
      transactionTime: (new Date()).toISOString(),
      transactionType: "buy"
    });
    expect(response).toContainAllKeys(['data', 'status'])
    expect(response).toHaveProperty('status.timestamp')
    expect(response).toHaveProperty('status.credit_count')
    expect(response).toHaveProperty('status.error_code')
    expect(response.data).toBeObject();
    expect(response.data).toContainAnyKeys(['id', 'timeCreated', 'transactionType']);
    expect(response.data.id).toEqual(transactionId);
    expect(response.data.amount).toEqual(0.75);
  });

  test('Can remove transaction in asset', async () => {
    const response = await client.removeAsset({
      id: transactionId,
      cryptocurrencyId,
    });
    expect(response).toContainAllKeys(['data', 'status'])
    expect(response).toHaveProperty('status.timestamp')
    expect(response).toHaveProperty('status.credit_count')
    expect(response).toHaveProperty('status.error_code')
    expect(response.data).toBeTrue();

    const transactions = await client.queryTransactionsByCrypto({
      cryptocurrencyId,
      pageSize: 100,
    });
    expect(transactions.data).toBeObject();
    expect(transactions.data).toContainKey('list');
    expect(transactions.data.list).toBeArray();
    const ids = transactions.data.list.map(trans => trans.id);
    expect(ids.includes(transactionId)).toBeFalse();
  });

  test('Can remove asset completely', async () => {
    const response = await client.removeAsset({
      cryptocurrencyId,
    });
    expect(response).toContainAllKeys(['data', 'status'])
    expect(response).toHaveProperty('status.timestamp')
    expect(response).toHaveProperty('status.credit_count')
    expect(response).toHaveProperty('status.error_code')
    expect(response.data).toBeTrue();

    const assets = await client.queryAssets({ pageSize: 100 });
    expect(assets).toContainAllKeys(['data', 'status'])
    expect(assets).toHaveProperty('status.timestamp')
    expect(assets).toHaveProperty('status.credit_count')
    expect(assets).toHaveProperty('status.error_code')
    expect(assets.data).toBeArray()
    expect(assets.data[0]).toBeObject()
    expect(assets.data[0]).toContainKey('list')
    expect(assets.data[0].list).toBeArray();
    const ids = assets.data[0].list.map(item => item.cryptocurrencyId);
    expect(ids.includes(cryptocurrencyId)).toBeFalse();
  });
});

test('querySpotlight should have correct response structure and type', async () => {
  const response = await client.querySpotlight({
    rankRange: 100,
  });
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeObject()
  expect(response.data).not.toBeEmpty()
  expect(response.data).toContainAllKeys(['gainerList', 'loserList']);
  expect(response.data.gainerList).toBeArray();
  expect(response.data.loserList).toBeArray();
  for (const item of response.data.loserList.concat(response.data.gainerList)) {
    expect(item).toBeObject();
    expect(item).toContainAnyKeys(['id', 'amount', 'inputPrice', 'price']);
  }
  expect(response.status.timestamp).toBeString()
})

test('queryWatchlist should have correct response structure and type', async () => {
  const response = await client.queryWatchlist();
  expect(response).toContainAllKeys(['data', 'status'])
  expect(response).toHaveProperty('status.timestamp')
  expect(response).toHaveProperty('status.credit_count')
  expect(response).toHaveProperty('status.error_code')
  expect(response.data).toBeObject()
  expect(response.data).not.toBeEmpty()
  expect(response.data).toContainKey('watchLists');
  expect(response.data.watchLists).toBeArray();
  for (const list of response.data.watchLists) {
    expect(list).toBeObject();
    expect(list).toContainKey('cryptoCurrencies');
    for (const coin of list.cryptoCurrencies) {
      expect(coin).toContainAnyKeys(['id', 'amount', 'inputPrice', 'price']);
    }
  }
  expect(response.status.timestamp).toBeString()
})
