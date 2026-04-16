"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Key,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bots", href: "/bots", icon: Bot },
  { name: "Skills", href: "/skills", icon: Wrench },
  { name: "API Credentials", href: "/credentials", icon: Key },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const NavContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-900">Bot Skill Manager</h1>
        <p className="text-sm text-slate-500">Mission Control</p>
      </div>

      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-900">{session?.user?.name || session?.user?.email}</p>
          <p className="text-xs text-slate-500 capitalize">{session?.user?.role}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-slate-900">Bot Skill Manager</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 flex flex-col">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 p-4 fixed h-screen">
        <NavContent />
      </div>
    </>
  )
}
