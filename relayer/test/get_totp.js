const totp = require("../../lib/totp");

for(var i=0; i< 10; i++) {
    console.log(i, totp("UJTXJ7ZRP25G55BU2PYSS6UTEUVSM74M", {counter: i}));
}
