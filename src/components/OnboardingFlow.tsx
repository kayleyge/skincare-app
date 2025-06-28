
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, User, Target, ShoppingCart } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    skinType: '',
    concerns: [] as string[],
    currentProducts: '',
    goals: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
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
    { id: 'oily', label: 'Oily', emoji: '🛢️', desc: 'Shiny, enlarged pores' },
    { id: 'dry', label: 'Dry', emoji: '🏜️', desc: 'Tight, flaky, rough' },
    { id: 'combination', label: 'Combination', emoji: '🌗', desc: 'Oily T-zone, dry cheeks' },
    { id: 'sensitive', label: 'Sensitive', emoji: '🌸', desc: 'Easily irritated, reactive' },
    { id: 'normal', label: 'Normal', emoji: '✨', desc: 'Balanced, few issues' }
  ];

  const commonConcerns = [
    'Acne & Breakouts',
    'Dark Spots',
    'Fine Lines',
    'Dryness',
    'Oily T-Zone',
    'Large Pores',
    'Redness',
    'Dullness',
    'Under-eye Circles',
    'Blackheads'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-300 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              GlowGuard
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Let's personalize your glow ✨</h2>
          <p className="text-gray-600">Step {step} of {totalSteps}</p>
          <Progress value={progress} className="w-full max-w-md mx-auto mt-4" />
        </div>

        <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                  <CardTitle className="text-2xl mb-2">Nice to meet you! 👋</CardTitle>
                  <CardDescription className="text-lg">
                    Let's start with the basics
                  </CardDescription>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      placeholder="What should we call you?"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="age">Age</Label>
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
                          ? 'border-pink-300 bg-pink-50 shadow-lg'
                          : 'border-gray-200 bg-white/50 hover:border-pink-200'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{type.emoji}</div>
                        <h3 className="font-semibold text-lg">{type.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{type.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                  <CardTitle className="text-2xl mb-2">What are your main concerns?</CardTitle>
                  <CardDescription className="text-lg">
                    Select all that apply - we'll prioritize these in your routine
                  </CardDescription>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {commonConcerns.map((concern) => (
                    <div
                      key={concern}
                      onClick={() => handleConcernToggle(concern)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        formData.concerns.includes(concern)
                          ? 'border-pink-300 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white/50 hover:border-pink-200'
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
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-pink-500" />
                  <CardTitle className="text-2xl mb-2">Current routine & goals 🎯</CardTitle>
                  <CardDescription className="text-lg">
                    Help us understand what you're using now and what you want to achieve
                  </CardDescription>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="products">Current Products</Label>
                    <Textarea
                      id="products"
                      placeholder="List your current skincare products (e.g., CeraVe cleanser, Neutrogena moisturizer...)"
                      value={formData.currentProducts}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentProducts: e.target.value }))}
                      className="rounded-2xl min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goals">Skincare Goals</Label>
                    <Textarea
                      id="goals"
                      placeholder="What do you hope to achieve? (e.g., clearer skin, reduce acne, anti-aging...)"
                      value={formData.goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                      className="rounded-2xl min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="rounded-2xl"
                >
                  Back
                </Button>
              )}
              <div className={step === 1 ? 'ml-auto' : ''}>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-2xl px-8"
                >
                  {step === totalSteps ? 'Complete Setup' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { OnboardingFlow };
