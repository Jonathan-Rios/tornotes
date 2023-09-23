"use client";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ptBR } from "date-fns/locale";

import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "@phosphor-icons/react";

interface IDateFieldProps {
  label: string;
  errorMessage?: string;
  fieldValue: Date | undefined;
  onFieldChange: (value: Date | undefined) => void;
}

export function DateField({
  label,
  errorMessage,
  fieldValue,
  onFieldChange,
}: IDateFieldProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div aria-controls="date-picker">
          <label className={`flex flex-col`}>
            <span className="mb-1 text-sm font-semibold text-slate-300">
              {label}
            </span>

            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "text-left font-normal rounded text-slate-800 text-base p-2",
                !fieldValue && "text-muted-foreground"
              )}
            >
              {fieldValue ? (
                Intl.DateTimeFormat("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "2-digit",
                  year: "numeric",
                })
                  .format(fieldValue)
                  .replace(/^(.)/, (match) => match.toUpperCase())
              ) : (
                <span>Pick a date</span>
              )}

              <CalendarIcon size={32} className="w-6 h-6 ml-auto opacity-75" />
            </Button>
          </label>

          {errorMessage && (
            <span className="text-xs font-semibold text-red-400">
              {errorMessage}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={fieldValue}
          onSelect={onFieldChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
