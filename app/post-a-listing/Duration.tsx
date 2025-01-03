"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PreviewButton from "./PreviewButton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Duration = ({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
}) => {
  const isComplete = Boolean(formData.startDate && formData.endDate);

  const handleStartDateSelect = (date: Date | undefined) => {
    setFormData({
      ...formData,
      startDate: date ? date.toISOString() : "",
    });
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setFormData({
      ...formData,
      endDate: date ? date.toISOString() : "",
    });
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-row justify-between mb-12">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Duration</h1>
          <h2 className="text-sm font-[500] text-gray-500">
            Set the start and end dates of your lease here.{" "}
          </h2>
        </div>

        <PreviewButton formData={formData} />
      </div>

      <div className="flex justify-between">
        <div className="w-[49%]">
          <h2 className="text-2xl font-medium mb-2">Start Date</h2>
          <span className="text-sm text-gray-400 mb-5 block">
            Required: Please select a start date
          </span>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl py-6",
                    !formData.startDate && "text-muted-foreground"
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
                  selected={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  onSelect={handleStartDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="w-[49%]">
          <h2 className="text-2xl font-medium mb-2">End Date</h2>
          <span className="text-sm text-gray-400 mb-5 block">
            Required: Please select an end date
          </span>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl py-6",
                    !formData.endDate && "text-muted-foreground"
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
                  selected={
                    formData.endDate ? new Date(formData.endDate) : undefined
                  }
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() ||
                    (formData.startDate && date < new Date(formData.startDate))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-2">Special Notes</h2>
        <p className="text-gray-400 text-sm mb-5">
          <span className="text-gray-500 font-semibold">This is optional!</span>{" "}
          You can include information such as flexible durations or move-in
          dates.{" "}
        </p>

        <div className="relative">
          <Textarea
            placeholder="Ex: Flexible with move-in/move-out dates. Early move-in possible."
            value={formData.durationNotes}
            onChange={(e) =>
              setFormData({ ...formData, durationNotes: e.target.value })
            }
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none placeholder:text-gray-400 py-3"
          />
          <div className="flex justify-end text-sm mt-2 text-gray-400">
            <span>
              <span className="text-gray-500 font-semibold">
                {formData.durationNotes.length}
              </span>
              /500 characters
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <Button
            className="rounded-lg px-6 flex items-center bg-[#FF7439] hover:bg-[#FF7439]/90"
            onClick={onBack}
          >
            <FaChevronLeft />
            <p>Back</p>
          </Button>
          <Button
            className={`rounded-lg px-6 flex items-center ${
              isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
            }`}
            onClick={onNext}
            disabled={!isComplete}
          >
            <p>Next</p>
            <FaChevronRight />
          </Button>
        </div>

        {/* Completion status */}
      </div>
    </div>
  );
};

export default Duration;
