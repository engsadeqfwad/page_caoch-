export interface Path {
  id: string;
  number: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleAr?: string;
  description: string;
  descriptionEn?: string;
  goals: string[];
  goalsEn?: string[];
  nutrition: string;
  nutritionEn?: string;
  training: string[];
  badge?: string;
  badgeEn?: string;
  color: string;
  accentColor: string;
  bgPattern: string;
}

export interface NutritionCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn?: string;
  icon: string;
}

export interface TrainingType {
  id: string;
  label: string;
  labelEn?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn?: string;
  icon: string;
  size: 'normal' | 'wide' | 'tall' | 'large';
  bg: string;
}

export interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn?: string;
  priceSAR: number;
  priceUSD: number;
  duration: string;
  durationEn?: string;
  durationMonths: number;
  features: string[];
  featuresEn?: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}

export interface OutcomeItem {
  id: string;
  title: string;
  titleEn?: string;
  icon: string;
}

export interface ProgressMetric {
  id: string;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
}
