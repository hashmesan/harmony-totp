import React, { useState } from 'react';
const {
    toBech32,
    fromBech32,
  } = require('@harmony-js/crypto');
import useClipboard from "react-use-clipboard";
import Notifications, {notify} from 'react-notify-toast';

export default function Address({walletAddress}) {
  // Declare a new state variable, which we'll call "count"
  const [isToggle, setIsToggle] = useState(0);
  const address = isToggle? walletAddress : toBech32(walletAddress)
  const [isCopied, setCopied] = useClipboard(address);
  const img = isToggle ? 
                "public/harmony-small.png"
                :"public/ethereum.svg";

  return (
    <div>
      <button className="btn btn-light bg-transparent text-left pl-0 " onClick={(e)=>{ notify.show("Copied!", "success", 1000); setCopied(); }}>{address}</button>
      <a href="#" onClick={(e)=> { e.preventDefault(); setIsToggle(!isToggle)}}>
            <img src={img} width={isToggle? 25 : 14} />     
      </a>     
    </div>
  );
}