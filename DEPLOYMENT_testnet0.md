Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'harmonytestnet0'
> Network id:      1666700000
> Block gas limit: 80000000 (0x4c4b400)


01_libraries.js
===============

   Replacing 'Guardians'
   ---------------------
   > transaction hash:    0xa8c5cc67939a7742079a59aee1fcc3b652b5f3fbc6116a3096d6fb5c25a86cdb
   > Blocks: 4            Seconds: 8
   > contract address:    0x9453624638d9b000CDB0E65eD5FC49285067c426
   > block number:        11669929
   > block timestamp:     1625092381
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.595005607
   > gas used:            478383 (0x74caf)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00956766 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0xaac5d46e72bf9ff6e6f34614460fab9fbe5095fa4f22c5bfec69150e67f0474b
   > Blocks: 5            Seconds: 8
   > contract address:    0x0CB6ff8931a7C31B50Aa6f2866FA39b423bb8420
   > block number:        11669936
   > block timestamp:     1625092395
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.592832907
   > gas used:            108635 (0x1a85b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0021727 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0x17de6b796419120bdb4afbbdcaffb49aee3bab691b1576cbb9c3977b4117ce12
   > Blocks: 2            Seconds: 4
   > contract address:    0x5Fa0D71064f97D028b07365a996241d4970fe963
   > block number:        11669945
   > block timestamp:     1625092413
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.583177527
   > gas used:            482769 (0x75dd1)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00965538 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0x9b645ff3e9eb9e29387c8f42d6446e61c0388d80d05432695d965f76b4bac99b
   > Blocks: 1            Seconds: 4
   > contract address:    0x6952334F63fA31B3DcC51BeF6282AfFEC874724F
   > block number:        11669952
   > block timestamp:     1625092427
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.565803347
   > gas used:            868709 (0xd4165)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01737418 ETH


   Deploying 'NameService'
   -----------------------
   > transaction hash:    0xf1df23ecffb6bfb33290fd439f030b5e0c614efc78d699974d58c11134bb036e
   > Blocks: 4            Seconds: 9
   > contract address:    0xa267CA553493B16857E089E5EAAde185A2EdD4f0
   > block number:        11669961
   > block timestamp:     1625092445
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.555922167
   > gas used:            494059 (0x789eb)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00988118 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0x9453624638d9b000CDB0E65eD5FC49285067c426)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0x5Fa0D71064f97D028b07365a996241d4970fe963)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0xa267CA553493B16857E089E5EAAde185A2EdD4f0)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0x4c06e08034b1b9d6b34e4d45d70fb60de3662f4a36eaaee2e3be6d8e8a6cbbaa
   > Blocks: 2            Seconds: 4
   > contract address:    0x0cA5c9Dd5Cb08daBCb16059dEeDa26BaD856Df25
   > block number:        11669968
   > block timestamp:     1625092459
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.488590967
   > gas used:            3366560 (0x335ea0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0673312 ETH

Implementation= 0x0cA5c9Dd5Cb08daBCb16059dEeDa26BaD856Df25

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x7508c9b75b2738c5ba3fdb92ce5e51ac9b70f9cab630979afeeadaeea199e503
   > Blocks: 4            Seconds: 8
   > contract address:    0x6BF83d0D174452d03F53555653e1d849FbB1EF79
   > block number:        11669977
   > block timestamp:     1625092477
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             550.459383847
   > gas used:            1460356 (0x164884)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02920712 ETH

Factory= 0x6BF83d0D174452d03F53555653e1d849FbB1EF79
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.14518942 ETH


02_testENS.js
=============
Deploying on  harmonytestnet0 block= 11669981

TypeError: Cannot read property 'resolver' of undefined
    at module.exports (/home/quoc/Projects/harmony-totp-pure/migrations/02_testENS.js:31:62)
    at process._tickCallback (internal/process/next_tick.js:68:7)
Truffle v5.1.67 (core: 5.1.67)