'use client'

/**
 * TreeNode Component
 * 
 * Renders the input fields for a formula tree node.
 * Handles different input types: number, string, file, array, etc.
 */

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  HelpCircle,
  AlertCircle,
  FileSpreadsheet,
  Send,
} from 'lucide-react'
import { GlassCard, Button, Input } from '@/components/shared'
import type { FormulaNode, InputField, FieldState, InputMethod, UploadedFile } from '@/types/registry'
import clsx from 'clsx'

export interface TreeNodeProps {
  node: FormulaNode
  fieldValues: { [field_id: string]: FieldState }
  onFieldChange: (fieldId: string, value: unknown, source: InputMethod) => void
  onFileUpload: (fieldId: string, file: File) => void
  className?: string
}

export function TreeNode({
  node,
  fieldValues,
  onFieldChange,
  onFileUpload,
  className,
}: TreeNodeProps) {
  if (!node.required_inputs || node.required_inputs.length === 0) {
    return null
  }
  
  return (
    <div className={clsx('space-y-4', className)}>
      {/* Input Methods Header */}
      <div className="flex items-center gap-4 text-sm text-white/60">
        <span>Input Methods:</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded">
            <Send className="w-3 h-3" />
            API
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded">
            <FileSpreadsheet className="w-3 h-3" />
            Excel
          </span>
          <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded">
            <Upload className="w-3 h-3" />
            Upload
          </span>
        </div>
      </div>
      
      {/* Input Fields */}
      <div className="grid gap-4">
        {node.required_inputs.map(input => (
          <InputFieldRenderer
            key={input.field_id}
            input={input}
            fieldState={fieldValues[input.field_id]}
            onChange={(value, source) => onFieldChange(input.field_id, value, source)}
            onFileUpload={(file) => onFileUpload(input.field_id, file)}
          />
        ))}
      </div>
    </div>
  )
}

interface InputFieldRendererProps {
  input: InputField
  fieldState?: FieldState
  onChange: (value: unknown, source: InputMethod) => void
  onFileUpload: (file: File) => void
}

function InputFieldRenderer({
  input,
  fieldState,
  onChange,
  onFileUpload,
}: InputFieldRendererProps) {
  const [showHelp, setShowHelp] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }, [onFileUpload])
  
  const hasValue = fieldState?.status === 'filled'
  const hasError = fieldState?.validation_errors && fieldState.validation_errors.length > 0
  
  // Render based on field type
  switch (input.field_type) {
    case 'file':
      return (
        <FileInputField
          input={input}
          fieldState={fieldState}
          onFileUpload={onFileUpload}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
        />
      )
      
    case 'array':
      return (
        <ArrayInputField
          input={input}
          fieldState={fieldState}
          onChange={onChange}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
        />
      )
      
    case 'object':
      return (
        <ObjectInputField
          input={input}
          fieldState={fieldState}
          onChange={onChange}
          showHelp={showHelp}
          setShowHelp={setShowHelp}
        />
      )
      
    default:
      return (
        <div className="relative">
          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
            {/* Status Indicator */}
            <div className={clsx(
              'mt-1 w-2 h-2 rounded-full flex-shrink-0',
              hasValue ? 'bg-emerald-400' : hasError ? 'bg-red-400' : 'bg-white/30'
            )} />
            
            {/* Field Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <label className="font-medium text-white text-sm">
                  {input.field_name}
                  {input.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                {input.unit && (
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">
                    {input.unit}
                  </span>
                )}
                
                {input.help_text && (
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Help Text */}
              {showHelp && input.help_text && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-white/50 mb-2"
                >
                  {input.help_text}
                </motion.p>
              )}
              
              {/* Input */}
              <div className="flex items-center gap-2">
                <input
                  type={input.field_type === 'number' ? 'number' : 'text'}
                  value={fieldState?.value as string ?? ''}
                  onChange={e => onChange(
                    input.field_type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
                    'manual'
                  )}
                  placeholder={input.description || `Enter ${input.field_name}`}
                  className={clsx(
                    'flex-1 px-3 py-2 bg-white/5 border rounded-lg text-white text-sm',
                    'placeholder:text-white/30 focus:outline-none focus:ring-2',
                    hasError 
                      ? 'border-red-400/50 focus:ring-red-400/30' 
                      : 'border-white/10 focus:ring-emerald-400/30'
                  )}
                />
                
                {/* Input Method Indicators */}
                <div className="flex gap-1">
                  {input.input_methods.includes('api') && (
                    <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded" title="Via API">
                      <Send className="w-3 h-3" />
                    </span>
                  )}
                  {input.input_methods.includes('excel') && (
                    <span className="p-1.5 bg-green-500/20 text-green-300 rounded" title="Via Excel">
                      <FileSpreadsheet className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
              
              {/* Validation Errors */}
              {hasError && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  {fieldState.validation_errors![0]}
                </div>
              )}
              
              {/* Source Indicator */}
              {fieldState?.source && (
                <div className="mt-2 text-xs text-white/40">
                  Source: {fieldState.source}
                  {fieldState.last_updated && (
                    <span className="ml-2">
                      Updated: {new Date(fieldState.last_updated).toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
  }
}

interface FileInputFieldProps {
  input: InputField
  fieldState?: FieldState
  onFileUpload: (file: File) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
}

function FileInputField({
  input,
  fieldState,
  onFileUpload,
  showHelp,
  setShowHelp,
}: FileInputFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedFile = fieldState?.uploaded_file as UploadedFile | undefined
  
  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-white/60" />
        <label className="font-medium text-white text-sm">
          {input.field_name}
          {input.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        {input.help_text && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {showHelp && input.help_text && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-white/50 mb-3"
        >
          {input.help_text}
        </motion.p>
      )}
      
      {uploadedFile ? (
        <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Check className="w-5 h-5 text-emerald-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{uploadedFile.file_name}</p>
            <p className="text-xs text-white/50">
              {(uploadedFile.file_size / 1024).toFixed(1)} KB • 
              Uploaded {new Date(uploadedFile.upload_date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 text-xs text-white/60 hover:text-white bg-white/10 rounded"
          >
            Replace
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed 
                   border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors"
        >
          <Upload className="w-8 h-8 text-white/40 mb-2" />
          <p className="text-sm text-white/60">Click to upload or drag and drop</p>
          <p className="text-xs text-white/40 mt-1">
            {input.validation_rules?.find(r => r.type === 'file_type')?.values?.join(', ') || 'PDF, JPG, PNG'}
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFileUpload(file)
        }}
        className="hidden"
        accept={input.validation_rules?.find(r => r.type === 'file_type')?.values?.map(v => `.${v}`).join(',')}
      />
    </div>
  )
}

interface ArrayInputFieldProps {
  input: InputField
  fieldState?: FieldState
  onChange: (value: unknown, source: InputMethod) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
}

function ArrayInputField({
  input,
  fieldState,
  onChange,
  showHelp,
  setShowHelp,
}: ArrayInputFieldProps) {
  const arrayValue = (fieldState?.value as unknown[]) || []
  
  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <label className="font-medium text-white text-sm">
          {input.field_name}
          {input.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded">
          Array ({arrayValue.length} items)
        </span>
        
        {input.help_text && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {showHelp && input.help_text && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-white/50 mb-3"
        >
          {input.help_text}
        </motion.p>
      )}
      
      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
        <FileSpreadsheet className="w-5 h-5 text-green-400" />
        <span className="text-sm text-white/60">
          Upload via Excel or submit via API
        </span>
        <Button variant="secondary" size="sm" className="ml-auto">
          Upload Excel
        </Button>
      </div>
      
      {arrayValue.length > 0 && (
        <div className="mt-3 text-xs text-white/50">
          {arrayValue.length} data points loaded
        </div>
      )}
    </div>
  )
}

interface ObjectInputFieldProps {
  input: InputField
  fieldState?: FieldState
  onChange: (value: unknown, source: InputMethod) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
}

function ObjectInputField({
  input,
  fieldState,
  onChange,
  showHelp,
  setShowHelp,
}: ObjectInputFieldProps) {
  const objectValue = (fieldState?.value as Record<string, unknown>) || {}
  
  return (
    <div className="p-4 bg-white/5 rounded-lg space-y-3">
      <div className="flex items-center gap-2">
        <label className="font-medium text-white text-sm">
          {input.field_name}
          {input.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        {input.help_text && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {showHelp && input.help_text && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-white/50"
        >
          {input.help_text}
        </motion.p>
      )}
      
      {/* Nested Fields */}
      {input.nested_fields && (
        <div className="pl-4 border-l-2 border-white/10 space-y-3">
          {input.nested_fields.map(nested => (
            <div key={nested.field_id} className="flex items-center gap-3">
              <label className="text-sm text-white/60 w-32">
                {nested.field_name}
                {nested.required && <span className="text-red-400">*</span>}
              </label>
              <input
                type={nested.field_type === 'number' ? 'number' : 'text'}
                value={(objectValue[nested.field_id] as string) ?? ''}
                onChange={e => {
                  const newValue = {
                    ...objectValue,
                    [nested.field_id]: nested.field_type === 'number' 
                      ? parseFloat(e.target.value) || 0 
                      : e.target.value,
                  }
                  onChange(newValue, 'manual')
                }}
                className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded 
                         text-white text-sm placeholder:text-white/30 
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                placeholder={nested.description}
              />
              {nested.unit && (
                <span className="text-xs text-white/40">{nested.unit}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TreeNode

