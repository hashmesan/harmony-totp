var window = self;

import wallet from "../../../lib/wallet";

onmessage = function(event) {
    var mywallet = wallet.createHOTP(event.data.secret, event.data.depth);    
    postMessage({status: "done", mywallet: mywallet});
  };
  