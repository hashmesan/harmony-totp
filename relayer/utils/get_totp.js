const totp = require("../../lib/totp");

console.log("SECRET=", process.argv[2])
const offset = parseInt(process.argv[3]|| 0);
for(var i=0; i< 10; i++) {
    console.log(i+offset, totp(process.argv[2], {counter: i + offset}));
}
