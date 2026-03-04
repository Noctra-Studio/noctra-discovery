"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, LogOut } from "lucide-react";
import { logout } from "@/app/[locale]/admin/actions";
import { useTranslations } from "next-intl";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  userEmail: string;
  pendingCount: number;
  locale: string;
}

export function AdminLayoutShell({
  children,
  userEmail,
  pendingCount,
  locale,
}: AdminLayoutShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("admin.dashboard");

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    {
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      label: "Dashboard",
      exact: true,
    },
    {
      href: `/${locale}/admin/forms`,
      icon: FileText,
      label: "Formularios",
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="p-6">
        <span className="font-mono text-[#555] text-xs uppercase tracking-[0.3em] block mb-4">
          Admin Panel
        </span>
        <div className="w-36 block">
          <img
            src="/noctra-logo-white.png"
            alt="Noctra Logo"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`flex items-center justify-between px-4 py-3 rounded-lg font-body transition-colors ${
                isActive
                  ? "bg-[#1A1A1A] text-white"
                  : "text-gray-400 hover:bg-[#111] hover:text-white"
              }`}>
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{link.label}</span>
              </div>
              {link.label === "Formularios" && pendingCount > 0 && (
                <span className="bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20 font-mono text-[8px] px-1.5 py-0.5 ml-auto">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer User */}
      <div className="p-4 border-t border-[#222]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center flex-shrink-0">
              <span className="text-xs uppercase text-gray-400 font-mono">
                {userEmail.substring(0, 2)}
              </span>
            </div>
            <div className="truncate">
              <p className="text-sm font-body text-gray-300 truncate">
                {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout(locale)}
            className="p-2 text-gray-500 hover:text-white transition-colors flex-shrink-0"
            title={t("logout")}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#080808] border-b border-[#222] z-40 flex items-center justify-between px-4">
        <div className="w-28 flex-shrink-0">
          <img
            src="/noctra-logo-white.png"
            alt="Noctra Logo"
            className="w-full h-auto object-contain"
          />
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-400 hover:text-white">
          <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0A0A0A] border-r border-[#222] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="absolute top-4 right-4 lg:hidden">
          <button
            onClick={closeMenu}
            className="p-2 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </>
  );
}
