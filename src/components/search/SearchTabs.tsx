
import React from 'react';
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
import { Menu, ChartBar, Search, GitCompare, LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchTabContent } from './SearchTabContent';

// Define interface for tab items
interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

// Split tabs into two rows
export const searchTabsRow1: TabItem[] = [
  { id: "single", label: "Single Numbers" },
  { id: "pattern", label: "Number Pattern" },
  { id: "onerow", label: "One Row Numbers" },
  { id: "tworow", label: "Two Row Numbers" },
  { id: "threerow", label: "Three Row Numbers" },
];

export const searchTabsRow2: TabItem[] = [
  { id: "lapping", label: "Lapping Numbers" },
  { id: "knocking", label: "Knocking Numbers" },
  { id: "chart", label: "View Chart", icon: ChartBar },
  { id: "eventlookup", label: "Event Look-up", icon: Search },
  { id: "compare", label: "Compare Charts", icon: GitCompare }
];

// Combined for backwards compatibility
export const tabOptions: TabItem[] = [...searchTabsRow1, ...searchTabsRow2];

interface SearchTabsProps {
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function SearchTabs({ isMobile, activeTab, setActiveTab }: SearchTabsProps) {
  const [open, setOpen] = React.useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOpen(false);
  };

  if (isMobile) {
    return (
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
                      {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
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
        <SearchTabContent activeTab={activeTab} />
      </>
    );
  }
  
  return (
    <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
      <div className="space-y-2 mb-6">
        {/* First row of tabs */}
        <TabsList className="w-full grid grid-cols-5 gap-2">
          {searchTabsRow1.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="px-2 py-2 text-sm md:text-base md:px-4 flex items-center justify-center"
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Second row of tabs */}
        <TabsList className="w-full grid grid-cols-5 gap-2">
          {searchTabsRow2.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="px-2 py-2 text-sm md:text-base md:px-4 flex items-center justify-center"
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabOptions.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <SearchTabContent activeTab={tab.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
