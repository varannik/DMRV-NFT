/**
 * NEAR Wallet Store
 * 
 * Manages NEAR wallet connection state and network status.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { NetworkType, NetworkStatus, WalletState } from '@/types/marketplace'

interface WalletStoreState extends WalletState {
  networkStatus: NetworkStatus
  isConnecting: boolean
  error: string | null
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  setNetwork: (network: NetworkType) => void
  refreshBalance: () => Promise<void>
  clearError: () => void
}

const initialNetworkStatus: NetworkStatus = {
  network: 'mainnet',
  isHealthy: true,
  blockHeight: 125432567,
  tps: 847,
  activeValidators: 100,
  totalTransactions: 8943210,
  avgBlockTime: 1.2,
  gasPrice: 0.00001,
}

export const useWalletStore = create<WalletStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        isConnected: false,
        accountId: null,
        balance: {
          near: 0,
          usd: 0,
        },
        network: 'mainnet',
        networkStatus: initialNetworkStatus,
        isConnecting: false,
        error: null,

        // Actions
        connect: async () => {
          set({ isConnecting: true, error: null })
          try {
            // Simulate wallet connection
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Mock successful connection
            set({
              isConnected: true,
              accountId: 'demo-user.near',
              balance: {
                near: 1250.45,
                usd: 6252.25,
              },
              isConnecting: false,
            })
          } catch (error) {
            set({
              error: 'Failed to connect wallet. Please try again.',
              isConnecting: false,
            })
          }
        },

        disconnect: () => {
          set({
            isConnected: false,
            accountId: null,
            balance: { near: 0, usd: 0 },
          })
        },

        setNetwork: (network) => {
          set({ 
            network,
            networkStatus: {
              ...get().networkStatus,
              network,
            }
          })
        },

        refreshBalance: async () => {
          if (!get().isConnected) return
          
          // Simulate balance refresh
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Mock balance update with slight variation
          const variation = (Math.random() - 0.5) * 10
          set(state => ({
            balance: {
              near: state.balance.near + variation,
              usd: (state.balance.near + variation) * 5,
            }
          }))
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'dmrv-wallet-storage',
        partialize: (state) => ({
          network: state.network,
          // Don't persist connection state for security
        }),
      }
    ),
    { name: 'WalletStore' }
  )
)
