import AbstractWallet from '@arche-polkadot/abstract-wallet';
import { Account, Signer } from '@arche-polkadot/types';
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

const ArcheProvider: React.FunctionComponent = ({ children }) => {
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [signer, setSigner] = React.useState<Signer | null>(null);
  const [wallet, setWallet] = React.useState<AbstractWallet | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  const enable = React.useCallback(async (wallet: AbstractWallet) => {
    wallet.once('enable', async () => {
      const [accounts, signer] = await Promise.all([wallet.getAccounts(), wallet.getSigner()]);

      setWallet(wallet);
      setAccounts(accounts);
      setSigner(signer);
      setEnabled(true);
    });

    await wallet.enable();
  }, []);

  const disable = React.useCallback(async () => {
    wallet?.once('disable', () => {
      setWallet(null);
      setAccounts([]);
      setSigner(null);
      setEnabled(false);
    });

    await wallet?.disable();
  }, [wallet]);

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
    <stateContext.Provider value={{ accounts, enabled, signer, wallet }}>
      <dispatchContext.Provider value={{ disable, enable }}>{children}</dispatchContext.Provider>
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
