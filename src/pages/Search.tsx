
import React from 'react';
import { Layout } from '@/components/Layout';
import { SingleNumberSearch } from '@/components/search/SingleNumberSearch';
import { PatternNumberSearch } from '@/components/search/PatternNumberSearch';
import { OneRowNumbersSearch } from '@/components/search/OneRowNumbersSearch';
import { TwoRowNumbersSearch } from '@/components/search/TwoRowNumbersSearch';
import { ThreeRowNumbersSearch } from '@/components/search/ThreeRowNumbersSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Search() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Lottery Search Tools</h1>
        
        <Tabs defaultValue="single">
          <TabsList className="mb-6 w-full max-w-3xl grid grid-cols-5 gap-4">
            <TabsTrigger value="single" className="px-2 py-2 text-sm md:text-base md:px-4">Single Numbers</TabsTrigger>
            <TabsTrigger value="pattern" className="px-2 py-2 text-sm md:text-base md:px-4">Number Pattern</TabsTrigger>
            <TabsTrigger value="onerow" className="px-2 py-2 text-sm md:text-base md:px-4">One Row Numbers</TabsTrigger>
            <TabsTrigger value="tworow" className="px-2 py-2 text-sm md:text-base md:px-4">Two Row Numbers</TabsTrigger>
            <TabsTrigger value="threerow" className="px-2 py-2 text-sm md:text-base md:px-4">Three Row Numbers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
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
          </TabsContent>
          
          <TabsContent value="pattern">
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
          </TabsContent>
          
          <TabsContent value="onerow">
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
          </TabsContent>
          
          <TabsContent value="tworow">
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
          </TabsContent>
          
          <TabsContent value="threerow">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
