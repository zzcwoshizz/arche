import ExtensionWallet from '@arche-polkadot/extension-wallet';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance, stringToHex } from '@polkadot/util';
import React from 'react';

const extension = new ExtensionWallet('example');

let api: ApiPromise;

const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    extension.on('enable', async () => {
      const accounts = await extension.getAccounts();
      const signer = await extension.getSigner();

      if (signer) {
        const provider = new WsProvider('wss://rpc.polkadot.io/');

        api = await ApiPromise.create({
          provider,
          signer
        });
        const balance = await api.derive.balances.all(accounts[0]);

        console.log(balance.freeBalance.toHuman());
        console.log(balance.frozenFee.toHuman());
        console.log(balance.frozenMisc.toHuman());
        console.log(balance.reservedBalance.toHuman());
        console.log(balance.lockedBalance.toHuman());
        console.log(balance.lockedBreakdown);
        console.log(balance.availableBalance.toHuman());
        console.log(balance.votingBalance.toHuman());
        console.log(balance.vestedBalance.toHuman());
        console.log(balance.vestedClaimable.toHuman());
        console.log(balance.vestingEndBlock.toHuman());
        console.log(balance.vestingLocked.toHuman());
        console.log(balance.vestingPerBlock.toHuman());
        console.log(balance.vestingTotal.toHuman());
        api
          .sign(accounts[0], {
            data: stringToHex('test')
          })
          .then(console.log);
      }
    });
    extension.on('disable', () => console.log('disable'));
    extension.on('error', () => console.log('error'));
  }, []);

  return (
    <div>
      <button
        onClick={async () => {
          await extension.enable();
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default App;
