"use client"

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
  info: string
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  author: string
  version: string
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  animations: {
    duration: string
    easing: string
  }
  effects: {
    blur: string
    shadow: string
    glow: boolean
    particles: boolean
  }
}

export const defaultThemes: ThemeConfig[] = [
  {
    id: "gaming-pro",
    name: "Gaming Pro",
    description: "Professional gaming theme with neon accents",
    author: "Aphrodite Team",
    version: "1.0.0",
    colors: {
      light: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#06b6d4",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      dark: {
        primary: "#8b5cf6",
        secondary: "#06b6d4",
        accent: "#f59e0b",
        background: "#0f0f23",
        surface: "#1a1a2e",
        text: "#eee6ff",
        textSecondary: "#a78bfa",
        border: "#16213e",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#06b6d4",
      },
    },
    fonts: {
      primary: "Inter, sans-serif",
      secondary: "Poppins, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    borderRadius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
    animations: {
      duration: "0.3s",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    effects: {
      blur: "8px",
      shadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      glow: true,
      particles: false,
    },
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    description: "Futuristic cyberpunk theme with glowing effects",
    author: "Community",
    version: "1.2.0",
    colors: {
      light: {
        primary: "#ff0080",
        secondary: "#00ffff",
        accent: "#ffff00",
        background: "#ffffff",
        surface: "#f0f0f0",
        text: "#000000",
        textSecondary: "#666666",
        border: "#cccccc",
        success: "#00ff00",
        warning: "#ffaa00",
        error: "#ff0000",
        info: "#0080ff",
      },
      dark: {
        primary: "#ff0080",
        secondary: "#00ffff",
        accent: "#ffff00",
        background: "#0a0a0a",
        surface: "#1a0a1a",
        text: "#ff00ff",
        textSecondary: "#00ffff",
        border: "#ff0080",
        success: "#00ff00",
        warning: "#ffaa00",
        error: "#ff0040",
        info: "#0080ff",
      },
    },
    fonts: {
      primary: "Orbitron, sans-serif",
      secondary: "Rajdhani, sans-serif",
      mono: "Share Tech Mono, monospace",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    borderRadius: {
      sm: "0rem",
      md: "0.125rem",
      lg: "0.25rem",
      xl: "0.5rem",
    },
    animations: {
      duration: "0.5s",
      easing: "ease-in-out",
    },
    effects: {
      blur: "12px",
      shadow: "0 0 20px rgba(255, 0, 128, 0.5)",
      glow: true,
      particles: true,
    },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Clean and minimal design for focused gaming",
    author: "Design Team",
    version: "1.0.0",
    colors: {
      light: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#059669",
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        textSecondary: "#6b7280",
        border: "#d1d5db",
        success: "#059669",
        warning: "#d97706",
        error: "#dc2626",
        info: "#2563eb",
      },
      dark: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#10b981",
        background: "#111827",
        surface: "#1f2937",
        text: "#f9fafb",
        textSecondary: "#9ca3af",
        border: "#374151",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
    },
    fonts: {
      primary: "System UI, sans-serif",
      secondary: "Inter, sans-serif",
      mono: "SF Mono, monospace",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    borderRadius: {
      sm: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
    },
    animations: {
      duration: "0.2s",
      easing: "ease-out",
    },
    effects: {
      blur: "4px",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      glow: false,
      particles: false,
    },
  },
]

class AdvancedThemeSystem {
  private currentTheme: ThemeConfig | null = null
  private customThemes: ThemeConfig[] = []
  private listeners: ((theme: ThemeConfig) => void)[] = []

  constructor() {
    this.loadCustomThemes()
  }

  // Apply theme to document
  applyTheme(theme: ThemeConfig, mode: "light" | "dark" = "dark") {
    const root = document.documentElement
    const colors = theme.colors[mode]

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Apply fonts
    root.style.setProperty("--font-primary", theme.fonts.primary)
    root.style.setProperty("--font-secondary", theme.fonts.secondary)
    root.style.setProperty("--font-mono", theme.fonts.mono)

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    // Apply animations
    root.style.setProperty("--animation-duration", theme.animations.duration)
    root.style.setProperty("--animation-easing", theme.animations.easing)

    // Apply effects
    root.style.setProperty("--effect-blur", theme.effects.blur)
    root.style.setProperty("--effect-shadow", theme.effects.shadow)

    // Toggle effect classes
    root.classList.toggle("theme-glow", theme.effects.glow)
    root.classList.toggle("theme-particles", theme.effects.particles)

    this.currentTheme = theme
    this.notifyListeners(theme)
    this.saveCurrentTheme(theme, mode)
  }

  // Create custom theme
  createCustomTheme(baseTheme: ThemeConfig, customizations: Partial<ThemeConfig>): ThemeConfig {
    const customTheme: ThemeConfig = {
      ...baseTheme,
      ...customizations,
      id: `custom-${Date.now()}`,
      author: "User",
      version: "1.0.0",
    }

    this.customThemes.push(customTheme)
    this.saveCustomThemes()
    return customTheme
  }

  // Get all available themes
  getAllThemes(): ThemeConfig[] {
    return [...defaultThemes, ...this.customThemes]
  }

  // Get theme by ID
  getThemeById(id: string): ThemeConfig | undefined {
    return this.getAllThemes().find((theme) => theme.id === id)
  }

  // Subscribe to theme changes
  subscribe(callback: (theme: ThemeConfig) => void) {
    this.listeners.push(callback)
  }

  // Unsubscribe from theme changes
  unsubscribe(callback: (theme: ThemeConfig) => void) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  private notifyListeners(theme: ThemeConfig) {
    this.listeners.forEach((callback) => callback(theme))
  }

  private saveCurrentTheme(theme: ThemeConfig, mode: "light" | "dark") {
    localStorage.setItem("aphrodite-current-theme", JSON.stringify({ theme, mode }))
  }

  private loadCurrentTheme(): { theme: ThemeConfig; mode: "light" | "dark" } | null {
    try {
      const saved = localStorage.getItem("aphrodite-current-theme")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  private saveCustomThemes() {
    localStorage.setItem("aphrodite-custom-themes", JSON.stringify(this.customThemes))
  }

  private loadCustomThemes() {
    try {
      const saved = localStorage.getItem("aphrodite-custom-themes")
      this.customThemes = saved ? JSON.parse(saved) : []
    } catch {
      this.customThemes = []
    }
  }

  // Initialize theme system
  initialize() {
    const saved = this.loadCurrentTheme()
    if (saved) {
      this.applyTheme(saved.theme, saved.mode)
    } else {
      // Apply default theme
      this.applyTheme(defaultThemes[0], "dark")
    }
  }

  getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme
  }

  // Export theme for sharing
  exportTheme(theme: ThemeConfig): string {
    return JSON.stringify(theme, null, 2)
  }

  // Import theme from JSON
  importTheme(themeJson: string): ThemeConfig {
    const theme = JSON.parse(themeJson) as ThemeConfig
    theme.id = `imported-${Date.now()}`
    this.customThemes.push(theme)
    this.saveCustomThemes()
    return theme
  }
}

export const advancedThemeSystem = new AdvancedThemeSystem()
