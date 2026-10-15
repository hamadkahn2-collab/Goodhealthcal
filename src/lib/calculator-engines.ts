/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Pure calculation engines
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  bodyFatPercent?: number
) {
  // Mifflin-St Jeor
  const mifflin =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  // Harris-Benedict (Revised 1984)
  const harris =
    gender === 'male'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;

  // Katch-McArdle
  let katch = 0;
  if (bodyFatPercent && bodyFatPercent > 3 && bodyFatPercent < 60) {
    const lbm = weightKg * (1 - bodyFatPercent / 100);
    katch = 370 + 21.6 * lbm;
  } else {
    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    const estBf = gender === 'male' ? 1.2 * bmi + 0.23 * age - 16.2 : 1.2 * bmi + 0.23 * age - 5.4;
    const lbm = weightKg * (1 - Math.max(8, Math.min(45, estBf)) / 100);
    katch = 370 + 21.6 * lbm;
  }

  const values = [Math.round(mifflin), Math.round(harris), Math.round(katch)];
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = Math.round((mifflin + harris + katch) / 3);

  return {
    primaryValue: avgVal,
    primaryUnit: 'kcal / day',
    primaryLabel: 'Estimated Basal Metabolic Rate',
    rangeMin: minVal,
    rangeMax: maxVal,
    rangeLabel: `${minVal.toLocaleString()} – ${maxVal.toLocaleString()} kcal/day`,
    formulaResults: [
      {
        name: 'Mifflin-St Jeor',
        value: Math.round(mifflin),
        unit: 'kcal',
        description: 'Gold standard formula recommended by the Academy of Nutrition and Dietetics.'
      },
      {
        name: 'Revised Harris-Benedict',
        value: Math.round(harris),
        unit: 'kcal',
        description: 'Classic clinical equation updated by Roza & Shizgal in 1984.'
      },
      {
        name: 'Katch-McArdle',
        value: Math.round(katch),
        unit: 'kcal',
        description: 'Lean Body Mass specific formula; most accurate for athletic profiles.'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Weekly Basal Energy', value: `${(avgVal * 7).toLocaleString()} kcal`, subtext: 'Calories needed for pure organ preservation' },
      { label: 'Hourly Basal Burn', value: `${Math.round(avgVal / 24)} kcal/hr`, subtext: 'Baseline burn during uninterrupted rest' }
    ]
  };
}

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activity: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra',
  bodyFatPercent?: number
) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9
  };

  const mult = multipliers[activity];
  const bmrRes = calculateBMR(weightKg, heightCm, age, gender, bodyFatPercent);
  const mifflinTDEE = Math.round(bmrRes.formulaResults[0].value * mult);
  const harrisTDEE = Math.round(bmrRes.formulaResults[1].value * mult);
  const katchTDEE = Math.round(bmrRes.formulaResults[2].value * mult);

  const values = [mifflinTDEE, harrisTDEE, katchTDEE];
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = Math.round((mifflinTDEE + harrisTDEE + katchTDEE) / 3);

  return {
    primaryValue: avgVal,
    primaryUnit: 'kcal / day',
    primaryLabel: 'Total Daily Energy Expenditure',
    rangeMin: minVal,
    rangeMax: maxVal,
    rangeLabel: `${minVal.toLocaleString()} – ${maxVal.toLocaleString()} kcal/day`,
    formulaResults: [
      {
        name: 'Mifflin-St Jeor TDEE',
        value: mifflinTDEE,
        unit: 'kcal',
        description: `BMR (${bmrRes.formulaResults[0].value}) × ${mult} multiplier`
      },
      {
        name: 'Harris-Benedict TDEE',
        value: harrisTDEE,
        unit: 'kcal',
        description: `BMR (${bmrRes.formulaResults[1].value}) × ${mult} multiplier`
      },
      {
        name: 'Katch-McArdle TDEE',
        value: katchTDEE,
        unit: 'kcal',
        description: `BMR (${bmrRes.formulaResults[2].value}) × ${mult} multiplier`
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Fat Loss Target (-20%)', value: `${Math.round(avgVal * 0.8).toLocaleString()} kcal`, subtext: 'Safe sustainable fat loss pace' },
      { label: 'Mild Surplus (+10%)', value: `${Math.round(avgVal * 1.1).toLocaleString()} kcal`, subtext: 'Lean muscle building target' },
      { label: 'Weekly Maintenance', value: `${(avgVal * 7).toLocaleString()} kcal`, subtext: 'Total weekly caloric expenditure' }
    ]
  };
}

export function calculateBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  weightKg: number,
  neckCm: number,
  waistCm: number,
  hipCm?: number
) {
  let bfPercent = 0;
  if (gender === 'male') {
    const diff = Math.max(1, waistCm - neckCm);
    bfPercent = 86.01 * Math.log10(diff) - 70.041 * Math.log10(heightCm) + 36.76;
  } else {
    const hip = hipCm || waistCm * 1.15;
    const sumDiff = Math.max(1, waistCm + hip - neckCm);
    bfPercent = 163.205 * Math.log10(sumDiff) - 97.684 * Math.log10(heightCm) - 78.387;
  }

  bfPercent = Math.max(3, Math.min(55, Math.round(bfPercent * 10) / 10));
  const fatMassKg = Math.round(weightKg * (bfPercent / 100) * 10) / 10;
  const leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;

  let categoryName = 'Average';
  let categoryColor = 'text-teal-600 dark:text-teal-400';
  let categoryDesc = 'Typical healthy body composition for the general population.';

  if (gender === 'male') {
    if (bfPercent < 6) {
      categoryName = 'Essential Fat';
      categoryColor = 'text-amber-600 dark:text-amber-400';
      categoryDesc = 'Minimum biological fat required for survival; difficult to maintain.';
    } else if (bfPercent < 14) {
      categoryName = 'Athletes';
      categoryColor = 'text-emerald-600 dark:text-emerald-400';
      categoryDesc = 'Lean athletic physique with visible abdominal definition.';
    } else if (bfPercent < 18) {
      categoryName = 'Fitness';
      categoryColor = 'text-teal-600 dark:text-teal-400';
      categoryDesc = 'Excellent fitness condition with healthy hormonal balance.';
    } else if (bfPercent < 25) {
      categoryName = 'Average';
      categoryColor = 'text-slate-600 dark:text-slate-400';
      categoryDesc = 'Standard physiological range with normal health markers.';
    } else {
      categoryName = 'Obese';
      categoryColor = 'text-rose-600 dark:text-rose-400';
      categoryDesc = 'Elevated adipose tissue associated with increased metabolic risks.';
    }
  } else {
    if (bfPercent < 14) {
      categoryName = 'Essential Fat';
      categoryColor = 'text-amber-600 dark:text-amber-400';
      categoryDesc = 'Minimum fat needed for female reproductive endocrine function.';
    } else if (bfPercent < 21) {
      categoryName = 'Athletes';
      categoryColor = 'text-emerald-600 dark:text-emerald-400';
      categoryDesc = 'Fit competitive athletic composition.';
    } else if (bfPercent < 25) {
      categoryName = 'Fitness';
      categoryColor = 'text-teal-600 dark:text-teal-400';
      categoryDesc = 'Optimal healthy composition with high vitality.';
    } else if (bfPercent < 32) {
      categoryName = 'Average';
      categoryColor = 'text-slate-600 dark:text-slate-400';
      categoryDesc = 'Typical healthy range for adult females.';
    } else {
      categoryName = 'Obese';
      categoryColor = 'text-rose-600 dark:text-rose-400';
      categoryDesc = 'Elevated adipose tissue associated with metabolic health risks.';
    }
  }

  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const bmiEstimatedBf =
    gender === 'male' ? 1.2 * bmi + 0.23 * 30 - 16.2 : 1.2 * bmi + 0.23 * 30 - 5.4;
  const clampedBmiBf = Math.max(4, Math.min(50, Math.round(bmiEstimatedBf * 10) / 10));

  const minRange = Math.min(bfPercent, clampedBmiBf);
  const maxRange = Math.max(bfPercent, clampedBmiBf);

  return {
    primaryValue: bfPercent,
    primaryUnit: '%',
    primaryLabel: 'Body Fat Percentage',
    rangeMin: minRange,
    rangeMax: maxRange,
    rangeLabel: `${minRange}% – ${maxRange}% estimated variance`,
    category: {
      name: categoryName,
      color: categoryColor,
      description: categoryDesc
    },
    formulaResults: [
      {
        name: 'U.S. Navy Method',
        value: bfPercent,
        unit: '%',
        description: 'Clinical standard based on abdominal and neck circumference ratios.'
      },
      {
        name: 'BMI-Derived Approximation',
        value: clampedBmiBf,
        unit: '%',
        description: 'Gallagher et al. population regression based on height and gross mass.'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Lean Body Mass', value: `${leanMassKg} kg`, subtext: `${Math.round(leanMassKg * 2.20462)} lbs contractile & organ mass` },
      { label: 'Total Fat Mass', value: `${fatMassKg} kg`, subtext: `${Math.round(fatMassKg * 2.20462)} lbs total adipose tissue` },
      { label: 'Waist-to-Height Ratio', value: `${Math.round((waistCm / heightCm) * 100) / 100}`, subtext: 'Target is below 0.5 for optimal cardiac health' }
    ]
  };
}

export function calculateMacros(
  calories: number,
  weightKg: number,
  goal: 'lose' | 'maintain' | 'gain'
) {
  let proteinRatio = 2.0;
  if (goal === 'lose') proteinRatio = 2.2;
  if (goal === 'maintain') proteinRatio = 1.8;
  if (goal === 'gain') proteinRatio = 2.0;

  const proteinGrams = Math.round(weightKg * proteinRatio);
  const proteinCals = proteinGrams * 4;
  const fatCals = calories * 0.25;
  const fatGrams = Math.round(fatCals / 9);
  const carbCals = Math.max(0, calories - proteinCals - fatCals);
  const carbGrams = Math.round(carbCals / 4);

  const totalCals = proteinGrams * 4 + fatGrams * 9 + carbGrams * 4;
  const proteinPct = Math.round((proteinGrams * 4 / totalCals) * 100);
  const fatPct = Math.round((fatGrams * 9 / totalCals) * 100);
  const carbPct = Math.max(0, 100 - proteinPct - fatPct);

  return {
    primaryValue: calories,
    primaryUnit: 'kcal',
    primaryLabel: 'Daily Target Calories',
    formulaResults: [
      {
        name: 'Protein Target',
        value: proteinGrams,
        unit: 'g',
        description: `${proteinRatio}g per kg bodyweight (${proteinGrams * 4} kcal / ${proteinPct}%)`
      },
      {
        name: 'Dietary Fat Target',
        value: fatGrams,
        unit: 'g',
        description: `25% of total daily calories (${fatGrams * 9} kcal / ${fatPct}%)`
      },
      {
        name: 'Carbohydrate Target',
        value: carbGrams,
        unit: 'g',
        description: `Remaining energy budget (${carbGrams * 4} kcal / ${carbPct}%)`
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    chartData: {
      protein: { grams: proteinGrams, percent: proteinPct, calories: proteinGrams * 4, color: '#0d9488' },
      fat: { grams: fatGrams, percent: fatPct, calories: fatGrams * 9, color: '#f59e0b' },
      carbs: { grams: carbGrams, percent: carbPct, calories: carbGrams * 4, color: '#3b82f6' }
    },
    secondaryMetrics: [
      { label: 'Protein / Meal (4 meals)', value: `${Math.round(proteinGrams / 4)}g`, subtext: 'Optimal leucine trigger per feeding' },
      { label: 'Dietary Fat Floor', value: `${Math.round(weightKg * 0.6)}g min`, subtext: 'Minimum essential fatty acids for hormones' },
      { label: 'Fiber Minimum Target', value: `${Math.round((calories / 1000) * 14)}g`, subtext: '14g per 1,000 kcal for gastrointestinal health' }
    ]
  };
}

export function calculateWater(
  weightKg: number,
  activityLevel: 'sedentary' | 'moderate' | 'intense',
  climate: 'temperate' | 'hot' | 'dry'
) {
  let baseMl = weightKg * 33;
  if (activityLevel === 'moderate') baseMl += 450;
  if (activityLevel === 'intense') baseMl += 900;
  if (climate === 'hot') baseMl += 400;
  if (climate === 'dry') baseMl += 650;

  const totalLiters = Math.round((baseMl / 1000) * 10) / 10;
  const ounces = Math.round(baseMl * 0.033814);
  const glasses = Math.round((baseMl / 250) * 10) / 10;
  const minLiters = Math.round((totalLiters * 0.9) * 10) / 10;
  const maxLiters = Math.round((totalLiters * 1.1) * 10) / 10;

  return {
    primaryValue: totalLiters,
    primaryUnit: 'Liters / day',
    primaryLabel: 'Recommended Daily Water Intake',
    rangeMin: minLiters,
    rangeMax: maxLiters,
    rangeLabel: `${minLiters}L – ${maxLiters}L per day`,
    formulaResults: [
      {
        name: 'Standard Bodyweight Formula',
        value: Math.round((weightKg * 33) / 100) / 10,
        unit: 'L',
        description: 'Baseline metabolic demand (33 ml per kg of body mass)'
      },
      {
        name: 'Exercise & Climate Adjusted',
        value: totalLiters,
        unit: 'L',
        description: 'Total fluid demand accounting for sweat loss and ambient humidity'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Fluid Ounces', value: `${ounces} fl oz`, subtext: 'Standard US fluid ounces' },
      { label: 'Standard Glasses', value: `${Math.round(glasses)} cups`, subtext: 'Based on 250ml (8.5 oz) drinking glasses' },
      { label: 'Morning Wake-Up Bolus', value: '500 ml', subtext: 'Rehydrates overnight respiratory loss immediately' }
    ]
  };
}

export function calculateIdealWeight(gender: 'male' | 'female', heightCm: number) {
  const inchesOver5Ft = Math.max(0, heightCm / 2.54 - 60);

  const devine = gender === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
  const robinson = gender === 'male' ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;
  const miller = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;
  const hamwi = gender === 'male' ? 48.0 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

  const values = [
    Math.round(devine * 10) / 10,
    Math.round(robinson * 10) / 10,
    Math.round(miller * 10) / 10,
    Math.round(hamwi * 10) / 10
  ];

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = Math.round(((minVal + maxVal) / 2) * 10) / 10;

  const heightM = heightCm / 100;
  const bmiMinWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const bmiMaxWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    primaryValue: avgVal,
    primaryUnit: 'kg',
    primaryLabel: 'Estimated Ideal Body Weight',
    rangeMin: minVal,
    rangeMax: maxVal,
    rangeLabel: `${minVal} – ${maxVal} kg (${Math.round(minVal * 2.20462)} – ${Math.round(maxVal * 2.20462)} lbs)`,
    formulaResults: [
      {
        name: 'Devine Formula (1974)',
        value: Math.round(devine * 10) / 10,
        unit: 'kg',
        description: 'Hospital pharmacological standard for drug clearance.'
      },
      {
        name: 'Robinson Formula (1983)',
        value: Math.round(robinson * 10) / 10,
        unit: 'kg',
        description: 'Updated epidemiological regression.'
      },
      {
        name: 'Miller Formula (1983)',
        value: Math.round(miller * 10) / 10,
        unit: 'kg',
        description: 'Empirical formula tailored for modern stature averages.'
      },
      {
        name: 'Hamwi Formula (1964)',
        value: Math.round(hamwi * 10) / 10,
        unit: 'kg',
        description: 'Classic clinical dietitian reference rule.'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Normal BMI Weight Span', value: `${bmiMinWeight} – ${bmiMaxWeight} kg`, subtext: 'WHO Healthy Range (BMI 18.5 – 24.9)' },
      { label: 'Equivalent in Pounds', value: `${Math.round(avgVal * 2.20462)} lbs`, subtext: 'Imperial scale representation' }
    ]
  };
}

export function calculateOneRepMax(weight: number, reps: number, unit: 'kg' | 'lbs') {
  if (reps === 1) {
    return {
      primaryValue: weight,
      primaryUnit: unit,
      primaryLabel: 'One Repetition Maximum',
      rangeMin: weight,
      rangeMax: weight,
      rangeLabel: `${weight} ${unit} (True 1RM)`,
      formulaResults: [
        { name: 'Brzycki', value: weight, unit, description: 'Direct 1-rep lift' },
        { name: 'Epley', value: weight, unit, description: 'Direct 1-rep lift' },
        { name: 'Lombardi', value: weight, unit, description: 'Direct 1-rep lift' }
      ],
      adaptiveGuide:
        "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
      secondaryMetrics: generateRMBreakdown(weight, unit)
    };
  }

  const brzycki = reps < 37 ? weight * (36 / (37 - reps)) : weight * 1.5;
  const epley = weight * (1 + reps / 30);
  const lombardi = weight * Math.pow(reps, 0.1);

  const values = [Math.round(brzycki), Math.round(epley), Math.round(lombardi)];
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = Math.round((brzycki + epley + lombardi) / 3);

  return {
    primaryValue: avgVal,
    primaryUnit: unit,
    primaryLabel: 'Estimated One Repetition Maximum (1RM)',
    rangeMin: minVal,
    rangeMax: maxVal,
    rangeLabel: `${minVal} – ${maxVal} ${unit}`,
    formulaResults: [
      {
        name: 'Brzycki Formula',
        value: Math.round(brzycki),
        unit,
        description: 'Most accurate for 2 to 8 repetitions.'
      },
      {
        name: 'Epley Formula',
        value: Math.round(epley),
        unit,
        description: 'Widely used in strength training and collegiate athletics.'
      },
      {
        name: 'Lombardi Formula',
        value: Math.round(lombardi),
        unit,
        description: 'Exponential scaling formula smoothing higher reps.'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: generateRMBreakdown(avgVal, unit)
  };
}

function generateRMBreakdown(maxWeight: number, unit: string) {
  const percentages = [95, 90, 85, 80, 75, 70];
  const repEstimates: Record<number, string> = {
    95: '2 reps',
    90: '3-4 reps',
    85: '5-6 reps',
    80: '7-8 reps',
    75: '9-10 reps',
    70: '11-12 reps'
  };

  return percentages.map((pct) => ({
    label: `${pct}% 1RM`,
    value: `${Math.round(maxWeight * (pct / 100))} ${unit}`,
    subtext: `Approx. ${repEstimates[pct]} at RPE 9-10`
  }));
}

export function calculateHeartRateZones(age: number, restingHr: number = 65) {
  const maxHrTanaka = Math.round(208 - 0.7 * age);
  const maxHrFox = Math.round(220 - age);
  const avgMaxHr = Math.round((maxHrTanaka + maxHrFox) / 2);
  const hrr = avgMaxHr - restingHr;

  const zone1 = [Math.round(hrr * 0.5 + restingHr), Math.round(hrr * 0.6 + restingHr)];
  const zone2 = [Math.round(hrr * 0.6 + restingHr), Math.round(hrr * 0.7 + restingHr)];
  const zone3 = [Math.round(hrr * 0.7 + restingHr), Math.round(hrr * 0.8 + restingHr)];
  const zone4 = [Math.round(hrr * 0.8 + restingHr), Math.round(hrr * 0.9 + restingHr)];
  const zone5 = [Math.round(hrr * 0.9 + restingHr), avgMaxHr];

  return {
    primaryValue: avgMaxHr,
    primaryUnit: 'BPM',
    primaryLabel: 'Estimated Maximum Heart Rate',
    rangeMin: Math.min(maxHrTanaka, maxHrFox),
    rangeMax: Math.max(maxHrTanaka, maxHrFox),
    rangeLabel: `${Math.min(maxHrTanaka, maxHrFox)} – ${Math.max(maxHrTanaka, maxHrFox)} BPM Max`,
    formulaResults: [
      {
        name: 'Tanaka Equation (2001)',
        value: maxHrTanaka,
        unit: 'BPM',
        description: '208 - (0.7 × Age); clinically validated across 18,000+ subjects.'
      },
      {
        name: 'Fox Equation (1971)',
        value: maxHrFox,
        unit: 'BPM',
        description: 'Traditional 220 - Age equation.'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Zone 1: Active Recovery (50-60%)', value: `${zone1[0]} – ${zone1[1]} BPM`, subtext: 'Easy walking, promotes circulation' },
      { label: 'Zone 2: Aerobic / Fat Burn (60-70%)', value: `${zone2[0]} – ${zone2[1]} BPM`, subtext: 'Mitochondrial base building, conversational pace' },
      { label: 'Zone 3: Tempo / Aerobic (70-80%)', value: `${zone3[0]} – ${zone3[1]} BPM`, subtext: 'Endurance pace, steady effort' },
      { label: 'Zone 4: Lactate Threshold (80-90%)', value: `${zone4[0]} – ${zone4[1]} BPM`, subtext: 'Hard interval pacing, race pace' },
      { label: 'Zone 5: Anaerobic / VO2 Max (90-100%)', value: `${zone5[0]} – ${zone5[1]} BPM`, subtext: 'Max sprint intervals, peak exertion' }
    ]
  };
}

export function calculateProtein(
  weightKg: number,
  goal: 'sedentary' | 'endurance' | 'hypertrophy' | 'fatloss'
) {
  let gPerKgMin = 1.0;
  let gPerKgMax = 1.2;

  if (goal === 'endurance') {
    gPerKgMin = 1.4;
    gPerKgMax = 1.7;
  } else if (goal === 'hypertrophy') {
    gPerKgMin = 1.6;
    gPerKgMax = 2.2;
  } else if (goal === 'fatloss') {
    gPerKgMin = 2.0;
    gPerKgMax = 2.4;
  }

  const minGrams = Math.round(weightKg * gPerKgMin);
  const maxGrams = Math.round(weightKg * gPerKgMax);
  const avgGrams = Math.round((minGrams + maxGrams) / 2);

  return {
    primaryValue: avgGrams,
    primaryUnit: 'grams / day',
    primaryLabel: 'Target Daily Protein Intake',
    rangeMin: minGrams,
    rangeMax: maxGrams,
    rangeLabel: `${minGrams}g – ${maxGrams}g per day (${gPerKgMin} – ${gPerKgMax} g/kg)`,
    formulaResults: [
      {
        name: 'Moderate Bracket',
        value: minGrams,
        unit: 'g',
        description: `${gPerKgMin} g/kg of total body mass.`
      },
      {
        name: 'Optimal Performance Bracket',
        value: maxGrams,
        unit: 'g',
        description: `${gPerKgMax} g/kg of total body mass.`
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Per Meal Target (4 meals)', value: `${Math.round(avgGrams / 4)}g`, subtext: 'Exceeds 2.5g leucine trigger threshold' },
      { label: 'Per Meal Target (3 meals)', value: `${Math.round(avgGrams / 3)}g`, subtext: 'Higher bolus distribution' },
      { label: 'Grams per Pound', value: `${Math.round((avgGrams / (weightKg * 2.20462)) * 100) / 100} g/lb`, subtext: 'Standard US strength rule of thumb' }
    ]
  };
}

export function calculateSleep(wakeTimeStr: string) {
  const [hoursStr, minutesStr] = wakeTimeStr.split(':');
  const targetWake = new Date();
  targetWake.setHours(parseInt(hoursStr, 10), parseInt(minutesStr, 10), 0, 0);

  const latencyMinutes = 14;
  const cycleDurations = [
    { cycles: 6, hours: 9.0, label: '6 Cycles (9h 00m) - Ideal for Teens & Heavy Athletes' },
    { cycles: 5, hours: 7.5, label: '5 Cycles (7h 30m) - Recommended for Most Adults' },
    { cycles: 4, hours: 6.0, label: '4 Cycles (6h 00m) - Functional Minimum' },
    { cycles: 3, hours: 4.5, label: '3 Cycles (4h 30m) - Emergency Short Rest' }
  ];

  const suggestedTimes = cycleDurations.map((c) => {
    const totalMinutesBack = c.hours * 60 + latencyMinutes;
    const bedtime = new Date(targetWake.getTime() - totalMinutesBack * 60 * 1000);
    const timeFormatted = bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      name: `${c.cycles} Cycles (${c.hours} hrs)`,
      value: 0,
      unit: timeFormatted,
      description: `${c.label}. Bedtime target: ${timeFormatted}`
    };
  });

  return {
    primaryValue: suggestedTimes[1].unit,
    primaryUnit: 'Bedtime',
    primaryLabel: 'Recommended Bedtime for 5 Full Cycles (7.5h)',
    formulaResults: suggestedTimes,
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Cycle Duration', value: '90 Minutes', subtext: 'Complete NREM + REM cycle' },
      { label: 'Sleep Latency Buffer', value: '14 Minutes', subtext: 'Average time to fall asleep' },
      { label: 'Weekly Sleep Target', value: '35 Cycles', subtext: 'Ideal restorative volume' }
    ]
  };
}

export function calculateCalorieDeficit(
  tdee: number,
  targetLossKg: number,
  intensity: 'conservative' | 'moderate' | 'aggressive'
) {
  const intensityMap = {
    conservative: { pct: 0.15, label: 'Conservative (15% deficit)' },
    moderate: { pct: 0.20, label: 'Moderate (20% deficit)' },
    aggressive: { pct: 0.25, label: 'Aggressive (25% deficit)' }
  };

  const choice = intensityMap[intensity];
  const dailyDeficit = Math.round(tdee * choice.pct);
  const targetCalories = Math.max(1200, tdee - dailyDeficit);

  const totalKcalNeeded = targetLossKg * 7700;
  const daysRequired = Math.round(totalKcalNeeded / dailyDeficit);
  const weeksRequired = Math.round((daysRequired / 7) * 10) / 10;
  const weeklyLossKg = Math.round(((dailyDeficit * 7) / 7700) * 100) / 100;
  const weeklyLossLbs = Math.round(weeklyLossKg * 2.20462 * 100) / 100;

  const milestoneDate = new Date();
  milestoneDate.setDate(milestoneDate.getDate() + daysRequired);
  const formattedDate = milestoneDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    primaryValue: targetCalories,
    primaryUnit: 'kcal / day',
    primaryLabel: `Target Intake (${choice.label})`,
    rangeMin: targetCalories - 100,
    rangeMax: targetCalories + 100,
    rangeLabel: `${(targetCalories - 100).toLocaleString()} – ${(targetCalories + 100).toLocaleString()} kcal/day buffer`,
    formulaResults: [
      {
        name: 'Conservative 15% Deficit',
        value: Math.round(tdee * 0.85),
        unit: 'kcal',
        description: `Burns approx ${(tdee * 0.15 * 7 / 7700).toFixed(2)} kg/week; easiest to maintain.`
      },
      {
        name: 'Moderate 20% Deficit',
        value: Math.round(tdee * 0.80),
        unit: 'kcal',
        description: `Burns approx ${(tdee * 0.20 * 7 / 7700).toFixed(2)} kg/week; optimal fat loss speed.`
      },
      {
        name: 'Aggressive 25% Deficit',
        value: Math.round(tdee * 0.75),
        unit: 'kcal',
        description: `Burns approx ${(tdee * 0.25 * 7 / 7700).toFixed(2)} kg/week; for short-term cut.`
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Estimated Weekly Loss', value: `${weeklyLossKg} kg (${weeklyLossLbs} lbs)`, subtext: 'Predicted fat tissue reduction' },
      { label: 'Projected Milestone Date', value: formattedDate, subtext: `In approx. ${weeksRequired} weeks` },
      { label: 'Daily Energy Deficit', value: `-${dailyDeficit} kcal`, subtext: 'Mobilized from adipose stores' }
    ]
  };
}

export function calculateBMI(weightKg: number, heightCm: number, age: number = 30, gender: 'male' | 'female' = 'male') {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  const bmiPrime = Math.round((bmi / 25.0) * 100) / 100;

  let category = 'Normal weight';
  let categoryColor = 'text-emerald-600 dark:text-emerald-400';
  let description = 'Lowest statistical all-cause mortality rate.';

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-amber-600 dark:text-amber-400';
    description = 'Possible nutritional deficiency or compromised bone mineral density.';
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    categoryColor = 'text-emerald-600 dark:text-emerald-400';
    description = 'Healthy balance between height and total mass.';
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    categoryColor = 'text-amber-600 dark:text-amber-400';
    description = 'Moderate excess mass. For muscular athletes, this may represent lean mass.';
  } else if (bmi <= 34.9) {
    category = 'Obesity Class I';
    categoryColor = 'text-rose-600 dark:text-rose-400';
    description = 'Elevated risk of cardiovascular and metabolic complications.';
  } else if (bmi <= 39.9) {
    category = 'Obesity Class II';
    categoryColor = 'text-rose-700 dark:text-rose-500';
    description = 'High clinical risk requiring deliberate lifestyle interventions.';
  } else {
    category = 'Obesity Class III';
    categoryColor = 'text-red-700 dark:text-red-500';
    description = 'Severe health risk; clinical supervision recommended.';
  }

  const normalMinKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const normalMaxKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    primaryValue: bmi,
    primaryUnit: 'kg/m²',
    primaryLabel: 'Body Mass Index (BMI)',
    category: {
      name: category,
      color: categoryColor,
      description
    },
    formulaResults: [
      {
        name: 'Standard WHO BMI',
        value: bmi,
        unit: 'kg/m²',
        description: 'Standard Quetelet metric weight / height²'
      },
      {
        name: 'BMI Prime Ratio',
        value: bmiPrime,
        unit: 'ratio',
        description: 'Index relative to the 25.0 upper normal limit (healthy: 0.74 – 1.00)'
      }
    ],
    adaptiveGuide:
      "Use this number for 2–3 weeks. If your weight hasn't moved in the expected direction, adjust by 100–200 calories. The calculator is a starting point — your real-world results are the final answer.",
    secondaryMetrics: [
      { label: 'Healthy Weight Target', value: `${normalMinKg} – ${normalMaxKg} kg`, subtext: `${Math.round(normalMinKg * 2.20462)} – ${Math.round(normalMaxKg * 2.20462)} lbs` },
      { label: 'BMI Prime', value: `${bmiPrime}`, subtext: bmiPrime > 1 ? `${Math.round((bmiPrime - 1) * 100)}% above upper limit` : 'Within standard bounds' }
    ]
  };
}
