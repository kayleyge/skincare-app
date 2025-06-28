
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Sun, Moon, Droplets, Sparkles, Timer, Play, Pause, RotateCcw } from "lucide-react";

const RoutineDashboard = () => {
  const [activeTimers, setActiveTimers] = useState<{ [key: string]: number }>({});
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const amRoutine = [
    {
      id: 'am-1',
      name: 'Gentle Foam Cleanser',
      brand: 'CeraVe',
      step: 1,
      duration: null,
      instructions: 'Massage onto damp skin for 30 seconds, then rinse with lukewarm water',
      reason: 'Removes overnight buildup without stripping natural oils',
      image: '🧴'
    },
    {
      id: 'am-2',
      name: 'Vitamin C Serum',
      brand: 'Skinceuticals',
      step: 2,
      duration: 300, // 5 minutes
      instructions: 'Apply 3-4 drops to clean skin, gently pat in',
      reason: 'Brightens skin and provides antioxidant protection for the day',
      image: '💧'
    },
    {
      id: 'am-3',
      name: 'Hyaluronic Acid Moisturizer',
      brand: 'Neutrogena',
      step: 3,
      duration: null,
      instructions: 'Apply evenly to face and neck while skin is slightly damp',
      reason: 'Locks in hydration and creates a smooth base for sunscreen',
      image: '🫧'
    },
    {
      id: 'am-4',
      name: 'Broad Spectrum SPF 50',
      brand: 'EltaMD',
      step: 4,
      duration: null,
      instructions: 'Apply generously to all exposed areas, reapply every 2 hours',
      reason: 'Essential protection against UV damage and premature aging',
      image: '☀️'
    }
  ];

  const pmRoutine = [
    {
      id: 'pm-1',
      name: 'Oil Cleanser',
      brand: 'DHC',
      step: 1,
      duration: null,
      instructions: 'Massage onto dry skin to dissolve makeup and sunscreen',
      reason: 'First step of double cleanse to remove daily buildup',
      image: '🛢️'
    },
    {
      id: 'pm-2',
      name: 'Gentle Foam Cleanser',
      brand: 'CeraVe',
      step: 2,
      duration: null,
      instructions: 'Follow up with water-based cleanser for deep clean',
      reason: 'Second cleanse ensures all impurities are removed',
      image: '🧴'
    },
    {
      id: 'pm-3',
      name: 'AHA Exfoliant',
      brand: 'Paula\'s Choice',
      step: 3,
      duration: 180, // 3 minutes
      instructions: 'Apply thin layer, avoid eye area. Start 2x/week.',
      reason: 'Gentle exfoliation to improve texture and reduce breakouts',
      image: '✨'
    },
    {
      id: 'pm-4',
      name: 'Niacinamide Serum',
      brand: 'The Ordinary',
      step: 4,
      duration: 600, // 10 minutes
      instructions: 'Apply after AHA has absorbed, gentle patting motion',
      reason: 'Minimizes pores and regulates oil production overnight',
      image: '💜'
    },
    {
      id: 'pm-5',
      name: 'Rich Night Moisturizer',
      brand: 'Olay',
      step: 5,
      duration: null,
      instructions: 'Apply generously as final step, focus on dry areas',
      reason: 'Intensive overnight hydration and barrier repair',
      image: '🌙'
    }
  ];

  const toggleTimer = (stepId: string, duration: number) => {
    if (activeTimers[stepId]) {
      // Stop timer
      clearInterval(activeTimers[stepId]);
      setActiveTimers(prev => {
        const newState = { ...prev };
        delete newState[stepId];
        return newState;
      });
    } else {
      // Start timer
      let timeLeft = duration;
      const intervalId = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          setActiveTimers(prev => {
            const newState = { ...prev };
            delete newState[stepId];
            return newState;
          });
          // Auto-mark as complete when timer ends
          setCompletedSteps(prev => ({ ...prev, [stepId]: true }));
        }
      }, 1000);
      
      setActiveTimers(prev => ({ ...prev, [stepId]: intervalId }));
    }
  };

  const toggleComplete = (stepId: string) => {
    setCompletedSteps(prev => ({ 
      ...prev, 
      [stepId]: !prev[stepId] 
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const RoutineSteps = ({ routine, timePrefix }: { routine: typeof amRoutine, timePrefix: string }) => (
    <div className="space-y-4">
      {routine.map((step) => {
        const isCompleted = completedSteps[step.id];
        const hasActiveTimer = activeTimers[step.id];
        
        return (
          <Card 
            key={step.id} 
            className={`transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-50 border-green-200 shadow-sm' 
                : 'bg-white/50 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Product Image/Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                  isCompleted ? 'bg-green-100' : 'bg-gradient-to-br from-pink-100 to-orange-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    step.image
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Step {step.step}
                        </Badge>
                        {step.duration && (
                          <Badge variant="secondary" className="text-xs">
                            <Timer className="w-3 h-3 mr-1" />
                            {formatTime(step.duration)}
                          </Badge>
                        )}
                      </div>
                      <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {step.name}
                      </h3>
                      <p className="text-sm text-gray-600">{step.brand}</p>
                    </div>
                    
                    <Button
                      onClick={() => toggleComplete(step.id)}
                      variant={isCompleted ? "outline" : "default"}
                      size="sm"
                      className={`rounded-full ${
                        isCompleted 
                          ? 'border-green-300 text-green-600 hover:bg-green-50' 
                          : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Undo
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Done
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-gray-700">
                    <strong>How:</strong> {step.instructions}
                  </p>
                  
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                    <strong>Why:</strong> {step.reason}
                  </p>

                  {/* Timer Controls */}
                  {step.duration && !isCompleted && (
                    <div className="flex items-center space-x-3 pt-2">
                      <Button
                        onClick={() => toggleTimer(step.id, step.duration!)}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        {hasActiveTimer ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Stop Timer
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start Timer
                          </>
                        )}
                      </Button>
                      
                      {hasActiveTimer && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="font-mono text-lg font-semibold text-orange-600">
                            Active Timer
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const amCompleted = amRoutine.filter(step => completedSteps[step.id]).length;
  const pmCompleted = pmRoutine.filter(step => completedSteps[step.id]).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Sun className="w-5 h-5 mr-2 text-yellow-600" />
              Morning Routine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">{amCompleted}/{amRoutine.length}</span>
              </div>
              <Progress value={(amCompleted / amRoutine.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Moon className="w-5 h-5 mr-2 text-purple-600" />
              Evening Routine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-600">{pmCompleted}/{pmRoutine.length}</span>
              </div>
              <Progress value={(pmCompleted / pmRoutine.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routine Tabs */}
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="morning" className="rounded-full">
            <Sun className="w-4 h-4 mr-2" />
            Morning ({amCompleted}/{amRoutine.length})
          </TabsTrigger>
          <TabsTrigger value="evening" className="rounded-full">
            <Moon className="w-4 h-4 mr-2" />
            Evening ({pmCompleted}/{pmRoutine.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="mt-6">
          <RoutineSteps routine={amRoutine} timePrefix="am" />
        </TabsContent>

        <TabsContent value="evening" className="mt-6">
          <RoutineSteps routine={pmRoutine} timePrefix="pm" />
        </TabsContent>
      </Tabs>

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-500" />
          <h3 className="text-xl font-semibold mb-2">You're doing great! ✨</h3>
          <p className="text-gray-600 mb-4">
            Consistency is key to seeing results. Your skin will thank you in 2-4 weeks!
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span>On track</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span>Building habits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-pink-400 rounded-full mr-2"></div>
              <span>Glowing soon</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { RoutineDashboard };
