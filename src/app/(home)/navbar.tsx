import Image from "next/image"
import Link from "next/link"
import { SearchInput } from "./search-input"

export const Navbar = () => {
    return (
       <nav className="flex items-center justify-between h-full w-full">
        <div className="flex gap-3 items-center shrink-0 pr-6">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={40} height={43} priority />
          </Link>
        </div>
        <h3 className="text-xl">Docs</h3>
        <SearchInput />
        </nav>
    )
}