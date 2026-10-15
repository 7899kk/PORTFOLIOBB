// Reference copy, retained to match the supplied video. Replace with the owner's details.
export const profile = {
  firstName: 'Sushmita',
  fullName: 'Sushmita Dasari',
  email: '',
  portrait: '', // e.g. /images/portrait.webp, once the owner supplies it
  heroFrames: [] as string[], // Ordered full-turn transparent portrait frames, front view first.
  introduction: 'A passionate Full-Stack Developer dedicated to crafting clean, functional, and highly scalable web applications. Specializing in high-performance architectures, intuitive user experiences, and robust backend pipelines.',
};

export const technologies = [
  'React.js', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap',
  'Node.js', 'Express.js', 'Java', 'Python', 'REST APIs', 'SQL', 'MySQL', 'MongoDB',
  'Git', 'Docker', 'NLP', 'Generative AI', 'LLMs', 'Computer Vision',
  'Prompt Engineering', 'Machine Learning', 'MCP', 'Agentic AI',
];

export const expertise = [
  { title: 'Frontend Development', text: 'Architecting responsive, high-performance UI components.', tag: 'React & Tailwind', code: ['const interface = {', '  responsive: true,', '  accessible: true,', '  performance: "first"', '};'] },
  { title: 'Backend Development', text: 'Building secure REST APIs and robust data pipelines.', tag: 'Node.js & Databases', code: ['router.get("/api",', '  authenticate,', '  validate,', '  handleRequest', ');'] },
  { title: 'AI & Machine Learning', text: 'Integrating intelligent models and automated workflows.', tag: 'Generative AI & LLMs', code: ['const intelligence =', '  await model.generate({', '    context,', '    prompt', '  });'] },
  { title: 'Cloud & Deployment', text: 'Containerized systems and seamless deployment.', tag: 'Docker & CI/CD', code: ['build:', '  test → package', '  container → deploy', 'status: healthy', 'uptime: continuous'] },
];

// Descriptive reference projects, not verified claims about the portfolio owner.
export const projects = [
  { title: 'API Gateway System', category: 'Finance & Security', description: 'A secure gateway architecture with centralized routing, authentication, and resilient request handling.', tags: ['Node.js', 'Express', 'Docker'], detail: 'A service-oriented gateway concept that brings authentication, route management, and request validation into a single entry point.' },
  { title: 'Multi-Tenant SaaS Platform', category: 'Full-Stack Architecture', description: 'Architected a containerized multi-tenant SaaS platform enforcing strict tenant data isolation and secure schema routing.', tags: ['Node.js', 'MongoDB', 'Docker', 'Express'], detail: 'A multi-tenant platform concept built around isolated tenant data, reusable application services, and containerized deployment.' },
  { title: 'Productivity Suite Extension', category: 'Client Automation', description: 'Developed a custom Chrome extension using JavaScript and Chrome APIs to manage tasks and boost daily workflow efficiency.', tags: ['JavaScript', 'Chrome APIs', 'Tailwind CSS'], detail: 'A browser extension concept that keeps everyday tasks and quick actions within reach, using native browser APIs and a compact interface.' },
];
