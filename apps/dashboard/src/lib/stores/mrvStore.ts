/**
 * MRV Store
 * 
 * Manages MRV submissions (blocks) state.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MRVSubmission, Block, UUID } from '@/types'

interface MRVState {
  submissions: MRVSubmission[]
  selectedSubmissionId: UUID | null
  isLoading: boolean
  error: string | null
  
  setSubmissions: (submissions: MRVSubmission[]) => void
  addSubmission: (submission: MRVSubmission) => void
  selectSubmission: (submissionId: UUID | null) => void
  updateSubmissionStatus: (submissionId: UUID, status: MRVSubmission['status']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getSelectedSubmission: () => MRVSubmission | undefined
  getBlocks: () => Block[]
}

export const useMRVStore = create<MRVState>()(
  devtools(
    (set, get) => ({
      submissions: [],
      selectedSubmissionId: null,
      isLoading: false,
      error: null,
      
      setSubmissions: (submissions) => set({ submissions }),
      
      addSubmission: (submission) => set((state) => ({
        submissions: [submission, ...state.submissions],
      })),
      
      selectSubmission: (submissionId) => set({ selectedSubmissionId: submissionId }),
      
      updateSubmissionStatus: (submissionId, status) => {
        set((state) => ({
          submissions: state.submissions.map(s =>
            s.mrv_submission_id === submissionId ? { ...s, status } : s
          ),
        }))
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      getSelectedSubmission: () => {
        const state = get()
        return state.submissions.find(s => s.mrv_submission_id === state.selectedSubmissionId)
      },
      
      getBlocks: () => {
        const submissions = get().submissions
        return submissions.map((s, index) => ({
          id: `block-${s.mrv_submission_id}`,
          blockNumber: submissions.length - index,
          mrvSubmissionId: s.mrv_submission_id,
          status: s.status,
          registryType: s.registry_type,
          timestamp: new Date(s.submission_date),
          tonnage: s.reported_tonnage,
          hash: s.mrv_hash,
        }))
      },
    }),
    { name: 'MRVStore' }
  )
)

