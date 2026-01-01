'use client'

/**
 * Settings Page
 * 
 * Tenant and user settings.
 */

import { motion } from 'framer-motion'
import { Settings, User, Building2, Shield, Bell, Key } from 'lucide-react'
import { GlassCard, Button, Input } from '@/components/shared'

const settingSections = [
  { id: 'profile', icon: User, title: 'Profile', desc: 'Update your personal information' },
  { id: 'organization', icon: Building2, title: 'Organization', desc: 'Manage your organization settings' },
  { id: 'security', icon: Shield, title: 'Security', desc: 'Password and MFA settings' },
  { id: 'notifications', icon: Bell, title: 'Notifications', desc: 'Configure email and push notifications' },
  { id: 'api', icon: Key, title: 'API Keys', desc: 'Manage API access and webhooks' },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account and organization preferences</p>
      </div>
      
      {/* Settings Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/10 flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  <p className="text-sm text-white/60">{section.desc}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      
      {/* Quick Settings */}
      <GlassCard>
        <h2 className="text-xl font-semibold text-white mb-6">Quick Settings</h2>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Display Name" defaultValue="John Doe" />
            <Input label="Email" type="email" defaultValue="john@example.com" />
          </div>
          <div className="flex justify-end">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

