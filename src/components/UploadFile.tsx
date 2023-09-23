import { ChangeEvent, useMemo } from "react";

import { Camera } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface UploadFileProps {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export function UploadFile({ selectedFile, setSelectedFile }: UploadFileProps) {
  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    // Files sempre será um array, mesmo que tenha apenas um arquivo selecionado
    const selectedFile = files[0];
    setSelectedFile(selectedFile);
  }

  const isVideo = useMemo(() => {
    if (!selectedFile) {
      return false;
    }

    const fileName = selectedFile.name.toLowerCase();
    return (
      fileName.endsWith(".mp4") ||
      fileName.endsWith(".avi") ||
      // Adicione mais extensões de vídeo aqui, se necessário
      selectedFile.type.startsWith("video/")
    );
  }, [selectedFile]);

  const previewContent = useMemo(() => {
    if (!selectedFile) {
      return (
        <>
          <Camera size={64} />{" "}
          <span className="text-lg font-semibold text-center lg:text-md">
            Selecione uma
            <br />
            imagem ou vídeo
          </span>
        </>
      );
    }

    if (isVideo) {
      return (
        <video
          src={URL.createObjectURL(selectedFile)}
          controls={false}
          className="min-w-[100px] min-h-[100px] rounded-md"
        />
      );
    } else {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt=""
          className="min-w-[100px] min-h-[100px] rounded-md"
        />
      );
    }
  }, [selectedFile, isVideo]);

  return (
    <div className="w-full space-y-6">
      <label
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 text-sm rounded-md cursor-pointer border-muted-foreground aspect-square text-muted-foreground hover:bg-primary/5",
          selectedFile ? "border-none" : "border-2"
        )}
        htmlFor="video"
      >
        {previewContent}
      </label>
      <input
        type="file"
        id="video"
        className="sr-only"
        onChange={handleFileSelected}
      />
    </div>
  );
}
