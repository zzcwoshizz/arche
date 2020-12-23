import type { Account, Signer, Provider } from '@arche-polkadot/types';

import Events from './Events';

abstract class AbstractWallet extends Events {
  public abstract enable(): Promise<void>;

  public abstract disable(): Promise<void>;

  public abstract getAccounts(): Promise<Account[]>;

  public abstract getSigner(): Promise<Signer | null>;

  public abstract getProvider(): Promise<Provider | null>;

  protected abstract onError(error: Error): void;
  protected abstract onEnable(...args: any[]): void;
  protected abstract onDisable(...args: any[]): void;
}

export default AbstractWallet;
