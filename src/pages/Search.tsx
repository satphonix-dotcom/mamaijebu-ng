
import React from 'react';
import { Layout } from '@/components/Layout';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchPageHeader } from '@/components/search/SearchPageHeader';
import { SearchTabs } from '@/components/search/SearchTabs';

export default function Search() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState("single");

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <SearchPageHeader />
        <SearchTabs 
          isMobile={isMobile} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
    </Layout>
  );
}
