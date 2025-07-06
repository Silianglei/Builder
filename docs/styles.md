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

## Modern UI Components (New)

### Glass Card Effect
```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

### Gradient Border Button
```tsx
className="inline-flex items-center space-x-3 px-8 py-4 gradient-border group"

/* With nested content for hover effect */
<div className="gradient-border">
  <div className="px-6 py-3 bg-[#0a0a0a] rounded-[0.65rem] transition-all group-hover:bg-[#0a0a0a]/50">
    Content
  </div>
</div>
```

```css
.gradient-border {
  background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
  padding: 1px;
  border-radius: 0.75rem;
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Floating Background Elements
```tsx
<div className="fixed inset-0 pointer-events-none">
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
  <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
  <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
</div>
```

### Sticky Navigation with Backdrop Blur
```tsx
className="fixed top-0 w-full z-50 px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
```

### Modern Terminal Window
```tsx
{/* Terminal Header */}
<div className="bg-white/5 px-6 py-4 border-b border-white/10">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
    </div>
    <div className="text-sm text-gray-500 font-mono">builder@terminal</div>
  </div>
</div>
```

### Step Number Design
```tsx
<div className="text-6xl font-bold mb-6 text-white/20">
  01
</div>
```

### Icon Container with Gradient
```tsx
<div className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center mx-auto bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-blue-500/25">
  <div className="text-white">
    {icon}
  </div>
</div>
```

### Integration Card
```tsx
<div className="group relative">
  <div className="glass-card p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/5">
    <div className="flex items-center justify-center mb-4 text-white opacity-80 group-hover:opacity-100 transition-opacity">
      {icon}
    </div>
    <h3 className="font-semibold mb-1 text-base sm:text-lg">{name}</h3>
    <p className="text-xs sm:text-sm text-gray-500">{desc}</p>
  </div>
</div>
```

### Glow Effect Behind Elements
```tsx
<div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
```

### Success State in Terminal
```tsx
<div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
  <div className="flex items-center space-x-2">
    <span className="text-green-400">✓</span>
    <span className="text-green-400 font-semibold">Ready</span>
    <span className="text-gray-400">- Local server started on</span>
    <span className="text-blue-400 underline">http://localhost:3000</span>
  </div>
</div>
```

### Social Proof Avatars
```tsx
<div className="flex -space-x-3">
  {[1, 2, 3, 4, 5].map((i) => (
    <img 
      key={i} 
      src={`/avatars/avatar${i}.svg`} 
      alt={`Developer ${i}`}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#0a0a0a] hover:scale-110 transition-transform"
    />
  ))}
</div>
```

### Section Headers with Subtitle
```tsx
<div className="text-center mb-16">
  <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Section Label</p>
  <h2 className="text-3xl sm:text-4xl font-bold">
    Main Title
    <span className="block text-2xl sm:text-3xl text-gray-400 font-normal mt-2">Subtitle text</span>
  </h2>
</div>
```

### Live Status Badge
```tsx
<div className="inline-flex items-center space-x-2 mb-8 px-4 py-2 glass-card rounded-full">
  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
  <span className="text-sm text-gray-300">Live in 60 seconds</span>
</div>
```

### Connection Line for Steps
```tsx
<div className="hidden sm:block absolute top-[88px] left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
```

## New Color Extensions

### Extended Purple Gradient
- **Purple-Blue Gradient**: `from-[#3B82F6] to-[#8B5CF6]`
- **Purple Accent**: `#8B5CF6`
- **Purple Shadow**: `shadow-blue-500/25`

### Transparency Levels
- **Ultra Light**: `white/5` (5% opacity)
- **Light**: `white/10` (10% opacity)
- **Medium**: `white/20` (20% opacity)
- **Strong**: `white/40` (40% opacity)
- **Extra Strong**: `white/60` (60% opacity)

### Dark Background Variations
- **Pure Black**: `#0a0a0a`
- **Black with Transparency**: `bg-[#0a0a0a]/80`
- **Glass Black**: `bg-[#0a0a0a]/50`

## New Animation Patterns

### Gradient Shift Animation
```css
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

### Glow Pulse Animation
```css
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
  }
}

.glow {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Slide Up Animation
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

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
11. **Glass Effects**: Use sparingly for modern UI elements
12. **Gradient Usage**: Primary for CTAs and emphasis
13. **Hover States**: Always include interactive feedback
14. **Typography Hierarchy**: Clear distinction between headings
15. **Section Spacing**: Generous spacing between major sections (mb-32)

## SVG Logo Collection

### Supabase Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
  <path d="M13.976 22.013c-.34.355-.933.106-.933-.392V13.38l8.212-9.24c.653-.735 1.88-.147 1.74.833l-1.842 12.94c-.067.468-.416.85-.885.895l-8.292 1.205Z" fill="#3FCF8E"/>
  <path d="M10.024 1.987c.34-.355.933-.106.933.392v8.24L2.745 19.86c-.653.735-1.88.147-1.74-.833L2.847 6.087c.067-.468.416-.85.885-.895l8.292-1.205Z" fill="#3FCF8E" opacity=".7"/>
</svg>
```

### Stripe Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" fill="#635BFF"/>
</svg>
```

### Next.js Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.17 0-.33.06-.46.14-.86.3-1.75.46-2.66.46-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 .91-.15 1.8-.46 2.66-.08.13-.14.29-.14.46 0 .43.35.78.78.78.32 0 .61-.19.72-.49.39-1.07.6-2.22.6-3.41 0-5.52-4.48-10-10-10zm0 0"/>
  <path d="M15 9v6l-4.5-6H9v6h1.5v-3.5l3 4V15H15V9z"/>
</svg>
```

### Tailwind CSS Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
  <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.51 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35-.98-1-2.09-2.15-4.59-2.15z" fill="#06B6D4"/>
</svg>
```

### TypeScript Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
  <rect x="3" y="3" width="18" height="18" rx="2" fill="#3178C6"/>
  <path d="M13.5 11V17H12V11H10V9.5H15.5V11H13.5Z" fill="white"/>
  <path d="M19 14.5C19 15.3284 18.3284 16 17.5 16C16.6716 16 16 15.3284 16 14.5V11H17.5V14.5H19Z" fill="white"/>
</svg>
```

### Docker Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
  <path d="M4.82 10.5h2.61v2.34H4.82V10.5zm2.97 0h2.61v2.34H7.79V10.5zm2.97 0h2.61v2.34h-2.61V10.5zm2.97 0h2.61v2.34h-2.61V10.5zM7.79 7.53h2.61v2.34H7.79V7.53zm2.97 0h2.61v2.34h-2.61V7.53zm2.97 0h2.61v2.34h-2.61V7.53zm0-2.97h2.61v2.34h-2.61V4.56z" fill="#2496ED"/>
  <path d="M22.43 9.69c-.52-.38-1.73-.53-2.66-.33-.14-.97-.71-1.81-1.74-2.51l-.59-.4-.4.59c-.5.75-.65 1.98-.1 2.79-.36.2-.81.37-1.19.52-1.54.3-3.19.23-4.71-.21H.57l-.05.29c-.17 1.01-.17 4.17 1.84 6.6 1.54 1.86 3.84 2.8 6.84 2.8 6.5 0 11.31-2.99 13.59-8.42.89.02 2.8.01 3.78-1.87.06-.1.2-.36.61-1.16l.11-.21-.58-.43z" fill="#2496ED"/>
</svg>
```

### GitHub Logo
```svg
<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
</svg>
```

### Vercel Logo
```svg
<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2L2 19.5h20L12 2z"/>
</svg>
```

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