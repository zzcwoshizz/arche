import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';

export interface ArcheStateContext {
  accounts: Account[];
  signer: Signer | null;
  wallet: AbstractWallet | null;
  enabled: boolean;
}

export interface ArcheDispatchContext {
  enable: (wallet: AbstractWallet) => Promise<void>;
  disable: () => void;
}
