import React from 'react';
import type { FormattedOutput, TerminalColor, TextSegment } from '@/lib/formatting';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'welcome';
  content: string | FormattedOutput;
  command?: string;
  displayedContent?: string | FormattedOutput;
  isComplete?: boolean;
}

interface TerminalOutputProps {
  line: TerminalLine;
}

/**
 * TerminalOutput Component - Renders terminal lines with Hyper theme colors
 * 
 * Design Philosophy (Hyper Theme):
 * - Vibrant, eye-catching colors
 * - Clean rendering with proper color support
 * - Character-by-character animation
 * - Bold text support
 */
export function TerminalOutput({ line }: TerminalOutputProps) {
  const displayedContent = line.displayedContent || line.content;
  const isAnimating = !line.isComplete;

  /**
   * Get CSS class for terminal color
   */
  const getColorClass = (color?: TerminalColor): string => {
    switch (color) {
      case 'primary':
        return 'text-terminal-cyan';
      case 'secondary':
        return 'text-terminal-magenta';
      case 'accent':
        return 'text-terminal-green';
      case 'warning':
        return 'text-terminal-yellow';
      case 'error':
        return 'text-terminal-red';
      case 'muted':
        return 'text-terminal-gray';
      case 'default':
      default:
        return 'text-terminal-white';
    }
  };

  /**
   * Render formatted output (array of TextSegments)
   */
  const renderFormattedOutput = (content: FormattedOutput) => {
    return content.map((segment: TextSegment, idx: number) => (
      <span
        key={idx}
        className={`${getColorClass(segment.color)} ${segment.bold ? 'font-bold' : ''}`}
      >
        {segment.text}
      </span>
    ));
  };

  /**
   * Render plain string content
   */
  const renderPlainContent = (content: string) => {
    return <span className="text-terminal-white">{content}</span>;
  };

  if (line.type === 'command') {
    return (
      <div className="terminal-line">
        <span className="terminal-prompt text-terminal-cyan font-bold">$</span>
        <span className="terminal-command text-terminal-white ml-2">
          {typeof displayedContent === 'string'
            ? displayedContent
            : displayedContent.map(s => s.text).join('')}
        </span>
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div className="terminal-line">
        <div className="terminal-output text-terminal-red">
          {typeof displayedContent === 'string'
            ? renderPlainContent(displayedContent)
            : renderFormattedOutput(displayedContent)}
        </div>
      </div>
    );
  }

  if (line.type === 'info') {
    return (
      <div className="terminal-line">
        <div className="terminal-output text-terminal-cyan">
          {typeof displayedContent === 'string'
            ? renderPlainContent(displayedContent)
            : renderFormattedOutput(displayedContent)}
        </div>
      </div>
    );
  }

  if (line.type === 'welcome') {
    return (
      <div className="terminal-line">
        <div className="text-terminal-cyan">
          {typeof displayedContent === 'string'
            ? renderPlainContent(displayedContent)
            : renderFormattedOutput(displayedContent)}
        </div>
      </div>
    );
  }

  // Default output type
  return (
    <div className="terminal-line">
      <div className="terminal-output">
        {typeof displayedContent === 'string'
          ? renderPlainContent(displayedContent)
          : renderFormattedOutput(displayedContent)}
      </div>
    </div>
  );
}
