"use client";

import { Header } from "@/components/Header";
import { TextField } from "@/components/TextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

import {
  MaterialForm,
  MaterialSchema,
  generateRawMaterial,
} from "./MaterialForm";

import {
  LaborCostSchema,
  LaborCostForm,
  generateRawLaborCost,
} from "./LaborCostForm";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

import { DateField } from "@/components/DateField";
import { currencyBRLFormat } from "@/utils/format";
import { api } from "@/lib/axios";
import { UploadFile } from "@/components/UploadFile";
import { ConfigForm } from "@/components/ConfigForm";
import { useLocalStorage } from "@/hooks/LocalStorage";
import { useLoading } from "@/hooks/Loading";
import { toast } from "react-toastify";

const registerFormSchema = z.object({
  // noteCode: z.string().min(1, { message: "Informe um código" }),
  noteCode: z.string(),
  client: z.string().min(1, { message: "Informe um nome" }),
  serviceDescription: z.string().min(1, { message: "Informe a descrição" }),
  workedDate: z.date().refine((date) => {
    return date <= new Date();
  }),
  materials: z.array(MaterialSchema),
  laborCost: z.array(LaborCostSchema),
  payed: z.boolean(),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const { setIsLoading } = useLoading();
  const { config } = useLocalStorage();
  const { push } = useRouter();
  const [materialTotal, setMaterialTotal] = useState(0);
  const [laborTotal, setLaborTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const RegisterForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      client: "",
      serviceDescription: "",
      workedDate: new Date(),
      materials: [generateRawMaterial()],
      laborCost: [generateRawLaborCost()],
      payed: false,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = RegisterForm;

  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [isSubmitting, setIsLoading]);

  const materials = useWatch({
    control,
    name: "materials",
  });

  const laborCost = useWatch({
    control,
    name: "laborCost",
  });

  useEffect(() => {
    const materialTotal = materials.reduce((acc, material) => {
      return acc + Number(material.value) * Number(material.quantity);
    }, 0);

    setMaterialTotal(materialTotal);
  }, [materials]);

  useEffect(() => {
    const laborCostTotal = laborCost.reduce((acc, labor) => {
      return acc + Number(labor.value) * Number(labor.quantity);
    }, 0);

    setLaborTotal(laborCostTotal);
  }, [laborCost]);

  function formatMaterialsToText(
    materialList: z.infer<typeof MaterialSchema>[]
  ) {
    let resultText = "";

    materialList.forEach(
      ({ material: materialDescription, quantity, value }, index) => {
        const formattedValue = currencyBRLFormat.format(Number(value));
        const formattedTotal = currencyBRLFormat.format(
          Number(value) * Number(quantity)
        );

        if (index > 1) {
          resultText += "\n\n";
        }

        resultText += `Material: ${materialDescription}; Quantidade: ${quantity}; Valor: ${formattedValue} Total: ${formattedTotal}`;
      }
    );

    return resultText;
  }

  function formatLaborCostToText(
    laborCostList: z.infer<typeof LaborCostSchema>[]
  ) {
    let resultText = "";

    laborCostList.forEach(
      ({ laborCost: laborCostDescription, quantity, value }, index) => {
        const formattedValue = currencyBRLFormat.format(Number(value));
        const formattedTotal = currencyBRLFormat.format(
          Number(value) * Number(quantity)
        );
        if (index > 1) {
          resultText += "\n\n";
        }

        resultText += `Mão de obra: ${laborCostDescription}; Quantidade: ${quantity}; Valor: ${formattedValue} Total: ${formattedTotal}`;
      }
    );

    return resultText;
  }

  function generateFileName(clientName: string) {
    // Remover acentos e caracteres especiais
    const cleanName = clientName
      .normalize("NFD") // Normalizar caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos
      .replace(/[^a-zA-Z0-9]/g, "_"); // Substituir caracteres não alfanuméricos por "_"

    const now = new Date();
    const currentDate = `${now.getDate()}-${
      now.getMonth() + 1
    }-${now.getFullYear()}`;
    const currentTime = `${now.getHours()}-${now.getMinutes()}`;

    const fileName = `${cleanName}_${currentDate}_${currentTime}`; // Você pode escolher a extensão desejada

    return fileName.toLowerCase();
  }

  async function handleRegister(data: RegisterFormData) {
    setIsSubmitting(true);

    const generatedFileName = generateFileName(data.client);

    const imageLink = await handleUploadVideo(generatedFileName);

    const formattedData = {
      ...data,
      workedDate: Intl.DateTimeFormat("pt-BR").format(data.workedDate),
      materials: formatMaterialsToText(data.materials),
      laborCost: formatLaborCostToText(data.laborCost),
      imageLink,
      total: currencyBRLFormat.format(laborTotal + materialTotal),
      sheetId: config?.sheetId,
    };

    api
      .post("/tornotes", formattedData)
      .then(() => {
        reset();
        push("/home");

        toast.success("Registro feito com sucesso", {
          position: "bottom-right",
        });
      })
      .catch(() => {
        toast.error("Erro ao fazer registro", {
          position: "bottom-right",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  async function handleUploadVideo(generatedFileName: string) {
    if (!selectedFile || !config?.folderId) {
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("generatedFileName", generatedFileName);
    data.append("folderId", config?.folderId || "");

    try {
      const result = await api
        .post("/upload", data)
        .then(({ data }) => data.link)
        .finally(() => {
          setSelectedFile(null);
        });

      return result;
    } catch (error) {
      console.log(error);

      toast.error("Erro ao fazer upload do arquivo", {
        position: "bottom-right",
      });

      return "Erro ao fazer upload do arquivo";
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center h-full justify-start lg:w-[1280px] p-4 lg:p-8">
      <Header />

      <div className="flex flex-col items-center justify-center w-full py-4 pt-5">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col w-full gap-4"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <div className="w-[70px]">
              <Controller
                name="noteCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Código"
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!errors.client}
                    redText
                  />
                )}
              />

              {errors.noteCode && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.noteCode.message}
                </span>
              )}
            </div>

            <div className="flex-1">
              <Controller
                name="workedDate"
                control={control}
                defaultValue={new Date()}
                render={({ field }) => (
                  <DateField
                    label="Data de realização do serviço*"
                    fieldValue={field.value}
                    onFieldChange={field.onChange}
                    errorMessage={errors.workedDate?.message}
                  />
                )}
              />

              {errors.workedDate && (
                <span className="text-xs font-semibold text-red-400">
                  {errors.workedDate.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <Controller
              name="client"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Nome do cliente*"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.client}
                />
              )}
            />

            {errors.client && (
              <span className="text-xs font-semibold text-red-400">
                {errors.client.message}
              </span>
            )}
          </div>

          <div>
            <Controller
              name="serviceDescription"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Descrição do serviço*"
                  value={field.value}
                  onChange={field.onChange}
                  hasError={!!errors.serviceDescription}
                />
              )}
            />

            {errors.serviceDescription && (
              <span className="text-xs font-semibold text-red-400">
                {errors.serviceDescription.message}
              </span>
            )}
          </div>

          <MaterialForm RegisterForm={RegisterForm} />
          <LaborCostForm RegisterForm={RegisterForm} />

          <div className="flex flex-col items-end justify-between w-full lg:flex-row">
            <div className="w-full mx-auto my-10 lg:mr-20 lg:w-52 lg:m-0">
              <UploadFile
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            </div>

            <div className="flex flex-col items-end w-full lg:w-[50%] max-w-[600px]">
              <div className="flex w-full">
                <div className="flex flex-col justify-between">
                  <h3 className="font-bold text-amber-400 text-bold">
                    Total de materiais
                  </h3>
                  <h3 className="font-bold text-indigo-200 text-bold">
                    Total de mão de obra
                  </h3>
                </div>

                <div className="flex flex-col justify-between min-w-[30%] items-end ml-auto">
                  <h3 className="font-bold text-amber-400 text-md">
                    {currencyBRLFormat.format(materialTotal)}{" "}
                  </h3>
                  <h3 className="font-bold text-indigo-200 text-md">
                    {currencyBRLFormat.format(laborTotal)}{" "}
                  </h3>
                </div>
              </div>

              <hr className="w-full my-3 border-t border-gray-300" />

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center justify-center gap-2 p-2 border border-orange-400 rounded">
                  <Controller
                    name="payed"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        className="bg-gray-100 data-[state=checked]:bg-orange-500"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    )}
                  />

                  <h3 className="text-sm font-bold text-orange-400">
                    Serviço foi pago?
                  </h3>
                </div>

                <div className="flex items-end gap-2">
                  <h2 className="text-2xl font-bold">Total:</h2>
                  <h2 className="text-2xl font-bold">
                    {currencyBRLFormat.format(laborTotal + materialTotal)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full h-10 mt-4 mb-6 font-bold transition-colors bg-green-500 rounded hover:bg-green-600"
          >
            {!isSubmitting ? "REGISTRAR" : "REGISTRANDO..."}
          </button>
        </form>
      </div>
    </div>
  );
}
