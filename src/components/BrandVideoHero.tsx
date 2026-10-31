"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BrandVideoHeroProps {
  onExploreVehicles?: () => void;
  shouldPlay?: boolean;
}

export default function BrandVideoHero({ 
  onExploreVehicles,
  shouldPlay = true,
}: BrandVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCenterIcon, setShowCenterIcon] = useState(false);

  // Track video playback progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Synchronized playback: plays only when shouldPlay is true (e.g. 0.5s before intro finishes)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [shouldPlay, isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }

    setShowCenterIcon(true);
    setTimeout(() => setShowCenterIcon(false), 600);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = newProgress * video.duration;
  };

  const scrollToVehicles = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onExploreVehicles) {
      onExploreVehicles();
      return;
    }
    const el = document.getElementById('carrosel-veiculos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[92vh] md:min-h-screen flex items-center overflow-hidden bg-black select-none border-b border-white/10"
    >
      {/* 100% Area Video Background */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden cursor-pointer"
        onClick={togglePlay}
        title="Clique para reproduzir / pausar o vídeo"
      >
        <video
          ref={videoRef}
          poster="/fao-site-poster.jpg"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.98]"
        >
          <source src="/FAO%20site.mp4" type="video/mp4" />
          <source src="/FAO%20site.mov" type="video/quicktime" />
          Seu navegador não suporta reprodução de vídeo HTML5.
        </video>

        {/* Softened Cinematic Gradient Overlays:
            Light, transparent backdrop to keep the video vibrant and clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 md:via-black/25 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        
        {/* Subtle Ambient Red Glow Accent in the corner */}
        <div 
          className="absolute top-1/4 left-10 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none opacity-20 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(161,26,26,0.5) 0%, transparent 70%)'
          }}
        />

        {/* Center Temporary Play/Pause Flash Indicator */}
        {showCenterIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-20 h-20 rounded-full bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 transition-transform animate-out fade-out duration-500 shadow-2xl">
              {isPlaying ? <Play className="w-9 h-9 fill-white ml-1" /> : <Pause className="w-9 h-9 fill-white" />}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Container: Large FAO Clássicos Logo on the Left */}
      <div className="max-w-[1340px] w-full mx-auto px-6 md:px-12 relative z-10 pt-8 md:pt-12 pb-14 md:pb-16 pointer-events-none">
        <div className="max-w-2xl text-left flex flex-col items-start justify-center pointer-events-auto">
          
          {/* Logo FAO Clássicos Grande à Esquerda */}
          <div 
            className="relative mb-6 group cursor-pointer inline-block" 
            onClick={scrollToVehicles}
            title="Conhecer o acervo oficial"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Logo-Sem-fundo.png"
              alt="FAO Clássicos"
              className="w-auto h-36 sm:h-48 md:h-60 lg:h-68 xl:h-72 object-contain brightness-100 filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)] transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_25px_50px_rgba(161,26,26,0.35)] transform-gpu"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.08] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Tradição, Excelência & Raridades Automotivas
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed mb-8 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Conheça nossa seleção exclusiva de relíquias automotivas. Exemplares raros, legítimos e rigorosamente preservados, onde cada veículo representa uma obra de arte única em autenticidade e excelência.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <Button
              variant="luxury"
              size="lg"
              onClick={scrollToVehicles}
              className="cursor-pointer shadow-2xl shadow-red-950/60 hover:scale-105 transition-transform"
            >
              <span>Ver Veículos em Estoque</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>

            <a
              href="https://api.whatsapp.com/send?phone=5561998631878&text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20FAO%20Cl%C3%A1ssicos%20e%20gostaria%20de%20atendimento."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-13 px-6 rounded-full border border-white/20 hover:border-white/50 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Falar no WhatsApp</span>
            </a>
          </div>

        </div>
      </div>

      {/* Floating Interactive Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center">
        {/* Sound Toggle (Mute / Unmute) Button - Icon Only */}
        <button
          type="button"
          onClick={toggleMute}
          className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-xl ${
            isMuted
              ? 'bg-black/70 border-white/20 text-neutral-200 hover:text-white hover:bg-black/90'
              : 'bg-[#a11a1a] border-red-500 text-white shadow-red-950/60'
          }`}
          title={isMuted ? "Ativar som" : "Desativar som"}
          aria-label={isMuted ? "Ativar som" : "Desativar som"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Scrubbable Progress Line along the bottom edge */}
      <div
        onClick={handleProgressBarClick}
        className="absolute bottom-0 left-0 right-0 h-1 hover:h-2 bg-white/15 z-20 cursor-pointer transition-all group/progress"
        title="Navegar no vídeo"
      >
        <div
          className="h-full bg-[#a11a1a] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scroll Down Indicator */}
      <div 
        onClick={scrollToVehicles}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center cursor-pointer text-white/70 hover:text-white transition-colors z-20 group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium mb-1 group-hover:translate-y-0.5 transition-transform">
          Conhecer Veículos
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#a11a1a]" />
      </div>
    </section>
  );
}
