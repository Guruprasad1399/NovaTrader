import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextProps {
	balance: number;
	addBalance: (amount: number) => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const useWallet = (): WalletContextProps => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error("useWallet must be used within a WalletProvider");
	}
	return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	const [balance, setBalance] = useState<number>(0);

	const addBalance = (amount: number) => {
		setBalance((prevBalance) => prevBalance + amount);
	};

	return (
		<WalletContext.Provider value={{ balance, addBalance }}>
			{children}
		</WalletContext.Provider>
	);
};
