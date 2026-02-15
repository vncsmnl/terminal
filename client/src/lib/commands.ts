/**
 * Command System for Terminal Portfolio
 * 
 * Design Philosophy:
 * - Modular command structure for easy extension
 * - Async support for future API integrations
 * - Hyper theme colors and formatting
 * - Error handling with descriptive messages
 */

import { create } from 'domain';
import {
  type FormattedOutput,
  text,
  createHeader,
  createEntry,
  createLink,
  createListItem,
  createBullet,
  combine,
} from './formatting';

interface CommandOutput {
  content: string | FormattedOutput;
  error: boolean;
}

const PORTFOLIO_DATA = {
  name: 'Vinícius Manoel Ribeiro',
  email: 'viniciusmanoel@duck.com',
  about: {
    description: `I'm a passionate full-stack developer with expertise in modern
web technologies. I love creating elegant solutions to complex
problems and building beautiful, performant applications.`,
    skills: 'React, TypeScript, Node.js, Python, DevOps',
    location: 'São Paulo, Brazil',
  },
  social: {
    github: 'https://github.com/vncsmnl',
    linkedin: 'https://linkedin.com/in/vncsmnl',
    twitter: 'https://twitter.com/vncsmnl',
    portfolio: 'https://vini.thedev.id/',
    linktree: 'https://vinicius.is-a.dev/',
  },
  projects: [
    {
      name: 'Project Alpha',
      description: 'A real-time collaboration platform built with React and WebSockets',
      link: 'https://github.com/yourusername/project-alpha',
    },
    {
      name: 'Project Beta',
      description: 'Machine learning model deployment dashboard using FastAPI',
      link: 'https://github.com/yourusername/project-beta',
    },
    {
      name: 'Project Gamma',
      description: 'Mobile app for task management with offline-first architecture',
      link: 'https://github.com/yourusername/project-gamma',
    },
  ],
  stack: [
    { category: 'Frontend', tech: 'React 19, TypeScript, Tailwind CSS, Framer Motion' },
    { category: 'Backend', tech: 'Node.js, Express, FastAPI, Python' },
    { category: 'Database', tech: 'PostgreSQL, MongoDB, Redis' },
    { category: 'DevOps', tech: 'Docker, GitHub Actions, AWS, Vercel' },
    { category: 'Tools', tech: 'Git, VS Code, Figma, Postman' },
  ],
  resume: 'https://vinicius.is-a.dev/cv/',
};

const commands: Record<string, (args: string[]) => Promise<CommandOutput>> = {
  help: async () => {
    const output = combine(
      createHeader('AVAILABLE COMMANDS'),
      [
        text.primary('about       ', true),
        text.default('- Learn about me\n'),
        text.primary('blog        ', true),
        text.default('- View my blog posts\n'),
        text.primary('social      ', true),
        text.default('- Display social network links\n'),
        text.primary('projects    ', true),
        text.default('- View my coding projects\n'),
        text.primary('stack       ', true),
        text.default('- View my current tech stack\n'),
        text.primary('videos      ', true),
        text.default('- View my YouTube videos\n'),
        text.primary('podcasts    ', true),
        text.default('- View my Spotify podcast episodes\n'),
        text.primary('resume      ', true),
        text.default('- Get my online resume link\n'),
        text.primary('history     ', true),
        text.default('- View command history\n'),
        text.primary('email       ', true),
        text.default('- See my email address\n'),
        text.primary('clear       ', true),
        text.default('- Clear terminal screen\n'),
        text.primary('reload      ', true),
        text.default('- Reload page and clear history\n'),
        text.primary('help        ', true),
        text.default('- Show this help message\n'),
        text.default('\n'),
        text.muted('Type any command to execute it.\n'),
      ]
    );
    return { content: output, error: false };
  },

  about: async () => {
    const output = combine(
      createHeader('ABOUT ME'),
      [
        text.default(PORTFOLIO_DATA.about.description + '\n\n'),
        text.primary('Skills: ', true),
        text.accent(PORTFOLIO_DATA.about.skills + '\n'),
        text.primary('Location: ', true),
        text.default(PORTFOLIO_DATA.about.location + '\n'),
      ]
    );
    return { content: output, error: false };
  },

  email: async () => {
    const output = [
      text.primary('📧 Email: ', true),
      text.secondary(PORTFOLIO_DATA.email),
      text.default('\n'),
    ];
    return { content: output, error: false };
  },

  social: async () => {
    const output = combine(
      createHeader('SOCIAL NETWORKS'),
      createLink('GitHub:', PORTFOLIO_DATA.social.github),
      createLink('LinkedIn:', PORTFOLIO_DATA.social.linkedin),
      createLink('Twitter:', PORTFOLIO_DATA.social.twitter),
      createLink('Portfolio:', PORTFOLIO_DATA.social.portfolio),
      createLink('Linktree:', PORTFOLIO_DATA.social.linktree)
    );
    return { content: output, error: false };
  },

  projects: async () => {
    const projectItems = PORTFOLIO_DATA.projects.flatMap((project, idx) =>
      createListItem(idx + 1, project.name, project.description, project.link)
    );

    const output = combine(
      createHeader('MY PROJECTS'),
      projectItems
    );
    return { content: output, error: false };
  },

  stack: async () => {
    const stackItems = PORTFOLIO_DATA.stack.flatMap((item) =>
      createBullet(item.category, item.tech)
    );

    const output = combine(
      createHeader('TECH STACK'),
      stackItems
    );
    return { content: output, error: false };
  },

  blog: async () => {
    const output = combine(
      createHeader('MY BLOG'),
      [
        text.default('Coming soon! Check back later for articles about web\n'),
        text.default('development, best practices, and tech insights.\n\n'),
        text.primary('Blog: ', true),
        text.secondary('https://vini.thedev.id/blog/\n'),
      ]
    );
    return { content: output, error: false };
  },

  videos: async () => {
    const output = combine(
      createHeader('YOUTUBE VIDEOS'),
      [
        text.default('Coming soon! Subscribe to my channel for tutorials and\n'),
        text.default('tech content.\n\n'),
        text.primary('YouTube: ', true),
        text.secondary('https://youtube.com/@vncsmnl\n'),
      ]
    );
    return { content: output, error: false };
  },

  podcasts: async () => {
    const output = combine(
      createHeader('SPOTIFY PODCASTS'),
      [
        text.default('Coming soon! Listen to my podcast episodes on Spotify.\n\n'),
        text.primary('Spotify: ', true),
        text.secondary('https://spotify.com/vncsmnl\n'),
      ]
    );
    return { content: output, error: false };
  },

  resume: async () => {
    const output = combine(
      createHeader('RESUME'),
      [
        text.primary('Download my resume: ', true),
        text.secondary(PORTFOLIO_DATA.resume + '\n\n'),
        text.primary('Or view it online at: ', true),
        text.secondary('https://vini.thedev.id\n'),
      ]
    );
    return { content: output, error: false };
  },

  history: async () => {
    const output = combine(
      createHeader('COMMAND HISTORY'),
      [
        text.default('Use arrow keys '),
        text.primary('(↑ ↓)', true),
        text.default(' to navigate through command history.\n'),
      ]
    );
    return { content: output, error: false };
  },

  clear: async () => {
    // This command is handled specially in the Terminal component
    return { content: 'CLEAR', error: false };
  },

  reload: async () => {
    // This command is handled specially in the Terminal component
    return { content: 'RELOAD', error: false };
  },
};

export async function getCommandOutput(input: string): Promise<CommandOutput> {
  const trimmed = input.trim().toLowerCase();
  const [command, ...args] = trimmed.split(' ');

  // Handle special commands
  if (command === 'clear') {
    return { content: 'CLEAR', error: false };
  }

  if (command === 'reload') {
    return { content: 'RELOAD', error: false };
  }

  // Execute command
  if (command in commands) {
    try {
      return await commands[command](args);
    } catch (error) {
      return {
        content: [
          text.error('Error executing command: '),
          text.error(error instanceof Error ? error.message : 'Unknown error'),
          text.default('\n'),
        ],
        error: true,
      };
    }
  }

  // Unknown command
  return {
    content: [
      text.error(`Command not found: ${command}. `),
      text.default('Type '),
      text.primary('help', true),
      text.default(' for available commands.\n'),
    ],
    error: true,
  };
}
