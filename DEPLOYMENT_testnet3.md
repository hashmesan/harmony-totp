Starting migrations...
======================
> Network name:    'harmonytestnet'
> Network id:      1666700003
> Block gas limit: 80000000 (0x4c4b400)


01_initial_migrations.js
========================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x16405b179c6f73ea0b6a7116cbcb5cd14a5f85add20aa6123a7f94372bdf4ed0
   > Blocks: 4            Seconds: 9
   > contract address:    0x890874e79F44Fd4c1A7f51d2A5Ea29FEAE8AaD9a
   > block number:        11928261
   > block timestamp:     1625669242
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.497758989999999953
   > gas used:            186963 (0x2da53)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00373926 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00373926 ETH


02_libraries.js
===============

   Replacing 'Guardians'
   ---------------------
   > transaction hash:    0x3354a718c49dabf74660bfe34c4ec559448accd61afd5d6a19991d22db0de4e5
   > Blocks: 2            Seconds: 5
   > contract address:    0xe1DC1F5C1668EA80BbE71d9c8e452E8a572A27ae
   > block number:        11928276
   > block timestamp:     1625669272
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.487344629999999953
   > gas used:            478383 (0x74caf)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00956766 ETH


   Replacing 'DailyLimit'
   ----------------------
   > transaction hash:    0xca9d2cd9efa8053acd5b37f533ca6fa106283667579c288a55334b4b09be9a7e
   > Blocks: 3            Seconds: 5
   > contract address:    0x1005439a408087b8DdA9a8cDE7EF6414E94EB924
   > block number:        11928282
   > block timestamp:     1625669284
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.485171929999999953
   > gas used:            108635 (0x1a85b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0021727 ETH


   Replacing 'Recovery'
   --------------------
   > transaction hash:    0x56b7276411428466a09fbd0bb8749779d44aba14b6621a8dbdb4ec2769458b56
   > Blocks: 3            Seconds: 5
   > contract address:    0xBae6882E67CF2832ccdF439B403EF867A5e618b2
   > block number:        11928288
   > block timestamp:     1625669296
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.475516549999999953
   > gas used:            482769 (0x75dd1)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00965538 ETH


   Replacing 'MetaTx'
   ------------------
   > transaction hash:    0xf908abd584d190377a38a77d4824b8fe143ca71469221093067ea73ff71bfd02
   > Blocks: 3            Seconds: 5
   > contract address:    0x62A076c94331d22F674eB27e03A8CA3b56cF90C8
   > block number:        11928293
   > block timestamp:     1625669306
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.458142369999999953
   > gas used:            868709 (0xd4165)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01737418 ETH


   Replacing 'NameService'
   -----------------------
   > transaction hash:    0x53d8124f655a0a545bdad7d3d33a9c3e61f320e6963d90609774e4fc2ca482ae
   > Blocks: 2            Seconds: 5
   > contract address:    0xC4CdcbF8d09f8d0325aE7E94E2D3Ed9110bc3470
   > block number:        11928298
   > block timestamp:     1625669316
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.448261189999999953
   > gas used:            494059 (0x789eb)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00988118 ETH


   Linking
   -------
   * Contract: TOTPWallet <--> Library: Guardians (at address: 0xe1DC1F5C1668EA80BbE71d9c8e452E8a572A27ae)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: Recovery (at address: 0xBae6882E67CF2832ccdF439B403EF867A5e618b2)

   Linking
   -------
   * Contract: TOTPWallet <--> Library: NameService (at address: 0xC4CdcbF8d09f8d0325aE7E94E2D3Ed9110bc3470)

   Replacing 'TOTPWallet'
   ----------------------
   > transaction hash:    0x035be5bbb3a6ac5415463bd9a3e484527f15c72c1c66c3b6c3c62b2e483ea48f
   > Blocks: 3            Seconds: 5
   > contract address:    0x58442C05C67CBC55311f8C1D9c43625716b05870
   > block number:        11928304
   > block timestamp:     1625669328
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.381102469999999953
   > gas used:            3357936 (0x333cf0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.06715872 ETH

Implementation= 0x58442C05C67CBC55311f8C1D9c43625716b05870

   Replacing 'WalletFactory'
   -------------------------
   > transaction hash:    0x62c880bb01ce259bcaae36274dbc5a889eb7b3cc9e50bca5126f8fccacb56b48
   > Blocks: 2            Seconds: 5
   > contract address:    0xebDCB8F3AFD1Dda1DA456f8055eC6aa1A8D7Ce86
   > block number:        11928309
   > block timestamp:     1625669338
   > account:             0x1727adCCe8F11E7b9cbDd065e5ab64158F8BcE3B
   > balance:             111.351895349999999953
   > gas used:            1460356 (0x164884)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02920712 ETH

Factory= 0xebDCB8F3AFD1Dda1DA456f8055eC6aa1A8D7Ce86

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.14501694 ETH


03_testENS.js
=============

   > Saving migration to chain.
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   8
> Final cost:          0.1487562 ETH
