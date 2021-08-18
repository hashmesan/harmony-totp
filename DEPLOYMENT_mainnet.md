Starting migrations...
======================
> Network name:    'harmonymainnet'
> Network id:      1666600000
> Block gas limit: 80000000 (0x4c4b400)


01_libraries.js
===============

   Replacing 'Guardians'
   ---------------------
   > transaction hash:    0x0a2cd962447ebd4daf4f7f3c3d4aa4c88d6909f481369e576f0dfcb7095f884d
   > Blocks: 1            Seconds: 4
   > contract address:    0x0a0b3c065DE7C5667c202B6D0026bdf1077BE820
   > block number:        14781646
   > block timestamp:     1625084475
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.278224270109648396
   > gas used:            478383 (0x74caf)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00956766 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0xf84b0eea3e193f3a816728d4bdc4d4bdf7c58065e8ebfd3ded395c93a2c50f8f
   > Blocks: 1            Seconds: 4
   > contract address:    0xe97983E9e2d8594A53b3786f4562beb5D60C862E
   > block number:        14781649
   > block timestamp:     1625084484
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.276051570109648396
   > gas used:            108635 (0x1a85b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0021727 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0x95c410e5fd29c6f9b5abc2bcdcc4666e2440fa49b0eea116780197e37a349a69
   > Blocks: 1            Seconds: 4
   > contract address:    0x495a7E8e9550C6432Cd08774A894F016BC371cAF
   > block number:        14781652
   > block timestamp:     1625084494
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.266396190109648396
   > gas used:            482769 (0x75dd1)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00965538 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0x29362d8c82f9187f5fe08c0b88d66dbedc857d17b14eb09cf177d9b044d9a3f1
   > Blocks: 1            Seconds: 4
   > contract address:    0xb40081FEeB1a61B90C84364CCCd1d09349359642
   > block number:        14781655
   > block timestamp:     1625084504
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.249022010109648396
   > gas used:            868709 (0xd4165)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01737418 ETH


   Replacing 'NameService'
   -----------------------
   > transaction hash:    0xd201ab2692919f0682b4d589907692099599891da862de4f1160f84a0b62540e
   > Blocks: 3            Seconds: 8
   > contract address:    0xE2dab8567eDd70418A379028f52d8609fA7E6bdD
   > block number:        14781658
   > block timestamp:     1625084513
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.239140830109648396
   > gas used:            494059 (0x789eb)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00988118 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0x0a0b3c065DE7C5667c202B6D0026bdf1077BE820)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0x495a7E8e9550C6432Cd08774A894F016BC371cAF)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0xE2dab8567eDd70418A379028f52d8609fA7E6bdD)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0x1bb505812173935d0f5ece1c7d8589943479553c8c34541c6531d3a6b7d509dc
   > Blocks: 2            Seconds: 8
   > contract address:    0xcF8642EBCE2A43Df512aA83F520413c943Dba5Dc
   > block number:        14781661
   > block timestamp:     1625084524
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.171809630109648396
   > gas used:            3366560 (0x335ea0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0673312 ETH

Implementation= 0xcF8642EBCE2A43Df512aA83F520413c943Dba5Dc

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x7339d57a70bd99ef53021a2cffd7f9c50a611cf1c2b33b6067cfe9c11a218ff1
   > Blocks: 1            Seconds: 4
   > contract address:    0x66055D7645428d1294dc7fC160bB71058Cc00619
   > block number:        14781664
   > block timestamp:     1625084534
   > account:             0x257455D4AB8d71E813E36942Bba7BbD1B7f15031
   > balance:             286.142602510109648396
   > gas used:            1460356 (0x164884)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02920712 ETH

Factory= 0x66055D7645428d1294dc7fC160bB71058Cc00619
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.14518942 ETH


02_testENS.js
=============
Deploying on  harmonymainnet block= 14781665
name hash:  0x8ada342410322a1cc38cc04ac516581740996bacbf88d2a55e0064133ecca850
Resolver crazy.one:  0x43B2b112ef03725B5FD42e3ad9b7f2d857ed4642
Computed wallet= 0x3afb20bF81d67DAAbf2d203b3043429587eECB97 1500000000000000000
Duration= 31536000
BIGSECRET 0 4
BIGSECRET 1 4
BIGSECRET 2 4
BIGSECRET 3 4
BIGSECRET 4 4
RESOLVED? 0x3afb20bF81d67DAAbf2d203b3043429587eECB97 0x3afb20bF81d67DAAbf2d203b3043429587eECB97
BALANCE (AFTER)= 0x3afb20bF81d67DAAbf2d203b3043429587eECB97 499999999999999953
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   7
> Final cost:          0.14518942 ETH