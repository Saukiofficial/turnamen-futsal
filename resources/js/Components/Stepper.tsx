import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
    currentStep: number;
    steps: {
        number: number;
        title: string;
        desc: string;
    }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
    return (
        <div className="w-full">
            {/* Desktop / Tablet view */}
            <div className="hidden sm:flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-0" />
                
                {steps.map((step) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;

                    return (
                        <div key={step.number} className="relative z-10 flex items-center gap-3 bg-white px-3 py-1">
                            <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-colors duration-200 ${
                                    isCompleted 
                                        ? 'bg-emerald-600 text-white shadow-sm' 
                                        : isActive 
                                        ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-sm' 
                                        : 'bg-slate-100 text-slate-500 border border-slate-300'
                                }`}
                            >
                                {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-xs font-bold tracking-tight ${isActive ? 'text-brand-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {step.title}
                                </span>
                                <span className="text-[11px] text-slate-500 hidden md:inline">
                                    {step.desc}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile view */}
            <div className="sm:hidden flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                        {currentStep}
                    </span>
                    <span className="text-sm font-semibold text-navy-950">
                        {steps[currentStep - 1]?.title}
                    </span>
                </div>
                <span className="text-xs font-medium text-slate-500">
                    Langkah {currentStep} dari {steps.length}
                </span>
            </div>
        </div>
    );
}
