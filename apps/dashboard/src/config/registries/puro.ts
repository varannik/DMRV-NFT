/**
 * Puro.earth Registry Configuration
 * 
 * Configuration for Puro.earth carbon removal protocols.
 * Based on COMPREHENSIVE_WORKFLOWS.md Section 3.0.6
 */

import type { RegistryConfig } from '@/types/registry'

export const puroConfig: RegistryConfig = {
  registry_id: 'puro',
  registry_name: 'Puro.earth',
  version: '1.0',
  description: 'The world\'s first registry dedicated to carbon removal',
  logo_url: '/images/registries/puro-logo.svg',
  website_url: 'https://puro.earth',
  
  protocols: [
    {
      protocol_id: 'puro_biochar',
      protocol_name: 'Biochar Carbon Removal',
      version: 'v3.0',
      description: 'Methodology for carbon removal through biochar production',
      documentation_url: 'https://puro.earth/methodologies/biochar',
      excel_template: '/templates/puro_biochar_v3.xlsx',
      
      net_corc_formula: {
        node_id: 'net_corc',
        node_name: 'Net CORC',
        node_type: 'calculated',
        description: 'Net Carbon Removal Credit from biochar production',
        formula: 'biochar_carbon - production_emissions - transport_emissions',
        display: {
          icon: 'flame',
          color: '#8b5cf6',
          show_formula: true,
        },
        children: [
          // Branch 1: Biochar Carbon Content
          {
            node_id: 'biochar_carbon',
            node_name: 'Biochar Carbon Content',
            node_type: 'input',
            description: 'Carbon sequestered in biochar',
            display: {
              icon: 'box',
              color: '#10b981',
            },
            required_inputs: [
              {
                field_id: 'biochar_mass',
                field_name: 'Biochar Mass Produced',
                field_type: 'number',
                description: 'Total mass of biochar produced',
                unit: 'tonnes',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                help_text: 'Enter the total dry mass of biochar produced',
              },
              {
                field_id: 'carbon_content',
                field_name: 'Carbon Content',
                field_type: 'number',
                description: 'Percentage of carbon in biochar',
                unit: '%',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 50, max: 95, message: 'Carbon content typically ranges from 50% to 95%' },
                ],
                help_text: 'Carbon content as determined by lab analysis (must be >50%)',
              },
              {
                field_id: 'h_c_ratio',
                field_name: 'H:C Molar Ratio',
                field_type: 'number',
                description: 'Hydrogen to carbon molar ratio (stability indicator)',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'max', value: 0.7, message: 'H:C ratio must be ≤0.7 for stable biochar' },
                ],
                help_text: 'H:C ratio indicates biochar stability. Must be ≤0.7 for Puro certification',
              },
              {
                field_id: 'o_c_ratio',
                field_name: 'O:C Molar Ratio',
                field_type: 'number',
                description: 'Oxygen to carbon molar ratio',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'max', value: 0.4, message: 'O:C ratio must be ≤0.4' },
                ],
                help_text: 'O:C ratio indicates biochar oxidation level',
              },
              {
                field_id: 'lab_certificate',
                field_name: 'EBC/IBI Certificate',
                field_type: 'file',
                description: 'European Biochar Certificate or International Biochar Initiative certification',
                required: true,
                input_methods: ['upload'],
                validation_rules: [
                  { type: 'file_type', values: ['pdf'], message: 'Only PDF files allowed' },
                ],
                help_text: 'Upload EBC or IBI certification document',
              },
              {
                field_id: 'feedstock_type',
                field_name: 'Feedstock Type',
                field_type: 'string',
                description: 'Type of biomass feedstock used',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'enum', values: ['wood_waste', 'agricultural_residue', 'forestry_residue', 'other'], message: 'Select a valid feedstock type' },
                ],
                help_text: 'Select the primary feedstock material',
              },
              {
                field_id: 'feedstock_source',
                field_name: 'Feedstock Source Documentation',
                field_type: 'file',
                description: 'Documentation proving sustainable feedstock sourcing',
                required: true,
                input_methods: ['upload'],
                help_text: 'Upload proof of sustainable feedstock origin',
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
          // Branch 2: Production Emissions
          {
            node_id: 'production_emissions',
            node_name: 'Production Emissions',
            node_type: 'input',
            description: 'Emissions from biochar production process',
            display: {
              icon: 'flame',
              color: '#f59e0b',
            },
            required_inputs: [
              {
                field_id: 'pyrolysis_energy',
                field_name: 'Pyrolysis Energy',
                field_type: 'number',
                description: 'Energy consumed during pyrolysis',
                unit: 'kWh',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total electrical energy consumed by pyrolysis equipment',
              },
              {
                field_id: 'pyrolysis_temperature',
                field_name: 'Pyrolysis Temperature',
                field_type: 'number',
                description: 'Peak pyrolysis temperature',
                unit: '°C',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 350, max: 900, message: 'Temperature typically ranges from 350°C to 900°C' },
                ],
                help_text: 'Peak temperature reached during pyrolysis',
              },
              {
                field_id: 'feedstock_transport',
                field_name: 'Feedstock Transport Distance',
                field_type: 'number',
                unit: 'km',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Average distance feedstock is transported to production facility',
              },
              {
                field_id: 'feedstock_processing',
                field_name: 'Feedstock Processing Emissions',
                field_type: 'number',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Emissions from feedstock preparation (chipping, drying, etc.)',
              },
              {
                field_id: 'energy_source',
                field_name: 'Energy Source',
                field_type: 'string',
                required: true,
                input_methods: ['manual'],
                validation_rules: [
                  { type: 'enum', values: ['grid', 'renewable', 'syngas', 'mixed'], message: 'Select energy source' },
                ],
                help_text: 'Primary energy source for production',
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
          // Branch 3: Permanence
          {
            node_id: 'permanence',
            node_name: 'Permanence Factor',
            node_type: 'input',
            description: 'Long-term carbon storage guarantee',
            display: {
              icon: 'clock',
              color: '#3b82f6',
            },
            required_inputs: [
              {
                field_id: 'permanence_years',
                field_name: 'Permanence Period',
                field_type: 'number',
                unit: 'years',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 100, message: 'Minimum permanence period is 100 years' },
                ],
                default_value: 100,
                help_text: 'Guaranteed carbon storage period (minimum 100 years for Puro)',
              },
              {
                field_id: 'application_method',
                field_name: 'Biochar Application Method',
                field_type: 'string',
                required: true,
                input_methods: ['manual'],
                validation_rules: [
                  { type: 'enum', values: ['soil_amendment', 'construction', 'water_filtration', 'other'], message: 'Select application method' },
                ],
                help_text: 'How will the biochar be applied/stored',
              },
              {
                field_id: 'application_site',
                field_name: 'Application Site Documentation',
                field_type: 'file',
                required: true,
                input_methods: ['upload'],
                help_text: 'Upload documentation of where biochar will be applied',
              },
            ],
          },
        ],
      },
    },
  ],
}

