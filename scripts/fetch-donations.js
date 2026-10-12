const fs = require('fs');
const path = require('path');

const WALLETS = {
  btc: 'bc1qnrnmvql9lzda8dl96ydtdmxy8cl7jkxdz280aw',
  sol: 'G8sswNw9rVPkbYhfLrWjQqQmM2RibrTzzKwoF3o9pLPA',
  eth: '0xf71C94c6b8DDA12A9FD846F0BB28CA546B2b4295',
  bep20: '0x7C3dE8EB01709943f29c0A467Af8a780B43C3bF8'
};

const BSC_USDT_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';
const ETH_USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

async function fetchJSON(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function getPrices() {
  const prices = { btc: 65000, sol: 150, eth: 2600, bnb: 750 };
  const pairs = [
    { key: 'btc', symbol: 'BTCUSDT' },
    { key: 'sol', symbol: 'SOLUSDT' },
    { key: 'eth', symbol: 'ETHUSDT' },
    { key: 'bnb', symbol: 'BNBUSDT' }
  ];

  await Promise.allSettled(pairs.map(async p => {
    try {
      const data = await fetchJSON(`https://api.binance.com/api/v3/ticker/price?symbol=${p.symbol}`);
      if (data && data.price) prices[p.key] = parseFloat(data.price);
    } catch (e) {}
  }));

  return prices;
}

async function getBtcBalance(addr) {
  try {
    const res = await fetch(`https://blockchain.info/q/addressbalance/${addr}`);
    const text = await res.text();
    const satoshis = parseFloat(text.trim());
    return isNaN(satoshis) ? 0 : satoshis / 1e8;
  } catch (e) {
    return 0;
  }
}

async function getSolBalance(addr) {
  try {
    const data = await fetchJSON('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [addr] })
    });
    if (data && data.result && typeof data.result.value === 'number') {
      return data.result.value / 1e9;
    }
  } catch (e) {}
  return 0;
}

async function getEthBalance(addr) {
  const rpcs = ['https://ethereum.publicnode.com', 'https://eth.blockrazor.xyz'];
  for (const r of rpcs) {
    try {
      const data = await fetchJSON(r, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [addr, 'latest'], id: 1 })
      });
      if (data && data.result) {
        return Number(BigInt(data.result)) / 1e18;
      }
    } catch (e) {}
  }
  return 0;
}

async function getBscBalances(addr) {
  let bnb = 0;
  let usdt = 0;
  const rpcs = ['https://bsc-dataseed.binance.org', 'https://bsc.publicnode.com'];

  for (const r of rpcs) {
    try {
      const [bnbRes, usdtRes] = await Promise.all([
        fetchJSON(r, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_getBalance', params: [addr, 'latest'], id: 1 })
        }),
        fetchJSON(r, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{ to: BSC_USDT_CONTRACT, data: '0x70a08231000000000000000000000000' + addr.slice(2).toLowerCase() }, 'latest'],
            id: 2
          })
        })
      ]);

      if (bnbRes && bnbRes.result) bnb = Number(BigInt(bnbRes.result)) / 1e18;
      if (usdtRes && usdtRes.result) usdt = Number(BigInt(usdtRes.result)) / 1e18;
      break;
    } catch (e) {}
  }

  return { bnb, usdt };
}

async function main() {
  console.log('Fetching blockchain balances and prices...');
  const [prices, btc, sol, eth, bsc] = await Promise.all([
    getPrices(),
    getBtcBalance(WALLETS.btc),
    getSolBalance(WALLETS.sol),
    getEthBalance(WALLETS.eth),
    getBscBalances(WALLETS.bep20)
  ]);

  const btcUSD = btc * prices.btc;
  const solUSD = sol * prices.sol;
  const ethUSD = eth * prices.eth;
  const bnbUSD = bsc.bnb * prices.bnb;
  const usdtUSD = bsc.usdt;

  const totalUSD = btcUSD + solUSD + ethUSD + bnbUSD + usdtUSD;

  const result = {
    updatedAt: new Date().toISOString(),
    totalUSD: parseFloat(totalUSD.toFixed(2)),
    formattedTotal: `$${totalUSD.toFixed(2)}`,
    breakdown: {
      btc: { balance: btc, priceUSD: prices.btc, usd: parseFloat(btcUSD.toFixed(4)) },
      sol: { balance: sol, priceUSD: prices.sol, usd: parseFloat(solUSD.toFixed(4)) },
      eth: { balance: eth, priceUSD: prices.eth, usd: parseFloat(ethUSD.toFixed(4)) },
      bep20: {
        bnb: bsc.bnb,
        bnbPriceUSD: prices.bnb,
        bnbUSD: parseFloat(bnbUSD.toFixed(4)),
        usdt: bsc.usdt,
        usdtUSD: parseFloat(usdtUSD.toFixed(4))
      }
    }
  };

  const outPath = path.join(__dirname, '..', 'donations.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log('Successfully written donations.json:');
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error('Fatal error in fetch-donations:', err);
  process.exit(1);
});
