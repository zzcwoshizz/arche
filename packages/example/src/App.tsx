import { useArcheState } from '@arche-polkadot/react-core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import React from 'react';

import EnableButton from './EnableButton';

let api: ApiPromise;

const App: React.FunctionComponent = () => {
  const {
    signer,
    accounts: [account]
  } = useArcheState();

  React.useEffect(() => {
    const provider = new WsProvider('wss://rpc.polkadot.io/');

    api = new ApiPromise({
      provider
    });
  }, []);

  React.useEffect(() => {
    if (signer) {
      api.setSigner(signer);
    }
  }, [signer]);

  const getBalance = React.useCallback(async () => {
    await api.isReady;

    const balances = await api.derive.balances.all(account.address);

    console.log('availableBalance', balances.availableBalance.toHuman());
    console.log('freeBalance', balances.freeBalance.toHuman());
    console.log('reservedBalance', balances.reservedBalance.toHuman());

    // transfer
    const submitable = api.tx.balances.transfer(account.address, 20000000000);

    await submitable.signAndSend(account.address);
  }, [account]);

  return (
    <div>
      <EnableButton onClick={getBalance}>获取余额</EnableButton>
    </div>
  );
};

export default App;
