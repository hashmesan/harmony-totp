// SPDX-License-Identifier: GPL-3.0-only

pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import "../core/wallet_data.sol";
import "../ens/ens_resolver.sol";
import "../ens/registrar_interface.sol";

library NameService {
    // event NameRegistered(string subdomain, string domain, uint cost);

    // namehash('one')
    bytes32 constant public TLD_NODE = 0x30f9ae3b1c4766476d11e2bacd21f9dff2c59670d8b8a74a88ebc22aec7020b9;

    function registerENS(Core.Wallet storage wallet, string calldata subdomain, string calldata domain, uint duration) public {
        bytes32 label = keccak256(bytes(domain));
        address resolver = wallet.resolver;
        address resolved = Resolver(resolver).addr(keccak256(abi.encodePacked(TLD_NODE, label)));

        uint rentPriceSub = RegistrarInterface(resolved).rentPrice(subdomain, duration);
        require(address(this).balance >= rentPriceSub, "NOT ENOUGH TO REGISTER NAME");

        RegistrarInterface(resolved).register{value:rentPriceSub}(label, subdomain, address(this), duration, '', resolver);
    }
}