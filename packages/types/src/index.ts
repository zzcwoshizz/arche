import { Signer as ApiSigner } from '@polkadot/api/types';

export type WalletEvents = 'enable' | 'disable' | 'error' | 'account_change';

export type Account = {
  name?: string;
  address: string;
};

export type Signer = ApiSigner;
