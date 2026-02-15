/**
 * Command System for Terminal Portfolio
 * 
 * Design Philosophy:
 * - Modular command structure for easy extension
 * - Async support for future API integrations
 * - Consistent output formatting with colors
 * - Error handling with descriptive messages
 */

interface CommandOutput {
  content: string;
  error: boolean;
}

const PORTFOLIO_DATA = {
  name: 'Vinícius Manoel Ribeiro',
  email: 'viniciusmanoel@duck.com',
  about: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    ABOUT ME                                ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]I'm a passionate full-stack developer with expertise in modern
web technologies. I love creating elegant solutions to complex
problems and building beautiful, performant applications.[/WHITE]

[CYAN]Skills:[/CYAN] [WHITE]React, TypeScript, Node.js, Python, DevOps[/WHITE]
[CYAN]Location:[/CYAN] [WHITE]São Paulo, Brazil[/WHITE]
  `,
  social: {
    github: 'https://github.com/vncsmnl',
    linkedin: 'https://linkedin.com/in/vncsmnl',
    twitter: 'https://twitter.com/vncsmnl',
    portfolio: 'https://vini.thedev.id/',
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
    const helpText = `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    AVAILABLE COMMANDS                      ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[CYAN]about[/CYAN]        [WHITE]- Learn about me[/WHITE]
[CYAN]blog[/CYAN]         [WHITE]- View my blog posts[/WHITE]
[CYAN]social[/CYAN]       [WHITE]- Display social network links[/WHITE]
[CYAN]projects[/CYAN]     [WHITE]- View my coding projects[/WHITE]
[CYAN]stack[/CYAN]        [WHITE]- View my current tech stack[/WHITE]
[CYAN]videos[/CYAN]       [WHITE]- View my YouTube videos[/WHITE]
[CYAN]podcasts[/CYAN]     [WHITE]- View my Spotify podcast episodes[/WHITE]
[CYAN]resume[/CYAN]       [WHITE]- Get my online resume link[/WHITE]
[CYAN]history[/CYAN]      [WHITE]- View command history[/WHITE]
[CYAN]email[/CYAN]        [WHITE]- See my email address[/WHITE]
[CYAN]clear[/CYAN]        [WHITE]- Clear terminal screen[/WHITE]
[CYAN]reload[/CYAN]       [WHITE]- Reload page and clear history[/WHITE]
[CYAN]help[/CYAN]         [WHITE]- Show this help message[/WHITE]

[WHITE]Type any command to execute it.[/WHITE]
    `;
    return { content: helpText, error: false };
  },

  about: async () => {
    return { content: PORTFOLIO_DATA.about, error: false };
  },

  email: async () => {
    return {
      content: `[CYAN]📧 Email:[/CYAN] [MAGENTA]${PORTFOLIO_DATA.email}[/MAGENTA]`,
      error: false,
    };
  },

  social: async () => {
    const socialText = `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    SOCIAL NETWORKS                         ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[CYAN]GitHub:[/CYAN]      [MAGENTA]${PORTFOLIO_DATA.social.github}[/MAGENTA]
[CYAN]LinkedIn:[/CYAN]    [MAGENTA]${PORTFOLIO_DATA.social.linkedin}[/MAGENTA]
[CYAN]Twitter:[/CYAN]     [MAGENTA]${PORTFOLIO_DATA.social.twitter}[/MAGENTA]
[CYAN]Portfolio:[/CYAN]   [MAGENTA]${PORTFOLIO_DATA.social.portfolio}[/MAGENTA]
    `;
    return { content: socialText, error: false };
  },

  projects: async () => {
    let projectText = `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    MY PROJECTS                             ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]
`;
    PORTFOLIO_DATA.projects.forEach((project, idx) => {
      projectText += `
[CYAN][${idx + 1}] ${project.name}[/CYAN]
[WHITE]    ${project.description}[/WHITE]
[MAGENTA]    Link: ${project.link}[/MAGENTA]
`;
    });
    return { content: projectText, error: false };
  },

  stack: async () => {
    let stackText = `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    TECH STACK                              ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]
`;
    PORTFOLIO_DATA.stack.forEach((item) => {
      stackText += `
[CYAN]▸ ${item.category}:[/CYAN] [WHITE]${item.tech}[/WHITE]`;
    });
    return { content: stackText, error: false };
  },

  blog: async () => {
    return {
      content: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    MY BLOG                                 ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]Coming soon! Check back later for articles about web
development, best practices, and tech insights.[/WHITE]

[CYAN]Blog:[/CYAN] [MAGENTA]https://vini.thedev.id/blog/[/MAGENTA]
      `,
      error: false,
    };
  },

  videos: async () => {
    return {
      content: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    YOUTUBE VIDEOS                          ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]Coming soon! Subscribe to my channel for tutorials and
tech content.[/WHITE]

[CYAN]YouTube:[/CYAN] [MAGENTA]https://youtube.com/@vncsmnl[/MAGENTA]
      `,
      error: false,
    };
  },

  podcasts: async () => {
    return {
      content: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    SPOTIFY PODCASTS                        ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]Coming soon! Listen to my podcast episodes on Spotify.[/WHITE]

[CYAN]Spotify:[/CYAN] [MAGENTA]https://spotify.com/vncsmnl[/MAGENTA]
      `,
      error: false,
    };
  },

  resume: async () => {
    return {
      content: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    RESUME                                  ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]Download my resume:[/WHITE] [MAGENTA]${PORTFOLIO_DATA.resume}[/MAGENTA]

[WHITE]Or view it online at:[/WHITE] [MAGENTA]https://vini.thedev.id[/MAGENTA]
      `,
      error: false,
    };
  },

  history: async () => {
    return {
      content: `
[CYAN]╔════════════════════════════════════════════════════════════╗[/CYAN]
[CYAN]║                    COMMAND HISTORY                         ║[/CYAN]
[CYAN]╚════════════════════════════════════════════════════════════╝[/CYAN]

[WHITE]Use arrow keys (↑ ↓) to navigate through command history.[/WHITE]
      `,
      error: false,
    };
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
        content: `[ERROR]Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}[/ERROR]`,
        error: true,
      };
    }
  }

  // Unknown command
  return {
    content: `[ERROR]Command not found: ${command}. Type "help" for available commands.[/ERROR]`,
    error: true,
  };
}
