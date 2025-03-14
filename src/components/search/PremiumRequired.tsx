import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function PremiumRequired() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    // If user is not logged in, redirect to login page
    if (!user) {
      navigate('/login');
    } else {
      // Otherwise, navigate to a hypothetical subscription page
      // You would implement this page later
      navigate('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Crown className="h-8 w-8 text-amber-500" />
          </div>
        </div>
        <CardTitle className="text-2xl">Premium Feature</CardTitle>
        <CardDescription>
          This feature is available exclusively to premium members
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Standard Access
            </h3>
            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li>• Basic lottery results</li>
              <li>• View charts and events</li>
              <li>• Limited search features</li>
            </ul>
          </div>
          <div className="border border-primary bg-primary/5 rounded-lg p-4 shadow-sm">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
              <Crown className="h-4 w-4" />
              Premium Access
            </h3>
            <ul className="text-sm text-gray-500 space-y-2 text-left">
              <li>• Advanced pattern search</li>
              <li>• Number analysis tools</li>
              <li>• All search features</li>
              <li>• Priority support</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleUpgradeClick} className="w-full max-w-xs">
          {user ? 'Upgrade to Premium' : 'Sign in to Upgrade'}
        </Button>
      </CardFooter>
    </Card>
  );
}
