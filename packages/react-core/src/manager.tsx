import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';
import React from 'react';

import { ArcheDispatchContext, ArcheStateContext } from './types';

const craeteArchContext = () => {
  const stateContext = React.createContext<ArcheStateContext>({} as ArcheStateContext);
  const dispatchContext = React.createContext<ArcheDispatchContext>({} as ArcheDispatchContext);

  return {
    stateContext,
    dispatchContext
  };
};

const { stateContext, dispatchContext } = craeteArchContext();

const ArcheProvider: React.FunctionComponent = ({ children }) => {
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [signer, setSigner] = React.useState<Signer | null>(null);
  const [wallet, setWallet] = React.useState<AbstractWallet | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  const enable = React.useCallback(
    async (wallet: AbstractWallet) => {
      wallet.once('enable', async () => {
        const [accounts, signer] = await Promise.all([wallet.getAccounts(), wallet.getSigner()]);

        setWallet(wallet);
        setAccounts(accounts);
        setSigner(signer);
        setEnabled(true);
      });

      wallet.enable();
    },
    [wallet, setWallet, setAccounts, setSigner, setSigner]
  );

  const disable = React.useCallback(() => {
    wallet?.once('disable', async () => {
      setWallet(null);
      setAccounts([]);
      setSigner(null);
      setEnabled(false);
    });

    wallet?.disable();
  }, [wallet, setWallet, setAccounts, setSigner, setSigner]);

  React.useEffect(() => {
    const onEnable = () => {
      setEnabled(true);
    };

    const onDisable = () => {
      setEnabled(false);
    };

    const onError = (error: any) => {
      console.error(error);
    };

    wallet?.on('enable', onEnable);

    wallet?.on('disable', onDisable);

    wallet?.on('error', onError);

    return () => {
      wallet?.off('enable', onEnable);
      wallet?.off('disable', onDisable);
      wallet?.off('error', onError);
    };
  }, [wallet, setEnabled]);

  return (
    <stateContext.Provider value={{ accounts, signer, wallet, enabled }}>
      <dispatchContext.Provider value={{ enable, disable }}>{children}</dispatchContext.Provider>
    </stateContext.Provider>
  );
};

const useArcheState = () => {
  const context = React.useContext(stateContext);

  if (context === undefined) {
    throw new Error('useArcheState must be provided by ArcheProvider');
  }

  return context;
};

const useArcheDispatch = () => {
  const context = React.useContext(dispatchContext);

  if (context === undefined) {
    throw new Error('useArcheDispatch must be provided by ArcheProvider');
  }

  return context;
};

export { ArcheProvider, useArcheState, useArcheDispatch };