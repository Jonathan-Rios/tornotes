'use client'

import { TextField } from '@/components/TextField'
import { Trash, PlusCircle } from '@phosphor-icons/react'
import { v4 as uuidv4 } from 'uuid'

import { Controller, UseFormReturn } from 'react-hook-form'
import { RegisterFormData } from './page'
import { z } from 'zod'
import { currencyBRLFormat } from '@/utils/format'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'

interface ILaborCostFormProps {
  RegisterForm: UseFormReturn<RegisterFormData>
}

export const LaborCostSchema = z.object({
  id: z.string(),
  laborCost: z.string().transform((value) => {
    return value || 'Não detalhada'
  }),
  quantity: z.string().min(1, { message: 'Obrigatório' }),
  value: z.string().min(1, { message: 'Obrigatório' }),
  total: z.string(),
})

export function generateRawLaborCost() {
  return {
    id: uuidv4(),
    laborCost: '',
    quantity: '1',
    value: '',
    total: '0',
  }
}

export function LaborCostForm({ RegisterForm }: ILaborCostFormProps) {
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = RegisterForm

  const laborCost = watch('laborCost')

  function handleAdd() {
    setValue('laborCost', [...laborCost, generateRawLaborCost()])
  }

  function handleAddSymbol(index: number, symbol: string) {
    const value = getValues(`laborCost.${index}.laborCost`)
    setValue(`laborCost.${index}.laborCost`, value + symbol)
  }

  function handleRemove(id: string) {
    setValue(
      'laborCost',
      watch('laborCost').filter((laborCost) => laborCost.id !== id),
    )
  }

  function updateTotal(index: number) {
    const quantity = Number(getValues(`laborCost.${index}.quantity`)) || 0
    const value = Number(getValues(`laborCost.${index}.value`)) || 0
    const total = quantity * value
    setValue(`laborCost.${index}.total`, currencyBRLFormat.format(total))
  }

  return (
    <div className="relative mt-2 flex flex-col items-center justify-center gap-1 rounded-sm border-2 border-indigo-300 bg-transparent p-1">
      <h4 className="absolute left-2 top-[-12px] rounded-sm bg-indigo-300 px-2 py-1 text-xs font-bold text-slate-800">
        MÃO DE OBRA
      </h4>

      {laborCost.map((laborCost, index) => (
        <Fragment key={laborCost.id}>
          <div
            className={cn(
              'grid w-full grid-cols-12 items-start justify-start gap-4 rounded p-4 ',
              index % 2 ? 'bg-slate-600' : 'bg-slate-500',
            )}
          >
            <div className="col-span-2 lg:col-span-1">
              <TextField label="Item" value={index + 1} readOnly />
            </div>

            <div className="col-span-10 flex w-full items-end gap-2 lg:col-span-7">
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
                    className="w-full"
                  />
                )}
              />

              {errors.laborCost && errors.laborCost[index]?.laborCost && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.laborCost[index]?.laborCost?.message}
                </span>
              )}

              <button
                type="button"
                className="flex  h-10 items-center justify-center gap-2 whitespace-pre break-words rounded bg-cyan-700 px-4 font-bold transition-colors hover:bg-cyan-600 "
                onClick={() => handleAddSymbol(index, 'Ø')}
              >
                Ø
              </button>
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
                      field.onChange(value)
                      updateTotal(index)
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
                      field.onChange(value)
                      updateTotal(index)
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
              className="group col-span-2 mt-6 flex h-10 w-full items-center justify-center transition-all lg:col-span-1"
            >
              <Trash
                size={32}
                weight="fill"
                className={cn(
                  'break-words fill-red-400 group-hover:fill-red-300',
                  index === 0
                    ? 'fill-slate-300 opacity-25 group-hover:fill-slate-200'
                    : 'fill-red-400 group-hover:fill-red-300',
                )}
              />
            </button>
          </div>
        </Fragment>
      ))}

      <button
        onClick={handleAdd}
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded bg-indigo-200 p-2 transition-all hover:bg-indigo-300"
      >
        <PlusCircle
          size={20}
          className="mb-[2px] fill-slate-800"
          weight="bold"
        />
        <p className="font-bold text-slate-800">ADICIONAR OUTRA MÃO DE OBRA</p>
      </button>
    </div>
  )
}
