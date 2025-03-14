
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
import { Menu, ChartBar, Search, GitCompare, LucideIcon, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchTabContent } from './SearchTabContent';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumRequired } from '@/components/search/PremiumRequired';

// Define interface for tab items
interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  premium?: boolean;
}

// Split tabs into two rows
export const searchTabsRow1: TabItem[] = [
  { id: "single", label: "Single Numbers", premium: true },
  { id: "pattern", label: "Number Pattern", premium: true },
  { id: "onerow", label: "One Row Numbers", premium: true },
  { id: "tworow", label: "Two Row Numbers", premium: true },
  { id: "threerow", label: "Three Row Numbers", premium: true },
];

export const searchTabsRow2: TabItem[] = [
  { id: "lapping", label: "Lapping Numbers", premium: true },
  { id: "knocking", label: "Knocking Numbers", premium: true },
  { id: "chart", label: "View Chart", icon: ChartBar, premium: false },
  { id: "eventlookup", label: "Event Look-up", icon: Search, premium: false },
  { id: "compare", label: "Compare Charts", icon: GitCompare, premium: true }
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
  const { user, profile } = useAuth();
  const isPremiumMember = profile?.is_premium || false;

  const handleTabChange = (value: string) => {
    const tab = tabOptions.find(tab => tab.id === value);
    
    // Only allow changing to premium tabs if user is premium
    if (tab?.premium && !isPremiumMember) {
      return;
    }
    
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
                      disabled={tab.premium && !isPremiumMember}
                    >
                      {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
                      {tab.label}
                      {tab.premium && !isPremiumMember && <Lock className="ml-2 h-3 w-3" />}
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
    <Tabs defaultValue="single" value={activeTab} onValueChange={handleTabChange}>
      <div className="space-y-2 mb-6">
        {/* First row of tabs */}
        <TabsList className="w-full grid grid-cols-5 gap-2">
          {searchTabsRow1.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="px-2 py-2 text-sm md:text-base md:px-4 flex items-center justify-center relative"
              disabled={tab.premium && !isPremiumMember}
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
              {tab.premium && !isPremiumMember && <Lock className="ml-1 h-3 w-3 absolute top-1 right-1" />}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Second row of tabs */}
        <TabsList className="w-full grid grid-cols-5 gap-2">
          {searchTabsRow2.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="px-2 py-2 text-sm md:text-base md:px-4 flex items-center justify-center relative"
              disabled={tab.premium && !isPremiumMember}
            >
              {tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
              {tab.label}
              {tab.premium && !isPremiumMember && <Lock className="ml-1 h-3 w-3 absolute top-1 right-1" />}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabOptions.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {(tab.premium && !isPremiumMember) ? (
            <PremiumRequired />
          ) : (
            <SearchTabContent activeTab={tab.id} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
