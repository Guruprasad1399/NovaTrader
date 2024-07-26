// src/contexts/WalletContext.tsx
import { createContext, useState, useContext } from 'react';

interface WalletContextType {
    balance: number;
    addBalance: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC = ({ children }) => {
    const [balance, setBalance] = useState(0);

    const addBalance = (amount: number) => {
        setBalance(prevBalance => prevBalance + amount);
    };

    return (
        <WalletContext.Provider value={{ balance, addBalance }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};