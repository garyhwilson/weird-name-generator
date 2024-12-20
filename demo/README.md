## Demo Application

The package includes a full-featured demo application that showcases the name generator's capabilities.

### Running the Demo

```bash
# Clone the repository
git clone https://github.com/yourusername/weird-name-generator.git
cd weird-name-generator

# Install dependencies
npm install

# Run the demo
npm run dev
```

### Demo Features

The demo application includes:

- Interactive name generation with all available styles
- Gender characteristic selection
- Special character options
- Name history tracking
- Favorites management
- Dark/Light theme toggle
- Detailed name information display including:
  - Syllable breakdown
  - Stress patterns
  - Style and gender characteristics

### Demo Structure

```
weird-name-generator/
├── demo/
│   ├── src/
│   │   ├── App.tsx           # Main demo application
│   │   ├── main.tsx         # Entry point
│   │   └── styles/          # Demo-specific styling
│   ├── index.html
│   └── package.json
```

### Available Demo Scripts

```bash
# Start development server
npm run dev

# Build the demo
npm run build:demo

# Preview the built demo
npm run preview
```

### Demo Development

If you want to modify the demo or use it as a reference for your own implementation:

1. The demo uses [Radix UI](https://www.radix-ui.com/themes) for components and theming
2. Styling follows the CUBE CSS methodology
3. All components are built using React with TypeScript
4. The demo showcases real-world usage of both the core generator and React hooks

### Using the Demo as a Reference

The demo application serves as a comprehensive example of how to:

1. Integrate the name generator into a React application
2. Implement history and favorites functionality
3. Display detailed name information

Check out the demo source code in the `demo/` directory for implementation details and best practices.