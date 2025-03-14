
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SingleNumberSearch } from '@/components/search/SingleNumberSearch';
import { PatternNumberSearch } from '@/components/search/PatternNumberSearch';
import { OneRowNumbersSearch } from '@/components/search/OneRowNumbersSearch';
import { TwoRowNumbersSearch } from '@/components/search/TwoRowNumbersSearch';
import { ThreeRowNumbersSearch } from '@/components/search/ThreeRowNumbersSearch';
import { LappingNumbersSearch } from '@/components/search/LappingNumbersSearch';
import { KnockingNumbersSearch } from '@/components/search/KnockingNumbersSearch';

interface SearchTabContentProps {
  activeTab: string;
}

export function SearchTabContent({ activeTab }: SearchTabContentProps) {
  switch (activeTab) {
    case "single":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Single Number Search</CardTitle>
            <CardDescription>
              Search for a single number across lottery games. Filter by game type and position.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SingleNumberSearch />
          </CardContent>
        </Card>
      );
    case "pattern":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Number Pattern Search</CardTitle>
            <CardDescription>
              Study number movement patterns across lottery charts. Look for patterns in success and machine numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatternNumberSearch />
          </CardContent>
        </Card>
      );
    case "onerow":
      return (
        <Card>
          <CardHeader>
            <CardTitle>One Row Numbers Search</CardTitle>
            <CardDescription>
              Look up numbers that occur within a single draw/event. Apply different match logics to refine your search.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OneRowNumbersSearch />
          </CardContent>
        </Card>
      );
    case "tworow":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Two Row Numbers Search</CardTitle>
            <CardDescription>
              Search across two consecutive draws independently. Look for patterns across consecutive lottery events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TwoRowNumbersSearch />
          </CardContent>
        </Card>
      );
    case "threerow":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Three Row Numbers Search</CardTitle>
            <CardDescription>
              Search across three consecutive draws independently. Look for patterns across three consecutive lottery events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThreeRowNumbersSearch />
          </CardContent>
        </Card>
      );
    case "lapping":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Lapping Numbers Search</CardTitle>
            <CardDescription>
              Search for lapping vertical sequence of numbers between two consecutive draws.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LappingNumbersSearch />
          </CardContent>
        </Card>
      );
    case "knocking":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Knocking Numbers Search</CardTitle>
            <CardDescription>
              Search for knocking pattern of numbers between three consecutive draws.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnockingNumbersSearch />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}
