import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';
import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';

class ExtensionWallet extends AbstractWallet {
  #enabled = false;
  #originName: string;
  #signer: Signer | null = null;

  constructor(originName: string) {
    super();
    this.#originName = originName;
  }

  get enabled() {
    return this.#enabled;
  }

  get isInjected(): boolean {
    return isWeb3Injected;
  }

  get originName() {
    return this.#originName;
  }

  public async enable() {
    if (this.#enabled) {
      return;
    }

    try {
      const injected = await web3Enable(this.#originName);

      this.#signer = injected[0].signer;

      this.#enabled = true;

      this.onEnable();
    } catch (error) {
      this.onError(error);
    }
  }

  public async disable(): Promise<void> {
    this.#enabled = false;

    this.#signer = null;

    this.onDisable();
  }

  public async getAccounts(): Promise<Account[]> {
    const accounts = await web3Accounts();

    return accounts.map((account) => account.address);
  }

  public async getSigner(): Promise<Signer | null> {
    return this.#signer;
  }

  protected onError(error: any): void {
    this.emit('error', error);
  }

  protected onEnable(...args: any[]): void {
    this.emit('enable', ...args);
  }

  protected onDisable(...args: any[]): void {
    this.emit('disable', ...args);
  }
}

export default ExtensionWallet;
