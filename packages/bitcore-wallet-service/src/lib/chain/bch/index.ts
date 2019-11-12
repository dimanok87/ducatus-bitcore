import { BitcoreLibCash } from '../../../../../crypto-ducatus-wallet-core';
import _ from 'lodash';
import { IChain } from '..';
import { BtcChain } from '../btc';

export class BchChain extends BtcChain implements IChain {
  constructor() {
    super(BitcoreLibCash);
  }
}
