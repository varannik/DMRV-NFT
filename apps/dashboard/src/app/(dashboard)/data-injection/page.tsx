'use client'

/**
 * Data Injection Page
 * 
 * Main page for submitting MRV data based on registry-driven configuration.
 * Displays the Net CORC calculation tree with expandable nodes.
 */

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Download,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { GlassCard, Button, LoadingSpinner, EmptyState } from '@/components/shared'
import { FormulaTree, RegistrySelector } from '@/components/registry'
import { useRegistryStore } from '@/lib/stores'
import { useRegistries, useProtocolTree } from '@/lib/hooks'
import type { InputMethod, NetCORCResult, GapAnalysis } from '@/types/registry'

export default function DataInjectionPage() {
  const router = useRouter()
  
  // Store state
  const {
    registries,
    selectedRegistryId,
    selectedProtocolId,
    currentSession,
    isCalculating,
    isSaving,
    error,
    selectRegistry,
    selectProtocol,
    createSession,
    updateFieldValue,
    uploadFile,
    calculateNetCORC,
    runGapAnalysis,
    submitForComputation,
    reset,
  } = useRegistryStore()
  
  // Local state
  const [netCorcResult, setNetCorcResult] = useState<NetCORCResult | null>(null)
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Fetch protocol tree
  const { tree, isLoading: isLoadingTree } = useProtocolTree(selectedRegistryId, selectedProtocolId)
  
  // Create session when protocol is selected
  useEffect(() => {
    if (selectedRegistryId && selectedProtocolId && !currentSession) {
      // For demo, use a mock project ID
      createSession('demo-project-id')
    }
  }, [selectedRegistryId, selectedProtocolId, currentSession, createSession])
  
  // Handle field change
  const handleFieldChange = useCallback((fieldId: string, value: unknown, source: InputMethod) => {
    updateFieldValue(fieldId, value, source)
    // Clear previous calculation when data changes
    setNetCorcResult(null)
    setGapAnalysis(null)
  }, [updateFieldValue])
  
  // Handle file upload
  const handleFileUpload = useCallback((fieldId: string, file: File) => {
    uploadFile(fieldId, file)
  }, [uploadFile])
  
  // Handle calculate
  const handleCalculate = useCallback(async () => {
    try {
      const result = await calculateNetCORC()
      setNetCorcResult(result)
      
      // Also run gap analysis
      const analysis = await runGapAnalysis()
      setGapAnalysis(analysis)
    } catch (err) {
      console.error('Calculation failed:', err)
    }
  }, [calculateNetCORC, runGapAnalysis])
  
  // Handle submit
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await submitForComputation()
      router.push('/mrv')
    } catch (err) {
      console.error('Submit failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [submitForComputation, router])
  
  // Handle template download
  const handleDownloadTemplate = useCallback(() => {
    // In production, this would trigger actual download
    alert('Template download not implemented in demo')
  }, [])
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-white">Data Injection</h1>
            <p className="text-white/60 text-sm mt-1">
              Submit MRV data for carbon credit certification
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Download Template */}
          <Button
            variant="ghost"
            onClick={handleDownloadTemplate}
            className="gap-2"
            disabled={!selectedProtocolId}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Template
          </Button>
          
          {/* Save Draft */}
          <Button
            variant="secondary"
            onClick={() => {/* Save draft */}}
            disabled={!currentSession || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </Button>
          
          {/* Submit */}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!gapAnalysis?.can_proceed_to_computation || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Submit for Computation
          </Button>
        </div>
      </div>
      
      {/* Registry Selection */}
      <RegistrySelector
        registries={registries}
        selectedRegistryId={selectedRegistryId}
        selectedProtocolId={selectedProtocolId}
        onRegistrySelect={selectRegistry}
        onProtocolSelect={selectProtocol}
      />
      
      {/* Gap Analysis Summary */}
      {gapAnalysis && (
        <GapAnalysisBanner analysis={gapAnalysis} />
      )}
      
      {/* Error Display */}
      {error && (
        <GlassCard className="p-4 bg-red-500/10 border-red-500/30">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </GlassCard>
      )}
      
      {/* Main Content */}
      {!selectedRegistryId || !selectedProtocolId ? (
        <GlassCard className="p-8">
          <EmptyState
            title="Select a Registry & Protocol"
            description="Choose your target registry and methodology to begin data injection"
            icon={<FileSpreadsheet className="w-12 h-12 text-white/20" />}
          />
        </GlassCard>
      ) : isLoadingTree ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading protocol configuration..." />
        </GlassCard>
      ) : tree && currentSession ? (
        <FormulaTree
          tree={tree}
          nodeStates={currentSession.node_states}
          fieldValues={currentSession.field_values}
          netCorcResult={netCorcResult}
          onFieldChange={handleFieldChange}
          onFileUpload={handleFileUpload}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />
      ) : (
        <GlassCard className="p-8">
          <EmptyState
            title="Protocol Not Found"
            description="The selected protocol configuration could not be loaded"
          />
        </GlassCard>
      )}
      
      {/* Session Info */}
      {currentSession && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-white/50">
              <span>Session: {currentSession.session_id.slice(0, 8)}...</span>
              <span>Status: {currentSession.status}</span>
              <span>Progress: {currentSession.overall_progress}%</span>
            </div>
            <div className="text-white/40">
              Last updated: {new Date(currentSession.updated_at).toLocaleString()}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}

interface GapAnalysisBannerProps {
  analysis: GapAnalysis
}

function GapAnalysisBanner({ analysis }: GapAnalysisBannerProps) {
  const canProceed = analysis.can_proceed_to_computation
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard 
        className={`p-4 ${
          canProceed 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-amber-500/10 border-amber-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {canProceed ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            
            <div>
              <p className={`font-medium ${canProceed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {canProceed 
                  ? 'Ready for Submission' 
                  : `${analysis.completeness_score}% Complete - Action Required`
                }
              </p>
              {!canProceed && analysis.recommendations.length > 0 && (
                <p className="text-sm text-white/60 mt-0.5">
                  {analysis.recommendations[0]}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/60">Completeness</p>
              <p className={`text-xl font-bold ${canProceed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {analysis.completeness_score}%
              </p>
            </div>
            
            {analysis.missing_required_fields.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-white/60">Missing Fields</p>
                <p className="text-xl font-bold text-red-400">
                  {analysis.missing_required_fields.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

