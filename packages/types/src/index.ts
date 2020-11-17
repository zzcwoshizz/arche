import { Signer as ApiSigner } from '@polkadot/api/types';

export type WalletEvents = 'enable' | 'disable' | 'error';

export type Account = string;

export type Signer = ApiSigner;
