/**
 * Registry Configurations Index
 * 
 * This file exports all available registry configurations.
 * New registries can be added by creating a new config file and adding it here.
 * 
 * In production, these configurations would be fetched from the backend API,
 * allowing dynamic addition of new registries without frontend deployment.
 */

import type { RegistryConfig } from '@/types/registry'
import { verraConfig } from './verra'
import { puroConfig } from './puro'
import { isometricConfig } from './isometric'

/**
 * All available registry configurations
 */
export const registryConfigs: RegistryConfig[] = [
  verraConfig,
  puroConfig,
  isometricConfig,
]

/**
 * Get a registry configuration by ID
 */
export function getRegistryConfig(registryId: string): RegistryConfig | undefined {
  return registryConfigs.find(r => r.registry_id === registryId)
}

/**
 * Get a protocol configuration by registry and protocol ID
 */
export function getProtocolConfig(registryId: string, protocolId: string) {
  const registry = getRegistryConfig(registryId)
  return registry?.protocols.find(p => p.protocol_id === protocolId)
}

/**
 * Get all protocols for a registry
 */
export function getRegistryProtocols(registryId: string) {
  const registry = getRegistryConfig(registryId)
  return registry?.protocols ?? []
}

/**
 * Get registry summary list (for dropdowns)
 */
export function getRegistrySummaries() {
  return registryConfigs.map(r => ({
    registry_id: r.registry_id,
    registry_name: r.registry_name,
    protocol_count: r.protocols.length,
    logo_url: r.logo_url,
  }))
}

export { verraConfig } from './verra'
export { puroConfig } from './puro'
export { isometricConfig } from './isometric'

