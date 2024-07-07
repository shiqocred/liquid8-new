"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, MoreHorizontal } from "lucide-react";

const steps = ["Step 1", "Step 2"];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    };
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    };
  },
};

export const Client = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 w-full relative px-4 gap-4 py-4">
      <div className="grid grid-cols-4 w-full bg-white rounded-md overflow-hidden shadow">
        <div className="flex border-r px-4 items-center gap-4 w-full h-20">
          <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-green-50 text-green-500">
            <Check className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h5 className="font-medium capitalize">upload file</h5>
            <p className="text-xs text-green-500">completed</p>
          </div>
        </div>
        <div className="flex border-r px-4 items-center gap-4 w-full h-20">
          <div className="w-10 h-10 rounded-full shadow justify-center flex items-center bg-gray-50">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h5 className="font-medium">upload excel</h5>
            <p className="text-xs text-gray-400">not complete</p>
          </div>
        </div>
        <button
          onClick={handlePrev}
          className={cn(
            "border-r px-4 justify-center flex-col w-full h-20",
            currentStep === 0 ? "hidden" : "flex"
          )}
        >
          <h5>previous</h5>
        </button>
        <button
          onClick={handleNext}
          className={cn(
            "flex px-4 justify-center flex-col w-full h-20",
            currentStep === 0 ? "col-span-2" : "col-span-1"
          )}
        >
          <h5>{currentStep === steps.length - 1 ? "completed" : "next"}</h5>
        </button>
      </div>
      <div className="w-full relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute w-full"
          >
            {currentStep === 0 && (
              <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4">Step 1</h2>
                <p>This is the content for Step 1</p>
              </div>
            )}
            {currentStep === 1 && (
              <div className="p-4 bg-white rounded shadow">
                <h2 className="text-xl font-bold mb-4">Step 2</h2>
                <p>This is the content for Step 2</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
