
import React from 'react';
import { Layout } from '@/components/Layout';
import { SingleNumberSearch } from '@/components/search/SingleNumberSearch';
import { PatternNumberSearch } from '@/components/search/PatternNumberSearch';
import { OneRowNumbersSearch } from '@/components/search/OneRowNumbersSearch';
import { TwoRowNumbersSearch } from '@/components/search/TwoRowNumbersSearch';
import { ThreeRowNumbersSearch } from '@/components/search/ThreeRowNumbersSearch';
import { LappingNumbersSearch } from '@/components/search/LappingNumbersSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function Search() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("single");
  const [open, setOpen] = React.useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOpen(false);
  };

  const tabOptions = [
    { id: "single", label: "Single Numbers" },
    { id: "pattern", label: "Number Pattern" },
    { id: "onerow", label: "One Row Numbers" },
    { id: "tworow", label: "Two Row Numbers" },
    { id: "threerow", label: "Three Row Numbers" },
    { id: "lapping", label: "Lapping Numbers" },
  ];

  const renderTabContent = (id: string) => {
    switch (id) {
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
                Search for lapping vertical sequence of numbers between two consecutive draws. Find where numbers appear in same positions across consecutive draws.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LappingNumbersSearch />
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Lottery Search Tools</h1>
        
        {isMobile ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-medium text-xl">{tabOptions.find(tab => tab.id === activeTab)?.label}</h2>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Search Tools</DrawerTitle>
                    <DrawerDescription>
                      Select a search tool to use
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-2">
                    <div className="flex flex-col space-y-2">
                      {tabOptions.map((tab) => (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? "default" : "ghost"}
                          className="justify-start w-full"
                          onClick={() => handleTabChange(tab.id)}
                        >
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            {renderTabContent(activeTab)}
          </>
        ) : (
          <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full max-w-3xl grid grid-cols-5 gap-4">
              {tabOptions.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="px-2 py-2 text-sm md:text-base md:px-4"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabOptions.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {renderTabContent(tab.id)}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
