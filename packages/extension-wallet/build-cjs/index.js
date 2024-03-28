"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _abstractWallet = _interopRequireDefault(require("@arche-polkadot/abstract-wallet"));
var _extensionDapp = require("@polkadot/extension-dapp");
var _tinyWarning = _interopRequireDefault(require("tiny-warning"));
// Copyright 2023-2023 zc.zhang authors & contributors
// SPDX-License-Identifier: Apache-2.0

class NotInstallError extends Error {
  constructor() {
    super();
    this.message = 'Please install extension';
    this.name = 'NotInstallError';
  }
}
class ExtensionWallet extends _abstractWallet.default {
  #enabled = false;
  #originName;
  #signer = null;
  #provier = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #unsub = () => {};
  constructor(originName) {
    super();
    this.#originName = originName;
  }
  get enabled() {
    return this.#enabled;
  }

  /**
   * is browser install extension [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)
   */
  get isInjected() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Object.keys(window.injectedWeb3).length !== 0;
  }

  /**
   * get InjectedExtension
   */
  get injectedExtensions() {
    return _extensionDapp.web3EnablePromise;
  }
  get originName() {
    return this.#originName;
  }
  async enable() {
    if (this.#enabled) {
      return;
    }
    const injected = this.isInjected;
    if (!injected) {
      (0, _tinyWarning.default)(false, 'Not install extension');
      this.onError(new NotInstallError());
      throw new NotInstallError();
    }
    try {
      const injected = await (0, _extensionDapp.web3Enable)(this.#originName);
      const unsub = await (0, _extensionDapp.web3AccountsSubscribe)(accounts => {
        const _accounts = accounts.map(account => ({
          address: account.address,
          meta: {
            genesisHash: account.meta.genesisHash,
            name: account.meta.name,
            source: account.meta.source
          }
        }));
        this.onAccountChange(_accounts);
      });
      this.#unsub = unsub;
      this.#signer = injected[0].signer;
      this.#provier = injected[0].provider || null;
      this.#enabled = true;
      this.onEnable();
    } catch (error) {
      (0, _tinyWarning.default)(false, error.message);
      this.onError(error);
    }
  }
  async disable() {
    this.#enabled = false;
    this.#signer = null;
    this.#unsub();
    this.onDisable();
    await Promise.resolve();
  }
  async getAccounts() {
    const injected = this.isInjected;
    if (!injected) {
      (0, _tinyWarning.default)(false, 'Not install extension');
      return [];
    }
    let accounts = [];
    try {
      const accountWithMeta = await (0, _extensionDapp.web3Accounts)();
      accounts = accountWithMeta.map(account => ({
        address: account.address,
        meta: {
          genesisHash: account.meta.genesisHash,
          name: account.meta.name,
          source: account.meta.source
        }
      }));
    } catch (e) {
      (0, _tinyWarning.default)(false, 'extension not enabled, falling back to call enable');
    }
    return accounts;
  }
  async getSigner() {
    await Promise.resolve();
    return this.#signer;
  }
  async getProvider() {
    await Promise.resolve();
    return this.#provier;
  }
  onError(error) {
    this.emit('error', error);
  }
  onEnable(...args) {
    this.emit('enable', ...args);
  }
  onDisable(...args) {
    this.emit('disable', ...args);
  }
  onAccountChange(accounts) {
    this.emit('account_change', accounts);
  }
}
var _default = exports.default = ExtensionWallet;