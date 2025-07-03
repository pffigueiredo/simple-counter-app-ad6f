
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Counter } from '../../server/src/schema';

function App() {
  const [counter, setCounter] = useState<Counter | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load counter data on component mount
  const loadCounter = useCallback(async () => {
    try {
      const result = await trpc.getCounter.query();
      setCounter(result);
    } catch (error) {
      console.error('Failed to load counter:', error);
    }
  }, []);

  useEffect(() => {
    loadCounter();
  }, [loadCounter]);

  const handleAction = async (action: 'increment' | 'decrement' | 'reset') => {
    setIsLoading(true);
    try {
      const result = await trpc.updateCounter.mutate({ action });
      setCounter(result);
    } catch (error) {
      console.error(`Failed to ${action} counter:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!counter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading counter...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Counter App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counter Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {counter.count}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {counter.updated_at.toLocaleString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => handleAction('decrement')}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="w-20"
            >
              -1
            </Button>
            <Button
              onClick={() => handleAction('reset')}
              disabled={isLoading}
              variant="secondary"
              size="lg"
              className="w-20"
            >
              Reset
            </Button>
            <Button
              onClick={() => handleAction('increment')}
              disabled={isLoading}
              size="lg"
              className="w-20"
            >
              +1
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">
              Updating counter...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
