/**
 * Isometric Registry Configuration
 * 
 * Configuration for Isometric Science carbon removal protocols.
 * Based on COMPREHENSIVE_WORKFLOWS.md Section 3.0.7
 */

import type { RegistryConfig } from '@/types/registry'

export const isometricConfig: RegistryConfig = {
  registry_id: 'isometric',
  registry_name: 'Isometric',
  version: '1.0',
  description: 'Science-backed carbon removal verification',
  logo_url: '/images/registries/isometric-logo.svg',
  website_url: 'https://isometric.com',
  
  protocols: [
    {
      protocol_id: 'iso_enhanced_weathering',
      protocol_name: 'Enhanced Rock Weathering',
      version: 'v1.0',
      description: 'Methodology for carbon removal through enhanced weathering of silicate rocks',
      documentation_url: 'https://isometric.com/protocols/erw',
      excel_template: '/templates/isometric_erw_v1.xlsx',
      
      net_corc_formula: {
        node_id: 'net_corc',
        node_name: 'Net CORC',
        node_type: 'calculated',
        description: 'Net Carbon Removal Credit from enhanced weathering',
        formula: 'co2_sequestered - supply_chain_emissions - application_emissions',
        display: {
          icon: 'mountain',
          color: '#06b6d4',
          show_formula: true,
        },
        children: [
          // Branch 1: CO2 Sequestered
          {
            node_id: 'co2_sequestered',
            node_name: 'CO₂ Sequestered',
            node_type: 'input',
            description: 'Carbon dioxide captured through rock weathering',
            display: {
              icon: 'download',
              color: '#10b981',
            },
            required_inputs: [
              {
                field_id: 'rock_mass',
                field_name: 'Rock Mass Applied',
                field_type: 'number',
                description: 'Total mass of silicate rock applied',
                unit: 'tonnes',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'min', value: 0, message: 'Must be a positive number' },
                ],
                help_text: 'Total dry mass of crushed rock applied to fields',
              },
              {
                field_id: 'rock_type',
                field_name: 'Rock Type',
                field_type: 'string',
                description: 'Type of silicate rock used',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'enum', values: ['basalt', 'olivine', 'wollastonite', 'dunite'], message: 'Select a valid rock type' },
                ],
                help_text: 'Select the primary rock type used',
              },
              {
                field_id: 'rock_composition',
                field_name: 'Rock Composition Analysis',
                field_type: 'file',
                description: 'Geochemical analysis of rock composition',
                required: true,
                input_methods: ['upload'],
                validation_rules: [
                  { type: 'file_type', values: ['pdf', 'xlsx'], message: 'Only PDF or Excel files allowed' },
                ],
                help_text: 'Upload XRF or ICP-MS analysis of rock composition',
              },
              {
                field_id: 'particle_size',
                field_name: 'Particle Size Distribution',
                field_type: 'number',
                description: 'D50 median particle size',
                unit: 'μm',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 1, max: 1000, message: 'Particle size typically 1-1000 μm' },
                ],
                help_text: 'Median particle size (D50) of the crushed rock',
              },
              {
                field_id: 'weathering_rate',
                field_name: 'Measured Weathering Rate',
                field_type: 'number',
                description: 'Observed CO₂ sequestration rate',
                unit: 'tCO₂/tonne rock',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                validation_rules: [
                  { type: 'range', min: 0, max: 1, message: 'Weathering rate typically 0-1 tCO₂/tonne' },
                ],
                help_text: 'Measured CO₂ capture per tonne of rock applied',
              },
              {
                field_id: 'soil_analysis',
                field_name: 'Soil Analysis Report',
                field_type: 'file',
                description: 'Pre and post application soil analysis',
                required: true,
                input_methods: ['upload'],
                help_text: 'Upload soil chemistry analysis showing weathering products',
              },
              {
                field_id: 'sensor_data',
                field_name: 'Continuous Sensor Data',
                field_type: 'array',
                description: 'Time-series monitoring data',
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
                    field_id: 'soil_ph',
                    field_name: 'Soil pH',
                    field_type: 'number',
                    required: true,
                    input_methods: ['api', 'excel'],
                  },
                  {
                    field_id: 'dic_concentration',
                    field_name: 'DIC Concentration',
                    field_type: 'number',
                    unit: 'mg/L',
                    required: false,
                    input_methods: ['api', 'excel'],
                  },
                ],
                help_text: 'Upload continuous monitoring data from field sensors',
              },
              {
                field_id: 'application_area',
                field_name: 'Application Area',
                field_type: 'number',
                unit: 'hectares',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total area where rock was applied',
              },
              {
                field_id: 'application_rate',
                field_name: 'Application Rate',
                field_type: 'number',
                unit: 'tonnes/hectare',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Rock application rate per hectare',
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
          // Branch 2: Supply Chain Emissions
          {
            node_id: 'supply_chain_emissions',
            node_name: 'Supply Chain Emissions',
            node_type: 'input',
            description: 'Emissions from rock sourcing and processing',
            display: {
              icon: 'truck',
              color: '#f59e0b',
            },
            required_inputs: [
              {
                field_id: 'mining_emissions',
                field_name: 'Mining Emissions',
                field_type: 'number',
                description: 'Emissions from rock extraction',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'CO₂ emissions from quarrying/mining operations',
              },
              {
                field_id: 'crushing_emissions',
                field_name: 'Crushing/Grinding Emissions',
                field_type: 'number',
                description: 'Emissions from rock processing',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Emissions from crushing and grinding to target particle size',
              },
              {
                field_id: 'transport_emissions',
                field_name: 'Transport Emissions',
                field_type: 'number',
                description: 'Emissions from transportation',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Emissions from transporting rock from quarry to field',
              },
              {
                field_id: 'transport_distance',
                field_name: 'Transport Distance',
                field_type: 'number',
                unit: 'km',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Total transport distance',
              },
              {
                field_id: 'transport_mode',
                field_name: 'Transport Mode',
                field_type: 'string',
                required: true,
                input_methods: ['manual'],
                validation_rules: [
                  { type: 'enum', values: ['truck', 'rail', 'ship', 'mixed'], message: 'Select transport mode' },
                ],
                help_text: 'Primary mode of transportation',
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
          // Branch 3: Application Emissions
          {
            node_id: 'application_emissions',
            node_name: 'Application Emissions',
            node_type: 'input',
            description: 'Emissions from field application',
            display: {
              icon: 'tractor',
              color: '#ef4444',
            },
            required_inputs: [
              {
                field_id: 'spreading_emissions',
                field_name: 'Spreading Equipment Emissions',
                field_type: 'number',
                description: 'Emissions from spreading machinery',
                unit: 'tCO₂e',
                required: true,
                input_methods: ['api', 'excel', 'manual'],
                help_text: 'Fuel emissions from tractors and spreading equipment',
              },
              {
                field_id: 'application_method',
                field_name: 'Application Method',
                field_type: 'string',
                required: true,
                input_methods: ['manual'],
                validation_rules: [
                  { type: 'enum', values: ['broadcast', 'banded', 'incorporated'], message: 'Select application method' },
                ],
                help_text: 'How rock was applied to fields',
              },
              {
                field_id: 'application_dates',
                field_name: 'Application Period',
                field_type: 'object',
                required: true,
                input_methods: ['api', 'manual'],
                nested_fields: [
                  {
                    field_id: 'start_date',
                    field_name: 'Start Date',
                    field_type: 'date',
                    required: true,
                    input_methods: ['api', 'manual'],
                  },
                  {
                    field_id: 'end_date',
                    field_name: 'End Date',
                    field_type: 'date',
                    required: true,
                    input_methods: ['api', 'manual'],
                  },
                ],
                help_text: 'Date range when rock was applied',
              },
            ],
          },
        ],
      },
    },
  ],
}

