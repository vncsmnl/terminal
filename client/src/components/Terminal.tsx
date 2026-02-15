import React, { useState, useRef, useEffect } from 'react';
import { getCommandOutput } from '@/lib/commands';
import { TerminalOutput } from './TerminalOutput';
import type { FormattedOutput } from '@/lib/formatting';

// Typing animation speed in milliseconds per character
// Lower values = faster typing (1-3ms for fast, realistic typing)
const TYPING_SPEED_MS = 2;

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info' | 'welcome';
  content: string | FormattedOutput;
  command?: string;
  displayedContent?: string | FormattedOutput;
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
  const renderOutputLine = async (lineId: string, content: string | FormattedOutput, type: 'output' | 'error' | 'info') => {
    // For FormattedOutput (array of segments), render character by character through segments
    if (Array.isArray(content)) {
      let displayedSegments: FormattedOutput = [];
      let currentSegmentIndex = 0;
      let currentCharIndex = 0;

      while (currentSegmentIndex < content.length) {
        const currentSegment = content[currentSegmentIndex];
        const segmentText = currentSegment.text;

        // If we're starting a new segment, add it with empty text
        if (currentCharIndex === 0) {
          displayedSegments.push({
            ...currentSegment,
            text: '',
          });
        }

        // Add one character at a time to the current segment
        if (currentCharIndex < segmentText.length) {
          displayedSegments[displayedSegments.length - 1].text += segmentText[currentCharIndex];
          currentCharIndex++;

          // Update the displayed content
          setLines(prevLines => {
            const updatedLines = [...prevLines];
            const lineIndex = updatedLines.findIndex(l => l.id === lineId);
            if (lineIndex !== -1) {
              updatedLines[lineIndex].displayedContent = [...displayedSegments];
            }
            return updatedLines;
          });

          // Typing delay for realistic effect
          await new Promise(resolve => setTimeout(resolve, TYPING_SPEED_MS));
        }

        // Move to next segment when current is complete
        if (currentCharIndex >= segmentText.length) {
          currentSegmentIndex++;
          currentCharIndex = 0;
        }
      }

      // Mark as complete
      setLines(prevLines => {
        const updatedLines = [...prevLines];
        const lineIndex = updatedLines.findIndex(l => l.id === lineId);
        if (lineIndex !== -1) {
          updatedLines[lineIndex].isComplete = true;
        }
        return updatedLines;
      });
      return;
    }

    // For string content, render character by character
    let displayedContent = '';
    const contentStr = content as string;

    for (let i = 0; i < contentStr.length; i++) {
      displayedContent += contentStr[i];

      setLines(prevLines => {
        const updatedLines = [...prevLines];
        const lineIndex = updatedLines.findIndex(l => l.id === lineId);
        if (lineIndex !== -1) {
          updatedLines[lineIndex].displayedContent = displayedContent;
        }
        return updatedLines;
      });

      // Typing delay for realistic effect
      await new Promise(resolve => setTimeout(resolve, TYPING_SPEED_MS));
    }

    // Mark as complete
    setLines(prevLines => {
      const updatedLines = [...prevLines];
      const lineIndex = updatedLines.findIndex(l => l.id === lineId);
      if (lineIndex !== -1) {
        updatedLines[lineIndex].isComplete = true;
      }
      return updatedLines;
    });
  };

  const handleCommand = async (command: string) => {
    if (!command.trim() || isProcessing) return;

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
    return 'guest@user';
  };

  return (
    <div className="terminal-container">
      {/* Content area */}
      <div className="terminal-content" ref={contentRef}>
        {lines.map((line) => (
          <TerminalOutput key={line.id} line={line} />
        ))}

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
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
