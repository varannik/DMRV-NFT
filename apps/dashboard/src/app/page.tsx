'use client'

/**
 * Landing Page
 * 
 * The main landing page for the DMRV Dashboard platform.
 * Showcases features, workflow, and calls to action.
 * 
 * Reference: https://charmindustrial.com
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Link2, 
  BarChart3, 
  Layers,
  CheckCircle,
  Play,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react'
import { GlassCard, Button } from '@/components/shared'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <GlassCard className="!p-3 !rounded-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">DMRV</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-white/70 hover:text-white transition">Features</Link>
              <Link href="#workflow" className="text-white/70 hover:text-white transition">Workflow</Link>
              <Link href="#registries" className="text-white/70 hover:text-white transition">Registries</Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Registry-First Approach
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Digital MRV for</span>
              <br />
              <span className="text-gradient">Carbon Credit Issuance</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 max-w-2xl mx-auto mb-10"
            >
              Streamline your carbon credit workflow with blockchain-verified MRV data, 
              multi-registry integration, and real-time tracking from submission to NFT minting.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-in">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="secondary" size="lg" leftIcon={<Play className="w-5 h-5" />}>
                Watch Demo
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: '4+', label: 'Registry Integrations' },
                { value: '8-Phase', label: 'Verification Workflow' },
                { value: 'Real-time', label: 'Blockchain Verification' },
              ].map((stat) => (
                <GlassCard key={stat.label} className="!p-6 text-center" variant="subtle">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to manage carbon credit issuance at scale
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Link2,
                title: 'Registry Integration',
                description: 'Connect directly to Verra, Puro, Isometric, and EU ETS registries with real-time synchronization.',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: Shield,
                title: 'Blockchain Verification',
                description: 'Every MRV submission is hashed and minted as an NFT on NEAR for immutable verification.',
                color: 'from-blue-500 to-indigo-600',
              },
              {
                icon: Zap,
                title: '9-Category Verification',
                description: 'Comprehensive verification process covering all aspects from project setup to removal data.',
                color: 'from-purple-500 to-violet-600',
              },
              {
                icon: Globe,
                title: 'Multi-Tenant Platform',
                description: 'Isolated environments for each organization with custom branding and SSO support.',
                color: 'from-amber-500 to-orange-600',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Track tonnage, verification status, and credit lifecycle with live dashboards.',
                color: 'from-rose-500 to-pink-600',
              },
              {
                icon: Layers,
                title: 'Gap Analysis',
                description: 'Automated gap analysis ensures your data meets registry requirements before submission.',
                color: 'from-cyan-500 to-teal-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full" hover>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              8-Phase Credit Issuance Workflow
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              From data ingestion to NFT minting, every step is tracked and verified
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { phase: 0, name: 'Registry Selection', desc: 'Select registry & gap analysis' },
              { phase: 1, name: 'Data Ingestion', desc: 'Receive & validate MRV data' },
              { phase: 2, name: 'MRV Computation', desc: 'Calculate tonnage & emissions' },
              { phase: 3, name: 'Verification', desc: '9-category verification process' },
              { phase: 4, name: 'Canonical Hashing', desc: 'Generate immutable MRV hash' },
              { phase: 5, name: 'Registry Submission', desc: 'Submit to carbon registry' },
              { phase: 6, name: 'NFT Minting', desc: 'Mint credit NFT on NEAR' },
              { phase: 7, name: 'Active Credit', desc: 'Ready for trading' },
            ].map((step, index) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="relative" variant="subtle">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {step.phase}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1 mt-2">
                    {step.name}
                  </h4>
                  <p className="text-sm text-white/60">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registries Section */}
      <section id="registries" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Supported Registries
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Direct integration with leading carbon registries worldwide
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Verra VCS', logo: '🌍', desc: 'Verified Carbon Standard' },
              { name: 'Puro.earth', logo: '🌱', desc: 'Carbon Removal Marketplace' },
              { name: 'Isometric', logo: '📐', desc: 'Science-First Registry' },
              { name: 'EU ETS', logo: '🇪🇺', desc: 'European Union ETS' },
            ].map((registry) => (
              <motion.div
                key={registry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard className="text-center" hover>
                  <div className="text-4xl mb-4">{registry.logo}</div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {registry.name}
                  </h3>
                  <p className="text-white/60 text-sm">{registry.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center !p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Streamline Your Carbon Credit Workflow?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join organizations using DMRV to issue verified carbon credits with blockchain-backed transparency.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/sign-in">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancel anytime
              </span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">DMRV</span>
              </Link>
              <p className="text-white/60 text-sm">
                Digital MRV for Carbon Credit Issuance. Blockchain-verified, registry-first.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#workflow" className="hover:text-white transition">Workflow</Link></li>
                <li><Link href="#registries" className="hover:text-white transition">Registries</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition">API Reference</Link></li>
                <li><Link href="#" className="hover:text-white transition">Status</Link></li>
                <li><Link href="#" className="hover:text-white transition">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} DMRV. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
