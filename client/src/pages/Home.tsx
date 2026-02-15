import Terminal from '@/components/Terminal';

/**
 * Home Page - Terminal Portfolio
 * 
 * Design Philosophy:
 * - Full-screen terminal emulator
 * - Cyberpunk aesthetic with neon colors
 * - Responsive design that works on all screen sizes
 */
export default function Home() {
  return (
    <div className="w-full h-screen">
      <Terminal />
    </div>
  );
}
