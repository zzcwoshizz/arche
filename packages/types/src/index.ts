import type { Signer as ApiSigner } from '@polkadot/api/types';
import type { ProviderInterface } from '@polkadot/rpc-provider/types';

export type WalletEvents = 'enable' | 'disable' | 'error' | 'account_change';

export type Account = {
  address: string;
  meta: {
    genesisHash?: string | null;
    name?: string;
    source: string;
  };
};

export type Signer = ApiSigner;

export type Provider = ProviderInterface;
