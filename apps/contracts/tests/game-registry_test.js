import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that game can be registered",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    
    let block = chain.mineBlock([
      Tx.contractCall('game-registry', 'register-game', [
        types.ascii('https://example.com/snake'),
        types.ascii('Snake Game')
      ], deployer.address),
    ]);
    
    block.receipts[0].result.expectOk().expectUint(1);
    
    // Get game details
    let getBlock = chain.mineBlock([
      Tx.contractCall('game-registry', 'get-game', [
        types.uint(1)
      ], deployer.address),
    ]);
    
    const gameData = getBlock.receipts[0].result.expectSome().expectTuple();
    assertEquals(gameData['name'], types.ascii('Snake Game'));
  },
});

Clarinet.test({
  name: "Ensure that scores can be submitted",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    const wallet1 = accounts.get('wallet_1');
    
    // Register game first
    let setupBlock = chain.mineBlock([
      Tx.contractCall('game-registry', 'register-game', [
        types.ascii('https://example.com/snake'),
        types.ascii('Snake Game')
      ], deployer.address),
    ]);
    
    // Submit score
    const hash = new Uint8Array(32);
    hash[0] = 1;
    
    let block = chain.mineBlock([
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(1000),
        types.buff(hash)
      ], wallet1.address),
    ]);
    
    block.receipts[0].result.expectOk().expectUint(1000);
    
    // Get player score
    let scoreBlock = chain.mineBlock([
      Tx.contractCall('game-registry', 'get-player-score', [
        types.uint(1),
        types.principal(wallet1.address)
      ], wallet1.address),
    ]);
    
    const scoreData = scoreBlock.receipts[0].result.expectSome().expectTuple();
    assertEquals(scoreData['best-score'], types.uint(1000));
  },
});

Clarinet.test({
  name: "Ensure that duplicate hashes are rejected",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    const wallet1 = accounts.get('wallet_1');
    
    // Register game
    chain.mineBlock([
      Tx.contractCall('game-registry', 'register-game', [
        types.ascii('https://example.com/snake'),
        types.ascii('Snake Game')
      ], deployer.address),
    ]);
    
    const hash = new Uint8Array(32);
    hash[0] = 2;
    
    // Submit score first time
    let block1 = chain.mineBlock([
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(1000),
        types.buff(hash)
      ], wallet1.address),
    ]);
    block1.receipts[0].result.expectOk();
    
    // Try to submit with same hash
    let block2 = chain.mineBlock([
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(2000),
        types.buff(hash)
      ], wallet1.address),
    ]);
    
    block2.receipts[0].result.expectErr().expectUint(101);
  },
});

Clarinet.test({
  name: "Ensure that best score is tracked correctly",
  async fn(chain, accounts) {
    const deployer = accounts.get('deployer');
    const wallet1 = accounts.get('wallet_1');
    
    // Register game
    chain.mineBlock([
      Tx.contractCall('game-registry', 'register-game', [
        types.ascii('https://example.com/snake'),
        types.ascii('Snake Game')
      ], deployer.address),
    ]);
    
    // Submit multiple scores
    const hash1 = new Uint8Array(32);
    hash1[0] = 3;
    const hash2 = new Uint8Array(32);
    hash2[0] = 4;
    const hash3 = new Uint8Array(32);
    hash3[0] = 5;
    
    let block = chain.mineBlock([
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(500),
        types.buff(hash1)
      ], wallet1.address),
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(1500),
        types.buff(hash2)
      ], wallet1.address),
      Tx.contractCall('game-registry', 'submit-score', [
        types.uint(1),
        types.uint(1000),
        types.buff(hash3)
      ], wallet1.address),
    ]);
    
    // Get player score - should be highest (1500)
    let scoreBlock = chain.mineBlock([
      Tx.contractCall('game-registry', 'get-player-score', [
        types.uint(1),
        types.principal(wallet1.address)
      ], wallet1.address),
    ]);
    
    const scoreData = scoreBlock.receipts[0].result.expectSome().expectTuple();
    assertEquals(scoreData['best-score'], types.uint(1500));
    assertEquals(scoreData['total-plays'], types.uint(3));
  },
});
