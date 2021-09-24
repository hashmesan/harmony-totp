import React from "react";

const TokenCategory = (props) => {
  const SwitchCategory = () => {
    switch (props.category) {
      case "stablecoin":
        return <span className="font-sm text-no-bank-primary bg-no-bank-grayscale-titanium  rounded-pill px-2 py-1">Stablecoin</span>;
      case "token":
        return <span className="font-sm text-no-bank-primary bg-no-bank-secondary-lemon  rounded-pill px-2 py-1">Token</span>;
      default:
        return <span className="font-sm text-no-bank-primary bg-no-bank-secondary-turquoise-green  rounded-pill px-2 py-1">Coin</span>;
    }
  };

  return (
    <>
      <SwitchCategory />
    </>
  );
};

export default TokenCategory;
