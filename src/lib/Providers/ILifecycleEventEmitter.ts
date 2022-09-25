/* eslint-disable semi */

import EventEmitter from '../Events/EventEmitter';

export default interface ILifecycleEventEmitter {
  startEvent: EventEmitter<void>;
  endEvent: EventEmitter<void>;
  tickEvent: EventEmitter<void>;
};
