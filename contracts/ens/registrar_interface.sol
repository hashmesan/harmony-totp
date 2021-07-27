// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.0;

abstract contract RegistrarInterface {
    event OwnerChanged(bytes32 indexed label, address indexed oldOwner, address indexed newOwner);
    event DomainConfigured(bytes32 indexed label);
    event DomainUnlisted(bytes32 indexed label);
    event NewRegistration(bytes32 indexed label, string subdomain, address indexed owner, uint expires);
    event RentPaid(bytes32 indexed label, string subdomain, uint amount, uint expirationDate);

    // InterfaceID of these four methods is 0xc1b15f5a
    function query(bytes32 label, string calldata subdomain) virtual external view returns (string memory domain, uint signupFee, uint rent, address referralAddress);
    function register(bytes32 label, string calldata subdomain, address owner, uint duration, string calldata url, address resolver) virtual external  payable;

    function rentDue(bytes32 label, string calldata subdomain) virtual external view returns (uint timestamp);
    function payRent(bytes32 label, string calldata subdomain) virtual external payable;
    function rentPrice(string memory name, uint duration) virtual public view returns(uint);    
}
