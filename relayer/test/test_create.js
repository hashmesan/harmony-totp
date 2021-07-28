var expect = require('chai').expect;
var assert = require('assert');

var Transactions = require("./../src/web3/transactions.js");
const env = "development";

describe('testResolver()', function () {
  it('name checks', async function () {
    const res = await new Transactions(env).checkName("sueprcrazylongcheapname00001949.crazy.one");
    console.log("res", res);

    const res2 = await new Transactions(env).checkName("testnonexist.crazy.one");
    console.log("res", res2.cost.toString());

  });
});