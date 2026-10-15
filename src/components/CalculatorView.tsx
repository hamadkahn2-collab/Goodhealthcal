/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ChevronDown,
  Info,
  Calendar,
  User,
  ArrowRight,
  RotateCcw,
  Sparkles,
  PieChart as PieIcon,
  ExternalLink,
  AlertTriangle,
  Stethoscope,
  BookOpen
} from 'lucide-react';
import {
  CalculatorDefinition,
  UnitSystem,
  CalculationResult
} from '../types/calculator';
import {
  CALCULATORS,
  SITE_AUTHOR,
  calculateBMR,
  calculateTDEE,
  calculateBodyFat,
  calculateMacros,
  calculateWater,
  calculateIdealWeight,
  calculateOneRepMax,
  calculateHeartRateZones,
  calculateProtein,
  calculateSleep,
  calculateCalorieDeficit,
  calculateBMI
} from '../lib/calculators';
import { AdUnit } from './AdUnit';

interface CalculatorViewProps {
  calculator: CalculatorDefinition;
  navigate: (path: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  calculator,
  navigate
}) => {
  // Global unit system
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [activity, setActivity] = useState<
    'sedentary' | 'light' | 'moderate' | 'very' | 'extra'
  >('sedentary');
  const [bodyFatInput, setBodyFatInput] = useState<number>(18);
  const [useBodyFat, setUseBodyFat] = useState<boolean>(false);

  // Circumference inputs for Navy method
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(85);
  const [hipCm, setHipCm] = useState<number>(95);

  // Specific calculator inputs
  const [macroCalories, setMacroCalories] = useState<number>(2200);
  const [macroGoal, setMacroGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');

  const [waterActivity, setWaterActivity] = useState<'sedentary' | 'moderate' | 'intense'>('moderate');
  const [waterClimate, setWaterClimate] = useState<'temperate' | 'hot' | 'dry'>('temperate');

  const [oneRepWeight, setOneRepWeight] = useState<number>(100);
  const [oneRepReps, setOneRepReps] = useState<number>(5);

  const [restingHr, setRestingHr] = useState<number>(65);
  const [proteinGoal, setProteinGoal] = useState<'sedentary' | 'endurance' | 'hypertrophy' | 'fatloss'>('hypertrophy');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [deficitTargetLoss, setDeficitTargetLoss] = useState<number>(5);
  const [deficitIntensity, setDeficitIntensity] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // Calculation & UI State
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Synchronize metric & imperial values
  const handleWeightChange = (val: number, system: UnitSystem) => {
    if (system === 'metric') {
      setWeightKg(val);
      setWeightLbs(Math.round(val * 2.20462 * 10) / 10);
    } else {
      setWeightLbs(val);
      setWeightKg(Math.round((val / 2.20462) * 10) / 10);
    }
  };

  const handleHeightMetricChange = (cm: number) => {
    setHeightCm(cm);
    const totalInches = cm / 2.54;
    setHeightFeet(Math.floor(totalInches / 12));
    setHeightInches(Math.round(totalInches % 12));
  };

  const handleHeightImperialChange = (feet: number, inches: number) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    const totalInches = feet * 12 + inches;
    setHeightCm(Math.round(totalInches * 2.54));
  };

  // Run calculation logic
  const executeCalculation = () => {
    setInputErrors({});
    const errors: Record<string, string> = {};

    if (age < 15 || age > 115) {
      errors.age = 'Age must be between 15 and 115.';
    }
    if (heightCm < 100 || heightCm > 250) {
      errors.height = 'Height must be between 100 cm and 250 cm (3ft 3in to 8ft 2in).';
    }
    if (weightKg < 30 || weightKg > 350) {
      errors.weight = 'Weight must be between 30 kg and 350 kg (66 lbs to 770 lbs).';
    }

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      let res: CalculationResult | null = null;
      const bfArg = useBodyFat ? bodyFatInput : undefined;

      switch (calculator.id) {
        case 'bmr':
          res = calculateBMR(weightKg, heightCm, age, gender, bfArg);
          break;
        case 'tdee':
          res = calculateTDEE(weightKg, heightCm, age, gender, activity, bfArg);
          break;
        case 'body-fat':
          res = calculateBodyFat(gender, heightCm, weightKg, neckCm, waistCm, hipCm);
          break;
        case 'macro':
          res = calculateMacros(macroCalories, weightKg, macroGoal);
          break;
        case 'water-intake':
          res = calculateWater(weightKg, waterActivity, waterClimate);
          break;
        case 'ideal-weight':
          res = calculateIdealWeight(gender, heightCm);
          break;
        case 'one-rep-max':
          res = calculateOneRepMax(oneRepWeight, oneRepReps, unitSystem === 'metric' ? 'kg' : 'lbs');
          break;
        case 'heart-rate-zone':
          res = calculateHeartRateZones(age, restingHr);
          break;
        case 'protein-intake':
          res = calculateProtein(weightKg, proteinGoal);
          break;
        case 'sleep':
          res = calculateSleep(wakeTime);
          break;
        case 'calorie-deficit':
          res = calculateCalorieDeficit(macroCalories, deficitTargetLoss, deficitIntensity);
          break;
        case 'bmi':
          res = calculateBMI(weightKg, heightCm, age, gender);
          break;
        default:
          res = calculateBMR(weightKg, heightCm, age, gender);
      }

      setResult(res);
      setIsCalculating(false);
    }, 150);
  };

  useEffect(() => {
    executeCalculation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [calculator.id]);

  const handleCopyResult = () => {
    if (!result) return;
    const textToCopy = `${calculator.title} Result:\n${result.primaryLabel}: ${result.primaryValue} ${result.primaryUnit}\n${
      result.rangeLabel ? `Scientific Range: ${result.rangeLabel}\n` : ''
    }Calculated on HealthCalcHub`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedTools = CALCULATORS.filter((c) =>
    calculator.relatedSlugs.includes(c.slug)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation (real paths, no hash) */}
      <nav
        className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6"
        aria-label="Breadcrumb"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          Home
        </a>
        <span aria-hidden="true">/</span>
        <span>{calculator.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">
          {calculator.title}
        </span>
      </nav>

      {/* Target H1 Header (Exact match, only ONE on page) */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {calculator.h1}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          {calculator.shortDescription}
        </p>

        {/* Simple "Last updated: [date]" line only - No author name */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated: {calculator.lastUpdated}</span>
        </div>
      </header>

      {/* Interactive Calculator Container */}
      <section
        aria-label="Interactive Health Calculator"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-xs transition-colors mb-8"
      >
        {/* Unit Selector Toggle */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Unit System
          </span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Metric (kg, cm)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap min-h-[36px] ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Imperial (lbs, ft/in)
            </button>
          </div>
        </div>

        {/* Dynamic Inputs Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {/* Sex Selector */}
          {[
            'bmr',
            'tdee',
            'body-fat',
            'ideal-weight',
            'bmi'
          ].includes(calculator.id) && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center min-h-[44px] ${
                    gender === 'male'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center min-h-[44px] ${
                    gender === 'female'
                      ? 'border-teal-600 bg-teal-50/70 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          )}

          {/* Age Input */}
          {[
            'bmr',
            'tdee',
            'body-fat',
            'heart-rate-zone',
            'bmi'
          ].includes(calculator.id) && (
            <div>
              <label
                htmlFor="input-age"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Age (years)
              </label>
              <input
                id="input-age"
                type="number"
                min={15}
                max={110}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
              />
              {inputErrors.age && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {inputErrors.age}
                </p>
              )}
            </div>
          )}

          {/* Weight Input */}
          {[
            'bmr',
            'tdee',
            'body-fat',
            'macro',
            'water-intake',
            'protein-intake',
            'bmi'
          ].includes(calculator.id) && (
            <div>
              <label
                htmlFor="input-weight"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                id="input-weight"
                type="number"
                step="0.5"
                value={unitSystem === 'metric' ? weightKg : weightLbs}
                onChange={(e) =>
                  handleWeightChange(parseFloat(e.target.value) || 0, unitSystem)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
              />
              {inputErrors.weight && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {inputErrors.weight}
                </p>
              )}
            </div>
          )}

          {/* Height Input */}
          {[
            'bmr',
            'tdee',
            'body-fat',
            'ideal-weight',
            'bmi'
          ].includes(calculator.id) && (
            <div>
              <label
                htmlFor="input-height"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Height ({unitSystem === 'metric' ? 'cm' : 'feet & inches'})
              </label>
              {unitSystem === 'metric' ? (
                <input
                  id="input-height"
                  type="number"
                  value={heightCm}
                  onChange={(e) =>
                    handleHeightMetricChange(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={3}
                    max={8}
                    value={heightFeet}
                    onChange={(e) =>
                      handleHeightImperialChange(
                        parseInt(e.target.value, 10) || 0,
                        heightInches
                      )
                    }
                    placeholder="Feet"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                  />
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={heightInches}
                    onChange={(e) =>
                      handleHeightImperialChange(
                        heightFeet,
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    placeholder="Inches"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                  />
                </div>
              )}
              {inputErrors.height && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                  {inputErrors.height}
                </p>
              )}
            </div>
          )}

          {/* Activity Level Selector */}
          {calculator.id === 'tdee' && (
            <div className="sm:col-span-2">
              <label
                htmlFor="input-activity"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Activity Level
              </label>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 mb-3 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Activity Note:</strong> Most people should select{' '}
                  <strong>Sedentary</strong> — overestimating physical activity is
                  the most common cause of inaccurate calorie calculations.
                </p>
              </div>

              <select
                id="input-activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
              >
                <option value="sedentary">
                  Sedentary (×1.2) — Desk job, little to no exercise
                </option>
                <option value="light">
                  Lightly active (×1.375) — Desk job + 1–3 workouts/week
                </option>
                <option value="moderate">
                  Moderately active (×1.55) — Active job or 3–5 workouts/week
                </option>
                <option value="very">
                  Very active (×1.725) — Hard physical job or 6–7 workouts/week
                </option>
                <option value="extra">
                  Extra active (×1.9) — Professional athlete or twice-daily
                  training
                </option>
              </select>
            </div>
          )}

          {/* Body Fat Circumference Specifics */}
          {calculator.id === 'body-fat' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Neck Circumference ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={
                    unitSystem === 'metric'
                      ? neckCm
                      : Math.round((neckCm / 2.54) * 10) / 10
                  }
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setNeckCm(
                      unitSystem === 'metric' ? val : Math.round(val * 2.54)
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Waist Circumference ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={
                    unitSystem === 'metric'
                      ? waistCm
                      : Math.round((waistCm / 2.54) * 10) / 10
                  }
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setWaistCm(
                      unitSystem === 'metric' ? val : Math.round(val * 2.54)
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              {gender === 'female' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hip Circumference ({unitSystem === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={
                      unitSystem === 'metric'
                        ? hipCm
                        : Math.round((hipCm / 2.54) * 10) / 10
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setHipCm(
                        unitSystem === 'metric' ? val : Math.round(val * 2.54)
                      );
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                  />
                </div>
              )}
            </>
          )}

          {/* Optional Body Fat for BMR & TDEE */}
          {(calculator.id === 'bmr' || calculator.id === 'tdee') && (
            <div className="sm:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={useBodyFat}
                  onChange={(e) => setUseBodyFat(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  Enable Katch-McArdle formula using verified Body Fat %
                </span>
              </label>

              {useBodyFat && (
                <div className="mt-3 max-w-xs">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Body Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={55}
                    value={bodyFatInput}
                    onChange={(e) =>
                      setBodyFatInput(parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm min-h-[44px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Specific Inputs: Macro Calculator */}
          {calculator.id === 'macro' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Calorie Budget (kcal)
                </label>
                <input
                  type="number"
                  step="50"
                  value={macroCalories}
                  onChange={(e) =>
                    setMacroCalories(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Fitness Objective
                </label>
                <select
                  value={macroGoal}
                  onChange={(e) => setMacroGoal(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
                >
                  <option value="lose">
                    Fat Loss (Higher protein 2.2g/kg to spare muscle)
                  </option>
                  <option value="maintain">
                    Weight Maintenance (Balanced 1.8g/kg)
                  </option>
                  <option value="gain">
                    Muscle Building / Surplus (Performance fuel)
                  </option>
                </select>
              </div>
            </>
          )}

          {/* Specific Inputs: Water Intake */}
          {calculator.id === 'water-intake' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Daily Activity & Exercise
                </label>
                <select
                  value={waterActivity}
                  onChange={(e) => setWaterActivity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
                >
                  <option value="sedentary">Sedentary (No formal sweat sessions)</option>
                  <option value="moderate">Moderate Exercise (30-60 mins)</option>
                  <option value="intense">Intense Training / Heavy Sweat (60+ mins)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Living Environment & Climate
                </label>
                <select
                  value={waterClimate}
                  onChange={(e) => setWaterClimate(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
                >
                  <option value="temperate">Temperate (Standard climate)</option>
                  <option value="hot">Hot or Humid (Elevated perspiration)</option>
                  <option value="dry">Dry / Arid / High Altitude</option>
                </select>
              </div>
            </>
          )}

          {/* Specific Inputs: One Rep Max */}
          {calculator.id === 'one-rep-max' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Weight Lifted ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  step="2.5"
                  value={oneRepWeight}
                  onChange={(e) =>
                    setOneRepWeight(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Completed Repetitions (1–12)
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={oneRepReps}
                  onChange={(e) =>
                    setOneRepReps(parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>
            </>
          )}

          {/* Specific Inputs: Heart Rate Zone */}
          {calculator.id === 'heart-rate-zone' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                min={35}
                max={110}
                value={restingHr}
                onChange={(e) =>
                  setRestingHr(parseInt(e.target.value, 10) || 60)
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
              />
            </div>
          )}

          {/* Specific Inputs: Protein Intake */}
          {calculator.id === 'protein-intake' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Goal / Athletic Modality
              </label>
              <select
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
              >
                <option value="sedentary">
                  Sedentary Wellness (1.0–1.2 g/kg)
                </option>
                <option value="endurance">
                  Endurance Athlete / Running (1.4–1.7 g/kg)
                </option>
                <option value="hypertrophy">
                  Muscle Hypertrophy / Resistance Training (1.6–2.2 g/kg)
                </option>
                <option value="fatloss">
                  Aggressive Deficit / Cutting (2.0–2.4 g/kg)
                </option>
              </select>
            </div>
          )}

          {/* Specific Inputs: Sleep Calculator */}
          {calculator.id === 'sleep' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Wake-Up Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-base"
              />
            </div>
          )}

          {/* Specific Inputs: Calorie Deficit Planner */}
          {calculator.id === 'calorie-deficit' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Maintenance (TDEE) kcal
                </label>
                <input
                  type="number"
                  step="50"
                  value={macroCalories}
                  onChange={(e) =>
                    setMacroCalories(parseInt(e.target.value, 10) || 2000)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Fat Loss ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={
                    unitSystem === 'metric'
                      ? deficitTargetLoss
                      : Math.round(deficitTargetLoss * 2.20462)
                  }
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setDeficitTargetLoss(
                      unitSystem === 'metric' ? val : val / 2.20462
                    );
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Deficit Pacing
                </label>
                <select
                  value={deficitIntensity}
                  onChange={(e) => setDeficitIntensity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px] text-sm"
                >
                  <option value="conservative">
                    Conservative (15% deficit) — Easiest to sustain, muscle sparing
                  </option>
                  <option value="moderate">
                    Moderate (20% deficit) — Standard validated fat loss pace
                  </option>
                  <option value="aggressive">
                    Aggressive (25% deficit) — Short-term cutting phase
                  </option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Calculate & Reset Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={executeCalculation}
            disabled={isCalculating}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-xs transition-all min-h-[48px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isCalculating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing Formulas...</span>
              </>
            ) : (
              <span>Calculate Result</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setAge(28);
              setWeightKg(75);
              setHeightCm(175);
              executeCalculation();
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[48px] flex items-center justify-center gap-1.5 text-xs font-medium"
            title="Reset inputs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            {/* Primary Result Card */}
            <div className="p-6 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-teal-800 dark:text-teal-300">
                    {result.primaryLabel}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-teal-950 dark:text-teal-100 font-mono tabular-nums">
                      {typeof result.primaryValue === 'number'
                        ? result.primaryValue.toLocaleString()
                        : result.primaryValue}
                    </span>
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                      {result.primaryUnit}
                    </span>
                  </div>

                  {result.rangeLabel && (
                    <p className="text-xs font-medium text-teal-800 dark:text-teal-300 mt-2 flex items-center gap-1.5">
                      <span className="font-semibold">Calculated Range:</span>{' '}
                      <span className="font-mono tabular-nums">{result.rangeLabel}</span>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-xs transition-colors shadow-xs self-start sm:self-center min-h-[44px]"
                  title="Copy result to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              </div>

              {result.category && (
                <div className="mt-4 pt-4 border-t border-teal-200/60 dark:border-teal-800/60 flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Classification:
                  </span>
                  <span className={`font-semibold text-xs ${result.category.color}`}>
                    {result.category.name}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">
                    ·
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {result.category.description}
                  </span>
                </div>
              )}
            </div>

            {/* Formula Breakdown Cards */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Scientific Formula Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Different clinical equations yield slightly different estimates based on their original population cohorts. The physiological median is typically most representative.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.formulaResults.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70"
                  >
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {f.name}
                    </p>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums my-1">
                      {f.value !== 0 ? f.value.toLocaleString() : ''} {f.unit}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Macro Breakdown */}
            {result.chartData && (
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Macronutrient Energy Distribution</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-900 dark:text-teal-200">
                      <span>Protein</span>
                      <span className="font-mono">{result.chartData.protein.percent}%</span>
                    </div>
                    <p className="text-2xl font-black text-teal-700 dark:text-teal-400 font-mono tabular-nums mt-1">
                      {result.chartData.protein.grams}g
                    </p>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-0.5">
                      {result.chartData.protein.calories} kcal (4 kcal/g)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200">
                      <span>Dietary Fats</span>
                      <span className="font-mono">{result.chartData.fat.percent}%</span>
                    </div>
                    <p className="text-2xl font-black text-amber-700 dark:text-amber-400 font-mono tabular-nums mt-1">
                      {result.chartData.fat.grams}g
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                      {result.chartData.fat.calories} kcal (9 kcal/g)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
                      <span>Carbohydrates</span>
                      <span className="font-mono">{result.chartData.carbs.percent}%</span>
                    </div>
                    <p className="text-2xl font-black text-blue-700 dark:text-blue-400 font-mono tabular-nums mt-1">
                      {result.chartData.carbs.grams}g
                    </p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                      {result.chartData.carbs.calories} kcal (4 kcal/g)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Metrics */}
            {result.secondaryMetrics && result.secondaryMetrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {result.secondaryMetrics.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {sec.label}
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                      {sec.value}
                    </p>
                    {sec.subtext && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {sec.subtext}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Adaptive Adjustment Guide */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-1">
                  Adaptive Calibration Guide
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result.adaptiveGuide}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* AdSense Slot (Rendered only when ADSENSE_ENABLED = true; otherwise null) */}
      <AdUnit slotId="1000000001" />

      {/* Personal Author Note */}
      <section className="mb-10 p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
              Methodology & Student Perspective Note
            </h3>
            <p>{calculator.authorNote}</p>
          </div>
        </div>
      </section>

      {/* Comprehensive In-Depth Scientific Article (1,200+ words total content) */}
      <article className="prose prose-slate dark:prose-invert max-w-none mb-10">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div
            className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: calculator.articleHtml }}
          />
        </div>
      </article>

      {/* AdSense Slot (Rendered only when ADSENSE_ENABLED = true; otherwise null) */}
      <AdUnit slotId="1000000002" />

      {/* Clinical Comparison Table */}
      <section className="mb-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Methodological Comparison: HealthCalcHub vs. Other Tools
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          How our clinical multi-formula approach compares to generic online calculators and hospital gold standards.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="py-3 px-3.5 font-semibold text-slate-900 dark:text-slate-100">Dimension</th>
                <th className="py-3 px-3.5 font-semibold text-teal-700 dark:text-teal-400">HealthCalcHub</th>
                <th className="py-3 px-3.5 font-semibold text-slate-500 dark:text-slate-400">Generic Online Tools</th>
                <th className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-300">Clinical Gold Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {calculator.comparisonTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100">{row.dimension}</td>
                  <td className="py-3 px-3.5 font-medium text-teal-800 dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/20">{row.healthCalcHub}</td>
                  <td className="py-3 px-3.5">{row.genericOnlineTools}</td>
                  <td className="py-3 px-3.5">{row.clinicalStandard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* When to See a Doctor Section */}
      <section className="mb-10 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            When to See a Doctor or Clinical Specialist
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          While health calculators provide useful educational baselines, physiological abnormalities require medical evaluation. Schedule an appointment with a licensed physician if:
        </p>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {calculator.whenToSeeDoctor.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Real Scientific Citations (PubMed, WHO, ISSN) */}
      {/* Peer-Reviewed Scientific Citations Section */}
      <section className="citations-section mb-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Peer-Reviewed Scientific Citations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          All formulas and clinical thresholds on this page are grounded in peer-reviewed biomedical literature:
        </p>

        <div className="space-y-3">
          {calculator.citations.map((cite, idx) => (
            <p key={idx} className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Source:</span>{' '}
              <a
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 dark:text-teal-400 underline hover:opacity-80"
              >
                {cite.text} ({cite.source}, {cite.year})
              </a>
            </p>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section
        aria-label="Frequently Asked Questions"
        className="mb-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Evidence-based answers verified against nutritional and metabolic research.
        </p>

        <div className="space-y-3">
          {calculator.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors min-h-[48px]"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Calculators (Exact Semantic Structure & Exact Anchor Matches) */}
      {relatedTools.length > 0 && (
        <section className="related-calculators mb-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Related Calculators
          </h2>
          <ul className="space-y-3">
            {relatedTools.map((rel) => (
              <li key={rel.id} className="text-sm text-slate-700 dark:text-slate-300">
                <a
                  href={`/tools/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/tools/${rel.slug}`);
                  }}
                  className="font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {rel.title}
                </a>
                <span className="text-slate-500 dark:text-slate-400"> — {rel.shortDescription}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
