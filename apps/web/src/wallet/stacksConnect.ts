import { showConnect, openContractCall, openSTXTransfer } from '@stacks/connect';
import { AppConfig, UserSession } from '@stacks/auth';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  callReadOnlyFunction,
  uintCV,
  principalCV,
  bufferCV,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
  createAssetInfo
} from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const network =
  import.meta.env.VITE_STACKS_NETWORK === 'mainnet'
    ? new StacksMainnet()
    : new StacksTestnet();

export async function connectWallet(): Promise<any> {
  return new Promise((resolve, reject) => {
    showConnect({
      userSession,
      appDetails: {
        name: 'Bitgame',
        icon: window.location.origin + '/icon.png'
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        resolve(userData);
      },
      onCancel: () => reject(new Error('User cancelled'))
    });
  });
}

export function disconnectWallet() {
  userSession.signUserOut();
}

export function getStxAddress(): string | null {
  if (!userSession.isUserSignedIn()) return null;
  const data = userSession.loadUserData();
  const isMainnet = import.meta.env.VITE_STACKS_NETWORK === 'mainnet';
  return isMainnet ? data.profile?.stxAddress?.mainnet : data.profile?.stxAddress?.testnet;
}

export function isWalletConnected(): boolean {
  return userSession.isUserSignedIn();
}

export async function readStxBalance(address: string): Promise<number> {
  try {
    const apiUrl = network instanceof StacksMainnet 
      ? 'https://api.hiro.so'
      : 'https://api.testnet.hiro.so';
    
    const response = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`);
    const data = await response.json();
    
    // STX balance is in microSTX (1 STX = 1,000,000 microSTX)
    const microStx = parseInt(data.stx.balance);
    return microStx / 1000000; // Convert to STX
  } catch (error) {
    console.error('Error reading STX balance:', error);
    return 0;
  }
}

export async function sendStxTip(
  recipientAddress: string,
  amount: number, // Amount in STX (will be converted to microSTX)
  memo?: string
): Promise<string> {
  const senderAddress = getStxAddress();
  if (!senderAddress) throw new Error('Wallet not connected');

  // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
  const amountInMicroStx = Math.floor(amount * 1000000);

  // Create post condition for the transfer
  const postConditions = [
    makeStandardSTXPostCondition(
      senderAddress,
      FungibleConditionCode.Equal,
      amountInMicroStx
    )
  ];

  return new Promise((resolve, reject) => {
    openSTXTransfer({
      network,
      recipient: recipientAddress,
      amount: amountInMicroStx.toString(),
      memo: memo || 'Bitgame Tip 🎁',
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      onFinish: (data) => {
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      }
    });
  });
}

export async function submitScoreOnChain(
  gameId: number,
  score: number,
  payloadHash: string
): Promise<string> {
  const senderAddress = getStxAddress();
  if (!senderAddress) throw new Error('Wallet not connected');

  const contractAddress = import.meta.env.VITE_GAME_REGISTRY_ADDRESS;
  const contractName = import.meta.env.VITE_GAME_REGISTRY_NAME;

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress,
      contractName,
      functionName: 'submit-score',
      functionArgs: [
        uintCV(gameId),
        uintCV(score),
        bufferCV(Buffer.from(payloadHash, 'hex'))
      ],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('Transaction cancelled'));
      }
    });
  });
}


