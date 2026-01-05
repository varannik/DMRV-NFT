'use client'

/**
 * RegistrySelector Component
 * 
 * Dropdown for selecting a registry and protocol for data injection.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Check, 
  Building2, 
  FileText,
  ExternalLink,
  Search,
} from 'lucide-react'
import { GlassCard } from '@/components/shared'
import type { RegistryConfig, ProtocolConfig } from '@/types/registry'
import type { RegistryType } from '@/types'
import clsx from 'clsx'

export interface RegistrySelectorProps {
  registries: RegistryConfig[]
  selectedRegistryId: RegistryType | null
  selectedProtocolId: string | null
  onRegistrySelect: (registryId: RegistryType) => void
  onProtocolSelect: (protocolId: string) => void
  disabled?: boolean
  className?: string
}

export function RegistrySelector({
  registries,
  selectedRegistryId,
  selectedProtocolId,
  onRegistrySelect,
  onProtocolSelect,
  disabled = false,
  className,
}: RegistrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Get selected registry and protocol
  const selectedRegistry = registries.find(r => r.registry_id === selectedRegistryId)
  const selectedProtocol = selectedRegistry?.protocols.find(p => p.protocol_id === selectedProtocolId)
  
  // Filter registries based on search
  const filteredRegistries = registries.filter(r =>
    r.registry_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.protocols.some(p => p.protocol_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between gap-3 p-4 rounded-xl transition-all',
          'bg-white/5 border border-white/10',
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-white/10 hover:border-white/20 cursor-pointer'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white/60" />
          </div>
          
          <div className="text-left">
            {selectedRegistry && selectedProtocol ? (
              <>
                <p className="font-medium text-white">
                  {selectedRegistry.registry_name}
                </p>
                <p className="text-sm text-white/50">
                  {selectedProtocol.protocol_name}
                </p>
              </>
            ) : selectedRegistry ? (
              <>
                <p className="font-medium text-white">
                  {selectedRegistry.registry_name}
                </p>
                <p className="text-sm text-amber-400">
                  Select a protocol
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-white/60">
                  Select Registry & Protocol
                </p>
                <p className="text-sm text-white/40">
                  Choose your target certification
                </p>
              </>
            )}
          </div>
        </div>
        
        <ChevronDown 
          className={clsx(
            'w-5 h-5 text-white/40 transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </button>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <GlassCard variant="dropdown" className="p-2 max-h-96 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search registries..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg
                             text-white text-sm placeholder:text-white/30
                             focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                  />
                </div>
              </div>
              
              {/* Registry List */}
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {filteredRegistries.map(registry => (
                  <RegistryItem
                    key={registry.registry_id}
                    registry={registry}
                    isSelected={registry.registry_id === selectedRegistryId}
                    selectedProtocolId={selectedProtocolId}
                    onRegistrySelect={() => {
                      onRegistrySelect(registry.registry_id)
                      // Auto-select first protocol if only one
                      if (registry.protocols.length === 1) {
                        onProtocolSelect(registry.protocols[0].protocol_id)
                        setIsOpen(false)
                      }
                    }}
                    onProtocolSelect={(protocolId) => {
                      onProtocolSelect(protocolId)
                      setIsOpen(false)
                    }}
                  />
                ))}
                
                {filteredRegistries.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    No registries found
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface RegistryItemProps {
  registry: RegistryConfig
  isSelected: boolean
  selectedProtocolId: string | null
  onRegistrySelect: () => void
  onProtocolSelect: (protocolId: string) => void
}

function RegistryItem({
  registry,
  isSelected,
  selectedProtocolId,
  onRegistrySelect,
  onProtocolSelect,
}: RegistryItemProps) {
  const [showProtocols, setShowProtocols] = useState(isSelected)
  
  return (
    <div className={clsx(
      'rounded-lg overflow-hidden',
      isSelected && 'bg-white/5'
    )}>
      {/* Registry Header */}
      <div
        onClick={() => {
          onRegistrySelect()
          setShowProtocols(true)
        }}
        className={clsx(
          'flex items-center gap-3 p-3 cursor-pointer transition-colors',
          isSelected 
            ? 'bg-emerald-500/10' 
            : 'hover:bg-white/5'
        )}
      >
        {/* Logo placeholder */}
        <div className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
          isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'
        )}>
          {registry.registry_name.substring(0, 2).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <p className="font-medium text-white text-sm">{registry.registry_name}</p>
          <p className="text-xs text-white/50">
            {registry.protocols.length} protocol{registry.protocols.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {isSelected && (
          <Check className="w-4 h-4 text-emerald-400" />
        )}
        
        <ChevronDown 
          className={clsx(
            'w-4 h-4 text-white/40 transition-transform',
            showProtocols && 'rotate-180'
          )}
          onClick={e => {
            e.stopPropagation()
            setShowProtocols(!showProtocols)
          }}
        />
      </div>
      
      {/* Protocols List */}
      <AnimatePresence>
        {showProtocols && registry.protocols.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5"
          >
            {registry.protocols.map(protocol => (
              <ProtocolItem
                key={protocol.protocol_id}
                protocol={protocol}
                isSelected={selectedProtocolId === protocol.protocol_id}
                onSelect={() => onProtocolSelect(protocol.protocol_id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ProtocolItemProps {
  protocol: ProtocolConfig
  isSelected: boolean
  onSelect: () => void
}

function ProtocolItem({ protocol, isSelected, onSelect }: ProtocolItemProps) {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'flex items-center gap-3 p-3 pl-14 cursor-pointer transition-colors',
        isSelected 
          ? 'bg-emerald-500/10' 
          : 'hover:bg-white/5'
      )}
    >
      <FileText className={clsx(
        'w-4 h-4',
        isSelected ? 'text-emerald-400' : 'text-white/40'
      )} />
      
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-sm truncate',
          isSelected ? 'text-white' : 'text-white/80'
        )}>
          {protocol.protocol_name}
        </p>
        <p className="text-xs text-white/40">
          {protocol.protocol_id} • {protocol.version}
        </p>
      </div>
      
      {isSelected && (
        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      )}
      
      {protocol.documentation_url && (
        <a
          href={protocol.documentation_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="p-1 text-white/40 hover:text-white/60 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  )
}

export default RegistrySelector

