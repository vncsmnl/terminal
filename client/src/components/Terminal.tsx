import React, { useState, useRef, useEffect } from 'react';
import { getCommandOutput } from '@/lib/commands';
import { parseColoredOutput } from '@/lib/formatting';
import { TerminalOutput } from './TerminalOutput';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'welcome';
  content: string;
  command?: string;
  displayedContent?: string;
  isComplete?: boolean;
}

/**
 * Terminal Component - Main interactive terminal interface
 * 
 * Design Philosophy (Hyper Theme):
 * - Authentic terminal emulation with character-by-character rendering
 * - Smooth animations and transitions
 * - Command history navigation
 * - Real-time output streaming
 */
export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'welcome',
      content: 'Welcome to Terminal Portfolio, the friendly interactive shell',
      displayedContent: 'Welcome to Terminal Portfolio, the friendly interactive shell',
      isComplete: true,
    },
    {
      id: '2',
      type: 'welcome',
      content: 'Type help for instructions on how to use this terminal',
      displayedContent: 'Type help for instructions on how to use this terminal',
      isComplete: true,
    },
  ]);

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollTo(0, contentRef.current.scrollHeight);
      }, 0);
    }
  }, [lines]);

  // Render output character by character
  const renderOutputLine = async (lineId: string, content: string, type: 'output' | 'error' | 'info') => {
    const lines_copy = [...lines];
    const lineIndex = lines_copy.findIndex(l => l.id === lineId);

    if (lineIndex === -1) return;

    // Split content into lines for proper rendering
    const contentLines = content.split('\n');

    for (let lineNum = 0; lineNum < contentLines.length; lineNum++) {
      const currentLine = contentLines[lineNum];
      const targetLineId = lineNum === 0 ? lineId : `${lineId}-${lineNum}`;
      const targetLineIndex = lineNum === 0 ? lineIndex : lines_copy.length - 1;

      // Add new line to lines array if this is not the first line
      if (lineNum > 0) {
        lines_copy.push({
          id: targetLineId,
          type,
          content: currentLine,
          displayedContent: '',
          isComplete: false,
        });
        setLines([...lines_copy]);
      }

      // Render character by character for current line
      let lineDisplayedContent = '';
      for (let i = 0; i < currentLine.length; i++) {
        lineDisplayedContent += currentLine[i];

        // Update the appropriate line
        const updatedLineIndex = lines_copy.findIndex(l => l.id === targetLineId);

        if (updatedLineIndex !== -1) {
          lines_copy[updatedLineIndex].displayedContent = lineDisplayedContent;
          setLines([...lines_copy]);
        }

        // Small delay between characters for typing effect
        await new Promise(resolve => setTimeout(resolve, 15));
      }

      // Mark line as complete
      const completedLineIndex = lines_copy.findIndex(l => l.id === targetLineId);
      if (completedLineIndex !== -1) {
        lines_copy[completedLineIndex].isComplete = true;
        setLines([...lines_copy]);
      }
    }
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add command to history
    setHistory([...history, command]);
    setHistoryIndex(-1);

    // Display command
    const commandId = Date.now().toString();
    const commandLine: TerminalLine = {
      id: commandId,
      type: 'command',
      content: command,
      displayedContent: command,
      isComplete: true,
    };

    setLines(prev => [...prev, commandLine]);
    setInput('');
    setIsProcessing(true);

    try {
      // Get command output
      const result = await getCommandOutput(command);

      // Handle special commands
      if (result.content === 'CLEAR') {
        setLines([
          {
            id: '1',
            type: 'welcome',
            content: 'Welcome to Terminal Portfolio, the friendly interactive shell',
            displayedContent: 'Welcome to Terminal Portfolio, the friendly interactive shell',
            isComplete: true,
          },
          {
            id: '2',
            type: 'welcome',
            content: 'Type help for instructions on how to use this terminal',
            displayedContent: 'Type help for instructions on how to use this terminal',
            isComplete: true,
          },
        ]);
        setHistory([]);
        setHistoryIndex(-1);
      } else if (result.content === 'RELOAD') {
        window.location.reload();
      } else {
        // Add output line
        const outputId = `output-${Date.now()}`;
        const outputType = result.error ? 'error' : 'output';

        setLines(prev => [
          ...prev,
          {
            id: outputId,
            type: outputType,
            content: result.content,
            displayedContent: '',
            isComplete: false,
          },
        ]);

        // Render output character by character
        await renderOutputLine(outputId, result.content, outputType);
      }
    } catch (error) {
      console.error('Command error:', error);
      setLines(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'error',
          content: 'An error occurred while executing the command.',
          displayedContent: 'An error occurred while executing the command.',
          isComplete: true,
        },
      ]);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getUserInfo = () => {
    return 'vinic@vncsmnl';
  };

  return (
    <div className="terminal-container">
      {/* Content area */}
      <div className="terminal-content" ref={contentRef}>
        {lines.map((line) => (
          <TerminalOutput key={line.id} line={line} />
        ))}
      </div>

      {/* Input area */}
      <div className="terminal-input-wrapper">
        <span className="terminal-prompt">{getUserInfo()} ~{'>'}  </span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          autoFocus
        />
      </div>
    </div>
  );
}
