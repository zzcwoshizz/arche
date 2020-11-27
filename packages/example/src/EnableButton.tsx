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
  const { enabled } = useArcheState();
  const { enable } = useArcheDispatch();

  if (enabled) {
    return <button {...props} />;
  } else {
    return (
      <button
        {...props}
        onClick={async () => {
          await enable(extension);
        }}
      >
        Connect Wallet
      </button>
    );
  }
};

export default EnableButton;
