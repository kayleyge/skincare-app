import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, RotateCcw, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { skinAnalysisApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const ScanInterface = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [glowScore, setGlowScore] = useState<number | null>(null);
  const [annotatedImg, setAnnotatedImg] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{redness: number; darkSpots: number}>({
    redness: 0,
    darkSpots: 0,
  });
  const [scanHistory] = useState([
    { date: '2024-01-15', score: 85, change: +5 },
    { date: '2024-01-14', score: 80, change: +2 },
    { date: '2024-01-13', score: 78, change: -1 },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (base64Img: string) => skinAnalysisApi.analyzeImage(base64Img),
    onSuccess: (response) => {
      const data = response.data;
      setGlowScore(data.skin_score);
      setMetrics({ redness: data.detected_issues.redness_count, darkSpots: data.detected_issues.dark_spots_count });
      setAnnotatedImg(data.annotated_image);
      setIsScanning(false);
      setHasResult(true);
      toast({ title: 'Analysis complete' });
      // Invalidate progress query so charts refresh
      queryClient.invalidateQueries({ queryKey: ['skin-progress'] });
    },
    onError: () => {
      setIsScanning(false);
      toast({ title: 'Analysis failed', variant: 'destructive' });
    }
  });

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Stop camera
      const stream = video.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      performAnalysis(dataUrl);
    }
  }, []);

  const performAnalysis = (imgBase64: string) => {
    setIsScanning(true);
    mutation.mutate(imgBase64);
  };

  const resetScan = () => {
    setHasResult(false);
    setIsScanning(false);
    setGlowScore(null);
    setAnnotatedImg(null);
    startCamera();
  };

  return (
    <div className="space-y-6">
      {/* Main Scan Card */}
      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Camera className="w-6 h-6 text-pink-500" />
            <CardTitle className="text-2xl">Tonight's Skin Scan</CardTitle>
          </div>
          <CardDescription className="text-lg">
            {hasResult ? "Your results are ready! ✨" : "Take a selfie to analyze your skin"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!hasResult && !isScanning && (
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 aspect-square max-w-sm mx-auto">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-xl"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera overlay */}
                <div className="absolute inset-4 border-2 border-dashed border-pink-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-pink-400 mx-auto mb-2" />
                    <p className="text-pink-600 font-medium">Position your face here</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">💡 Tips for best results:</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Good lighting (face a window or lamp)</li>
                    <li>• Remove makeup if possible</li>
                    <li>• Keep face centered and still</li>
                  </ul>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={startCamera}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button
                    onClick={captureImage}
                    className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-2xl px-6"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Capture & Analyze
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="text-center space-y-6 py-8">
              <div className="relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-pink-200 animate-spin border-t-pink-500"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Analyzing your skin... ✨</h3>
                <p className="text-gray-600">AI is checking for redness, blemishes, and hydration</p>
                <Progress value={66} className="w-64 mx-auto" />
              </div>
            </div>
          )}

          {hasResult && glowScore !== null && (
            <div className="space-y-6">
              {/* Glow Score */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{glowScore.toFixed(1)}</div>
                      <div className="text-sm">Skin Score</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                    <TrendingUp className="w-4 h-4 text-yellow-800" />
                  </div>
                </div>
                <div className="mt-4">
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-lg px-4 py-1">
                    Skin Score
                  </Badge>
                </div>
              </div>

              {annotatedImg && (
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src={annotatedImg} alt="Annotated result" className="w-full" />
                </div>
              )}

              {/* Metrics display */}
              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">{metrics.redness}</p>
                  <p className="text-sm">Redness spots</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{metrics.darkSpots}</p>
                  <p className="text-sm">Dark spots</p>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  Tonight's Insights
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Your new vitamin C serum is showing great results - keep it up!
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    Hydration levels are perfect. Your moisturizer routine is working.
                  </p>
                  <p className="flex items-start">
                    <span className="text-orange-500 mr-2">⚠️</span>
                    Minor redness detected. Consider using your calming toner tonight.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={resetScan}
                  variant="outline"
                  className="rounded-2xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Scan Again
                </Button>
                <Button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 rounded-2xl">
                  View Routine
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-pink-500" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                <div>
                  <div className="font-medium">{new Date(scan.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">Daily scan</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-bold">{scan.score}/100</div>
                    <div className={`text-sm flex items-center ${scan.change > 0 ? 'text-green-600' : scan.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {scan.change > 0 ? '+' : ''}{scan.change}
                      <TrendingUp className={`w-3 h-3 ml-1 ${scan.change < 0 ? 'rotate-180' : ''}`} />
                    </div>
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

export { ScanInterface };
export default ScanInterface;
