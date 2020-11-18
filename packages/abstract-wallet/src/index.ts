import { Account, Signer } from '@arche-polkadot/types';

import Events from './Events';

abstract class AbstractWallet extends Events {
  public abstract async enable(): Promise<void>;

  public abstract async disable(): Promise<void>;

  public abstract async getAccounts(): Promise<Account[]>;

  public abstract async getSigner(): Promise<Signer | null>;

  protected abstract onError(error: any): void;
  protected abstract onEnable(...args: any[]): void;
  protected abstract onDisable(...args: any[]): void;
}

export default AbstractWallet;
