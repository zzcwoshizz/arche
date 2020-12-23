import { useArcheState } from '@arche-polkadot/react-core';
import { ApiPromise } from '@polkadot/api';
import React from 'react';

import EnableButton from './EnableButton';

let api: ApiPromise;

const App: React.FunctionComponent = () => {
  const { accounts, provider, signer } = useArcheState();

  const account = React.useMemo(() => {
    if (accounts.length > 0) {
      return accounts[0];
    }

    return null;
  }, [accounts]);

  React.useEffect(() => {
    api = new ApiPromise({ provider: provider || undefined });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      provider?.disconnect();
    };
  }, [provider]);

  React.useEffect(() => {
    if (signer) {
      api.setSigner(signer);
    }
  }, [signer]);

  const getBalance = React.useCallback(async () => {
    if (!account) {
      return;
    }

    await api?.isReady;

    const balances = await api?.derive.balances.all(account.address);

    console.log('availableBalance', balances?.availableBalance.toHuman());
    console.log('freeBalance', balances?.freeBalance.toHuman());
    console.log('reservedBalance', balances?.reservedBalance.toHuman());

    // transfer
    const submitable = api?.tx.balances.transfer(account.address, 20000000000);

    await submitable?.signAndSend(account.address);
  }, [account]);

  return (
    <div>
      <EnableButton onClick={getBalance}>获取余额</EnableButton>
    </div>
  );
};

export default App;
