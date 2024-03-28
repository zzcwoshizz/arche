// Copyright 2023-2023 zc.zhang authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WalletEvents } from '@arche-polkadot/types';
import EventEmitter from 'eventemitter3';

class Events {
  #eventemitter = new EventEmitter();

  protected emit(type: WalletEvents, ...args: any[]): boolean {
    return this.#eventemitter.emit(type, ...args);
  }

  public on(type: WalletEvents, handler: (...args: any[]) => any): this {
    this.#eventemitter.on(type, handler);

    return this;
  }

  public off(type: WalletEvents, handler: (...args: any[]) => any): this {
    this.#eventemitter.removeListener(type, handler);

    return this;
  }

  public once(type: WalletEvents, handler: (...args: any[]) => any): this {
    this.#eventemitter.once(type, handler);

    return this;
  }
}

export default Events;
