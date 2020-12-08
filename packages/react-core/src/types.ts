import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';

export interface ArcheStateContext {
  accounts: Account[];
  signer: Signer | null;
  wallet: AbstractWallet | null;
  connected: boolean;
}

export interface ArcheDispatchContext {
  connect: (wallet: AbstractWallet) => Promise<void>;
  disconnect: () => void;
}
