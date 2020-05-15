import Web3 from 'web3';
import { ERC721Abi } from './abi';

import { DUCXTxProvider } from '../ducx';

export class ERC721TxProvider extends DUCXTxProvider {
  getERC721Contract(tokenContractAddress: string) {
    const web3 = new Web3();
    const contract = new web3.eth.Contract(ERC721Abi, tokenContractAddress);
    return contract;
  }

  create(params: {
    recipients: Array<{ address: string; amount: string }>;
    nonce: number;
    gasPrice: number;
    data: string;
    gasLimit: number;
    tokenAddress: string;
    from: string;
    tokenId: number;
    chainId?: number;
  }) {
    const { tokenAddress } = params;
    const data = this.encodeData(params);
    const recipients = [{ address: tokenAddress, amount: '0' }];
    const newParams = { ...params, recipients, data };
    return super.create(newParams);
  }

  encodeData(params: {
    recipients: Array<{ address: string; amount: string }>;
    tokenAddress: string;
    from: string;
    tokenId: number;
  }) {
    const [{ address }] = params.recipients;
    const { tokenAddress, from, tokenId } = params;
    const data = this.getERC721Contract(tokenAddress)
      .methods.transferFrom(from, address, tokenId)
      .encodeABI();
    return data;
  }
}
