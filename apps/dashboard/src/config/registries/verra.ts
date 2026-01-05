/**
 * Verra VCS Registry Configuration
 * 
 * Configuration for Verra's Verified Carbon Standard protocols.
 * Based on COMPREHENSIVE_WORKFLOWS.md Section 3.0.5
 */

import type { RegistryConfig } from '@/types/registry'

export const verraConfig: RegistryConfig = {
  registry_id: 'verra',
  registry_name: 'Verra VCS',
  version: '1.0',
  description: 'Verified Carbon Standard - The world\'s most widely used voluntary GHG program',
  logo_url: '/images/registries/verra-logo.svg',
  website_url: 'https://verra.org',
  
  protocols: [
    {
      protocol_id: 'VM0042',
      protocol_name: 'Methodology for Improved Agricultural Land Management',
      version: 'v2.0',
      description: 'Quantifies GHG emission reductions and carbon sequestration from improved agricultural practices',
      documentation_url: 'https://verra.org/methodologies/vm0042',
      excel_template: '/templates/verra_VM0042_v2.xlsx',
      
      net_corc_formula: {
        node_id: 'net_corc',
        node_name: 'Net CORC',
        node_type: 'calculated',
        description: 'Net Carbon Removal Credit after all deductions',
        formula: 'removal_data - project_emissions - leakage - buffer',
        display: {
          icon: 'leaf',
          color: '#22c55e',
          show_formula: true,
        },
        children: [
          // Branch 1: Removal Data
          {
            node_id: 'removal_data',
            node_name: 'Removal Data',
            node_type: 'input',
            description: 'Gross CO₂ removal from CDR activities',
            display: {
              icon: 'arrow-up-circle',
              color: '#10b981',
            },
            required_inputs: [
              {
                field_id: 'gross_removal',
                field_name: 'Gross CO₂ Removal',
                field_type: 'number',
                description: 'Total measured CO₂ removed before deductions',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'required', message: 'Gross removal is required' },
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                api_spec: {
                  endpoint: '/mrv/removal-data',
                  method: 'POST',
                  field_path: 'gross_removal',
                },
                excel_column: 'B',
                help_text: 'Enter the total measured CO₂ removal in tonnes CO₂ equivalent',
              },
              {
                field_id: 'sensor_readings',
                field_name: 'Sensor Readings',
                field_type: 'array',
                description: 'Time-series sensor data',
                required: true,
                input_methods: ['api', 'excel'],
                nested_fields: [
                  {
                    field_id: 'timestamp',
                    field_name: 'Timestamp',
                    field_type: 'date',
                    required: true,
                    input_methods: ['api', 'excel'],
                  },
                  {
                    field_id: 'co2_removed',
                    field_name: 'CO₂ Removed',
                    field_type: 'number',
                    unit: 'tCO₂e',
                    required: true,
                    input_methods: ['api', 'excel'],
                  },
                ],
                help_text: 'Upload sensor readings as time-series data',
              },
              {
                field_id: 'calibration_cert',
                field_name: 'Calibration Certificate',
                field_type: 'file',
                description: 'Instrument calibration certificate',
                required: true,
                input_methods: ['upload'],
                validation_rules: [
                  { type: 'file_type', values: ['pdf', 'jpg', 'png'], message: 'Only PDF and image files allowed' },
                  { type: 'file_size', max: 10485760, message: 'File must be less than 10MB' },
                ],
                help_text: 'Upload the calibration certificate for measurement instruments',
              },
              {
                field_id: 'lab_analysis',
                field_name: 'Lab Analysis Report',
                field_type: 'file',
                description: 'Laboratory analysis report',
                required: true,
                input_methods: ['upload'],
                validation_rules: [
                  { type: 'file_type', values: ['pdf'], message: 'Only PDF files allowed' },
                ],
                help_text: 'Upload the lab analysis report verifying measurements',
              },
              {
                field_id: 'data_completeness',
                field_name: 'Data Completeness',
                field_type: 'number',
                unit: '%',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 0, max: 100, message: 'Must be between 0 and 100' },
                ],
                help_text: 'Percentage of complete data points in the monitoring period',
              },
              {
                field_id: 'data_quality_score',
                field_name: 'Data Quality Score',
                field_type: 'number',
                description: 'Quality assessment score',
                required: true,
                input_methods: ['api', 'manual'],
                validation_rules: [
                  { type: 'range', min: 0, max: 100, message: 'Score must be between 0 and 100' },
                ],
                help_text: 'Overall data quality score (0-100)',
              },
            ],
          },
          // Operator: Subtract
          {
            node_id: 'operator_minus_1',
            node_name: '-',
            node_type: 'operator',
            operator: '-',
          },
          // Branch 2: Project Emissions
          {
            node_id: 'project_emissions',
            node_name: 'Project Emissions',
            node_type: 'input',
            description: 'Emissions generated by the CDR project',
            display: {
              icon: 'factory',
              color: '#f59e0b',
            },
            required_inputs: [
              {
                field_id: 'scope_1',
                field_name: 'Scope 1 Emissions',
                field_type: 'number',
                description: 'Direct emissions from owned/controlled sources',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                help_text: 'Direct GHG emissions from sources owned or controlled by the project',
              },
              {
                field_id: 'scope_2',
                field_name: 'Scope 2 Emissions',
                field_type: 'number',
                description: 'Indirect emissions from purchased energy',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                help_text: 'Indirect emissions from purchased electricity, steam, heating, cooling',
              },
              {
                field_id: 'scope_3',
                field_name: 'Scope 3 Emissions',
                field_type: 'number',
                description: 'Other indirect emissions in value chain',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                help_text: 'All other indirect emissions in the project value chain',
              },
              {
                field_id: 'energy_consumption',
                field_name: 'Energy Consumption',
                field_type: 'number',
                unit: 'kWh',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total energy consumed during the monitoring period',
              },
              {
                field_id: 'fuel_consumption',
                field_name: 'Fuel Consumption',
                field_type: 'number',
                unit: 'L',
                required: false,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total fuel consumed (diesel, gasoline, etc.)',
              },
              {
                field_id: 'transport_distance',
                field_name: 'Transport Distance',
                field_type: 'number',
                unit: 'km',
                required: false,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total transport distance for materials and equipment',
              },
            ],
          },
          // Operator: Subtract
          {
            node_id: 'operator_minus_2',
            node_name: '-',
            node_type: 'operator',
            operator: '-',
          },
          // Branch 3: Leakage
          {
            node_id: 'leakage',
            node_name: 'Leakage Deduction',
            node_type: 'calculated',
            description: 'Emissions that occur outside the project boundary',
            formula: 'gross_removal * leakage_factor',
            display: {
              icon: 'alert-triangle',
              color: '#ef4444',
            },
            required_inputs: [
              {
                field_id: 'leakage_factor',
                field_name: 'Leakage Factor',
                field_type: 'number',
                unit: '%',
                required: true,
                default_value: 5,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 0, max: 20, message: 'Leakage factor must be between 0% and 20%' },
                ],
                help_text: 'Percentage of gross removal attributed to leakage (typically 5%)',
              },
              {
                field_id: 'leakage_assessment',
                field_name: 'Leakage Assessment Report',
                field_type: 'file',
                required: true,
                input_methods: ['upload'],
                help_text: 'Upload the leakage assessment documentation',
              },
            ],
          },
          // Operator: Subtract
          {
            node_id: 'operator_minus_3',
            node_name: '-',
            node_type: 'operator',
            operator: '-',
          },
          // Branch 4: Buffer Pool
          {
            node_id: 'buffer',
            node_name: 'Buffer Pool',
            node_type: 'calculated',
            description: 'Risk reserve contribution to buffer pool',
            formula: '(gross_removal - leakage) * buffer_rate',
            display: {
              icon: 'shield',
              color: '#3b82f6',
            },
            required_inputs: [
              {
                field_id: 'buffer_rate',
                field_name: 'Buffer Rate',
                field_type: 'number',
                unit: '%',
                required: true,
                default_value: 15,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 10, max: 25, message: 'Buffer rate must be between 10% and 25%' },
                ],
                help_text: 'Percentage contribution to buffer pool (typically 15%)',
              },
              {
                field_id: 'risk_assessment',
                field_name: 'Risk Assessment',
                field_type: 'object',
                required: true,
                input_methods: ['api', 'manual'],
                nested_fields: [
                  {
                    field_id: 'permanence_risk',
                    field_name: 'Permanence Risk',
                    field_type: 'string',
                    required: true,
                    input_methods: ['manual'],
                    validation_rules: [
                      { type: 'enum', values: ['low', 'medium', 'high'], message: 'Must be low, medium, or high' },
                    ],
                  },
                  {
                    field_id: 'reversal_risk',
                    field_name: 'Reversal Risk',
                    field_type: 'string',
                    required: true,
                    input_methods: ['manual'],
                    validation_rules: [
                      { type: 'enum', values: ['low', 'medium', 'high'], message: 'Must be low, medium, or high' },
                    ],
                  },
                ],
                help_text: 'Assess the risk factors affecting buffer pool contribution',
              },
            ],
          },
        ],
      },
    },
  ],
}

