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
    description: `I'm a PhD student in Computer Science, specializing in Biotechnology 
    with expertise in modern technologies. I love creating elegant solutions to complex
    problems and building beautiful, performant applications.`,
    skills: 'Python, C++, Rust, JavaScript, Go, Ruby',
    location: 'Brasília, Brazil',
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
      name: 'astar_msa_rust',
      description: 'PA-Star is a software that performs a parallel A-Star search to solve the Multiple Sequence Alignment (MSA) problem.',
      link: 'https://github.com/vncsmnl/astar_msa_rust',
    },
    {
      name: 'pa-star-rv',
      description: 'An interactive 3D visualization tool for analyzing execution logs from the PA-Star (Parallel A-Star) algorithm applied to the Multiple Sequence Alignment (MSA) problem.',
      link: 'https://github.com/vncsmnl/pa-star-rv',
    },
    {
      name: 'msa_app',
      description: 'A web-based interface for running Multiple Sequence Alignment (MSA) using A-Star and PA-Star algorithms.',
      link: 'https://github.com/vncsmnl/msa_app',
    },
  ],
  stack: [
    { category: 'Frontend', tech: 'React, TypeScript, Tailwind CSS' },
    { category: 'Backend', tech: 'Node.js, Bun, FastAPI, Flask' },
    { category: 'Frameworks', tech: 'LangChain, CrewAI, OpenAI API, Hugging Face' },
    { category: 'Database', tech: 'PostgreSQL, SQLite, FAISS' },
    { category: 'DevOps', tech: 'Docker, GitHub Actions, AWS, Kubernetes' },
    { category: 'Tools', tech: 'Git, Latex, Ollama, ' },
  ],
  resume: 'https://vinicius.is-a.dev/cv/pdf',
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
        text.primary('sudo        ', true),
        text.default('- Execute a command as another user\n'),
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
        text.default('Check my articles about web\n'),
        text.default('development, best practices, and tech insights.\n\n'),
      ],
      createLink('Blog:', 'https://vini.thedev.id/blog/')
    );
    return { content: output, error: false };
  },

  videos: async () => {
    const output = combine(
      createHeader('YOUTUBE VIDEOS'),
      [
        text.default('Subscribe to my channel for tutorials and\n'),
        text.default('tech content.\n\n'),
      ],
      createLink('YouTube:', 'https://youtube.com/@vncsmnl')
    );
    return { content: output, error: false };
  },

  podcasts: async () => {
    const output = combine(
      createHeader('SPOTIFY PODCASTS'),
      [
        text.default('Coming soon! Listen to my podcast episodes on Spotify.\n\n'),
      ],
      createLink('Spotify:', 'https://spotify.com/vncsmnl')
    );
    return { content: output, error: false };
  },

  resume: async () => {
    const output = combine(
      createHeader('RESUME'),
      createLink('Download:', PORTFOLIO_DATA.resume),
      createLink('View online:', 'https://vinicius.is-a.dev/cv/')
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

  sudo: async (args: string[]) => {
    const packages = [
      'react', 'typescript', 'vite', 'tailwindcss', 'nodejs', 'npm', 'webpack',
      'babel', 'eslint', 'prettier', 'jest', 'cypress', 'docker', 'kubernetes',
      'postgresql', 'mongodb', 'redis', 'nginx', 'apache', 'git', 'github-cli',
      'python', 'pip', 'django', 'flask', 'fastapi', 'express', 'nestjs',
      'nextjs', 'gatsby', 'nuxt', 'vue', 'angular', 'svelte', 'solid',
      'prisma', 'graphql', 'apollo', 'trpc', 'zod', 'yup', 'formik',
      'axios', 'fetch', 'websocket', 'socket.io', 'webrtc', 'pwa',
      'electron', 'tauri', 'capacitor', 'react-native', 'expo', 'flutter',
    ];

    // Generate random fake update output
    const generateUpdateLines = () => {
      const lines: FormattedOutput = [];
      const numPackages = Math.floor(Math.random() * 8) + 5; // 5-12 packages

      for (let i = 0; i < numPackages; i++) {
        const pkg = packages[Math.floor(Math.random() * packages.length)];
        const oldVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 10)}`;
        const newVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 10)}`;
        const size = Math.floor(Math.random() * 500) + 50;

        lines.push(
          text.default('Get:' + (i + 1) + ' '),
          text.accent('stable/main ', true),
          text.default(pkg + ' '),
          text.muted(oldVersion + ' -> '),
          text.primary(newVersion, true),
          text.default(' [' + size + ' kB]\n')
        );
      }

      const totalSize = Math.floor(Math.random() * 5000) + 1000;
      const speed = Math.floor(Math.random() * 3000) + 500;
      const time = Math.floor(totalSize / speed);

      lines.push(
        text.default('\nFetched '),
        text.primary(totalSize + ' kB', true),
        text.default(' in '),
        text.accent(time + 's', true),
        text.default(' ('),
        text.secondary(speed + ' kB/s'),
        text.default(')\n\n')
      );

      lines.push(
        text.default('Reading package lists... '),
        text.accent('Done\n', true)
      );

      lines.push(
        text.default('Building dependency tree... '),
        text.accent('Done\n', true)
      );

      lines.push(
        text.default('Reading state information... '),
        text.accent('Done\n', true)
      );

      lines.push(
        text.accent('\n✓ All packages are up to date!\n', true)
      );

      return lines;
    };

    // Detect if it's an update command
    const fullCommand = args.join(' ').toLowerCase();
    const isUpdateCommand =
      fullCommand.includes('update') ||
      fullCommand.includes('upgrade') ||
      fullCommand.includes('install') ||
      args.length === 0;

    if (isUpdateCommand) {
      const output = combine(
        [text.primary('[sudo] ', true), text.default('password for user: ')],
        [text.muted('***************\n\n')],
        [text.accent('Reading package lists... Done\n', true)],
        [text.default('Building dependency tree\n')],
        [text.default('Reading state information... Done\n\n')],
        generateUpdateLines()
      );

      return { content: output, error: false };
    } else {
      return {
        content: [
          text.primary('[sudo] ', true),
          text.default('password for user: '),
          text.muted('***************\n\n'),
          text.error(`sudo: ${args[0]}: command not found\n`),
        ],
        error: false,
      };
    }
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
