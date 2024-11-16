"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Duration = ({ formData, setFormData, onNext }: { 
  formData: any; 
  setFormData: any;
  onNext: () => void;
}) => {
  const isComplete = Boolean(formData.startDate && formData.endDate);

  const handleStartDateSelect = (date: Date | undefined) => {
    setFormData({
      ...formData, 
      startDate: date ? date.toISOString() : ''
    });
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setFormData({
      ...formData, 
      endDate: date ? date.toISOString() : ''
    });
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Start Date</h2>
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl",
                  !formData.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(new Date(formData.startDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate ? new Date(formData.startDate) : undefined}
                onSelect={handleStartDateSelect}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {!formData.startDate && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please select a start date
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-4">End Date</h2>
        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl",
                  !formData.endDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(new Date(formData.endDate), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate ? new Date(formData.endDate) : undefined}
                onSelect={handleEndDateSelect}
                initialFocus
                disabled={(date) => 
                  date < new Date() || 
                  (formData.startDate && date < new Date(formData.startDate))
                }
              />
            </PopoverContent>
          </Popover>
          {!formData.endDate && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please select an end date
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Flexible with move-in/move-out dates. Early move-in possible."
            value={formData.durationNotes}
            onChange={(e) => setFormData({...formData, durationNotes: e.target.value})}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
          <span className="text-sm text-gray-400 mt-1 block">
            Optional: Add any additional information about the duration
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!isComplete}
            className={`rounded-lg px-6 ${
              isComplete 
                ? 'bg-[#FF7439] hover:bg-[#FF7439]/90' 
                : 'bg-gray-300'
            }`}
          >
            Next
          </Button>
        </div>

        {/* Completion status */}
        {!isComplete && (
          <div className="text-sm text-gray-500 text-right">
            To continue, please select:
            {!formData.startDate && <div>• Start date</div>}
            {!formData.endDate && <div>• End date</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Duration;