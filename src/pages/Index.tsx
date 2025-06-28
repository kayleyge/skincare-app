import { useState, useEffect } from 'react';
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
import { Camera, Sparkles, TrendingUp, Clock, Heart, Zap, Moon, Sun, BarChart3, ShoppingCart, LogOut } from "lucide-react";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { LoginForm } from "@/components/LoginForm";
import { ScanInterface } from "@/components/ScanInterface";
import { RoutineDashboard } from "@/components/RoutineDashboard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { authApi, isAuthenticated, logout } from "@/lib/api";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'onboarding' | 'dashboard'>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthenticated()) {
        try {
          // Verify token is still valid by calling protected endpoint
          await authApi.checkAuth();
          setIsLoggedIn(true);
          setCurrentView('dashboard');
        } catch (error) {
          // Token is invalid, clear storage and show landing
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          setCurrentView('landing');
        }
      } else {
        setIsLoggedIn(false);
        setCurrentView('landing');
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

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

  const handleLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleSwitchToSignup = () => {
    setCurrentView('onboarding');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentView('landing');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setIsLoggedIn(false);
      setCurrentView('landing');
    }
  };

  const handleGoHome = () => {
    if (isLoggedIn) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form
  if (currentView === 'login') {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={handleSwitchToSignup}
      />
    );
  }

  // Show onboarding flow
  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Show dashboard if logged in
  if (currentView === 'dashboard' && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Header with logout */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  GlowGuard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleGoHome}
                  variant="ghost"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-gray-600 hover:text-red-600 border-gray-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-white shadow-sm">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="scan" className="rounded-xl">Skin Scan</TabsTrigger>
              <TabsTrigger value="routine" className="rounded-xl">Routine</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-xl">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Skin Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">85%</div>
                    <p className="text-purple-100">Great progress this week!</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">+12%</div>
                    <p className="text-gray-600">Since last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Routine Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">14</div>
                    <p className="text-gray-600">Days in a row</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed morning routine</span>
                      <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Skin scan completed</span>
                      <span className="text-xs text-gray-500 ml-auto">Yesterday</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">New product recommendation</span>
                      <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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

  // Landing page (default view)
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                GlowGuard
              </h1>
            </div>
            <Button
              onClick={handleLogin}
              variant="outline"
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Your Personal Skin
            <br />
            Analysis Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized skincare recommendations with AI-powered skin analysis. 
            Track your progress and achieve your glow goals.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 py-6 text-lg shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Started Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Camera className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>AI Skin Analysis</CardTitle>
              <CardDescription>
                Advanced computer vision to analyze your skin condition and identify areas for improvement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Personalized Care</CardTitle>
              <CardDescription>
                Customized skincare routines and product recommendations based on your unique skin profile
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your skin's improvement over time with detailed analytics and progress tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-2xl">
          <CardContent className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Skin?</h3>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of users who have improved their skincare routine with GlowGuard
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-gray-100 rounded-2xl px-8 py-6 text-lg"
            >
              Start Your Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;