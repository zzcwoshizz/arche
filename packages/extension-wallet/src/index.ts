import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';
import {
  isWeb3Injected,
  web3Accounts,
  web3AccountsSubscribe,
  web3Enable,
  web3EnablePromise
} from '@polkadot/extension-dapp';
import warning from 'tiny-warning';

class NotInstallError extends Error {
  constructor() {
    super();
    this.message = 'Please install extension';
    this.name = 'NotInstallError';
  }
}

class ExtensionWallet extends AbstractWallet {
  #enabled = false;
  #originName: string;
  #signer: Signer | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #unsub: () => any = () => {};

  constructor(originName: string) {
    super();
    this.#originName = originName;
  }

  get enabled() {
    return this.#enabled;
  }

  /**
   * is browser install extension [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)
   */
  get isInjected(): boolean {
    return isWeb3Injected;
  }

  /**
   * get InjectedExtension
   */
  get injectedExtensions() {
    return web3EnablePromise;
  }

  get originName() {
    return this.#originName;
  }

  public async subscribe(cb: (accounts: Account[]) => void) {
    const injected = await this.isInjected;

    if (injected) {
      return;
    } else {
      warning(false, 'subscribe must call after call enable');

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
  }

  public async enable() {
    if (this.#enabled) {
      return;
    }

    const injected = await this.isInjected;

    if (!injected) {
      warning(false, 'Not install extension');

      this.onError(new NotInstallError());
      throw new NotInstallError();
    }

    try {
      const injected = await web3Enable(this.#originName);

      const unsub = await web3AccountsSubscribe((accounts) => {
        const _accounts = accounts.map((account) => account.address);

        this.onAccountChange(_accounts);
      });

      this.#unsub = unsub;

      this.#signer = injected[0].signer;

      this.#enabled = true;

      this.onEnable();
    } catch (error) {
      warning(false, error.message);
      this.onError(error);
    }
  }

  public async disable(): Promise<void> {
    this.#enabled = false;

    this.#signer = null;

    this.#unsub();

    this.onDisable();
  }

  public async getAccounts(): Promise<Account[]> {
    const injected = await this.isInjected;

    if (!injected) {
      warning(false, 'Not install extension');

      return [];
    }

    let accounts: Account[] = [];

    try {
      const accountWithMeta = await web3Accounts();

      accounts = accountWithMeta.map((account) => ({
        address: account.address,
        name: account.meta.name
      }));
    } catch (e) {
      warning(false, 'extension not enabled, falling back to call enable');
    }

    return accounts;
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

  protected onAccountChange(...args: any[]): void {
    this.emit('account_change', ...args);
  }
}

export default ExtensionWallet;
