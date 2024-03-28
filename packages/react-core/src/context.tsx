// Copyright 2023-2023 zc.zhang authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type AbstractWallet from '@arche-polkadot/abstract-wallet';
import type { Account, Provider, Signer } from '@arche-polkadot/types';

import React from 'react';

import { ArcheDispatchContext, ArcheStateContext } from './types';

const craeteArchContext = () => {
  const stateContext = React.createContext<ArcheStateContext>({} as ArcheStateContext);
  const dispatchContext = React.createContext<ArcheDispatchContext>({} as ArcheDispatchContext);

  return {
    dispatchContext,
    stateContext
  };
};

const { dispatchContext, stateContext } = craeteArchContext();

const ArcheProvider: React.FunctionComponent = ({ children }: { children?: React.ReactNode }) => {
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [signer, setSigner] = React.useState<Signer | null>(null);
  const [provider, setProvider] = React.useState<Provider | null>(null);
  const [wallet, setWallet] = React.useState<AbstractWallet | null>(null);
  const [connected, setConnected] = React.useState(false);

  const connect = React.useCallback(async (wallet: AbstractWallet) => {
    setWallet(wallet);
    await wallet.enable();
  }, []);

  const disconnect = React.useCallback(async () => {
    await wallet?.disable();
  }, [wallet]);

  React.useEffect(() => {
    const onEnable = () => {
      setConnected(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all([wallet?.getAccounts(), wallet?.getSigner(), wallet?.getProvider()]).then(([accounts, signer, provider]) => {
        setAccounts(accounts || []);
        setSigner(signer || null);
        setProvider(provider || null);
      });
    };

    const onDisable = () => {
      setConnected(false);
      setSigner(null);
      setProvider(null);
      setAccounts([]);
      setWallet(null);
    };

    const onError = (error: any) => {
      console.error(error);
    };

    const onAccountChange = (accounts: Account[]) => {
      setAccounts(accounts);
    };

    wallet?.on('enable', onEnable);

    wallet?.on('disable', onDisable);

    wallet?.on('error', onError);

    wallet?.on('account_change', onAccountChange);

    return () => {
      wallet?.off('enable', onEnable);
      wallet?.off('disable', onDisable);
      wallet?.off('error', onError);
      wallet?.off('account_change', onAccountChange);
    };
  }, [wallet]);

  return (
    <stateContext.Provider value={{ accounts, connected, provider, signer, wallet }}>
      <dispatchContext.Provider value={{ connect, disconnect }}>{children}</dispatchContext.Provider>
    </stateContext.Provider>
  );
};

const useArcheState = (): ArcheStateContext => {
  const context = React.useContext(stateContext);

  if (context === undefined) {
    throw new Error('useArcheState must be provided by ArcheProvider');
  }

  return context;
};

const useArcheDispatch = (): ArcheDispatchContext => {
  const context = React.useContext(dispatchContext);

  if (context === undefined) {
    throw new Error('useArcheDispatch must be provided by ArcheProvider');
  }

  return context;
};

export { ArcheProvider, useArcheState, useArcheDispatch };
