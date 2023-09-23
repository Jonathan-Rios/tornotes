import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { TextField } from "./TextField";
import { Copy, FloppyDisk } from "@phosphor-icons/react";
import { toast } from "react-toastify";

import imgGoogleDrive from "@/assets/images/example-google-drive.png";
import imgGoogleSheets from "@/assets/images/example-google-sheets.png";
import imgShareAccess from "@/assets/images/share-access.png";
import Image from "next/image";

import { useLocalStorage } from "@/hooks/LocalStorage";
import { api } from "@/lib/axios";
import { useLoading } from "@/hooks/Loading";

const registerFormSchema = z.object({
  sheetId: z.string(),
  folderId: z.string(),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export function ConfigForm() {
  const { setIsLoading } = useLoading();

  const { loadLocalStorageConfig, config, saveLocalStorageConfig } =
    useLocalStorage();

  const [howConfigureIsVisible, setHowConfigureIsVisible] =
    useState<boolean>(false);

  const RegisterForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),

    defaultValues: {
      sheetId: "",
      folderId: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = RegisterForm;

  useEffect(() => {
    if (config) {
      setValue("sheetId", config?.sheetId || "");
      setValue("folderId", config?.folderId || "");
    }
  }, [config, setValue]);

  async function handleRegister(data: RegisterFormData) {
    setIsLoading(true);

    const formattedData = {
      ...data,
    };

    saveLocalStorageConfig(formattedData);

    await api
      .post("/sheets", {
        sheetId: config?.sheetId,
      })
      .then(({ data }) => {
        if (data.success === true) {
          toast.success("Configuração salva com sucesso", {
            position: "bottom-right",
          });
        } else {
          toast.error("Erro ao salvar configuração", {
            position: "bottom-right",
          });
        }
      })
      .catch((error) => {
        console.log(`-error:`, error);
        toast.error("Erro ao salvar configuração", {
          position: "bottom-right",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    loadLocalStorageConfig();
  }

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col items-end w-full gap-4 p-4 border-2 rounded-sm border-muted-foreground"
    >
      <div className="flex flex-col items-center justify-between w-full gap-4 lg:flex-row">
        <ol className="space-y-1 text-sm font-bold text-slate-100">
          <h3 className="text-lg font-bold text-amber-500">
            Configure a aplicação.
          </h3>
          <li>1. Adicione os IDs das planilhas e pastas.</li>
          <li>
            2. Compartilhe o acesso de <strong>Editor</strong> para o e-mail do
            Tornotes.
          </li>
        </ol>

        <button
          type="button"
          onClick={() => setHowConfigureIsVisible(!howConfigureIsVisible)}
          className="flex items-center justify-center w-full h-8 p-4 ml-auto font-bold text-white transition-colors rounded bg-slate-600 lg:w-56 hover:bg-slate-500 "
        >
          Como configurar?
        </button>
      </div>

      {howConfigureIsVisible && (
        <div className="flex flex-col max-w-full break-word">
          <h3 className="font-bold text-orange-400 ">
            ID da Planilha no Google Sheets:
          </h3>
          <div className="space-y-1">
            <ol className="ml-6 list-decimal">
              <li>Abra a planilha no Google Sheets.</li>
              <li>
                {
                  'Olhe para a barra de endereços do seu navegador. Você verá algo como "docs.google.com/spreadsheets/d/abcdefgh123456" onde "abcdefgh123456" é o ID da sua planilha.'
                }
              </li>
              <li>
                Copie esse ID da barra de endereços e cole-o no campo{" "}
                <strong>código da planilha</strong>.
              </li>
            </ol>
          </div>
          <Image
            src={imgGoogleSheets}
            alt="imagem de exemplo de como pegar o id do google sheets"
            width={860}
            height={254}
            className="mx-auto my-6 rounded-sm opacity-90"
          />
          <h3 className="font-bold text-orange-400 ">
            ID da Pasta no Google Drive:
          </h3>
          <div className="space-y-1">
            <ol className="ml-6 list-decimal">
              <li>Acesse o Google Drive.</li>
              <li>
                {`Clique com o botão direito do mouse na pasta que deseja usar e
        selecione "Compartilhar".`}
              </li>
              <li>{`Na janela de compartilhamento, clique em "Copiar link".`}</li>
              <p>{`O ID estará entre as barras "/folders/" e "/view".`}</p>
              <p>{`Exemplo, o link pode ser "drive.google.com/drive/folders/abcdefgh123456/view". Nesse caso, "abcdefgh123456" é o ID da pasta.`}</p>
              <li>
                Copie esse ID da barra de endereços e cole-o no campo{" "}
                <strong>código da pasta do google drive</strong>.
              </li>
            </ol>
          </div>
          <Image
            src={imgGoogleDrive}
            alt="imagem de exemplo de como pegar o id da pasta do google drive"
            width={860}
            height={250}
            className="mx-auto my-6 rounded-sm opacity-90"
          />

          <h3 className="font-bold text-orange-400">
            Como Compartilhar Acesso de Editor em uma Planilha do Google e em
            uma Pasta do Google Drive
          </h3>
          <div className="space-y-1">
            <p>
              {
                "Para compartilhar o acesso de editor em uma planilha do Google, siga estas etapas:"
              }
            </p>
            <ol className="ml-6 list-decimal">
              <li>{"Abrir a planilha no Google Sheets."}</li>
              <li>
                {
                  'Clique no botão "Compartilhar" no canto superior direito da tela.'
                }
              </li>
              <li>
                {
                  'Na janela de compartilhamento, digite "spreadsheet@tornotes.iam.gserviceaccount.com" na caixa de texto "Adicionar pessoas e grupos".'
                }
              </li>
              <li>{'Selecione "Editor" nas opções de permissão.'}</li>
              <li>{'Clique em "Enviar" para compartilhar a planilha.'}</li>
            </ol>
            <p>
              {
                "Para compartilhar o acesso a uma pasta no Google Drive, siga estas etapas:"
              }
            </p>
            <ol className="ml-6 list-decimal">
              <li>{"Acesse o Google Drive."}</li>
              <li>
                {
                  "Clique com o botão direito do mouse na pasta que deseja compartilhar."
                }
              </li>
              <li>{'Selecione a opção "Compartilhar" no menu.'}</li>
              <li>
                {
                  'Na janela de compartilhamento, digite "spreadsheet@tornotes.iam.gserviceaccount.com" na caixa de texto "Adicionar pessoas e grupos".'
                }
              </li>
              <li>{'Selecione as permissões adequadas, como "Editor".'}</li>
              <li>{'Clique em "Enviar" para compartilhar a pasta.'}</li>
            </ol>
          </div>

          <Image
            src={imgShareAccess}
            alt="imagem de exemplo de compartilhamento de acesso"
            width={508}
            height={442}
            className="mx-auto my-6 rounded-sm opacity-90"
          />
        </div>
      )}

      <div className="flex flex-col w-full gap-4">
        <div className="w-full">
          <Controller
            name="sheetId"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <TextField
                label="Código da planilha"
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.sheetId}
              />
            )}
          />

          {errors.sheetId && (
            <span className="text-xs font-semibold text-red-400">
              {errors.sheetId.message}
            </span>
          )}
        </div>
        <div className="w-full">
          <Controller
            name="folderId"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <TextField
                label="Código da pasta"
                value={field.value}
                onChange={field.onChange}
                hasError={!!errors.folderId}
              />
            )}
          />

          {errors.folderId && (
            <span className="text-xs font-semibold text-red-400">
              {errors.folderId.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end w-full gap-4 lg:flex-row">
        <div className="w-full">
          <h3 className="mb-1 text-sm font-semibold text-slate-300 whitespace-nowrap">
            E-mail do tornotes:
          </h3>
          <h3 className="mb-1 text-xs font-semibold lg:hidden text-slate-300 whitespace-nowrap">
            spreadsheet@tornotes.iam.gserviceaccount.com
          </h3>

          <button
            type="button"
            className="flex items-center justify-center w-full h-10 gap-2 px-4 break-words whitespace-pre transition-colors rounded bg-cyan-700 hover:bg-cyan-600"
            onClick={() => {
              navigator.clipboard.writeText(
                "spreadsheet@tornotes.iam.gserviceaccount.com"
              );

              toast.info("E-mail copiado", {
                position: "bottom-right",
              });
            }}
          >
            Copiar o email
            <strong className="hidden lg:block">
              spreadsheet@tornotes.iam.gserviceaccount.com
            </strong>
            <Copy size={24} />
          </button>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center lg:w-[20%] w-full gap-2 h-10 font-bold transition-colors bg-emerald-500 rounded hover:bg-emerald-600"
        >
          {!isSubmitting ? (
            <>
              Salvar
              <FloppyDisk size={24} />
            </>
          ) : (
            "Registrando..."
          )}
        </button>
      </div>
    </form>
  );
}
