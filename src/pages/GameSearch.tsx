
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGames } from '@/hooks/useGames';
import { useCountries } from '@/hooks/useCountries';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { LottoGame } from '@/types/supabase';

export default function GameSearch() {
  const { games, loading, fetchGames } = useGames();
  const { countries } = useCountries();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filteredGames, setFilteredGames] = useState<LottoGame[]>([]);

  useEffect(() => {
    if (games) {
      let filtered = [...games];
      
      // Filter by country
      if (selectedCountry) {
        filtered = filtered.filter(game => game.country_id === selectedCountry);
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(game => 
          game.name.toLowerCase().includes(term) || 
          (game.description && game.description.toLowerCase().includes(term))
        );
      }
      
      setFilteredGames(filtered);
    }
  }, [games, searchTerm, selectedCountry]);

  const handleRefresh = () => {
    fetchGames();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
  };

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Game Search</h1>
        
        <div className="grid gap-6 mb-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Search and Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Games</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or description"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Country Filter */}
              <div className="space-y-2">
                <Label htmlFor="country">Filter by Country</Label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Results Display */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Results 
              {!loading && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({filteredGames.length} games found)
                </span>
              )}
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredGames.length === 0 ? (
              <Card className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No games found matching your criteria.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Game Card Component
function GameCard({ game }: { game: LottoGame }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{game.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {game.description || 'No description available'}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Country:</span> {game.countries?.name || 'Unknown'}
            </div>
            <div>
              <span className="font-medium">Type:</span> {game.lotto_types?.name || 'Unknown'}
            </div>
            <div>
              <span className="font-medium">Balls:</span> {game.ball_count}
            </div>
            <div>
              <span className="font-medium">Range:</span> {game.min_number}-{game.max_number}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
