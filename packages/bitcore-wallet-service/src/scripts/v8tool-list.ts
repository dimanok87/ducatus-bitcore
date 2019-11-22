#!/usr/bin/env node

var _ = require('lodash');
const request = require('request');
const Bitcore = require('bitcore-lib');
const requestStream = require('request');
import { Client } from '../lib//blockchainexplorers/v8/client';

const coin = 'BTC';
console.log('COIN:', coin);
const network = 'mainnet';
const authKey = process.argv[2];

if (!authKey)
  throw new Error('provide authKey');

// ====================
//
const authKeyObj =  Bitcore.PrivateKey(authKey);

let tmp  = authKeyObj.toObject();
tmp.compressed = false;
const pubKey = Bitcore.PrivateKey(tmp).toPublicKey() ;
const baseUrl = `http://127.0.0.1:3000/api/${coin}/${network}`;
let client = new Client({
  baseUrl,
  authKey: authKeyObj,
});

// utxos
// addresses

// const url = `${baseUrl}/wallet/${pubKey}/${path}`;
const url = `${baseUrl}/wallet/${pubKey}/transactions?startBlock=0&includeMempool=true`;
console.log('[v8tool.37:url:]', url);
const signature = client.sign({ method: 'GET', url });
const payload = {};
var acum = '';

let r = requestStream.get(url, {
  headers: { 'x-signature': signature },
  json: true
});

r.on('data', (raw) => {
  acum = acum + raw.toString();
});

r.on('end', () => {
  let txs = [], unconf = [], err;
  _.each(acum.split(/\r?\n/), (rawTx) => {
    if (!rawTx)
    return;

    let tx;
    try {
      tx = JSON.parse(rawTx);
    } catch (e) {
      log.error('v8 error at JSON.parse:' + e  + ' Parsing:' + rawTx + ':');
    }
    // v8 field name differences
    if (tx.value)
    tx.amount = tx.satoshis / 1e8;

    if (tx.height >= 0)
      txs.push(tx);
    else
      unconf.push(tx);
  });
  console.log('txs', _.flatten(_.orderBy(unconf, 'blockTime', 'desc').concat(txs.reverse())));
});
