import Image from "next/image";

import logoImg from "@/assets/images/logo.svg";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex flex-col items-center justify-center w-full mb-4">
      <Link href="/home">
        <Image
          src={logoImg}
          alt="TorNotes"
          className="lg:w-[280px] w-[220px] lg:mx-8 "
        />
      </Link>
    </div>
  );
}
