"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowDown, Award } from 'lucide-react';
import { Car } from '@/data/cars';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSliderProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
}

export default function HeroSlider({ cars, onSelectCar }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const featuredCars = cars.filter((c) => c.featured);
  const currentCar = featuredCars[currentIndex] || featuredCars[0];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [currentIndex, featuredCars.length]);

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredCars.length);
      setAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + featuredCars.length) % featuredCars.length);
      setAnimating(false);
    }, 300);
  };

  const scrollToNextSection = () => {
    const nextSec = document.getElementById('catalogo-destaque');
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="carrosel-veiculos" className="relative min-h-[92vh] md:min-h-screen pt-16 md:pt-24 pb-16 flex flex-col justify-between overflow-hidden bg-white select-none">
      {/* Background Watermark Model Name (Signature GPS Motors Detail) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none z-0">
        <span 
          className="watermark-text text-[15vw] md:text-[14vw] font-black uppercase tracking-tight text-neutral-900/5 transition-all duration-700 block whitespace-nowrap"
          style={{ letterSpacing: '-0.06em' }}
        >
          {currentCar.modelShort || currentCar.model}
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-[1340px] w-full mx-auto px-6 md:px-12 relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Car Information (Brand, Model, Specs, Price, CTA) */}
          <div className="lg:col-span-5 text-left order-2 lg:order-1">
            <div className={`transition-all duration-500 transform ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              
              {/* Badge */}
              <div className="mb-4">
                <Badge variant="redLight" className="space-x-1.5 py-1 px-3">
                  <Award className="w-3.5 h-3.5 text-[#a11a1a]" />
                  <span>{currentCar.badge || "Exemplar de Coleção"}</span>
                </Badge>
              </div>

              {/* Brand Title */}
              <h2 className="text-3xl md:text-5xl font-black text-neutral-950 uppercase tracking-tight leading-none mb-1">
                {currentCar.brand}
              </h2>

              {/* Model Subtitle */}
              <h3 className="text-xl md:text-2xl font-bold text-neutral-800 tracking-tight mb-2">
                {currentCar.model}
              </h3>

              {/* Version */}
              <p className="text-sm md:text-base text-neutral-500 font-normal mb-5 leading-snug">
                {currentCar.version}
              </p>

              {/* Specs Pills */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-600 mb-6 pb-4 border-b border-neutral-100">
                <Badge variant="secondary" className="font-medium text-neutral-700">{currentCar.yearModel}</Badge>
                <Badge variant="secondary" className="font-medium text-neutral-700">{currentCar.km}</Badge>
                <Badge variant="secondary" className="font-medium text-neutral-700">{currentCar.fuel}</Badge>
                {currentCar.placaPreta && (
                  <Badge variant="placaPreta" className="text-[10px]">
                    Placa Preta
                  </Badge>
                )}
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-xs text-neutral-400 block uppercase tracking-wider font-medium mb-1">Valor do Veículo</span>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-950 tracking-tight">
                  {currentCar.price}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="luxury"
                  size="default"
                  onClick={() => onSelectCar(currentCar)}
                  className="px-7"
                >
                  <span className="mr-2">Ver clássico</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <a
                  href={`https://api.whatsapp.com/send?phone=5511987654321&text=Ol%C3%A1!%20Gostaria%20de%20proposta%20para%20o%20${encodeURIComponent(currentCar.brand + ' ' + currentCar.model)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 text-xs font-semibold uppercase tracking-wider h-11 px-6 rounded-full transition-colors"
                >
                  Proposta WhatsApp
                </a>
              </div>

            </div>
          </div>

          {/* Right: Big Hero Car Showcase with Studio Lighting */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex items-center justify-center min-h-[300px] md:min-h-[460px]">
            <div className={`relative w-full max-w-2xl transition-all duration-700 transform ${animating ? 'opacity-0 scale-98 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
              
              {/* Studio Glow */}
              <div className="absolute inset-0 bg-neutral-200/40 blur-3xl -z-10 rounded-full scale-110" />

              {/* Car Image Container */}
              <div 
                className="relative overflow-hidden rounded-2xl shadow-2xl border border-neutral-200/70 group cursor-pointer" 
                onClick={() => onSelectCar(currentCar)}
              >
                <img
                  src={currentCar.heroImage}
                  alt={`${currentCar.brand} ${currentCar.model}`}
                  className="w-full h-[280px] sm:h-[380px] md:h-[440px] object-cover object-center car-image-treatment"
                />
                
                {/* Soft gradient bottom overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold uppercase tracking-wider bg-black/40 px-3 py-1 rounded backdrop-blur-sm">
                    {currentCar.engine} • {currentCar.power}
                  </span>
                  <span className="text-white/80 underline decoration-[#a11a1a] decoration-2 underline-offset-4">
                    Clique para galeria
                  </span>
                </div>
              </div>

              {/* Reflection */}
              <div className="w-5/6 h-5 bg-neutral-900/10 blur-xl mx-auto -mt-2 rounded-full" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Controls & Scroll indicator */}
      <div className="max-w-[1340px] w-full mx-auto px-6 md:px-12 relative z-10 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-100 pt-5 gap-4">
          
          {/* Thumbnails / Slider Pagination */}
          <div className="flex items-center space-x-2">
            {featuredCars.map((car, idx) => (
              <button
                key={car.id}
                onClick={() => {
                  setAnimating(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setAnimating(false);
                  }, 200);
                }}
                className={`transition-all duration-300 flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                  currentIndex === idx
                    ? 'bg-[#a11a1a] text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>0{idx + 1}</span>
                <span className="hidden md:inline font-normal text-[11px] opacity-90">{car.brand}</span>
              </button>
            ))}

            {/* Arrows */}
            <div className="flex items-center space-x-1 ml-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="w-8 h-8 rounded-full"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="w-8 h-8 rounded-full"
                aria-label="Próximo"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* "Role pra baixo" Scroll Indicator */}
          <button
            onClick={scrollToNextSection}
            className="flex items-center space-x-2 text-xs font-medium text-neutral-400 hover:text-[#a11a1a] transition-colors group cursor-pointer"
          >
            <span className="uppercase tracking-widest text-[11px]">Role para ver o acervo</span>
            <div className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-[#a11a1a] transition-colors">
              <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </button>

        </div>
      </div>
    </section>
  );
}
