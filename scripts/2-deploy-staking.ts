import { Address, getRandomNonce, toNano, WalletTypes } from "locklift";

async function main() {
    const signer = (await locklift.keystore.getSigner("0"))!;
    const account = await locklift.factory.accounts.addExistingAccount({
      type: WalletTypes.WalletV3,
      publicKey: signer.publicKey,
    });
    const { contract: staking, tx } = await locklift.factory.deployContract({
      contract: "Staking",
      publicKey: signer.publicKey,
      initParams: {
        _nonce: getRandomNonce(),
        _owner: account.address
      },
      constructorParams: {
        stakingTokenRoot: new Address('0:4e73ec103bc5c4998e7d92473fdd17ee7d4941fd681f07f6610085119a90ce1c'),
        stakingNFTRoot: new Address('0:127f28a512b73050a306a0836bb683bde3598e268594874b6aaa9a88c3b479d5'),
        sendRemainingGasTo: account.address
      },
      value: locklift.utils.toNano(2),
    });
  
    console.log(`Staking deployed at: ${staking.address.toString()}`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(e => {
      console.log(e);
      process.exit(1);
    });
  