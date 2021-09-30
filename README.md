[**NoBank.Finance**](https://no-bank.finance) |
[**Demo Videos**](#demo-videos) |
[**Security & Usability**](#security--usabilities) |
[**Smart Contracts**](#smart-contracts) |
[**Relayer**](#relayer) |
[**Web client**](#Webclient)

[![](https://github.com/hashmesan/harmony-totp/actions/workflows/webclient.yml/badge.svg?branch=develop)](https://github.com/hashmesan/harmony-totp/actions/workflows/webclient.yml)
[![](https://github.com/adirery/nobank/actions/workflows/heroku.yml/badge.svg?branch=develop)](https://github.com/adirery/nobank/actions/workflows/heroku.yml)

</p>

NoBank is a smart contract wallet designed with worry-free recovery using your Google Authenticator (no worry about key phrases, passwords, device loss, email phishing, sms hijacking), and with many advanced wallet features.

![Slide 1](docs/Slide1.png)
![Slide 2](docs/Slide2.png)
![Slide 3](docs/Slide3.png)
![Slide 4](docs/Slide4.png)
![Slide 5](docs/Slide5.png)
![Slide 6](docs/Slide6.png)
![Slide 7](docs/Slide7.png)
![Slide 8](docs/Slide8.png)
![Slide 9](docs/Slide9.png)
![Slide 10](docs/Slide10.png)

### Key Technical Features

- **Worry-free recovery**: No worry about key phrases, passwords, device loss, email phishing, sms hijacking. Recover with 5 OTP tokens which means entering 30 digits code, providing you security of 100bits+ of entropy.
- **Harmony Name Service**: Just like domain registration, register yourself an easy name to lookup your wallet and share with your friends.
- **HRC20/HRC721/HRC1155**: Fully supported HRC20, Non-Fungible Tokens (ERC721), and Multi-token Standard (HRC1155).
- **Spending Limit**: Protect your wallet by capping spending limits and requiring 2FA OTP wallet verification.
- **Social Guardians**: Take your wallet security to next level by requiring multiple devices you own or friends & family to authorize over spending limits, and recovery.
- **Smart contract without the hassle**: You don't need native wallet (like metamask or CLI) to sign transactions to use it. We designed _meta transactions_ which can be relayed, and deduct fees from your wallet when it is successful.
- **Activate your wallet with a simple deposit**: Using counter-factual wallet [EIP 1014](https://eips.ethereum.org/EIPS/eip-1014), we can generate your "future" wallet before it is created, and safely deposit into the address any amount, from anywhere (even exchanges like Binance, Coinbase, etc), to activate your smart wallet contract (aka Smartvault).
- **Fully Upgradeable**: Smartvault has built-in upgrade functions. As there are more features like staking, DEX added, simply upgrade with all the new features without moving your assets, and still keep the same address.
- **Dapp integration**: Integrate with any Dapp with multi-call support. See [Uniswap/Viper demo](https://github.com/hashmesan/harmony-totp/wiki/Integrating-DAPP)

Contract Audited by **Slowmist** - see [report](/audit/SlowMist%20Audit%20Report.pdf)

### Demo Videos

## Developer Guide

[SmartVault Specifications](https://github.com/hashmesan/harmony-totp/wiki/SmartVault-Specifications)

[Developer Guide](https://github.com/hashmesan/harmony-totp/wiki/Developer-Guide)

[Integrating Dapp](https://github.com/hashmesan/harmony-totp/wiki/Integrating-DAPP)

## Deployment

Deployed to gh-pages branch.
Start using it out at [smartvault.one](https://smartvaule.one)

## Components

### Command Line

Install: `npm -g @hashmesan/smartvault`

```
Usage: smartvault [options] [command]

Options:
  -V, --version                                           output the version number
  -e --env <env>                                          environment mainnet0, testnet0, testnet3 (default: "mainnet0")
  -h, --help                                              display help for command

Commands:
  new [options] <name>                                    creates a new wallet
  recover <name> <code1> <code2> <code3> <code4> <code5>  recover wallet
  list                                                    list all wallets
  balance <address>                                       get balance
  transfer [options] [to] [amount]                        Transfer funds
  info <address>                                          Display wallet info
  set_daily_limit [options] <amount>                      set daily limit
  set_drain_address [options] <address>                   set drain address
  upgrade [options]                                       upgrades contract to latest
  debug-break [options]                                   forces a revert
  help [command]                                          display help for command
```

See [Examples](https://github.com/hashmesan/harmony-totp/wiki/CLI-Examples)

### Smart contracts

See [/contracts](/contracts/README.md)

Contract Audited by Slowmist - see [report](/audit/SlowMist%20Audit%20Report.pdf)

### Relayer

See [/relayer](/relayer/README.md)

### Webclient

See [/webclient](/webclient/README.md)

## Credits

- Research paper: Ivan Homoliak & et al. https://arxiv.org/pdf/1812.03598.pdf
- https://github.com/ivan-homoliak-sutd/SmartOTPs
