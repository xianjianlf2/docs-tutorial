# 📝 Docs Tutorial - Building a Modern Document Editor

[简体中文](./README_zh.md) | English

> A complete tutorial project for building a Google Docs-style document editor from scratch

This project demonstrates how to build a fully-featured rich text document editor using modern web technologies, including real-time editing, tables, images, task lists, and more.

## ✨ Features

- 📄 **Rich Text Editing** - Powerful editor built with Tiptap
- 🛠️ **Rich Formatting Toolbar** - Complete toolbar with undo/redo, text styles, headings, and fonts
- ✅ **Task Lists** - Nested todo items support
- 📊 **Table Support** - Resizable tables
- 🖼️ **Image Handling** - Image insertion and drag-to-reorder
- 🎨 **Complete UI Component Library** - Built with Radix UI and Tailwind CSS
- 🔄 **State Management** - Zustand for efficient editor state management
- 📱 **Responsive Design** - Adapts to all device sizes
- 🖨️ **Print Optimization** - Specially optimized print styles

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React full-stack framework
- **Editor**: [Tiptap](https://tiptap.dev/) - Headless editor built on ProseMirror
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Notifications**: Sonner
- **Theming**: next-themes
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or higher
- npm / yarn / pnpm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/docs-tutorial.git
cd docs-tutorial

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

Visit [http://localhost:3000/documents/demo](http://localhost:3000/documents/demo) to see the editor demo.

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
docs-tutorial/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── documents/           # Document-related pages
│   │   │   └── [documentId]/   # Dynamic document routes
│   │   │       ├── editor.tsx   # Tiptap editor component
│   │   │       ├── toolbar.tsx  # Editor toolbar with formatting controls
│   │   │       └── page.tsx     # Document page layout
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   └── ui/                  # UI component library (shadcn/ui)
│   ├── hooks/                   # Custom hooks
│   ├── store/                   # Zustand stores
│   │   └── use-editor-store.ts # Editor state management
│   └── lib/                     # Utility functions
├── public/                      # Static assets
└── package.json
```

## 📚 Tutorial Steps

This project follows a step-by-step approach, with each development stage recorded in Git commit history:

### Phase 1: Project Initialization
- Initialize project with Create Next App
- Configure TypeScript and ESLint
- Set up Tailwind CSS

**Commit**: `chore: initial project setup from Create Next App`

### Phase 2: Component Library Setup
- Integrate Radix UI components
- Configure shadcn/ui
- Create base UI components

**Commit**: `feat: add initial component structure and dependencies`

### Phase 3: Editor Integration
- Integrate Tiptap core functionality
- Add StarterKit extensions
- Implement image, table, and task list extensions
- Optimize editor styles and print functionality

**Commit**: `feat: integrate Tiptap extensions for enhanced editing capabilities`

### Phase 4: Toolbar and State Management
- Build comprehensive formatting toolbar
- Implement Zustand state management
- Add text formatting controls (bold, italic, underline)
- Add heading level selector
- Add font family selector
- Add undo/redo functionality
- Add print and spell check features

**Commit**: `feat: add toolbar with formatting controls and state management`

### Coming Soon

- [ ] Font size selector
- [ ] Text color and highlight
- [ ] Link insertion and editing
- [ ] Collaborative editing
- [ ] Document persistence
- [ ] User authentication system
- [ ] Comments and annotations

## 🎯 Learning Objectives

Through this project, you will learn:

1. **Next.js App Router** usage and patterns
2. **Tiptap Editor** configuration and extension development
3. **React Component** design and best practices
4. **Zustand** state management implementation
5. **Tailwind CSS** advanced techniques
6. **TypeScript** in React projects
7. **Responsive Design** and print style optimization

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tiptap Documentation](https://tiptap.dev/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💬 Feedback & Support

For questions or suggestions:
- Submit an [Issue](https://github.com/your-username/docs-tutorial/issues)
- Start a [Discussion](https://github.com/your-username/docs-tutorial/discussions)
- Star the project for updates

---

⭐ If this project helps you, please consider giving it a star!
