"use client";

import { TextField } from "@/components/TextField";
import { Trash, PlusCircle } from "@phosphor-icons/react";
import { v4 as uuidv4 } from "uuid";

import { Controller, UseFormReturn } from "react-hook-form";
import { RegisterFormData } from "./page";
import { z } from "zod";
import { currencyBRLFormat } from "@/utils/format";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface ILaborCostFormProps {
  RegisterForm: UseFormReturn<RegisterFormData>;
}

export const LaborCostSchema = z.object({
  id: z.string(),
  laborCost: z.string().transform((value) => {
    return value ? value : "Não detalhada";
  }),
  quantity: z.string().min(1, { message: "Obrigatório" }),
  value: z.string().min(1, { message: "Obrigatório" }),
  total: z.string(),
});

export function generateRawLaborCost() {
  return {
    id: uuidv4(),
    laborCost: "",
    quantity: "1",
    value: "",
    total: "0",
  };
}

export function LaborCostForm({ RegisterForm }: ILaborCostFormProps) {
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = RegisterForm;

  const laborCost = watch("laborCost");

  function handleAdd() {
    setValue("laborCost", [...laborCost, generateRawLaborCost()]);
  }

  function handleRemove(id: string) {
    setValue(
      "laborCost",
      watch("laborCost").filter((laborCost) => laborCost.id !== id)
    );
  }

  function updateTotal(index: number) {
    const quantity = Number(getValues(`laborCost.${index}.quantity`)) || 0;
    const value = Number(getValues(`laborCost.${index}.value`)) || 0;
    const total = quantity * value;
    setValue(`laborCost.${index}.total`, currencyBRLFormat.format(total));
  }

  return (
    <div className="relative flex flex-col items-center justify-center gap-1 p-1 mt-2 bg-transparent border-2 border-indigo-300 rounded-sm">
      <h4 className="absolute top-[-12px] left-2 bg-indigo-300 rounded-sm px-2 py-1 text-xs font-bold text-slate-800">
        MÃO DE OBRA
      </h4>

      <button
        type="button"
        className="flex items-center justify-center h-10 gap-2 px-4 ml-auto font-bold break-words whitespace-pre transition-colors rounded bg-cyan-700 hover:bg-cyan-600"
        onClick={() => {
          navigator.clipboard.writeText("Ø");

          toast.info("Ø Copiado", {
            position: "bottom-right",
          });
        }}
      >
        Ø
      </button>

      {laborCost.map((laborCost, index) => (
        <Fragment key={laborCost.id}>
          <div
            className={cn(
              "grid items-start justify-start w-full grid-cols-12 gap-4 p-4 rounded ",
              index % 2 ? "bg-slate-600" : "bg-slate-500"
            )}
          >
            <div className="col-span-2 lg:col-span-1">
              <TextField label="Item" value={index + 1} readOnly />
            </div>

            <div className="col-span-10 lg:col-span-7">
              <Controller
                name={`laborCost.${index}.laborCost`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Descrição de mão de obra"
                    placeholder="Não detalhada"
                    value={field.value}
                    onChange={field.onChange}
                    hasError={
                      !!errors.laborCost && !!errors.laborCost[index]?.laborCost
                    }
                  />
                )}
              />

              {errors.laborCost && errors.laborCost[index]?.laborCost && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.laborCost[index]?.laborCost?.message}
                </span>
              )}
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Controller
                name={`laborCost.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Qtd.*"
                    value={field.value}
                    min={0}
                    hasError={
                      !!errors.laborCost && !!errors.laborCost[index]?.quantity
                    }
                    onChange={(value) => {
                      field.onChange(value);
                      updateTotal(index);
                    }}
                  />
                )}
              />

              {errors.laborCost && errors.laborCost[index]?.quantity && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.laborCost[index]?.quantity?.message}
                </span>
              )}
            </div>

            <div className="col-span-3 lg:col-span-1">
              <Controller
                name={`laborCost.${index}.value`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Valor unit.*"
                    value={field.value}
                    type="number"
                    min={0}
                    hasError={
                      !!errors.laborCost && !!errors.laborCost[index]?.value
                    }
                    onChange={(value) => {
                      field.onChange(value);
                      updateTotal(index);
                    }}
                  />
                )}
              />

              {errors.laborCost && errors.laborCost[index]?.value && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.laborCost[index]?.value?.message}
                </span>
              )}
            </div>

            <div className="col-span-5 lg:col-span-1">
              <Controller
                name={`laborCost.${index}.total`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField label="Total" value={field.value} readOnly />
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemove(laborCost.id)}
              disabled={index === 0}
              className="flex items-center justify-center w-full h-10 col-span-2 mt-6 transition-all lg:col-span-1 group"
            >
              <Trash
                size={32}
                weight="fill"
                className={cn(
                  "break-words fill-red-400 group-hover:fill-red-300",
                  index === 0
                    ? "fill-slate-300 opacity-25 group-hover:fill-slate-200"
                    : "fill-red-400 group-hover:fill-red-300"
                )}
              />
            </button>
          </div>
        </Fragment>
      ))}

      <button
        onClick={handleAdd}
        type="button"
        className="flex items-center justify-center w-full gap-2 p-2 transition-all bg-indigo-200 rounded hover:bg-indigo-300"
      >
        <PlusCircle
          size={20}
          className="fill-slate-800 mb-[2px]"
          weight="bold"
        />
        <p className="font-bold text-slate-800">ADICIONAR OUTRA MÃO DE OBRA</p>
      </button>
    </div>
  );
}
