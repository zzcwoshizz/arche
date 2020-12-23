import type AbstractWallet from '@arche-polkadot/abstract-wallet';
import type { Account, Provider, Signer } from '@arche-polkadot/types';

export interface ArcheStateContext {
  accounts: Account[];
  signer: Signer | null;
  provider: Provider | null;
  wallet: AbstractWallet | null;
  connected: boolean;
}

export interface ArcheDispatchContext {
  connect: (wallet: AbstractWallet) => Promise<void>;
  disconnect: () => void;
}
