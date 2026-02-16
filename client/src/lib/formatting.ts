/**
 * Terminal Formatting System - Hyper Theme
 * 
 * Object-based formatting system for terminal output
 * Inspired by Hyper Terminal aesthetics with vibrant colors
 */

export type TerminalColor =
  | 'primary'    // Bright cyan (#00D9FF) - titles, headers
  | 'secondary'  // Bright magenta (#FF2E88) - links, highlights  
  | 'accent'     // Bright green (#50FA7B) - success messages
  | 'warning'    // Bright yellow (#F1FA8C) - warnings
  | 'error'      // Bright red (#FF5555) - errors
  | 'muted'      // Gray (#6272A4) - comments, subtle text
  | 'default';   // White (#F8F8F2) - default text

export interface TextSegment {
  text: string;
  color?: TerminalColor;
  bold?: boolean;
  url?: string;
}

export type FormattedOutput = TextSegment[];

/**
 * Hyper Theme Color Helpers
 */
export const text = {
  /** Bright cyan - for titles and headers */
  primary: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'primary',
    bold
  }),

  /** Bright magenta - for links and highlights */
  secondary: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'secondary',
    bold
  }),

  /** Bright green - for success messages */
  accent: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'accent',
    bold
  }),

  /** Bright yellow - for warnings */
  warning: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'warning',
    bold
  }),

  /** Bright red - for errors */
  error: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'error',
    bold
  }),

  /** Gray - for muted text */
  muted: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'muted',
    bold
  }),

  /** White - default text color */
  default: (str: string, bold = false): TextSegment => ({
    text: str,
    color: 'default',
    bold
  }),
};

/**
 * Convert FormattedOutput to plain string for display
 */
export function formatToString(output: FormattedOutput): string {
  return output.map(segment => segment.text).join('');
}

/**
 * Create a simple header
 */
export function createHeader(title: string): FormattedOutput {
  return [
    text.primary(title.toUpperCase(), true),
    text.default('\n\n'),
  ];
}

/**
 * Create a labeled entry (key: value)
 */
export function createEntry(label: string, value: string, valueColor: TerminalColor = 'default'): FormattedOutput {
  return [
    text.primary(label + ': ', true),
    { text: value, color: valueColor },
    text.default('\n'),
  ];
}

/**
 * Create a link entry
 */
export function createLink(label: string, url: string): FormattedOutput {
  return [
    text.primary(label.padEnd(14)),
    { text: url, color: 'secondary', url },
    text.default('\n'),
  ];
}

/**
 * Create a numbered list item
 */
export function createListItem(
  number: number,
  title: string,
  description?: string,
  link?: string
): FormattedOutput {
  const output: FormattedOutput = [
    text.default('\n'),
    text.primary(`[${number}] `, true),
    text.primary(title, true),
    text.default('\n'),
  ];

  if (description) {
    output.push(text.muted('    ' + description));
    output.push(text.default('\n'));
  }

  if (link) {
    output.push(text.muted('    🔗 '));
    output.push({ text: link, color: 'secondary', url: link });
    output.push(text.default('\n'));
  }

  return output;
}

/**
 * Create a bullet point item
 */
export function createBullet(label: string, value: string): FormattedOutput {
  return [
    text.primary('  ▸ ' + label + ': ', true),
    text.default(value),
    text.default('\n'),
  ];
}

/**
 * Combine multiple formatted outputs
 */
export function combine(...outputs: FormattedOutput[]): FormattedOutput {
  return outputs.flat();
}
