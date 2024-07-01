"use client"

import {http} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

import {createConfig} from '@privy-io/wagmi';

import {PrivyProvider, type PrivyClientConfig} from '@privy-io/react-auth';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {WagmiProvider} from '@privy-io/wagmi';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { JsonRpcSigner } from 'ethers/providers';
import { ethers } from 'ethers';
const EthersContext = createContext<EthersContextValue | null>(null);


const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: 'dark',
    accentColor: '#676FFF',
  },
  defaultChain: baseSepolia,
  loginMethods: ['farcaster'],
  embeddedWallets: {
    createOnLogin: 'all-users',
  },
};

interface EthersContextValue {
  ethersProvider: ethers.BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
}

export default function Provider({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_ID!;
    const queryClient = new QueryClient();
    const [ethersProvider, setEthersProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    
    useEffect(() => {
        const initEthers = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = signer.address;
                    setEthersProvider(provider);
                    setSigner(signer);
                    setAddress(address);
                } catch (error) {
                    console.error('Error connecting to MetaMask', error);
                }
            } else {
                console.error('Please install MetaMask!');
            }
        };
        initEthers();
    }, []);

    return (
      <PrivyProvider appId={appId} config={privyConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <EthersContext.Provider value={{ ethersProvider, signer, address }}>
                {children}
              </EthersContext.Provider>
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>);
}

export const useEthers = () => useContext(EthersContext);
