
<p align="center">
  <img src="./webclient/public/logo_smartvault.png"" height ="55" alt="" align="middle" />
</p>

[**Smartvault.one**](https://smartvault.one) | 
[**Demo Videos**](#demo-videos) |
[**Security & Usability**](#demo-videos) |
[**Smart Contracts**](#smart-contracts) |
[**Relayer**](#relayer) |
[**Web client**](#Webclient)


SmartVault is a smart contract wallet designed with worry-free recovery using your Google Authenticator (no worry about key phrases, passwords, device loss, email phishing, sms hijacking), and with many advanced wallet features.

* **Worry-free recovery**: No worry about key phrases, passwords, device loss, email phishing, sms hijacking. Recover with 5 OTP tokens which means entering 30 digits code, providing you security of 100bits+ of entropy.
* **Harmony Name Service**: Just like domain registration, register yourself an easy name to lookup  your wallet and share with your friends.
* **Spending Limit**: Protect your wallet by capping spending limits and requiring 2FA OTP wallet verification.
* **Social Guardians**: Take your wallet security to next level by requiring multiple devices you own or friends & family to authorize over spending limits, and recovery. 
* **Smart contract without the hassle**: You don't need native wallet (like metamask or CLI) to sign transactions to use it. We designed *meta transactions* which can be relayed, and deduct fees from your wallet when it is successful.
* **Activate your wallet with a simple deposit**: Using counter-factual wallet [EIP 1014](https://eips.ethereum.org/EIPS/eip-1014), we can generate your "future" wallet before it is created, and safely deposit into the address any amount, from anywhere (even exchanges like Binance, Coinbase, etc), to activate your smart wallet contract (aka Smartvault).
* **Fully Upgradeable**: Your wallet has built-in upgrade functions. As we add more features like staking, DEX, simply upgrade with all the new features without moving your assets, and still keep the same address.

### Demo Videos
#### New Wallet Demo
![Demo Video- Create](designs/create.gif)

#### Recover Demo
![Demo Video- Recover](designs/create.gif)

## Security & Usabilities

## Deployment

Deployed to gh-pages branch.
Start using it out at [smartvault.one](https://smartvaule.one)

## Components

### Smart contracts

See [/contracts](/contracts/README.md)

### Relayer

See [/relayer](/relayer/README.md)

### Webclient

See [/webclient](/webclient/README.md)

## Credits

* Research paper: Ivan Homoliak & et al. https://arxiv.org/pdf/1812.03598.pdf
* https://github.com/ivan-homoliak-sutd/SmartOTPs
