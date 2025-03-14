
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumRequired } from './PremiumRequired';
import {
  SingleNumberTabContent,
  PatternNumberTabContent,
  OneRowNumbersTabContent,
  TwoRowNumbersTabContent,
  ThreeRowNumbersTabContent,
  LappingNumbersTabContent,
  KnockingNumbersTabContent,
  ViewChartTabContent,
  EventLookupTabContent,
  CompareChartsTabContent
} from './tab-content';

interface SearchTabContentProps {
  activeTab: string;
}

// Define which tabs require premium membership
const premiumTabs = ['single', 'pattern', 'onerow', 'tworow', 'threerow', 'lapping', 'knocking', 'compare'];

export function SearchTabContent({ activeTab }: SearchTabContentProps) {
  const { isPremium } = useAuth();
  
  // Check if the active tab requires premium and user is not premium
  const requiresPremium = premiumTabs.includes(activeTab) && !isPremium;
  
  if (requiresPremium) {
    return <PremiumRequired />;
  }
  
  switch (activeTab) {
    case "single":
      return <SingleNumberTabContent />;
    case "pattern":
      return <PatternNumberTabContent />;
    case "onerow":
      return <OneRowNumbersTabContent />;
    case "tworow":
      return <TwoRowNumbersTabContent />;
    case "threerow":
      return <ThreeRowNumbersTabContent />;
    case "lapping":
      return <LappingNumbersTabContent />;
    case "knocking":
      return <KnockingNumbersTabContent />;
    case "chart":
      return <ViewChartTabContent />;
    case "eventlookup":
      return <EventLookupTabContent />;
    case "compare":
      return <CompareChartsTabContent />;
    default:
      return null;
  }
}
