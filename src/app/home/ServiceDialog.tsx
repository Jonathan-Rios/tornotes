import { Dispatch, SetStateAction, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SelectedRegister } from './ServiceDataTable'

interface ServiceDialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  selectedRegister: SelectedRegister
}

export default function ServiceDialog({
  isOpen,
  setIsOpen,
  selectedRegister,
}: ServiceDialogProps) {
  const {
    noteCode,
    client,
    serviceDescription,
    workedDate,
    materials,
    laborCost,
    total,
    payed,
    imageLink,
  } = selectedRegister

  function breakLines(text: string) {
    const textArray = text.split('\n\n')

    return textArray.map((text, index) => <li key={index}>{text}</li>)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] overflow-auto border-slate-800 bg-slate-800 py-10 text-slate-200">
        <div className="flex w-full gap-2">
          <p>
            <strong className="mr-1 text-amber-500">Código:</strong>
            {noteCode}
          </p>
          <p>
            <strong className="mr-1 text-amber-500">Data:</strong>
            {workedDate}
          </p>
        </div>

        <div>
          <p>
            <strong className="mr-1 text-amber-500">Cliente:</strong>
            {client}
          </p>
        </div>

        <div className="flex w-full flex-col">
          <strong className="mr-1 text-amber-500">Descrição do Serviço:</strong>
          {serviceDescription}
        </div>

        <div className="flex w-full flex-col">
          <strong className="mr-1 text-amber-500">
            Descrição dos Materiais:
          </strong>
          <ul className="list-inside list-disc space-y-2">
            {breakLines(materials)}
          </ul>
        </div>

        <div className="flex w-full flex-col">
          <strong className="mr-1 text-amber-500">
            Descrição da Mão de obra:
          </strong>
          <ul className="list-inside list-disc space-y-2">
            {breakLines(laborCost)}
          </ul>
        </div>

        <div className="flex w-full justify-between">
          <p>
            <strong className="mr-1 text-amber-500">Foi pago?:</strong>
            {payed}
          </p>

          <p>
            <strong className="mr-1 text-amber-500">Total:</strong>
            {total}
          </p>
        </div>

        <p>
          <strong className="mr-1 text-amber-500">Imagem:</strong>
          {imageLink && imageLink !== 'Imagem não enviada' ? (
            <a
              href={imageLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Acessar imagem
            </a>
          ) : (
            'Imagem não enviada'
          )}
        </p>
      </DialogContent>
    </Dialog>
  )
}
