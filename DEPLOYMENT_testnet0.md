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



####
#### Version 2
####


Compiling your contracts...
===========================
> Compiling ./contracts/_deprecated/forwarder.sol
> Compiling ./contracts/_deprecated/relayer.sol
> Compiling ./contracts/features/metatx.sol
> Compiling ./contracts/features/recovery.sol
> Compiling ./contracts/otp_wallet.sol
> Compiling ./contracts/wallet_factory.sol
> Artifacts written to /home/quoc/Projects/harmony-totp-pure/build/contracts
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang

Network up to date.
quoc@quoc-linux:~/Projects/harmony-totp-pure$ truffle migrate --network testnet0 --reset

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'testnet0'
> Network id:      1666700000
> Block gas limit: 80000000 (0x4c4b400)


01_initial_migrations.js
========================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x84d9aba4d5d4937bcd18e7174baff6ae2c93cdd492285dc7d351e9aa413578e5
   > Blocks: 3            Seconds: 4
   > contract address:    0xD1AF112ea0524E902937Eca370631F8e982c7585
   > block number:        15911868
   > block timestamp:     1633614973
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             181.041909917036857074
   > gas used:            244300 (0x3ba4c)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.004886 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:            0.004886 ETH


02_libraries.js
===============

   Replacing 'Guardians'
   ---------------------
   > transaction hash:    0x2d098530fa95cf7ed0b56e14a302c0ad5cdf1109b70237940f17645025eda839
   > Blocks: 2            Seconds: 4
   > contract address:    0x210e1C2a916D828ca026a30B05599225074cfF47
   > block number:        15911876
   > block timestamp:     1633614989
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             181.028101257036857074
   > gas used:            647920 (0x9e2f0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0129584 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0x84a6603d83d924d9e950cb31a40042c4760995f774376e50cf9549445d670a7f
   > Blocks: 3            Seconds: 4
   > contract address:    0xA433e0e2782f0C906F2b06aDB7F72c3887969954
   > block number:        15911881
   > block timestamp:     1633614999
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             181.024435157036857074
   > gas used:            183305 (0x2cc09)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0036661 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0x7ce795db8c57f8a91b0207799a7373c0961416e90a9942451b1fab3191b5704e
   > Blocks: 2            Seconds: 4
   > contract address:    0x267D5fFf48cCA385eCb9AeE2AAbA653269437583
   > block number:        15911885
   > block timestamp:     1633615007
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             181.004926737036857074
   > gas used:            975421 (0xee23d)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01950842 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0x1dc88980a810f62e16a9f7ba8e2f55725ebfa197f795378999a955db63e8bb96
   > Blocks: 2            Seconds: 4
   > contract address:    0xC7f136a2eBC5e70Fc4cB3900bbEE9692F7dF159b
   > block number:        15911889
   > block timestamp:     1633615015
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             180.982069477036857074
   > gas used:            1142863 (0x11704f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02285726 ETH


   Replacing 'NameService'
   -----------------------
   > transaction hash:    0x27b39bcba775c7780f67de8738c9a35f79fa37c940bf4142ddeae334240cb91e
   > Blocks: 2            Seconds: 4
   > contract address:    0x8fD55d4Ba7a24bFAcF65C5154894604b0e144b80
   > block number:        15911893
   > block timestamp:     1633615023
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             180.972181577036857074
   > gas used:            494395 (0x78b3b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0098879 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0x210e1C2a916D828ca026a30B05599225074cfF47)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0x267D5fFf48cCA385eCb9AeE2AAbA653269437583)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: MetaTx (at address: 0xC7f136a2eBC5e70Fc4cB3900bbEE9692F7dF159b)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0x8fD55d4Ba7a24bFAcF65C5154894604b0e144b80)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0xaa085bfc377898fdd68b0c85f66d3ccf151d3a558a3ac9a5adf7ecf2d7ad1cc8
   > Blocks: 2            Seconds: 4
   > contract address:    0xD9ca3618165E198481B320090ABF9FEA60dE1187
   > block number:        15911898
   > block timestamp:     1633615033
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             180.865586877036857074
   > gas used:            5329735 (0x515347)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.1065947 ETH

Implementation= 0xD9ca3618165E198481B320090ABF9FEA60dE1187

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x7bbad4eb558489da5713dbabdca30ead3569b6d6232dcb61538238ad2b23245c
   > Blocks: 3            Seconds: 4
   > contract address:    0x8B984Dd90f9df767c0741213E273B9bcaaCfa411
   > block number:        15911903
   > block timestamp:     1633615043
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             180.834222237036857074
   > gas used:            1568232 (0x17ede8)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03136464 ETH

Factory= 0x8B984Dd90f9df767c0741213E273B9bcaaCfa411

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.20683742 ETH


03_testENS.js
=============

   > Saving migration to chain.
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   8
> Final cost:          0.21172342 ETH