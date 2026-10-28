require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const { createSlug } = require('./utils/slugify');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog_platform';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing users, posts, and comments.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create demo users
    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'alex@devblog.io',
        passwordHash,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Staff Software Architect & Full-Stack Engineer passionate about React, distributed systems, and elegant UI engineering.',
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@devblog.io',
        passwordHash,
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        bio: 'Senior Cloud & DevOps Engineer specializing in Kubernetes, microservices security, and backend scalability.',
      },
      {
        name: 'Maya Patel',
        email: 'maya@devblog.io',
        passwordHash,
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        bio: 'AI Researcher and UX Specialist exploring generative intelligence, ethical AI design, and human-computer interaction.',
      },
    ]);

    console.log(`Created ${users.length} demo users (Password: password123)`);

    const userMap = {
      alex: users[0],
      sarah: users[1],
      maya: users[2],
    };

    const postsData = [
      {
        author: userMap.alex._id,
        title: 'Mastering Modern Full-Stack Architecture in 2026',
        category: 'Technology',
        tags: ['fullstack', 'architecture', 'react', 'nodejs'],
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        content: `Building web applications in 2026 requires balancing agility, performance, and rock-solid resilience. Gone are the days when monolithic stacks were simply deployed without considering distributed state and reactive client interfaces.

## The Pillars of Modern Web Architecture

1. **Decoupled API Contracts**: Clear JSON/REST or GraphQL interfaces backed by strong schema validation.
2. **Stateless Authentication**: Leveraging cryptographically verified HTTP-only JWTs to eliminate persistent server session storage bottlenecks while guarding against XSS and CSRF.
3. **Resilient Data Pipelines**: Designing databases with proper compound indices, query optimization, and connection pooling.

### Writing Clean Services

When implementing your business logic, adhere to separation of concerns:
\`\`\`javascript
// Clean service pattern example
const createBlogPost = async (userId, postPayload) => {
  const sanitized = sanitizeInput(postPayload);
  const slug = await generateUniqueSlug(sanitized.title);
  return await Post.create({ ...sanitized, slug, author: userId });
};
\`\`\`

Always remember: premature optimization is the root of all evil, but bad architectural foundations are nearly impossible to retrofit.`,
      },
      {
        author: userMap.sarah._id,
        title: 'Deep Dive into Node.js Event Loop and High-Throughput APIs',
        category: 'Backend',
        tags: ['nodejs', 'backend', 'performance', 'api'],
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        content: `Node.js remains one of the premier runtime environments for high-concurrency microservices. However, unlocking its true throughput requires understanding how libuv orchestrates asynchronous I/O across tick phases.

### The Six Phases of the Event Loop
- **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
- **Pending callbacks**: Executes I/O callbacks deferred to the next loop iteration.
- **Idle, prepare**: Used internally by the runtime.
- **Poll**: Retrieves new I/O events; executes I/O related callbacks.
- **Check**: Invokes callbacks registered via \`setImmediate\`.
- **Close callbacks**: Emits socket close events.

### Best Practices for CPU-Intensive Tasks
Never block the single thread! When computing complex operations like cryptographic hashes, delegate to worker threads or background tasks. Keep your response latency under 50ms at the 99th percentile.`,
      },
      {
        author: userMap.maya._id,
        title: 'Designing Accessible, Editorial-Grade Interfaces with Tailwind CSS',
        category: 'Design',
        tags: ['design', 'css', 'ui', 'accessibility'],
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        content: `Typography and generous whitespace are the heartbeat of modern editorial platforms like Medium, The Atlantic, and Substack. When readers land on an article, cognitive fatigue should vanish.

### Essential Typography Rules
- **Line Length**: Keep line lengths between 45 to 75 characters per line for optimal scanning speed.
- **Line Height**: Use generous line heights (\`leading-relaxed\` or \`leading-loose\`) for body text.
- **Contrast Ratios**: Aim for WCAG AAA compliance (at least 7:1 for body copy).

Dark mode is not merely an inversion of black and white—it requires muted grays and tinted backgrounds that protect the reader's retinas while sustaining brand identity.`,
      },
      {
        author: userMap.alex._id,
        title: 'Building Scalable Real-time Data Pipelines: Lessons from Production',
        category: 'Cloud',
        tags: ['cloud', 'databases', 'mongodb', 'scaling'],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        content: `When scaling databases like MongoDB to handle millions of reads and writes per day, schema design and indexing strategy dictate everything.

### Common Indexing Pitfalls
1. Failing to index fields used in sorting operations.
2. Over-indexing, which drags down write throughput.
3. Not leveraging compound indices with equality, sort, and range rules.

Remember: Always run \`explain('executionStats')\` before pushing queries into production!`,
      },
      {
        author: userMap.sarah._id,
        title: 'Security Essentials: Defending MERN Applications Against Top Exploits',
        category: 'Security',
        tags: ['security', 'jwt', 'xss', 'owasp'],
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        status: 'published',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        content: `Security is not an afterthought—it must be baked into every layer of your application from day one.

### The Critical Safeguards
- **HTTP-Only Cookies**: Prevent JavaScript from touching session tokens, completely neutralizing standard token theft via XSS.
- **Content Sanitization**: Clean all Markdown and user HTML before storing or rendering with libraries like \`sanitize-html\`.
- **Rate Limiting**: Protect authentication endpoints against credential stuffing and brute-force attacks.
- **Helmet Headers**: Automatically establish Strict-Transport-Security, X-Frame-Options, and Content-Security-Policy.`,
      },
      {
        author: userMap.maya._id,
        title: 'Draft: The Future of Autonomous AI Agents in Software Engineering',
        category: 'AI',
        tags: ['ai', 'future', 'automation'],
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        status: 'draft',
        publishedAt: null,
        content: `Autonomous AI agents are transforming the landscape of modern programming. In this working draft, we analyze the transition from basic code completion to multi-agent orchestrated systems that can plan, execute, and verify complete full-stack applications.`,
      },
    ];

    const createdPosts = [];
    for (const postItem of postsData) {
      const slug = createSlug(postItem.title);
      const post = await Post.create({
        ...postItem,
        slug,
      });
      createdPosts.push(post);
    }
    console.log(`Created ${createdPosts.length} posts.`);

    // Add comments
    const commentsData = [
      {
        post: createdPosts[0]._id,
        author: userMap.sarah._id,
        content: 'Spot on article, Alex! The section on decoupled API contracts and stateless auth hits the nail on the head.',
      },
      {
        post: createdPosts[0]._id,
        author: userMap.maya._id,
        content: 'Loved the code snippet. Separating business logic into dedicated service layers makes unit testing so much simpler.',
      },
      {
        post: createdPosts[1]._id,
        author: userMap.alex._id,
        content: 'The breakdown of the 6 phases of the libuv event loop is the clearest explanation I have seen in a long time!',
      },
      {
        post: createdPosts[2]._id,
        author: userMap.alex._id,
        content: 'The typography rules are gold. I find that line length between 50 and 70 characters makes reading long-form tech posts effortless.',
      },
      {
        post: createdPosts[4]._id,
        author: userMap.maya._id,
        content: 'HTTP-only cookies are a must. So many tutorials still teach storing JWTs in localStorage without warning about XSS risks!',
      },
    ];

    await Comment.create(commentsData);
    console.log(`Created ${commentsData.length} comments.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
