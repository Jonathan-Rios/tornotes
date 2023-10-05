"use client";

import Image from "next/image";

import logoImg from "@/assets/images/logo.svg";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/LocalStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/Loading";
import { Loading } from "@/components/Loading";

export default function Page() {
  const { setIsLoading } = useLoading();
  const [acceptTerm, setAcceptTerm] = useState<boolean>(true);
  const { push } = useRouter();
  const { getLocalStorageAcceptTerm, saveLocalStorageAcceptTerm } =
    useLocalStorage();

  useEffect(() => {
    const term = getLocalStorageAcceptTerm();
    setAcceptTerm(term);

    if (term) {
      push("/home");
    }
  }, [getLocalStorageAcceptTerm, push, setIsLoading]);

  function handleAcceptTerm() {
    saveLocalStorageAcceptTerm();
    push("/home");
  }

  if (!acceptTerm) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center justify-center p-4 lg:px-8 lg:py-12 bg-zinc-900">
          <Image
            src={logoImg}
            alt="TorNotes"
            className="lg:w-[320px] w-[220px] mb-4"
          />

          <div className="lg:max-w-[1280px] w-full lg:px-8 lg:py-4 p-4 bg-zinc-950 rounded shadow-md">
            <h1 className="mb-4 text-2xl font-semibold">
              Termo de Aceite de Responsabilidade
            </h1>

            <p>
              {
                'Este Termo de Aceite de Responsabilidade ("Termo") é um acordo entre você (o "Usuário") e o criador da aplicação de código aberto Tornotes ("Aplicação"), que não coleta nem armazena dados pessoais dos usuários.'
              }
            </p>

            <h2 className="mt-4 text-lg font-semibold">1. Uso da Aplicação</h2>
            <p>
              Ao utilizar a Aplicação, o Usuário concorda em cumprir os
              seguintes termos e condições:
            </p>

            <h2 className="mt-4 text-lg font-semibold">2. Responsabilidade</h2>
            <p>O Usuário reconhece e concorda com o seguinte:</p>
            <ul className="ml-6 list-disc">
              <li>
                2.1. A Aplicação permite acessar e editar planilhas e pastas no
                Google Drive associadas à conta do Usuário.
              </li>
              <li>
                2.2. Qualquer ação realizada pelo Usuário ou em nome do Usuário
                por meio da Aplicação, como a edição ou modificação de dados em
                planilhas e pastas, é de responsabilidade exclusiva do Usuário.
              </li>
            </ul>

            <h2 className="mt-4 text-lg font-semibold">
              3. Privacidade e Dados
            </h2>
            <p>
              A Aplicação não coleta, armazena ou transmite dados pessoais dos
              usuários. Apenas IDs de planilhas podem ser armazenados localmente
              no navegador da pessoa para fins de acesso à funcionalidade da
              Aplicação.
            </p>

            <h2 className="mt-4 text-lg font-semibold">4. Contato e Suporte</h2>
            <p>
              Para dúvidas ou relatórios de problemas relacionados à Aplicação,
              o Usuário pode entrar em contato com o criador da Aplicação em
              jonathan.riosousa@gmail.com.
            </p>

            <h2 className="mt-4 text-lg font-semibold">
              5. Encerramento de Uso
            </h2>
            <p>
              O Usuário pode interromper o uso da Aplicação simplesmente parando
              de acessá-la.
            </p>

            <p className="mt-4">
              Ao utilizar a Aplicação, o Usuário concorda com os termos e
              condições deste Termo e aceita toda a responsabilidade por suas
              ações ao usar a Aplicação.
            </p>
          </div>

          <Link href="/home" className="flex w-full mt-4">
            <button
              type="button"
              onClick={handleAcceptTerm}
              className="px-4 py-2 m-auto font-semibold text-white whitespace-pre-wrap bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Confirmar aceite e acessar aplicação
            </button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image
          src={logoImg}
          alt="TorNotes"
          className="lg:w-[420px] w-[320px] mb-4"
        />
        <Loading forceShow />
      </div>
    );
  }
}
