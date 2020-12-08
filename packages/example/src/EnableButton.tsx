import ExtensionWallet from '@arche-polkadot/extension-wallet';
import { useArcheDispatch, useArcheState } from '@arche-polkadot/react-core';
import React from 'react';

const extension = new ExtensionWallet('example');

const EnableButton: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => {
  const { connected } = useArcheState();
  const { connect } = useArcheDispatch();

  if (connected) {
    return <button {...props} />;
  } else {
    return (
      <button
        {...props}
        onClick={async () => {
          await connect(extension);
        }}
      >
        Connect Wallet
      </button>
    );
  }
};

export default EnableButton;
