
import React from 'react';
import {
  SingleNumberTabContent,
  PatternNumberTabContent,
  OneRowNumbersTabContent,
  TwoRowNumbersTabContent,
  ThreeRowNumbersTabContent,
  LappingNumbersTabContent,
  KnockingNumbersTabContent,
  ViewChartTabContent,
  EventLookupTabContent
} from './tab-content';

interface SearchTabContentProps {
  activeTab: string;
}

export function SearchTabContent({ activeTab }: SearchTabContentProps) {
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
    default:
      return null;
  }
}
