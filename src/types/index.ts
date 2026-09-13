export interface Path {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  goals: string[];
  nutrition: string;
  training: string[];
  badge?: string;
  color: string;
  accentColor: string;
  bgPattern: string;
}

export interface NutritionCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
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
  icon: string;
  size: 'normal' | 'wide' | 'tall' | 'large';
  bg: string;
}

export interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  priceSAR: number;
  priceUSD: number;
  duration: string;
  durationMonths: number;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface OutcomeItem {
  id: string;
  title: string;
  icon: string;
}

export interface ProgressMetric {
  id: string;
  label: string;
  description: string;
  icon: string;
}
