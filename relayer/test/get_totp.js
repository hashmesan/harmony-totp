const totp = require("../../lib/totp");

for(var i=0; i< 10; i++) {
    console.log(i, totp("VGHPVZU4CM7LCJF73PCUJCWNOUJCE7ES", {counter: i}));
}
