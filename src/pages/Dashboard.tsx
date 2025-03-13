
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the dashboard
const recentDraws = [
  { id: 1, game: "Powerball", date: "2023-10-01", numbers: [5, 12, 34, 45, 56, 3] },
  { id: 2, game: "Mega Millions", date: "2023-09-30", numbers: [7, 13, 22, 35, 48, 11] },
  { id: 3, game: "EuroMillions", date: "2023-09-29", numbers: [9, 18, 22, 41, 50, 4, 6] },
];

const activityData = [
  { month: "Jan", searches: 4 },
  { month: "Feb", searches: 3 },
  { month: "Mar", searches: 2 },
  { month: "Apr", searches: 7 },
  { month: "May", searches: 5 },
  { month: "Jun", searches: 4 },
  { month: "Jul", searches: 9 },
  { month: "Aug", searches: 8 },
  { month: "Sep", searches: 6 },
  { month: "Oct", searches: 8 },
  { month: "Nov", searches: 12 },
  { month: "Dec", searches: 10 },
];

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Your latest pattern searches</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Saved Patterns</CardTitle>
              <CardDescription>Patterns you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">7</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Favorite Games</CardTitle>
              <CardDescription>Games you follow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">3</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Lottery Draws</CardTitle>
              <CardDescription>Latest results from your favorite games</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Numbers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDraws.map((draw) => (
                    <TableRow key={draw.id}>
                      <TableCell className="font-medium">{draw.game}</TableCell>
                      <TableCell>{draw.date}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {draw.numbers.map((num, index) => (
                            <span key={index} className="inline-flex items-center justify-center w-6 h-6 bg-primary-400 text-white text-xs rounded-full">
                              {num}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Activity</CardTitle>
              <CardDescription>Search activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="searches" 
                      stroke="#4f46e5" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
