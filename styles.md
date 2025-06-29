# Template Styles Documentation

This document contains all the extracted styles, design patterns, and UI components from the Simulate AI codebase to be used as reference for building the template.

## Color Palette & CSS Variables

### Dark Theme (Primary)
```css
:root {
  --background: #000000;           /* Pure black background */
  --foreground: #ffffff;           /* White text */
  --muted: #18181b;               /* Dark gray for muted elements */
  --muted-foreground: #71717a;    /* Gray text */
  --card: #18181b;                /* Card background */
  --card-foreground: #ffffff;     /* Card text */
  --border: #27272a;              /* Border color */
  --input: #27272a;               /* Input background */
  --accent: #18181b;              /* Accent background */
  --accent-foreground: #ffffff;   /* Accent text */
  --primary: #3b82f6;             /* Blue primary (equivalent to #4285F4) */
  --primary-foreground: #ffffff;  /* Primary text */
}
```

### Specific Brand Colors
- **Primary Blue**: `#4285F4` (Google Blue)
- **Primary Blue Hover**: `#4285F4/90`
- **Primary Blue Light**: `#4285F4/10` (for backgrounds)
- **Primary Blue Border**: `#4285F4/20`
- **Secondary Colors**: 
  - Success: `#60a5fa`, `#93c5fd`
  - Warning: `#fbbf24`
  - Error: `#ef4444`
  - Info: `#06b6d4`

### Layout Variables
```css
--sidebar-width: 220px;
--sidebar-min-width: 180px;
--sidebar-max-width: 300px;
```

## Typography

### Font Family
- **Primary**: `Inter, system-ui, -apple-system, sans-serif`
- **Fallbacks**: System fonts for cross-platform compatibility

### Font Sizes (Tailwind classes)
- `text-xs` - 12px (captions, metadata)
- `text-sm` - 14px (body text, form labels)
- `text-base` - 16px (default)
- `text-lg` - 18px (section headers)
- `text-xl` - 20px (card titles)
- `text-2xl` - 24px (page headers)
- `text-3xl` - 30px (hero headers)
- `text-4xl` - 36px (landing page)

### Font Weights
- `font-normal` - 400 (body text)
- `font-medium` - 500 (buttons, labels)
- `font-semibold` - 600 (card titles)
- `font-bold` - 700 (headers)

## Component Styles

### Button Variants

#### Primary Button
```tsx
className="group relative w-full overflow-hidden rounded-md bg-[#4285F4] h-10 text-white font-medium transition-all duration-300 hover:bg-[#4285F4]/90 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/50 flex items-center justify-center"
```

#### Button with Shine Effect
```css
/* Animated shine effect */
.button-shine::before {
  content: '';
  position: absolute;
  top: 0;
  -inset-full: 0;
  height: 100%;
  width: 50%;
  z-index: 5;
  display: block;
  transform: skewX(-12deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

.button-shine:hover::before {
  animation: shine 1.5s ease-in-out;
}

@keyframes shine {
  to { left: 125%; }
}
```

#### Secondary Button
```tsx
className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
```

#### Ghost Button
```tsx
className="hover:bg-accent hover:text-accent-foreground"
```

### Card Styles

#### Standard Card
```tsx
className="rounded-lg border bg-card text-card-foreground shadow-sm"
```

#### Glass Morphism Card (Dark)
```tsx
className="bg-[#111827]/90 backdrop-blur-sm border border-[#1e293b]/30 shadow-xl"
```

#### Glass Morphism Card (Light)
```tsx
className="bg-white shadow-md border border-gray-200"
```

#### Card with Hover Effects
```tsx
className="group relative overflow-hidden rounded-lg border border-[#1e293b]/20 bg-[#111827]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#4285F4]/30 hover:bg-[#111827]/80 hover:shadow-lg"
```

### Input Styles

#### Standard Input
```tsx
className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
```

#### Input with Icon (Dark Theme)
```tsx
className="pl-10 bg-[#0a0d14]/80 border-[#1e293b]/20 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-600"
```

#### Input with Icon (Light Theme)
```tsx
className="pl-10 bg-white border-gray-300 h-10 rounded-md w-full focus:border-[#4285F4]/50 focus:ring-1 focus:ring-[#4285F4]/50 placeholder:text-gray-400"
```

## Layout Patterns

### Landing Page Layout
```tsx
<div className="min-h-screen bg-[#0a0d14] text-white">
  <main className="flex flex-col lg:flex-row h-screen">
    {/* Left side - Product description (dark) */}
    <div className="w-full lg:w-[45%] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob bg-[#4285F4] w-[600px] h-[600px] -top-[200px] -left-[300px]"></div>
        <div className="blob bg-[#121d40] w-[500px] h-[500px] bottom-[5%] right-[5%]"></div>
      </div>
      
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
    </div>
    
    {/* Right side - Auth form (white) */}
    <div className="w-full lg:w-[55%] p-6 md:p-8 lg:pl-4 flex flex-col justify-center bg-white text-gray-800">
      {/* Auth form content */}
    </div>
  </main>
</div>
```

### App Layout with Sidebar
```tsx
<div className="flex">
  <AuthenticatedSidebar />
  <main className="flex-1 transition-all duration-300">
    {children}
  </main>
</div>
```

### Dashboard Grid Layout
```tsx
<div className="p-6 space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Metric cards */}
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main content areas */}
  </div>
</div>
```

## Animation Patterns

### CSS Animations
```css
/* Fade in animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating animation for background elements */
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}

/* Pulse animations */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.01);
  }
}

/* Shimmer effect */
@keyframes shimmer {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(150%); }
}

/* Shine effect for buttons */
@keyframes shine {
  to { left: 125%; }
}
```

### Animation Classes
```css
.animate-fade-in { animation: fade-in 0.6s ease-out; }
.animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
```

### Staggered Animations (Landing Page)
```tsx
// Progressive reveal with delays
<div className="fade-in" style={{ transitionDelay: '150ms' }}>
<div className="fade-in" style={{ transitionDelay: '300ms' }}>
<div className="fade-in" style={{ transitionDelay: '450ms' }}>
```

### Framer Motion Patterns
```tsx
// List animations
<AnimatePresence>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* content */}
    </motion.div>
  ))}
</AnimatePresence>

// Page transitions
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3 }}
>
```

## Background Effects

### Blob Backgrounds
```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
  <div className="blob bg-[#4285F4] w-[600px] h-[600px] -top-[200px] -left-[300px]"></div>
  <div className="blob bg-[#121d40] w-[500px] h-[500px] bottom-[5%] right-[5%]"></div>
</div>
```

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: float 8s ease-in-out infinite;
  opacity: 0.08;
}
```

### Dot Grid Pattern
```tsx
<div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none"></div>
```

### Glass Morphism
```css
.glass-morphism {
  background: rgba(30, 41, 59, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(30, 41, 59, 0.6);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-morphism-dark {
  background: rgba(18, 24, 32, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(30, 41, 59, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}
```

## Scrollbar Styles

### Custom Scrollbars
```css
/* Dark theme scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--muted);
}

::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}

/* Subtle dashboard scrollbar */
.dashboard-scrollbar::-webkit-scrollbar {
  width: 3px;
}

.dashboard-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.2);
  border-radius: 4px;
}

.dashboard-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(66, 133, 244, 0.3);
  border-radius: 4px;
}
```

## Icon Patterns

### Icon with Text
```tsx
<div className="flex items-center space-x-3">
  <div className="w-6 h-6 rounded-full bg-[#4285F4]/10 flex items-center justify-center">
    <CheckIcon className="w-3 h-3 text-[#4285F4]" />
  </div>
  <span className="text-sm text-gray-300">Feature text</span>
</div>
```

### Icon Sizes
- `w-4 h-4` - Small icons (16px)
- `w-5 h-5` - Medium icons (20px)
- `w-6 h-6` - Large icons (24px)
- `w-8 h-8` - XL icons (32px)

## State Patterns

### Loading States
```tsx
{loading ? (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
) : (
  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
)}
```

### Error States
```tsx
{error && (
  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-500">
    {error}
  </div>
)}
```

### Empty States
```tsx
<div className="text-center py-12">
  <div className="text-muted-foreground mb-4">
    <EmptyIcon className="w-16 h-16 mx-auto" />
  </div>
  <h3 className="text-lg font-medium mb-2">No items found</h3>
  <p className="text-muted-foreground">Get started by creating your first item.</p>
</div>
```

## Responsive Patterns

### Breakpoint Classes
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

### Grid Responsive Patterns
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
```

### Responsive Text
```tsx
className="text-2xl md:text-3xl lg:text-4xl"
```

### Responsive Spacing
```tsx
className="p-4 md:p-6 lg:p-8"
```

## Accessibility Patterns

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-[#4285F4]/50 focus:ring-offset-2
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Screen Reader Support
```tsx
<span className="sr-only">Screen reader text</span>
<button aria-label="Close dialog">
```

### Color Contrast
- All text maintains WCAG AA contrast ratios
- Interactive elements have clear focus states
- Brand blue (#4285F4) provides sufficient contrast on both light and dark backgrounds

## Best Practices

1. **Consistent Spacing**: Use Tailwind's spacing scale (4px increments)
2. **Consistent Colors**: Stick to the defined color palette
3. **Semantic HTML**: Use appropriate HTML elements
4. **Responsive Design**: Mobile-first approach
5. **Performance**: Use CSS transforms for animations
6. **Accessibility**: Include focus states and ARIA labels
7. **Dark Theme**: Default to dark theme with light theme support
8. **Loading States**: Provide feedback for all async operations
9. **Error Handling**: Clear error messages with appropriate styling
10. **Progressive Enhancement**: Graceful degradation of animations

## Tailwind Configuration

Key extensions to include in `tailwind.config.ts`:

```typescript
{
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // ... other CSS variables
      },
      animation: {
        shine: "shine 1.5s ease-in-out infinite",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { transform: "translateX(-150%)" },
          "50%": { transform: "translateX(150%)" },
        },
        shine: {
          "to": { left: "125%" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(30px, -30px)" },
        },
      },
    },
  },
}
```

This comprehensive style guide provides all the visual patterns and components needed to maintain consistency across the template while ensuring scalability for future projects.