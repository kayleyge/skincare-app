import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { skinAnalysisApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Target, Sparkles, Camera, ShoppingCart, Award } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ProgressTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const navigate = useNavigate();

  const { data: progressData } = useQuery({
    queryKey: ['skin-progress'],
    queryFn: () => skinAnalysisApi.getProgress(30).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });

  const glowScoreData = progressData?.dates?.map((date: string, idx: number) => ({
    date,
    score: progressData.skin_scores[idx],
    hydration: progressData.redness_counts[idx] ?? 0,
    clarity: progressData.dark_spot_counts[idx] ?? 0,
    calmness: 0,
  })) || [];

  const achievements = [
    { 
      id: 1, 
      title: '7-Day Streak!', 
      description: 'Completed your routine for 7 days straight',
      icon: '🔥',
      unlocked: true,
      date: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Glow Up!', 
      description: 'Improved your glow score by 15+ points',
      icon: '✨',
      unlocked: true,
      date: '2024-01-20'
    },
    { 
      id: 3, 
      title: 'Scan Master', 
      description: 'Completed 30 skin scans',
      icon: '📸',
      unlocked: false,
      progress: 22
    },
    { 
      id: 4, 
      title: 'Product Pro', 
      description: 'Tried 5 different product recommendations',
      icon: '🛍️',
      unlocked: false,
      progress: 3
    }
  ];

  const productImpact = [
    {
      name: 'Vitamin C Serum',
      brand: 'Skinceuticals',
      impact: '+12',
      metric: 'Brightness',
      status: 'working',
      weeksUsed: 3,
      recommendation: 'Keep using - showing great results!'
    },
    {
      name: 'AHA Exfoliant',
      brand: 'Paula\'s Choice',
      impact: '+8',
      metric: 'Texture',
      status: 'working',
      weeksUsed: 2,
      recommendation: 'Continue current frequency (2x/week)'
    },
    {
      name: 'Niacinamide Serum',
      brand: 'The Ordinary',
      impact: '+5',
      metric: 'Oil Control',
      status: 'moderate',
      weeksUsed: 4,
      recommendation: 'Consider upgrading to a stronger formula'
    },
    {
      name: 'Night Moisturizer',
      brand: 'Olay',
      impact: '+15',
      metric: 'Hydration',
      status: 'excellent',
      weeksUsed: 6,
      recommendation: 'Perfect match! Auto-reorder enabled ✨'
    }
  ];

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'working': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Redirect to login page if no auth token is present
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Current Glow Score</p>
                <p className="text-3xl font-bold text-green-800">91</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +19 from start
                </p>
              </div>
              <div className="text-4xl">✨</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Scan Streak</p>
                <p className="text-3xl font-bold text-blue-800">12</p>
                <p className="text-sm text-blue-600">consecutive days</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Routine Completion</p>
                <p className="text-3xl font-bold text-purple-800">94%</p>
                <p className="text-sm text-purple-600">this week</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <Tabs defaultValue="glow-score" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="glow-score" className="rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Glow Score
          </TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-full">
            <Target className="w-4 h-4 mr-2" />
            Detailed Metrics
          </TabsTrigger>
          <TabsTrigger value="products" className="rounded-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Product Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glow-score" className="mt-6">
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Glow Score Trend</span>
                <div className="flex gap-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className="rounded-full"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </CardTitle>
              <CardDescription>
                Your skin's overall health score over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={glowScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#888"
                    />
                    <YAxis stroke="#888" domain={[65, 95]} />
                    <Tooltip 
                      labelFormatter={(label) => formatDate(label)}
                      formatter={(value) => [`${value}/100`, 'Glow Score']}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="url(#glowGradient)"
                      fill="url(#glowGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Detailed Skin Metrics</CardTitle>
              <CardDescription>
                Track hydration, clarity, and calmness over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={glowScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#888"
                    />
                    <YAxis stroke="#888" domain={[60, 100]} />
                    <Tooltip 
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hydration" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Hydration"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clarity" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Clarity"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calmness" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Calmness"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Hydration</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Clarity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm">Calmness</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="space-y-4">
            {productImpact.map((product, index) => (
              <Card key={index} className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      <Badge className={`mt-2 ${getStatusColor(product.status)}`}>
                        {product.impact} improvement in {product.metric}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Used for</p>
                      <p className="font-semibold">{product.weeksUsed} weeks</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>AI Recommendation:</strong> {product.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Milestones you've unlocked on your glow journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.unlocked ? (
                      <p className="text-xs text-yellow-600 mt-1">
                        Unlocked on {new Date(achievement.date!).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        Progress: {achievement.progress}/30
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ProgressTracker };
