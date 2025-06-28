
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Sparkles, TrendingUp, Clock, Heart, Zap, Moon, Sun, BarChart3, ShoppingCart } from "lucide-react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { ScanInterface } from "@/components/ScanInterface";
import { RoutineDashboard } from "@/components/RoutineDashboard";
import { ProgressTracker } from "@/components/ProgressTracker";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-6">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-300 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                GlowGuard
              </h1>
            </div>
            <Button onClick={() => setCurrentView('landing')} variant="outline" className="rounded-full">
              Back to Home
            </Button>
          </header>

          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="scan" className="rounded-full">
                <Camera className="w-4 h-4 mr-2" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="routine" className="rounded-full">
                <Clock className="w-4 h-4 mr-2" />
                Routine
              </TabsTrigger>
              <TabsTrigger value="progress" className="rounded-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan">
              <ScanInterface />
            </TabsContent>

            <TabsContent value="routine">
              <RoutineDashboard />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-300 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              GlowGuard
            </span>
          </div>
          <div className="flex space-x-4">
            <Dialog open={showLogin} onOpenChange={setShowLogin}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Welcome back! ✨</DialogTitle>
                  <DialogDescription>
                    Sign in to continue your glow journey
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setShowLogin(false);
                      setCurrentView('dashboard');
                    }}
                  >
                    Sign In
                  </Button>
                  <Button variant="outline" className="w-full rounded-full">
                    Continue with Google
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full px-6"
            >
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 bg-clip-text text-transparent leading-tight">
            Snap, scan, glow.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your skin over time with AI-powered analysis. Get personalized routines that adapt to your progress and never run out of products that actually work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full px-8 py-6 text-lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Try Free for 7 Days
            </Button>
            <p className="text-sm text-gray-500">No credit card required ✨</p>
          </div>
          
          {/* Demo Preview */}
          <div className="relative max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-4 mb-4">
                <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-orange-200 rounded-xl flex items-center justify-center">
                  <Camera className="w-12 h-12 text-pink-500" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Glow Score</span>
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white">87/100</Badge>
                </div>
                <Progress value={87} className="h-2" />
                <div className="text-xs text-gray-600 text-left">
                  🎉 +12 points from last week! Your new serum is working.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Your personal skin scientist 🧪
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered analysis meets personalized care for results you can actually see
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Skin Analysis</CardTitle>
              <CardDescription>
                Take a selfie and get instant feedback on redness, breakouts, and hydration levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Personalized Routines</CardTitle>
              <CardDescription>
                Get AM/PM routines that adapt based on your skin's progress and changing needs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Visualize your skin's improvement over time with detailed analytics and insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Get science-backed product suggestions when your current routine needs an upgrade
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Refills</CardTitle>
              <CardDescription>
                Never run out of products that work. Auto-order refills for items showing positive results
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Data You Own</CardTitle>
              <CardDescription>
                Your skin data stays private. Export anytime or choose to auto-delete photos after analysis
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center bg-white/30 backdrop-blur-sm rounded-3xl p-12 border border-white/50">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
            Ready to start glowing? ✨
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of Gen-Z skincare enthusiasts who've transformed their routines with AI-powered insights
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-full px-8 py-6 text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Glow Journey
          </Button>
          <p className="text-sm text-gray-500 mt-4">7-day free trial • Cancel anytime • No commitment</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-500">
        <p>&copy; 2024 GlowGuard. Made with 💖 for better skin days.</p>
      </footer>
    </div>
  );
};

export default Index;
