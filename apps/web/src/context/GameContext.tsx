import { createContext, useContext, useRef, ReactNode } from 'react';
import BitgameBridge from '../sdk/BitgameBridge';

interface GameContextType {
  bridge: BitgameBridge;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const bridgeRef = useRef<BitgameBridge>(new BitgameBridge());

  return (
    <GameContext.Provider value={{ bridge: bridgeRef.current }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameBridge() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameBridge must be used within GameProvider');
  }
  return context.bridge;
}


