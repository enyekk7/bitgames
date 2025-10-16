import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that token has correct metadata",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    
    let block = chain.mineBlock([
      Tx.contractCall('bit-token', 'get-name', [], deployer.address),
      Tx.contractCall('bit-token', 'get-symbol', [], deployer.address),
      Tx.contractCall('bit-token', 'get-decimals', [], deployer.address),
    ]);
    
    block.receipts[0].result.expectOk().expectAscii('Bitgame Token');
    block.receipts[1].result.expectOk().expectAscii('BIT');
    block.receipts[2].result.expectOk().expectUint(6);
  },
});

Clarinet.test({
  name: "Ensure that tokens can be transferred",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    const wallet1 = accounts.get('wallet_1');
    const wallet2 = accounts.get('wallet_2');
    
    // Mint tokens to wallet1
    let block = chain.mineBlock([
      Tx.contractCall('bit-token', 'mint', [
        types.uint(1000000),
        types.principal(wallet1.address)
      ], deployer.address),
    ]);
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Check balance
    let balanceBlock = chain.mineBlock([
      Tx.contractCall('bit-token', 'get-balance', [
        types.principal(wallet1.address)
      ], wallet1.address),
    ]);
    balanceBlock.receipts[0].result.expectOk().expectUint(1000000);
    
    // Transfer tokens
    let transferBlock = chain.mineBlock([
      Tx.contractCall('bit-token', 'transfer', [
        types.uint(500000),
        types.principal(wallet1.address),
        types.principal(wallet2.address),
        types.none()
      ], wallet1.address),
    ]);
    transferBlock.receipts[0].result.expectOk().expectBool(true);
    
    // Check balances after transfer
    let finalBalances = chain.mineBlock([
      Tx.contractCall('bit-token', 'get-balance', [
        types.principal(wallet1.address)
      ], wallet1.address),
      Tx.contractCall('bit-token', 'get-balance', [
        types.principal(wallet2.address)
      ], wallet2.address),
    ]);
    finalBalances.receipts[0].result.expectOk().expectUint(500000);
    finalBalances.receipts[1].result.expectOk().expectUint(500000);
  },
});

Clarinet.test({
  name: "Ensure that only admin can mint",
  async fn(chain, accounts) {
    const wallet1 = accounts.get('wallet_1');
    
    let block = chain.mineBlock([
      Tx.contractCall('bit-token', 'mint', [
        types.uint(1000000),
        types.principal(wallet1.address)
      ], wallet1.address),
    ]);
    
    block.receipts[0].result.expectErr().expectUint(100);
  },
});
