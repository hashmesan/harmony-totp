
Compiling your contracts...
===========================
> Compiling ./contracts/_deprecated/forwarder.sol
> Compiling ./contracts/_deprecated/relayer.sol
> Compiling ./contracts/core/wallet_data.sol
> Compiling ./contracts/features/daily_limit.sol
> Compiling ./contracts/features/guardians.sol
> Compiling ./contracts/features/metatx.sol
> Compiling ./contracts/features/name_service.sol
> Compiling ./contracts/features/recovery.sol
> Compiling ./contracts/otp_wallet.sol
> Compiling ./contracts/wallet_factory.sol
> Artifacts written to /home/quoc/Projects/harmony-totp-pure/build/contracts
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



Starting migrations...
======================
> Network name:    'mainnet0'
> Network id:      1666600000
> Block gas limit: 80000000 (0x4c4b400)


01_initial_migrations.js
========================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0xdca3c18962136abb3943399da7495a3abb7864380bc3e01c2f4e946b22f268df
   > Blocks: 1            Seconds: 4
   > contract address:    0x2c2ad00490859cc373ac7d2A5301A06A09e076b3
   > block number:        19561163
   > block timestamp:     1637272390
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.933603171345060396
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
   > transaction hash:    0xd5cf1d613eed4705be2c1e0e8c9ae4f68e4db5bd2f4a362afa2fb5c75a1bbc26
   > Blocks: 1            Seconds: 4
   > contract address:    0xBD231b18321fa089980c1fCAF7D6c654D9f11117
   > block number:        19561169
   > block timestamp:     1637272406
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.919794511345060396
   > gas used:            647920 (0x9e2f0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0129584 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0xa7b9f3aefc484bfaf247450b9bf78f54c8503eba08471bf5a190be99b5d3a016
   > Blocks: 1            Seconds: 4
   > contract address:    0x834aD4e6505f7801e25F4552a6eBe0047Eaa5AA9
   > block number:        19561172
   > block timestamp:     1637272413
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.916128411345060396
   > gas used:            183305 (0x2cc09)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0036661 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0x53938f8970adb414b4f9b3d383a4d54a0f8f68c9fd9571d0fb8804003b66718d
   > Blocks: 1            Seconds: 4
   > contract address:    0x3eCda16B7A9dcF219EF19325460DC3F51C41A4eD
   > block number:        19561175
   > block timestamp:     1637272422
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.881656091345060396
   > gas used:            1723616 (0x1a4ce0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03447232 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0x148edee3757b3212066581bd7785ad439dd022536c41d6b8e62e412179e77233
   > Blocks: 2            Seconds: 4
   > contract address:    0x994682fF4Be744bd4A32B893bD614Dc7d184010e
   > block number:        19561178
   > block timestamp:     1637272430
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.850749051345060396
   > gas used:            1545352 (0x179488)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03090704 ETH


   Replacing 'NameService'
   -----------------------
   > transaction hash:    0x9b035c223324ad54bbe18aabf6efe808e40118a4dcd8a8a003956e35e8b574c1
   > Blocks: 3            Seconds: 4
   > contract address:    0x1aC7bC15E45b654e5842d6E75b20c3522c0F954c
   > block number:        19561181
   > block timestamp:     1637272437
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.840861151345060396
   > gas used:            494395 (0x78b3b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0098879 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0xBD231b18321fa089980c1fCAF7D6c654D9f11117)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0x3eCda16B7A9dcF219EF19325460DC3F51C41A4eD)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: MetaTx (at address: 0x994682fF4Be744bd4A32B893bD614Dc7d184010e)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0x1aC7bC15E45b654e5842d6E75b20c3522c0F954c)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0x039ed4bd0af939a6774e940d6bd6e5abd262455b438468c9efb760f2cb7fedfc
   > Blocks: 2            Seconds: 4
   > contract address:    0xA9B7B8c631A420500a1A4734e4cC5D0A9C189763
   > block number:        19561184
   > block timestamp:     1637272444
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.734929031345060396
   > gas used:            5296606 (0x50d1de)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.10593212 ETH

Implementation= 0xA9B7B8c631A420500a1A4734e4cC5D0A9C189763

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x4df4b5a67933fe35f917c4233c644dd31ed21c80b3d724d57059db19860284fb
   > Blocks: 1            Seconds: 4
   > contract address:    0x970F7d4d09485Bf508aa4eE1CA0407186D8Ed280
   > block number:        19561187
   > block timestamp:     1637272452
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             0.702818271345060396
   > gas used:            1605538 (0x187fa2)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03211076 ETH

Factory= 0x970F7d4d09485Bf508aa4eE1CA0407186D8Ed280

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.22993464 ETH


03_testENS.js
=============

   > Saving migration to chain.
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   8
> Final cost:          0.23482064 ETH


