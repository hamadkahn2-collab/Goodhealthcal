/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export interface CalculatorFormulaResult {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface CalculationResult {
  primaryValue: number | string;
  primaryUnit: string;
  primaryLabel: string;
  rangeMin?: number;
  rangeMax?: number;
  rangeLabel?: string;
  formulaResults: CalculatorFormulaResult[];
  adaptiveGuide: string;
  secondaryMetrics?: {
    label: string;
    value: string | number;
    subtext?: string;
  }[];
  chartData?: any;
  category?: {
    name: string;
    color: string;
    description: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Citation {
  text: string;
  source: string;
  url: string;
  year: number;
}

export interface ComparisonRow {
  dimension: string;
  healthCalcHub: string;
  genericOnlineTools: string;
  clinicalStandard: string;
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortDescription: string;
  category: 'Metabolism & Energy' | 'Body Composition' | 'Nutrition' | 'Fitness & Performance' | 'Daily Wellness';
  icon: string;
  featureList: string;
  lastUpdated: string;
  writtenBy: string;
  medicalSpecialty: string;
  estimatesRiskOf: string;
  relatedSlugs: string[];
  articleHtml: string;
  citations: Citation[];
  comparisonTable: ComparisonRow[];
  whenToSeeDoctor: string[];
  authorNote: string;
  faqs: FAQItem[];
}
