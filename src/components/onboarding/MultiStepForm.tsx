'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Save, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<StepProps>;
  validation?: (data: any) => boolean;
  optional?: boolean;
}

interface StepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isValid: boolean;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onSubmit: (data: any) => Promise<void>;
  onSave?: (data: any) => Promise<void>;
  initialData?: any;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  className?: string;
}

export default function MultiStepForm({
  steps,
  onSubmit,
  onSave,
  initialData = {},
  serviceType,
  className
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (onSave && Object.keys(formData).length > 0) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [formData]);

  const handleAutoSave = async () => {
    if (!onSave || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = useCallback((stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const step = steps[currentStep];
    if (!step.validation) return true;
    return step.validation(formData);
  }, [currentStep, formData, steps]);

  const goToNext = useCallback(() => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, steps.length, validateCurrentStep]);

  const goToPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const jumpToStep = useCallback((stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep, completedSteps]);

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isValid = validateCurrentStep();

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">
            Onboarding - {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {isSaving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Salvando...
              </motion.div>
            )}
            <span>{currentStep + 1} de {steps.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex flex-col items-center cursor-pointer transition-all duration-200',
                index <= currentStep || completedSteps.has(index)
                  ? 'text-cyan-400'
                  : 'text-gray-500'
              )}
              onClick={() => jumpToStep(index)}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                  completedSteps.has(index)
                    ? 'bg-green-500 text-black'
                    : index === currentStep
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-black'
                    : index < currentStep
                    ? 'bg-cyan-400 text-black'
                    : 'bg-gray-700 text-gray-400'
                )}
              >
                {completedSteps.has(index) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Dynamic Step Component */}
            <steps[currentStep].component
              data={formData}
              onChange={updateFormData}
              onNext={goToNext}
              onPrev={goToPrev}
              isValid={isValid}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPrev}
          disabled={currentStep === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
            currentStep === 0
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-gray-800'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleAutoSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-medium rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Finalizar
                </>
              )}
            </button>
          ) : (
            <button
              onClick={goToNext}
              disabled={!isValid}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-medium rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Save Status */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Seu progresso é salvo automaticamente • 
          Você pode fechar e retomar mais tarde
        </p>
      </div>
    </div>
  );
}