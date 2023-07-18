import fetch from 'node-fetch';

const WH_KAZAN = 117986;
const URL_PARSE =
  'https://card.wb.ru/cards/detail?appType=1&curr=rub&dest=-444908&regions=80,38,83,4,64,33,68,70,30,40,86,75,69,1,66,110,48,22,31,71,114&spp=31&nm=138590435;94340606;94339119;138593051;94340317;138607462;94339244';

async function parse() {
  const response = await fetch(URL_PARSE, {
    method: 'GET',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://www.wildberries.ru',
    },
  })
    .then((res) => res.json())
    .then(({ data: { products } }) => products);

  const wbStock = response.map((item) => {
    const stockSizes = item.sizes.reduce((newObj, size) => {
      const stockQty = size.stocks.find((stock) => stock.wh === WH_KAZAN)?.qty;
      return stockQty ? { ...newObj, [size.name]: stockQty } : newObj;
    }, {});

    return {
      art: item.id,
      ...stockSizes,
    };
  });

  return wbStock;
}

async function startApp() {
  try {
    console.log(await parse());
  } catch (e) {
    console.log(e);
  }
}

startApp();
