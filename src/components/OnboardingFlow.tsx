import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, User, Target, ShoppingCart, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Add username field for backend
    email: '',
    password: '',
    age: '',
    skinType: '',
    concerns: [] as string[],
    currentProducts: '',
    goals: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const validateStep = (currentStep: number) => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.username.trim()) {
          setError('Please enter a username');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Please enter your email');
          return false;
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email');
          return false;
        }
        if (!formData.password.trim()) {
          setError('Please create a password');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (!formData.age.trim()) {
          setError('Please enter your age');
          return false;
        }
        break;
      case 2:
        if (!formData.skinType) {
          setError('Please select your skin type');
          return false;
        }
        break;
      case 3:
        if (formData.concerns.length === 0) {
          setError('Please select at least one skin concern');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step - register user with backend
      setIsLoading(true);
      try {
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age),
          skin_type: formData.skinType,
          skin_concerns: formData.concerns,
          current_products: formData.currentProducts,
          goals: formData.goals
        };

        const response = await authApi.register(userData);
        
        // Store tokens after successful registration
        if (response.data.access_token) {
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
        }
        
        onComplete();
      } catch (error: any) {
        console.error('Registration failed:', error);
        setError(error.response?.data?.detail || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const skinTypes = [
    {
      id: 'oily',
      title: 'Oily',
      description: 'Shiny appearance, enlarged pores',
      emoji: '💧'
    },
    {
      id: 'dry',
      title: 'Dry',
      description: 'Tight feeling, visible flaking',
      emoji: '🏜️'
    },
    {
      id: 'combination',
      title: 'Combination',
      description: 'Oily T-zone, dry cheeks',
      emoji: '🎭'
    },
    {
      id: 'sensitive',
      title: 'Sensitive',
      description: 'Easily irritated, reactive',
      emoji: '🌸'
    }
  ];

  const commonConcerns = [
    'Acne', 'Dark spots', 'Fine lines', 'Dryness', 'Oiliness', 
    'Redness', 'Large pores', 'Uneven texture', 'Sensitivity'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              GlowGuard Setup
            </h1>
          </div>
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-500 mt-2">Step {step} of {totalSteps}</p>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">👋</div>
                <CardTitle className="text-2xl mb-2">Welcome to GlowGuard!</CardTitle>
                <CardDescription className="text-lg">
                  Let's create your account
                </CardDescription>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Create Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <CardTitle className="text-2xl mb-2">What's your skin type?</CardTitle>
                <CardDescription className="text-lg">
                  This helps us understand your skin's baseline needs
                </CardDescription>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skinTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, skinType: type.id }))}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                      formData.skinType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{type.emoji}</div>
                      <h3 className="font-semibold text-lg">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle className="text-2xl mb-2">What are your skin concerns?</CardTitle>
                <CardDescription className="text-lg">
                  Select all that apply - we'll help address them
                </CardDescription>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonConcerns.map((concern) => (
                  <div
                    key={concern}
                    onClick={() => handleConcernToggle(concern)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      formData.concerns.includes(concern)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <CardTitle className="text-2xl mb-2">Tell us more</CardTitle>
                <CardDescription className="text-lg">
                  Help us personalize your experience
                </CardDescription>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentProducts">Current skincare products (optional)</Label>
                  <Textarea
                    id="currentProducts"
                    placeholder="List any products you're currently using..."
                    value={formData.currentProducts}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentProducts: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Your skincare goals (optional)</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to achieve with your skincare routine?"
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outline"
                className="rounded-2xl"
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
              disabled={isLoading}
            >
              {isLoading ? (
                'Creating account...'
              ) : step === totalSteps ? (
                'Complete Setup'
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { OnboardingFlow };