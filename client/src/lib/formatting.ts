/**
 * Terminal Formatting System
 * 
 * Provides colored output formatting for terminal commands
 * Colors follow Hyper theme: cyan for titles, magenta for links, white for descriptions
 */

export interface FormattedLine {
  text: string;
  color?: 'cyan' | 'magenta' | 'white' | 'error' | 'success';
}

export interface FormattedOutput {
  lines: FormattedLine[];
}

/**
 * Parse formatted output with color codes
 * Format: [COLOR]text[/COLOR] or use helper functions below
 */
export function parseColoredOutput(text: string): FormattedLine[] {
  const lines = text.split('\n');
  return lines.map(line => {
    // Check for color codes
    const cyanMatch = line.match(/\[CYAN\](.*?)\[\/CYAN\]/);
    const magentaMatch = line.match(/\[MAGENTA\](.*?)\[\/MAGENTA\]/);
    const whiteMatch = line.match(/\[WHITE\](.*?)\[\/WHITE\]/);
    const errorMatch = line.match(/\[ERROR\](.*?)\[\/ERROR\]/);
    const successMatch = line.match(/\[SUCCESS\](.*?)\[\/SUCCESS\]/);

    if (cyanMatch) {
      return { text: cyanMatch[1], color: 'cyan' };
    } else if (magentaMatch) {
      return { text: magentaMatch[1], color: 'magenta' };
    } else if (whiteMatch) {
      return { text: whiteMatch[1], color: 'white' };
    } else if (errorMatch) {
      return { text: errorMatch[1], color: 'error' };
    } else if (successMatch) {
      return { text: successMatch[1], color: 'success' };
    }

    return { text: line, color: 'white' };
  });
}

/**
 * Helper functions for creating colored output
 */
export const format = {
  title: (text: string) => `[CYAN]${text}[/CYAN]`,
  link: (text: string) => `[MAGENTA]${text}[/MAGENTA]`,
  description: (text: string) => `[WHITE]${text}[/WHITE]`,
  error: (text: string) => `[ERROR]${text}[/ERROR]`,
  success: (text: string) => `[SUCCESS]${text}[/SUCCESS]`,
};

/**
 * Create a formatted section with title and content
 */
export function createSection(title: string, content: string[]): string {
  const lines = [
    format.title(`╔════════════════════════════════════════════════════════════╗`),
    format.title(`║ ${title.padEnd(58)} ║`),
    format.title(`╚════════════════════════════════════════════════════════════╝`),
    ...content,
  ];
  return lines.join('\n');
}

/**
 * Create a formatted project entry
 */
export function createProjectEntry(
  number: number,
  name: string,
  description: string,
  link: string
): string {
  return [
    format.title(`[${number}] ${name}`),
    format.description(`    ${description}`),
    format.link(`    Link: ${link}`),
  ].join('\n');
}

/**
 * Create a formatted tech stack entry
 */
export function createTechEntry(category: string, technologies: string): string {
  return format.description(`▸ ${category}: ${technologies}`);
}

/**
 * Create a formatted social link entry
 */
export function createSocialEntry(platform: string, url: string): string {
  return [
    format.title(`${platform.padEnd(12)}`),
    format.link(`${url}`),
  ].join(' ');
}
