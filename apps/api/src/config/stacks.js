import { StacksTestnet, StacksMainnet } from '@stacks/network';

const isMainnet = process.env.STACKS_NETWORK === 'mainnet';

export const stacksNetwork = isMainnet ? new StacksMainnet() : new StacksTestnet();

export const contractConfig = {
  bitToken: {
    address: process.env.BIT_TOKEN_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    name: process.env.BIT_TOKEN_NAME || 'bit-token'
  },
  gameRegistry: {
    address: process.env.GAME_REGISTRY_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    name: process.env.GAME_REGISTRY_NAME || 'game-registry'
  }
};
