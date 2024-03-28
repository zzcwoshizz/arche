"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _eventemitter = _interopRequireDefault(require("eventemitter3"));
// Copyright 2023-2023 zc.zhang authors & contributors
// SPDX-License-Identifier: Apache-2.0

class Events {
  #eventemitter = new _eventemitter.default();
  emit(type, ...args) {
    return this.#eventemitter.emit(type, ...args);
  }
  on(type, handler) {
    this.#eventemitter.on(type, handler);
    return this;
  }
  off(type, handler) {
    this.#eventemitter.removeListener(type, handler);
    return this;
  }
  once(type, handler) {
    this.#eventemitter.once(type, handler);
    return this;
  }
}
var _default = exports.default = Events;