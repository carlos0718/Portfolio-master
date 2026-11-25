import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { EngineeringPillars } from '../components/home/EngineeringPillars';
import { ExperienceTimeline } from '../components/home/ExperienceTimeline';
import { TechStackMatrix } from '../components/home/TechStackMatrix';
import { FeaturedCases } from '../components/home/FeaturedCases';

export function HomePage({ onOpenAvailability }) {
  return (
    <main>
      <HeroSection onOpenAvailability={onOpenAvailability} />
      <EngineeringPillars />
      <ExperienceTimeline />
      <TechStackMatrix />
      <FeaturedCases />
    </main>
  );
}
