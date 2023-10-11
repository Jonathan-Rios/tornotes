import Image from 'next/image'

import logoImg from '@/assets/images/logo.svg'
import Link from 'next/link'

export function Header() {
  return (
    <div className="mb-4 flex w-full flex-col items-center justify-center">
      <Link href="/home">
        <Image
          src={logoImg}
          alt="TorNotes"
          className="w-[220px] lg:mx-8 lg:w-[280px] "
        />
      </Link>
    </div>
  )
}
