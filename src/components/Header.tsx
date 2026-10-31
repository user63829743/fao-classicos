"use client";

import React, { useState, useEffect } from 'react';
import { Phone, Search, Menu, X } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { BRANDS } from '@/data/cars';
import { Button } from '@/components/ui/button';

const ROTATING_BRANDS = ["CHEVROLET", "FORD", "DODGE", "PORSCHE", "FERRARI", "VOLKSWAGEN", "PUMA"];

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectBrand: (brand: string) => void;
  selectedBrand: string;
}

export default function Header({
  activeTab,
  setActiveTab,
  onSelectBrand,
  selectedBrand,
}: HeaderProps) {
  const [brandIndex, setBrandIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Auto-rotate brands in search pill every 2.4s (GPS Motors signature)
  useEffect(() => {
    const interval = setInterval(() => {
      setBrandIndex((prev) => (prev + 1) % ROTATING_BRANDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Detect scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Início', index: 0 },
    { id: 'veiculos', label: 'Veículos', index: 1 },
    { id: 'sobre', label: 'Sobre', index: 2 },
    { id: 'contato', label: 'Contato', index: 3 },
  ];

  const currentNavIndex = navItems.find((item) => item.id === activeTab)?.index ?? 0;
  const isVisible = activeTab !== 'home' || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto bg-black/95 backdrop-blur-md py-2 md:py-2.5 shadow-2xl border-b border-white/10'
            : '-translate-y-full opacity-0 pointer-events-none py-2 md:py-2.5'
        }`}
      >
        <div className="max-w-[1340px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo Oficial FAO Clássicos (Logo-Sem-fundo) */}
            <div 
              className="cursor-pointer select-none group flex items-center"
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo-Sem-fundo.png"
                alt="FAO Clássicos"
                className="w-auto h-8 md:h-10 object-contain brightness-100 transition-all duration-300 group-hover:scale-105"
              />
            </div>

            {/* Central Search / Brand Selector Button (GPS Motors Style) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center px-5 py-2 rounded-full transition-all duration-300 group cursor-pointer border bg-neutral-900/90 hover:bg-neutral-800/90 border-neutral-800 text-neutral-300 hover:border-neutral-700"
              >
                {/* Rotating brand icon/badge */}
                <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden mr-2.5 transition-colors bg-neutral-800 text-neutral-200">
                  <span className="text-[9px] font-bold transition-transform duration-500">
                    {ROTATING_BRANDS[brandIndex].slice(0, 2)}
                  </span>
                </div>
                
                {/* Title and current rotating brand */}
                <span className="text-[11px] transition-colors font-medium text-neutral-400 group-hover:text-white">
                  Pesquise por marca: <strong className="uppercase ml-1 transition-colors text-white">{selectedBrand !== 'Todas' ? selectedBrand : ROTATING_BRANDS[brandIndex]}</strong>
                </span>

                <Search className="w-3.5 h-3.5 ml-2.5 transition-colors text-neutral-400 group-hover:text-white" />
              </button>

              {/* Brand Selector Dropdown */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 rounded-2xl shadow-2xl z-20 py-2 max-h-72 overflow-y-auto border bg-neutral-950 border-neutral-800 text-white">
                    <div className="px-4 py-2 border-b text-[11px] font-semibold tracking-wider uppercase border-neutral-800 text-neutral-400">
                      Filtrar Marca
                    </div>
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          onSelectBrand(brand);
                          setDropdownOpen(false);
                          setActiveTab('veiculos');
                        }}
                        className={`w-full text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between ${
                          selectedBrand === brand
                            ? 'bg-neutral-900 text-[#a11a1a]'
                            : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                        }`}
                      >
                        <span>{brand}</span>
                        {selectedBrand === brand && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a11a1a]" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right side: Phone & Vertical indicator Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Phone contact */}
              <a
                href="https://api.whatsapp.com/send?phone=5561998631878&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20FAO%20Cl%C3%A1ssicos."
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-xs transition-colors group text-neutral-300 hover:text-white"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 transition-colors bg-neutral-900 group-hover:bg-[#a11a1a]/30">
                  <Phone className="w-3 h-3 transition-colors text-neutral-300 group-hover:text-white" />
                </div>
                <span className="text-[11px] leading-tight">
                  (61) 99863-1878 <span className="text-[9px] text-neutral-400 block font-light">Showroom Brasília - DF</span>
                </span>
              </a>

              {/* Navigation with GPS Motors red active bar */}
              <div className="relative pr-5">
                <div
                  className="absolute right-0 w-[2px] bg-[#a11a1a] transition-all duration-300 ease-out"
                  style={{
                    height: '14px',
                    top: `${currentNavIndex * 19 + 2}px`
                  }}
                />

                <ul className="text-right space-y-0.5">
                  {navItems.map((item) => (
                    <li key={item.id} className="leading-tight">
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`text-[11px] uppercase tracking-wider font-medium transition-colors leading-tight ${
                          activeTab === item.id
                            ? 'text-[#a11a1a] font-semibold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mobile Burger Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Abrir Menu"
                className="text-white hover:bg-neutral-900 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#a11a1a]" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`fixed inset-0 bg-white z-50 flex flex-col justify-between p-8 transition-all duration-500 ease-[cubic-bezier(0.5,0,0,1)] lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div 
            className="cursor-pointer select-none"
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo-Sem-fundo.png"
              alt="FAO Clássicos"
              className="h-12 w-auto object-contain brightness-0"
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links list */}
        <div className="py-8">
          <ul className="space-y-6 text-center">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-xl uppercase tracking-widest font-semibold transition-colors ${
                    activeTab === item.id ? 'text-[#a11a1a]' : 'text-neutral-800'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Contacts & Social */}
        <div className="border-t border-neutral-100 pt-6 space-y-5 text-center">
          <a
            href="https://api.whatsapp.com/send?phone=5561998631878"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center space-x-2 text-sm text-neutral-700 bg-neutral-100 px-6 py-3 rounded-full w-full font-medium"
          >
            <Phone className="w-4 h-4 text-[#a11a1a]" />
            <span>(61) 99863-1878 • Showroom Brasília</span>
          </a>

          <div className="flex justify-center space-x-4 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-[#a11a1a]"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
