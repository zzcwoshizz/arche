"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useArcheState = exports.useArcheDispatch = exports.ArcheProvider = void 0;
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
// Copyright 2023-2023 zc.zhang authors & contributors
// SPDX-License-Identifier: Apache-2.0

const craeteArchContext = () => {
  const stateContext = /*#__PURE__*/_react.default.createContext({});
  const dispatchContext = /*#__PURE__*/_react.default.createContext({});
  return {
    dispatchContext,
    stateContext
  };
};
const {
  dispatchContext,
  stateContext
} = craeteArchContext();
const ArcheProvider = ({
  children
}) => {
  const [accounts, setAccounts] = _react.default.useState([]);
  const [signer, setSigner] = _react.default.useState(null);
  const [provider, setProvider] = _react.default.useState(null);
  const [wallet, setWallet] = _react.default.useState(null);
  const [connected, setConnected] = _react.default.useState(false);
  const connect = _react.default.useCallback(async wallet => {
    setWallet(wallet);
    await wallet.enable();
  }, []);
  const disconnect = _react.default.useCallback(async () => {
    await (wallet == null ? void 0 : wallet.disable());
  }, [wallet]);
  _react.default.useEffect(() => {
    const onEnable = () => {
      setConnected(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all([wallet == null ? void 0 : wallet.getAccounts(), wallet == null ? void 0 : wallet.getSigner(), wallet == null ? void 0 : wallet.getProvider()]).then(([accounts, signer, provider]) => {
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
    const onError = error => {
      console.error(error);
    };
    const onAccountChange = accounts => {
      setAccounts(accounts);
    };
    wallet == null ? void 0 : wallet.on('enable', onEnable);
    wallet == null ? void 0 : wallet.on('disable', onDisable);
    wallet == null ? void 0 : wallet.on('error', onError);
    wallet == null ? void 0 : wallet.on('account_change', onAccountChange);
    return () => {
      wallet == null ? void 0 : wallet.off('enable', onEnable);
      wallet == null ? void 0 : wallet.off('disable', onDisable);
      wallet == null ? void 0 : wallet.off('error', onError);
      wallet == null ? void 0 : wallet.off('account_change', onAccountChange);
    };
  }, [wallet]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(stateContext.Provider, {
    value: {
      accounts,
      connected,
      provider,
      signer,
      wallet
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(dispatchContext.Provider, {
      value: {
        connect,
        disconnect
      },
      children: children
    })
  });
};
exports.ArcheProvider = ArcheProvider;
const useArcheState = () => {
  const context = _react.default.useContext(stateContext);
  if (context === undefined) {
    throw new Error('useArcheState must be provided by ArcheProvider');
  }
  return context;
};
exports.useArcheState = useArcheState;
const useArcheDispatch = () => {
  const context = _react.default.useContext(dispatchContext);
  if (context === undefined) {
    throw new Error('useArcheDispatch must be provided by ArcheProvider');
  }
  return context;
};
exports.useArcheDispatch = useArcheDispatch;