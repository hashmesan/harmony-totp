$ truffle deploy --network harmonytestnet0

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'harmonytestnet0'
> Network id:      1666700000
> Block gas limit: 80000000 (0x4c4b400)


01_initial_migrations.js
========================

   Replacing 'Migrations'
   ----------------------
   > transaction hash:    0x7894c808186cb69fd3070625bdbe31e5723ce90a02bd3fdc0ddf8d502fefa77b
   > Blocks: 2            Seconds: 5
   > contract address:    0xbBf07afd0507344813767A6ca7e5828b83332F22
   > block number:        15045800
   > block timestamp:     1631874563
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.79042647
   > gas used:            244300 (0x3ba4c)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.002443 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:            0.002443 ETH


02_libraries.js
===============

   Replacing 'Guardians'
   ---------------------
   > transaction hash:    0x41e7c720b82cb94df98a0574a5d1c11889fe0bc54f4aa00db36167b9e7e2997f
   > Blocks: 3            Seconds: 5
   > contract address:    0x00805E01c02Ed7F18434244DEeAF7d76ffD4f790
   > block number:        15045812
   > block timestamp:     1631874587
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.78352214
   > gas used:            647920 (0x9e2f0)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.0064792 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0x32e7da31fc4ca7bf3d959f84b953584ea14e79762d2356069d6ccf6071bab11d
   > Blocks: 5            Seconds: 9
   > contract address:    0x31Efd7155BD51C605cDfb4463814B6d2AfBf4166
   > block number:        15045820
   > block timestamp:     1631874603
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.78172776
   > gas used:            179438 (0x2bcee)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00179438 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0xa25608fb409da30058bf86c53cafbe1ad0378ec45e8c65e19c861549833d2c8c
   > Blocks: 5            Seconds: 10
   > contract address:    0x0B7664088C2DdA8925A7335a91939D15f8C80AF2
   > block number:        15045829
   > block timestamp:     1631874621
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.7732925
   > gas used:            843526 (0xcdf06)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00843526 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0x2460dc8e16b127c28711205ac892b9e57a7c767b53aecbf88b334840821d3e96
   > Blocks: 5            Seconds: 10
   > contract address:    0xD7e6348F3FF89BC82a75F8DC41e25f049e3E412d
   > block number:        15045839
   > block timestamp:     1631874641
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.76348701
   > gas used:            980549 (0xef645)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00980549 ETH


   Replacing 'NameService'
   -----------------------
   > transaction hash:    0x681f6a1a725bdb57d5916bb60474945ff456ed12c978060bd3066fc805a9c8f6
   > Blocks: 4            Seconds: 10
   > contract address:    0xfFa05C35FAA7F09cfCE8B60Ca2bF452bEED13b96
   > block number:        15045847
   > block timestamp:     1631874657
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.75854306
   > gas used:            494395 (0x78b3b)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.00494395 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0x00805E01c02Ed7F18434244DEeAF7d76ffD4f790)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0x0B7664088C2DdA8925A7335a91939D15f8C80AF2)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: MetaTx (at address: 0xD7e6348F3FF89BC82a75F8DC41e25f049e3E412d)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0xfFa05C35FAA7F09cfCE8B60Ca2bF452bEED13b96)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0x5879e211d1cf31d5f71136bbdcf51533ab148d466c6b5b2538d93d59bab209f7
   > Blocks: 6            Seconds: 13
   > contract address:    0xFf985Fc6b8b6b7Fe7376e748B0910744ee11836C
   > block number:        15045856
   > block timestamp:     1631874675
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.70566682
   > gas used:            5287624 (0x50aec8)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.05287624 ETH

Implementation= 0xFf985Fc6b8b6b7Fe7376e748B0910744ee11836C

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x0a155c09e4b0b0793148054446f36cb6002d864f815893ce9479cbc1195a41b4
   > Blocks: 4            Seconds: 9
   > contract address:    0xa3c68319b2D476E579c906cC8e9743babe80597C
   > block number:        15045870
   > block timestamp:     1631874703
   > account:             0xdd465C56b148e02082240cADFfE87831BA94eC92
   > balance:             889.68908217
   > gas used:            1658465 (0x194e61)
   > gas price:           10 gwei
   > value sent:          0 ETH
   > total cost:          0.01658465 ETH

Factory= 0xa3c68319b2D476E579c906cC8e9743babe80597C

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.10091917 ETH


03_testENS.js
=============

   > Saving migration to chain.
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   8
> Final cost:          0.10336217 ETH