import React from 'react';
import { parseColoredOutput } from '@/lib/formatting';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'welcome';
  content: string;
  command?: string;
  displayedContent?: string;
  isComplete?: boolean;
}

interface TerminalOutputProps {
  line: TerminalLine;
}

/**
 * TerminalOutput Component - Renders individual terminal lines with color support
 * 
 * Design Philosophy (Hyper Theme):
 * - Clean, minimal aesthetic
 * - Character-by-character rendering
 * - Color-coded output based on type
 * - Support for inline color formatting
 */
export function TerminalOutput({ line }: TerminalOutputProps) {
  const displayedContent = line.displayedContent || line.content;
  const isAnimating = !line.isComplete;

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400';
      case 'magenta':
        return 'text-magenta-400';
      case 'white':
        return 'text-white';
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  if (line.type === 'command') {
    return (
      <div className="terminal-line">
        <span className="terminal-prompt">$</span>
        <span className="terminal-command">{displayedContent}</span>
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div className="terminal-line">
        <div className="terminal-output error">
          {displayedContent}
          {isAnimating && <span className="terminal-cursor" />}
        </div>
      </div>
    );
  }

  if (line.type === 'info') {
    return (
      <div className="terminal-line">
        <div className="terminal-output info">
          {displayedContent}
          {isAnimating && <span className="terminal-cursor" />}
        </div>
      </div>
    );
  }

  if (line.type === 'welcome') {
    return (
      <div className="terminal-line welcome-text">
        {displayedContent}
        {isAnimating && <span className="terminal-cursor" />}
      </div>
    );
  }

  // Render colored output
  const coloredLines = parseColoredOutput(displayedContent);

  return (
    <div className="terminal-line">
      <div className="terminal-output">
        {coloredLines.map((segment, idx) => (
          <span key={idx} className={getColorClass(segment.color)}>
            {segment.text}
          </span>
        ))}
        {isAnimating && <span className="terminal-cursor" />}
      </div>
    </div>
  );
}
