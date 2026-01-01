'use client'

/**
 * ProcessFlow Component
 * 
 * ReactFlow visualization of the 8-phase credit issuance workflow.
 */

import { useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ProcessNode } from './ProcessNode'
import { GlassCard } from '@/components/shared'
import { PROCESS_PHASES, VERIFICATION_CATEGORIES } from '@/types'
import type { ProcessStep, ProcessPhase, ProcessNodeData } from '@/types'

interface ProcessFlowProps {
  steps: ProcessStep[]
  currentPhase: ProcessPhase
  onStepClick?: (stepId: string) => void
  className?: string
}

// Custom node types
const nodeTypes: NodeTypes = {
  processNode: ProcessNode,
}

// Generate nodes from steps
function generateNodes(steps: ProcessStep[], currentPhase: ProcessPhase): Node<ProcessNodeData>[] {
  // If no steps provided, generate demo nodes
  if (steps.length === 0) {
    return Object.entries(PROCESS_PHASES).map(([phase, info], index) => {
      const phaseNum = parseInt(phase) as ProcessPhase
      let status: ProcessStep['status'] = 'pending'
      
      if (phaseNum < currentPhase) {
        status = 'completed'
      } else if (phaseNum === currentPhase) {
        status = 'in_progress'
      }
      
      const subSteps = phaseNum === 3 ? VERIFICATION_CATEGORIES.map((cat, i) => ({
        id: `cat-${i}`,
        name: cat,
        status: (i < 5 ? 'completed' : i === 5 ? 'in_progress' : 'pending') as ProcessStep['status'],
        order: i,
      })) : undefined
      
      return {
        id: `node-${phase}`,
        type: 'processNode',
        position: { x: 250, y: index * 150 },
        data: {
          phase: phaseNum,
          phaseName: info.name,
          status,
          subSteps,
          isExpanded: phaseNum === currentPhase && phaseNum === 3,
        },
      }
    })
  }
  
  return steps.map((step, index) => ({
    id: step.step_id,
    type: 'processNode',
    position: { x: 250, y: index * 150 },
    data: {
      phase: step.phase,
      phaseName: step.phase_name,
      status: step.status,
      timestamp: step.completed_at ? new Date(step.completed_at) : undefined,
      subSteps: step.sub_steps,
      isExpanded: step.phase === currentPhase && step.phase === 3,
    },
  }))
}

// Generate edges between nodes
function generateEdges(nodes: Node[]): Edge[] {
  const edges: Edge[] = []
  
  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i]
    const targetNode = nodes[i + 1]
    const sourceStatus = (sourceNode.data as ProcessNodeData).status
    
    edges.push({
      id: `edge-${i}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: 'smoothstep',
      animated: sourceStatus === 'in_progress',
      style: {
        stroke: sourceStatus === 'completed' 
          ? 'rgba(74, 222, 128, 0.5)' 
          : sourceStatus === 'in_progress'
            ? 'rgba(251, 191, 36, 0.5)'
            : 'rgba(255, 255, 255, 0.2)',
        strokeWidth: 2,
      },
    })
  }
  
  return edges
}

export function ProcessFlow({ 
  steps, 
  currentPhase, 
  onStepClick,
  className 
}: ProcessFlowProps) {
  const initialNodes = useMemo(() => generateNodes(steps, currentPhase), [steps, currentPhase])
  const initialEdges = useMemo(() => generateEdges(initialNodes), [initialNodes])
  
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onStepClick?.(node.id)
  }, [onStepClick])
  
  return (
    <GlassCard className={className}>
      <div className="h-[350px] md:h-[500px] rounded-xl overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            minZoom: 0.5,
            maxZoom: 1.5,
          }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="rgba(255, 255, 255, 0.1)" 
          />
          <Controls 
            className="!bg-white/10 !border-white/20 !rounded-lg [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-white/70 [&>button:hover]:!bg-white/10"
          />
          <MiniMap 
            className="!bg-white/5 !border-white/10 !rounded-lg"
            nodeColor={(node) => {
              const status = (node.data as ProcessNodeData).status
              switch (status) {
                case 'completed': return '#4ade80'
                case 'in_progress': return '#fbbf24'
                case 'failed': return '#f87171'
                default: return 'rgba(255, 255, 255, 0.3)'
              }
            }}
          />
        </ReactFlow>
      </div>
    </GlassCard>
  )
}

