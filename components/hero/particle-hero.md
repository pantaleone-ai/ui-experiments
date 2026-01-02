How to use this in Next.jsThis component is a Client Component because it relies on the browser's window object and requestAnimationFrame.1. Install DependenciesYou will need Framer Motion for the optimized animation loop.npm install framer-motion
# or
yarn add framer-motion
# or
pnpm add framer-motion
2. Create the ComponentCreate a new file (e.g., components/ParticleHero.tsx) and paste the code from the file provided above.Important: Ensure the very first line of the file is:"use client";
(I have already added this to the code block above for you).3. Import and UseYou can now use this component in any page (like app/page.tsx).import ParticleHero from '@/components/ParticleHero';

export default function Home() {
  return (
    <main>
      <ParticleHero />
      {/* Other sections of your site... */}
    </main>
  );
}
4. Customization Tips for Next.jsFonts: The component uses standard Tailwind sans-serif fonts. If you are using next/font, ensure your body tag in layout.tsx has the font class applied so font-sans picks it up.Full Screen vs. Section: Currently, the component has h-screen (100vh) on the wrapper div. If you want this to just be a header section, change h-screen to h-[600px] or min-h-screen.
