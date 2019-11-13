import { IChain } from '..';
import { BitcoreLibCash } from 'crypto-ducatus-wallet-core';
import { BtcChain } from '../btc';

export class BchChain extends BtcChain implements IChain {
  constructor() {
    super(BitcoreLibCash);
  }
}
