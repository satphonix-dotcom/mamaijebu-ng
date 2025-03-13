
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { SingleNumberSearch } from '@/components/search/SingleNumberSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchResults } from '@/hooks/useSearchResults';

export default function Search() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Lottery Search Tools</h1>
        
        <Tabs defaultValue="single">
          <TabsList className="mb-6 w-full max-w-md grid grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="single">Single Numbers</TabsTrigger>
            <TabsTrigger value="pattern" disabled>Number Pattern</TabsTrigger>
            <TabsTrigger value="onerow" disabled>One Row Numbers</TabsTrigger>
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
                  Study number movement patterns across lottery charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* To be implemented */}
                <p>This feature will be coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="onerow">
            <Card>
              <CardHeader>
                <CardTitle>One Row Numbers Search</CardTitle>
                <CardDescription>
                  Look up numbers that occur within a single draw/event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* To be implemented */}
                <p>This feature will be coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
