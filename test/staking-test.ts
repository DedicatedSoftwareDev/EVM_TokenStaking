import { expect } from "chai";
import { Contract, Signer, getRandomNonce, WalletTypes, Address, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";

let stakingCont: Contract<FactorySource["Staking"]>;
let signer: Signer;
let account: any;
let tokenRoot: Contract<FactorySource["TokenRoot"]>;
const ZERO_ADDRESS = "0:0000000000000000000000000000000000000000000000000000000000000000"

describe("Test Staking contract", async function () {
  before(async () => {
    // we will use "before" section for initialize some Wallet for tokensale owner and deploy tip3 TokenRoot
    signer = (await locklift.keystore.getSigner("0"))!
    // const { account: accountAddOperation } = await locklift.factory.accounts.addNewAccount({
    //     type: WalletTypes.WalletV3,
    //     value: toNano(10000),
    //     publicKey: signer.publicKey
    // });
    // account = accountAddOperation;
    // const { contract: tip3root } = await locklift.factory.deployContract({
    //   contract: "TokenRoot",
    //   publicKey: signer.publicKey,
    //   initParams: {
    //       randomNonce_: 0,
    //       deployer_: new Address(ZERO_ADDRESS),
    //       name_: "test",
    //       symbol_: "tst",
    //       decimals_: 3,
    //       rootOwner_: account.address,
    //       walletCode_: (await locklift.factory.getContractArtifacts("TokenWallet")).code,
    //   },
    //   constructorParams: {
    //       initialSupplyTo: account.address,
    //       initialSupply: 100000000000,
    //       deployWalletValue: 100000000,
    //       mintDisabled: true,
    //       burnByRootDisabled: true,
    //       burnPaused: false,
    //       remainingGasTo: account.address,
    //   },
    //   value: toNano(3)
    // });
    // tokenRoot = tip3root;
  });
  describe("Contracts", async function () {
    it("Load contract factory", async function () {
      const stakingData = await locklift.factory.getContractArtifacts("Staking");

      expect(stakingData.code).not.to.equal(undefined, "Code should be available");
      expect(stakingData.abi).not.to.equal(undefined, "ABI should be available");
      expect(stakingData.tvc).not.to.equal(undefined, "tvc should be available");
    });

    it("Deploy contract", async function () {
      const account = await locklift.factory.accounts.addExistingAccount({
        type: WalletTypes.WalletV3,
        publicKey: signer.publicKey,
      });
      const _owner = account.address;
      const { contract } = await locklift.factory.deployContract({
        contract: "Staking",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: getRandomNonce(),
          _owner
        },
        constructorParams: {
          stakingTokenRoot: new Address('0:4e73ec103bc5c4998e7d92473fdd17ee7d4941fd681f07f6610085119a90ce1c'),
          stakingNFTRoot: new Address('0:127f28a512b73050a306a0836bb683bde3598e268594874b6aaa9a88c3b479d5'),
          sendRemainingGasTo: account.address,
        },
        value: locklift.utils.toNano(3),
      });
      stakingCont = contract;
      console.log(stakingCont.address);
      expect(await locklift.provider.getBalance(stakingCont.address).then(balance => Number(balance))).to.be.above(0);
    });

    it("Interact with contract", async function () {
      // const NEW_STATE = 1;

      const addr = await stakingCont.methods._stakingTokenWallet({}).call();
      const addr1 = await stakingCont.methods._stakingTokenRoot({}).call();
      const addr2 = await stakingCont.methods._stakingNFTRoot({}).call();
      console.log(addr, addr1, addr2);
      // const response = await sample.methods.getDetails({}).call();

      // expect(Number(response._state)).to.be.equal(NEW_STATE, "Wrong state");
    });
    
    // it("Interact with contract", async function () {
    //   // const NEW_STATE = 1;

    //   // await sample.methods.setState({ _state: NEW_STATE }).sendExternal({ publicKey: signer.publicKey });

    //   // const response = await sample.methods.getDetails({}).call();

    //   // expect(Number(response._state)).to.be.equal(NEW_STATE, "Wrong state");
    // });
  });
});
