"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  LogOut,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("admin.dashboard");

  // Success Modal State from URL
  const success = searchParams.get("success") === "true";
  const formUrl = searchParams.get("formUrl");
  const slug = searchParams.get("slug");
  const clientName = searchParams.get("clientName");

  const [copied, setCopied] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleCloseSuccessModal = () => {
    // Clear query params without full reload
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    params.delete("formUrl");
    params.delete("slug");
    params.delete("clientName");

    const newQuery = params.toString();
    const newPath = `${pathname}${newQuery ? `?${newQuery}` : ""}`;
    router.replace(newPath);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    {
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      label: t("navPanel"),
      exact: true,
    },
    {
      href: `/${locale}/admin/forms`,
      icon: FileText,
      label: t("navForms"),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="p-6">
        <span className="font-medium text-[#555] text-[10px] uppercase tracking-[0.18em] block mb-4">
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
              className={`flex items-center justify-between px-4 py-3 font-medium text-[10px] uppercase tracking-[0.18em] transition-colors border ${
                isActive
                  ? "bg-[#1A1A1A] text-white border-[#333]"
                  : "text-[#555] hover:bg-[#111] hover:text-[#F5F5F0] border-transparent"
              }`}>
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span>{link.label}</span>
              </div>
              {link.label === t("navForms") && pendingCount > 0 && (
                <span className="bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20 font-medium text-[8px] px-1.5 py-0.5 ml-auto">
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
            <div className="w-8 h-8 bg-[#222] border border-[#333] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] uppercase text-[#555] font-medium">
                {userEmail.substring(0, 2)}
              </span>
            </div>
            <div className="truncate">
              <p className="text-sm text-[#F5F5F0] truncate">{userEmail}</p>
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
          className="p-2 text-[#555] hover:text-white">
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
            className="p-2 text-[#555] hover:text-white">
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      {/* Success Modal */}
      {success && formUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-none animate-in fade-in duration-300">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-8 max-w-md w-full relative animate-in zoom-in-95 duration-300 shadow-2xl">
            <button
              onClick={handleCloseSuccessModal}
              className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="mb-6">
              <h2 className="text-[28px] text-white mb-2 uppercase font-black tracking-tight">
                ✓ Formulario creado
              </h2>
              <p className="text-[13px] text-[#555] font-light">
                Comparte este link con {clientName || "el cliente"}
              </p>
            </div>

            <div className="bg-[#080808] border border-[#222] rounded-lg px-4 py-3 mb-6 group relative">
              <span className="font-medium text-[12px] text-[#F5F5F0] break-all block pr-8">
                discovery.noctra.studio/f/{slug || "..."}
              </span>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {}
                }}
                className="absolute right-3 top-3 text-[#333] hover:text-[#00E5A0] transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {}
                }}
                className="w-full min-h-[48px] py-3.5 md:py-3 bg-white text-black rounded-full font-medium tracking-[0.08em] uppercase text-base md:text-sm hover:bg-[#00E5A0] transition-colors">
                {copied ? "✓ Copiado" : "Copiar link"}
              </button>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] py-3.5 md:py-3 border border-[#222] rounded-full text-white font-medium tracking-[0.08em] uppercase text-base md:text-sm hover:bg-[#222] transition-colors flex items-center justify-center gap-2">
                Abrir en nueva pestaña <ExternalLink size={14} />
              </a>
            </div>

            <button
              onClick={handleCloseSuccessModal}
              className="w-full mt-6 text-center font-medium text-[11px] text-[#555] hover:text-white transition-colors uppercase tracking-[0.18em]">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
