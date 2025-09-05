import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionContextIndicator from '../../components/ui/SessionContextIndicator';
import PhotoUploadZone from './components/PhotoUploadZone';
import OccasionSelector from './components/OccasionSelector';
import AnalysisProgress from './components/AnalysisProgress';
import AnalysisActions from './components/AnalysisActions';
import QuickTips from './components/QuickTips';

const PhotoUploadAnalysis = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('upload');

  // Mock current session data
  const [currentSession] = useState(null);

  useEffect(() => {
    // Reset upload progress when file changes
    if (!selectedFile) {
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [selectedFile]);

  const handleFileSelect = (file, error) => {
    setSelectedFile(file);
    setUploadError(error);
    
    if (file && !error) {
      // Simulate file upload progress
      setIsUploading(true);
      setUploadProgress(0);
      
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile || !selectedOccasion) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('upload');

    // Simulate analysis progress
    const analysisSteps = [
      { step: 'upload', duration: 1000, progress: 20 },
      { step: 'processing', duration: 1500, progress: 40 },
      { step: 'body-analysis', duration: 2000, progress: 70 },
      { step: 'style-matching', duration: 1500, progress: 90 },
      { step: 'complete', duration: 500, progress: 100 }
    ];

    let currentStepIndex = 0;
    let currentProgress = 0;

    const runAnalysisStep = () => {
      if (currentStepIndex >= analysisSteps?.length) {
        // Analysis complete - navigate to results
        setTimeout(() => {
          navigate('/style-recommendations', {
            state: {
              analysisData: {
                photo: selectedFile,
                occasion: selectedOccasion,
                timestamp: new Date()?.toISOString(),
                sessionId: `session_${Date.now()}`
              }
            }
          });
        }, 500);
        return;
      }

      const step = analysisSteps?.[currentStepIndex];
      setCurrentAnalysisStep(step?.step);

      const progressInterval = setInterval(() => {
        currentProgress += (step?.progress - currentProgress) * 0.1;
        setAnalysisProgress(Math.min(Math.round(currentProgress), step?.progress));

        if (currentProgress >= step?.progress - 1) {
          clearInterval(progressInterval);
          currentStepIndex++;
          setTimeout(runAnalysisStep, 300);
        }
      }, 100);
    };

    runAnalysisStep();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedOccasion('');
    setUploadError(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('upload');
  };

  const handleCancelAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('upload');
  };

  const handleViewHistory = () => {
    navigate('/user-session-history');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionContextIndicator 
        currentSession={currentSession}
        hasActiveAnalysis={isAnalyzing}
        analysisProgress={analysisProgress}
        onViewResults={handleViewHistory}
      />
      
      <main className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              AI Style Analysis
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Upload your photo and select an occasion to get personalized T-shirt recommendations powered by AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Upload Section */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <PhotoUploadZone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  error={uploadError}
                />
              </div>

              {/* Occasion Selection */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <OccasionSelector
                  selectedOccasion={selectedOccasion}
                  onOccasionChange={setSelectedOccasion}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Analysis Actions */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <AnalysisActions
                  selectedFile={selectedFile}
                  selectedOccasion={selectedOccasion}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                  onReset={handleReset}
                  onViewHistory={handleViewHistory}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <QuickTips />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Analysis Progress Modal */}
      <AnalysisProgress
        isAnalyzing={isAnalyzing}
        progress={analysisProgress}
        currentStep={currentAnalysisStep}
        onCancel={handleCancelAnalysis}
      />
    </div>
  );
};

export default PhotoUploadAnalysis;