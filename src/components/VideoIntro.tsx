"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface VideoIntroProps {
  onComplete: () => void;
  onNearEnd?: () => void;
}

export default function VideoIntro({ onComplete, onNearEnd }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const nearEndTriggeredRef = useRef(false);
  const nearEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerNearEnd = () => {
    if (nearEndTriggeredRef.current) return;
    nearEndTriggeredRef.current = true;
    if (onNearEnd) {
      onNearEnd();
    }
  };

  const handleFinish = () => {
    triggerNearEnd();
    if (fadeOut) return;
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play without audio
    video.muted = true;
    video.defaultMuted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback
        const handleUserInteraction = () => {
          video.play().catch(() => {});
          window.removeEventListener('click', handleUserInteraction);
          window.removeEventListener('touchstart', handleUserInteraction);
        };
        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);
      });
    }

    const handleTimeUpdate = () => {
      if (!video) return;
      const duration = video.duration || 5.0;
      // Start background video when 0.5s or less remain before intro ends
      if (duration - video.currentTime <= 0.5) {
        triggerNearEnd();
      }
    };

    const handlePlaying = () => {
      const duration = video.duration || 5.0;
      const remainingTime = Math.max(0, duration - video.currentTime - 0.5);
      if (nearEndTimerRef.current) clearTimeout(nearEndTimerRef.current);
      nearEndTimerRef.current = setTimeout(() => {
        triggerNearEnd();
      }, remainingTime * 1000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleFinish);

    // Fallback timer: 5.4s (Logo_Reveal-2 is 5.0s)
    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 5400);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleFinish);
      clearTimeout(fallbackTimer);
      if (nearEndTimerRef.current) {
        clearTimeout(nearEndTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      id="fao-video-intro"
      className={`fixed inset-0 bg-[#000000] z-[99999] flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.5,0,0,1)] ${
        fadeOut ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ zIndex: 99999 }}
    >
      {/* Ambient background bloom & cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(161,26,26,0.12)_0%,rgba(0,0,0,0.85)_70%,#000000_100%)] pointer-events-none -z-10" />

      {/* Elegant Centered Video Container */}
      <div className="relative w-[88vw] max-w-[780px] max-h-[65vh] aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          src="/Logo_Reveal-2.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
          className="w-full h-full object-contain select-none pointer-events-none filter contrast-[1.12] brightness-[1.04]"
        />

        {/* Soft edge feathering so video edges blend seamlessly into background */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_#000000]" />
      </div>

      {/* Skip button in bottom right */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          type="button"
          onClick={handleFinish}
          className="group flex items-center space-x-2 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-neutral-700/80 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl"
        >
          <span>Pular intro</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#a11a1a]" />
        </button>
      </div>
    </div>
  );
}
