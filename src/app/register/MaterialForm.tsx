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

interface IMaterialFormProps {
  RegisterForm: UseFormReturn<RegisterFormData>
}

export const MaterialSchema = z.object({
  id: z.string(),
  material: z.string().min(1, { message: 'Informe o material' }),
  quantity: z.string().min(1, { message: 'Obrigatório' }),
  value: z.string().min(1, { message: 'Obrigatório' }),
  total: z.string(),
})

export function generateRawMaterial() {
  return {
    id: uuidv4(),
    material: '',
    quantity: '1',
    value: '',
    total: '0',
  }
}

export function MaterialForm({ RegisterForm }: IMaterialFormProps) {
  const {
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = RegisterForm

  const materials = watch('materials')

  function handleAdd() {
    setValue('materials', [...materials, generateRawMaterial()])
  }

  function handleAddSymbol(index: number, symbol: string) {
    const value = getValues(`materials.${index}.material`)
    setValue(`materials.${index}.material`, value + symbol)
  }

  function handleRemove(id: string) {
    setValue(
      'materials',
      watch('materials').filter((material) => material.id !== id),
    )
  }

  function updateTotal(index: number) {
    const quantity = Number(getValues(`materials.${index}.quantity`)) || 0
    const value = Number(getValues(`materials.${index}.value`)) || 0
    const total = quantity * value
    setValue(`materials.${index}.total`, currencyBRLFormat.format(total))
  }

  return (
    <div className="relative mt-4 flex flex-col items-center justify-center gap-1 rounded-sm border-2 border-amber-500 bg-transparent p-1">
      <h4 className="absolute left-2 top-[-12px] rounded-sm bg-amber-500 px-2 py-1 text-xs font-bold text-slate-800">
        MATERIAIS UTILIZADOS
      </h4>

      {materials.map((material, index) => (
        <Fragment key={material.id}>
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
                name={`materials.${index}.material`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Material*"
                    value={field.value}
                    onChange={field.onChange}
                    hasError={
                      !!errors.materials && !!errors.materials[index]?.material
                    }
                    className="w-full"
                  />
                )}
              />

              {errors.materials && errors.materials[index]?.material && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.materials[index]?.material?.message}
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
                name={`materials.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Qtd.*"
                    value={field.value}
                    min={0}
                    hasError={
                      !!errors.materials && !!errors.materials[index]?.quantity
                    }
                    onChange={(value) => {
                      field.onChange(value)
                      updateTotal(index)
                    }}
                  />
                )}
              />

              {errors.materials && errors.materials[index]?.quantity && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.materials[index]?.quantity?.message}
                </span>
              )}
            </div>

            <div className="col-span-3 lg:col-span-1">
              <Controller
                name={`materials.${index}.value`}
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Valor unit.*"
                    value={field.value}
                    min={0}
                    type="number"
                    hasError={
                      !!errors.materials && !!errors.materials[index]?.value
                    }
                    onChange={(value) => {
                      field.onChange(value)
                      updateTotal(index)
                    }}
                  />
                )}
              />

              {errors.materials && errors.materials[index]?.value && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.materials[index]?.value?.message}
                </span>
              )}
            </div>

            <div className="col-span-5 lg:col-span-1">
              <Controller
                name={`materials.${index}.total`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField label="Total" value={field.value} readOnly />
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemove(material.id)}
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
        className="flex w-full items-center justify-center gap-2 rounded bg-amber-400 p-2 transition-all hover:bg-amber-500"
      >
        <PlusCircle
          size={20}
          className="mb-[2px] fill-slate-800"
          weight="bold"
        />
        <p className="font-bold text-slate-800">ADICIONAR OUTRO MATERIAL</p>
      </button>
    </div>
  )
}
