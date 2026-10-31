"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import FeaturedSection from '@/components/FeaturedSection';
import ShowroomSection from '@/components/ShowroomSection';
import InventoryView from '@/components/InventoryView';
import VehicleDetailModal from '@/components/VehicleDetailModal';
import AboutView from '@/components/AboutView';
import ContactView from '@/components/ContactView';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import VideoIntro from '@/components/VideoIntro';
import BrandVideoHero from '@/components/BrandVideoHero';
import { CARS_DATA, Car } from '@/data/cars';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [startHeroVideo, setStartHeroVideo] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const forceIntro = params.get('intro') === 'true' || params.get('intro') === '1';
        const hasSeenIntro = localStorage.getItem('fao_intro_seen') || sessionStorage.getItem('fao_intro_seen');
        if (hasSeenIntro && !forceIntro) {
          return true; // Intro skipped, play hero video immediately
        }
      } catch {}
    }
    return false; // Intro is showing, wait until 0.5s before intro ends
  });

  // Intro control: only shown on first access, never on reload
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forceIntro = params.get('intro') === 'true' || params.get('intro') === '1';
      const hasSeenIntro = localStorage.getItem('fao_intro_seen') || sessionStorage.getItem('fao_intro_seen');

      if (hasSeenIntro && !forceIntro) {
        setShowIntro(false);
        setStartHeroVideo(true);
      } else {
        setShowIntro(true);
        setStartHeroVideo(false);
        localStorage.setItem('fao_intro_seen', 'true');
        sessionStorage.setItem('fao_intro_seen', 'true');
      }
    } catch {
      setShowIntro(false);
      setStartHeroVideo(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setStartHeroVideo(true);
    try {
      localStorage.setItem('fao_intro_seen', 'true');
      sessionStorage.setItem('fao_intro_seen', 'true');
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('intro-seen');
      }
    } catch {}
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setActiveTab('veiculos');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col justify-between selection:bg-[#a11a1a] selection:text-white">
      {/* Cinematic Logo Reveal Video Intro */}
      {showIntro && (
        <VideoIntro
          onNearEnd={() => setStartHeroVideo(true)}
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main Header with Search pill, Phone, and red active line indicator */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onSelectBrand={handleBrandSelect}
        selectedBrand={selectedBrand}
      />

      {/* Main Content based on active tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Apresentação Oficial: Logo FAO Clássicos Grande à Esquerda com Vídeo "FAO site" */}
            <BrandVideoHero
              shouldPlay={startHeroVideo}
              onExploreVehicles={() => {
                const el = document.getElementById('carrosel-veiculos');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Hero Car Showcase Slider */}
            <HeroSlider
              cars={CARS_DATA}
              onSelectCar={handleSelectCar}
            />

            {/* Curated Highlights Showcase ("Apaixone-se pelo clássico") */}
            <FeaturedSection
              cars={CARS_DATA}
              onSelectCar={handleSelectCar}
              onOpenInventory={() => handleTabChange('veiculos')}
            />

            {/* Showroom & 4 Pillars ("Excelência em cada detalhe") */}
            <ShowroomSection
              onOpenInventory={() => handleTabChange('veiculos')}
            />
          </>
        )}

        {activeTab === 'veiculos' && (
          <InventoryView
            cars={CARS_DATA}
            onSelectCar={handleSelectCar}
            initialBrand={selectedBrand}
          />
        )}

        {activeTab === 'sobre' && (
          <AboutView
            onOpenInventory={() => handleTabChange('veiculos')}
          />
        )}

        {activeTab === 'contato' && (
          <ContactView />
        )}
      </main>

      {/* Vehicle Detail Lightbox / Modal */}
      {selectedCar && (
        <VehicleDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* High-end Automotive Footer */}
      <Footer onNavigate={handleTabChange} />
    </div>
  );
}
