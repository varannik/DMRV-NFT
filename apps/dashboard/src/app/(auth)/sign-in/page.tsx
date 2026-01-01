'use client'

/**
 * Sign In Page
 * 
 * Authentication page with email/password login, MFA support, and SSO option.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, Building2 } from 'lucide-react'
import { GlassCard, Button, Input } from '@/components/shared'
import { useAuthStore } from '@/lib/stores'

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

const mfaSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
})

type LoginFormData = z.infer<typeof loginSchema>
type MFAFormData = z.infer<typeof mfaSchema>

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { setUser, setTokens, setMfaRequired } = useAuthStore()
  
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })
  
  const mfaForm = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      code: '',
    },
  })
  
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock response - in production, this would be the API response
      const mockMfaRequired = false // Set to true to test MFA flow
      
      if (mockMfaRequired) {
        setShowMFA(true)
        setMfaRequired(true, 'mock-session-token')
      } else {
        // Success - set user and tokens
        setUser({
          user_id: 'user-1',
          email: data.email,
          name: data.email.split('@')[0],
          role: 'admin',
          tenant_id: 'tenant-1',
          mfa_enabled: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        setTokens('mock-access-token', 'mock-refresh-token')
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleMFA = async (data: MFAFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate MFA verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success
      setUser({
        user_id: 'user-1',
        email: loginForm.getValues('email'),
        name: loginForm.getValues('email').split('@')[0],
        role: 'admin',
        tenant_id: 'tenant-1',
        mfa_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setTokens('mock-access-token', 'mock-refresh-token')
      router.push('/dashboard')
    } catch (err) {
      setError('Invalid MFA code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <GlassCard className="!p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {showMFA ? 'Verify Your Identity' : 'Welcome Back'}
          </h1>
          <p className="text-white/70">
            {showMFA 
              ? 'Enter the 6-digit code from your authenticator app'
              : 'Sign in to your DMRV dashboard'
            }
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
        
        {showMFA ? (
          /* MFA Form */
          <form onSubmit={mfaForm.handleSubmit(handleMFA)} className="space-y-6">
            <Input
              label="Authentication Code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              leftIcon={<KeyRound className="w-5 h-5" />}
              error={mfaForm.formState.errors.code?.message}
              {...mfaForm.register('code')}
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Verify
            </Button>
            
            <button
              type="button"
              onClick={() => {
                setShowMFA(false)
                setError(null)
              }}
              className="w-full text-center text-white/60 hover:text-white text-sm transition"
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={loginForm.formState.errors.password?.message}
                {...loginForm.register('password')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                  {...loginForm.register('rememberMe')}
                />
                <span className="text-sm text-white/70">Remember me</span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-sm text-green-400 hover:text-green-300 transition"
              >
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In
            </Button>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/40">Or continue with</span>
              </div>
            </div>
            
            {/* SSO Button */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={<Building2 className="w-5 h-5" />}
            >
              Enterprise SSO
            </Button>
          </form>
        )}
        
        {!showMFA && (
          <p className="mt-8 text-center text-white/60 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-green-400 hover:text-green-300 transition font-medium">
              Request Access
            </Link>
          </p>
        )}
      </GlassCard>
    </motion.div>
  )
}

