"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { advancedThemeSystem, defaultThemes, type ThemeConfig } from "@/lib/advanced-theme-system"
import {
  PaletteIcon,
  DownloadIcon,
  UploadIcon,
  SaveIcon,
  ShareIcon,
  EyeIcon,
  RefreshCwIcon,
  MonitorIcon,
  TypeIcon,
  LayoutIcon,
  ZapIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
  CheckIcon,
} from "lucide-react"

export default function AdvancedThemeBuilder() {
  const { toast } = useToast()
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(defaultThemes[0])
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(defaultThemes[0])
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("dark")
  const [isPreviewActive, setIsPreviewActive] = useState(false)

  useEffect(() => {
    // Initialize with current theme
    const current = advancedThemeSystem.getCurrentTheme()
    if (current) {
      setSelectedTheme(current)
      setCustomTheme(current)
    }
  }, [])

  const handleColorChange = (colorKey: string, value: string, mode: "light" | "dark") => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [mode]: {
          ...prev.colors[mode],
          [colorKey]: value,
        },
      },
    }))
  }

  const handleFontChange = (fontKey: string, value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value,
      },
    }))
  }

  const handleSpacingChange = (spacingKey: string, value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value,
      },
    }))
  }

  const handleEffectChange = (effectKey: string, value: any) => {
    setCustomTheme((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectKey]: value,
      },
    }))
  }

  const previewTheme = () => {
    setIsPreviewActive(true)
    advancedThemeSystem.applyTheme(customTheme, previewMode)
    toast({
      title: "Theme Preview",
      description: "Preview applied! Click 'Stop Preview' to revert.",
    })
  }

  const stopPreview = () => {
    setIsPreviewActive(false)
    advancedThemeSystem.applyTheme(selectedTheme, previewMode)
    toast({
      title: "Preview Stopped",
      description: "Reverted to original theme.",
    })
  }

  const saveTheme = () => {
    const savedTheme = advancedThemeSystem.createCustomTheme(selectedTheme, customTheme)
    setSelectedTheme(savedTheme)
    advancedThemeSystem.applyTheme(savedTheme, previewMode)
    setIsPreviewActive(false)

    toast({
      title: "Theme Saved",
      description: `"${savedTheme.name}" has been saved to your custom themes.`,
    })
  }

  const exportTheme = () => {
    const themeJson = advancedThemeSystem.exportTheme(customTheme)
    navigator.clipboard.writeText(themeJson)
    toast({
      title: "Theme Exported",
      description: "Theme JSON copied to clipboard!",
    })
  }

  const importTheme = (themeJson: string) => {
    try {
      const imported = advancedThemeSystem.importTheme(themeJson)
      setCustomTheme(imported)
      toast({
        title: "Theme Imported",
        description: `"${imported.name}" has been imported successfully.`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid theme format. Please check your JSON.",
        variant: "destructive",
      })
    }
  }

  const resetToDefault = () => {
    setCustomTheme(selectedTheme)
    toast({
      title: "Reset Complete",
      description: "Theme reset to original settings.",
    })
  }

  const colorInputs = [
    { key: "primary", label: "Primary", description: "Main brand color" },
    { key: "secondary", label: "Secondary", description: "Secondary accent color" },
    { key: "accent", label: "Accent", description: "Highlight color" },
    { key: "background", label: "Background", description: "Main background" },
    { key: "surface", label: "Surface", description: "Card backgrounds" },
    { key: "text", label: "Text", description: "Primary text color" },
    { key: "textSecondary", label: "Text Secondary", description: "Muted text color" },
    { key: "border", label: "Border", description: "Border color" },
    { key: "success", label: "Success", description: "Success state color" },
    { key: "warning", label: "Warning", description: "Warning state color" },
    { key: "error", label: "Error", description: "Error state color" },
    { key: "info", label: "Info", description: "Info state color" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PaletteIcon className="h-8 w-8 text-purple-400" />
          <div>
            <h2 className="text-3xl font-bold text-white">Advanced Theme Builder</h2>
            <p className="text-white/60">Create and customize your perfect gaming theme</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className={isPreviewActive ? "border-yellow-400 text-yellow-300" : "border-gray-400 text-gray-300"}
          >
            {isPreviewActive ? <EyeIcon className="h-3 w-3 mr-1" /> : <MonitorIcon className="h-3 w-3 mr-1" />}
            {isPreviewActive ? "Preview Active" : "Live Theme"}
          </Badge>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previewMode === "dark" ? () => setPreviewMode("light") : () => setPreviewMode("dark")}
            >
              {previewMode === "dark" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-white/60">{previewMode} mode</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="colors">
            <PaletteIcon className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <TypeIcon className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <LayoutIcon className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="effects">
            <ZapIcon className="h-4 w-4 mr-2" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="presets">
            <StarIcon className="h-4 w-4 mr-2" />
            Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Color Palette Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Color Palette</CardTitle>
                  <CardDescription className="text-white/60">Customize colors for {previewMode} mode</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {colorInputs.map((colorInput) => (
                      <div key={colorInput.key} className="space-y-2">
                        <Label className="text-white text-sm font-medium">{colorInput.label}</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={
                              customTheme.colors[previewMode][colorInput.key as keyof typeof customTheme.colors.dark]
                            }
                            onChange={(e) => handleColorChange(colorInput.key, e.target.value, previewMode)}
                            className="w-12 h-10 p-1 border-white/20"
                          />
                          <Input
                            type="text"
                            value={
                              customTheme.colors[previewMode][colorInput.key as keyof typeof customTheme.colors.dark]
                            }
                            onChange={(e) => handleColorChange(colorInput.key, e.target.value, previewMode)}
                            className="flex-1 bg-black/20 border-white/20 text-white"
                            placeholder="#000000"
                          />
                        </div>
                        <p className="text-xs text-white/40">{colorInput.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Live Preview</CardTitle>
                  <CardDescription className="text-white/60">See your changes in real-time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Components */}
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: customTheme.colors[previewMode].surface,
                      borderColor: customTheme.colors[previewMode].border,
                      color: customTheme.colors[previewMode].text,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="text-lg font-semibold" style={{ color: customTheme.colors[previewMode].primary }}>
                        Sample Card
                      </div>
                      <p style={{ color: customTheme.colors[previewMode].textSecondary }}>
                        This is how your theme will look in practice.
                      </p>
                      <div className="flex space-x-2">
                        <div
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: customTheme.colors[previewMode].primary,
                            color: customTheme.colors[previewMode].background,
                          }}
                        >
                          Primary
                        </div>
                        <div
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: customTheme.colors[previewMode].secondary,
                            color: customTheme.colors[previewMode].background,
                          }}
                        >
                          Secondary
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button onClick={previewTheme} disabled={isPreviewActive} className="w-full">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Preview Theme
                    </Button>
                    {isPreviewActive && (
                      <Button onClick={stopPreview} variant="outline" className="w-full">
                        <RefreshCwIcon className="h-4 w-4 mr-2" />
                        Stop Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Typography Settings</CardTitle>
              <CardDescription className="text-white/60">Configure fonts and text styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Primary Font</Label>
                  <Select
                    value={customTheme.fonts.primary}
                    onValueChange={(value) => handleFontChange("primary", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Orbitron, sans-serif">Orbitron</SelectItem>
                      <SelectItem value="Rajdhani, sans-serif">Rajdhani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Secondary Font</Label>
                  <Select
                    value={customTheme.fonts.secondary}
                    onValueChange={(value) => handleFontChange("secondary", value)}
                  >
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Orbitron, sans-serif">Orbitron</SelectItem>
                      <SelectItem value="Rajdhani, sans-serif">Rajdhani</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Monospace Font</Label>
                  <Select value={customTheme.fonts.mono} onValueChange={(value) => handleFontChange("mono", value)}>
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JetBrains Mono, monospace">JetBrains Mono</SelectItem>
                      <SelectItem value="Fira Code, monospace">Fira Code</SelectItem>
                      <SelectItem value="Source Code Pro, monospace">Source Code Pro</SelectItem>
                      <SelectItem value="Share Tech Mono, monospace">Share Tech Mono</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Font Preview */}
              <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold">Font Preview</h3>
                <div className="space-y-3">
                  <div style={{ fontFamily: customTheme.fonts.primary }}>
                    <div className="text-2xl text-white">Primary Font - Heading</div>
                    <div className="text-white/80">
                      This is how your primary font will look in paragraphs and body text.
                    </div>
                  </div>
                  <div style={{ fontFamily: customTheme.fonts.secondary }}>
                    <div className="text-lg text-white">Secondary Font - Subheading</div>
                    <div className="text-white/80">Secondary font is used for UI elements and labels.</div>
                  </div>
                  <div style={{ fontFamily: customTheme.fonts.mono }}>
                    <div className="text-sm text-green-400">const code = "Monospace font for code blocks";</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Layout & Spacing</CardTitle>
              <CardDescription className="text-white/60">
                Configure spacing, borders, and layout properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Spacing Controls */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Spacing Scale</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(customTheme.spacing).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-white text-sm">{key.toUpperCase()}</Label>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpacingChange(key, e.target.value)}
                        className="bg-black/20 border-white/20 text-white"
                        placeholder="1rem"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Radius Controls */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Border Radius</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(customTheme.borderRadius).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-white text-sm">{key.toUpperCase()}</Label>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setCustomTheme((prev) => ({
                            ...prev,
                            borderRadius: { ...prev.borderRadius, [key]: e.target.value },
                          }))
                        }
                        className="bg-black/20 border-white/20 text-white"
                        placeholder="0.5rem"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Animation Controls */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Animations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Duration</Label>
                    <Input
                      type="text"
                      value={customTheme.animations.duration}
                      onChange={(e) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          animations: { ...prev.animations, duration: e.target.value },
                        }))
                      }
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="0.3s"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Easing</Label>
                    <Select
                      value={customTheme.animations.easing}
                      onValueChange={(value) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          animations: { ...prev.animations, easing: value },
                        }))
                      }
                    >
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                        <SelectItem value="cubic-bezier(0.4, 0, 0.2, 1)">Custom Cubic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Visual Effects</CardTitle>
              <CardDescription className="text-white/60">Configure visual effects and enhancements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Blur Effect</Label>
                    <Input
                      type="text"
                      value={customTheme.effects.blur}
                      onChange={(e) => handleEffectChange("blur", e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="8px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Shadow Effect</Label>
                    <Textarea
                      value={customTheme.effects.shadow}
                      onChange={(e) => handleEffectChange("shadow", e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="0 10px 25px rgba(0, 0, 0, 0.1)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Glow Effects</Label>
                      <p className="text-xs text-white/60">Enable glowing borders and highlights</p>
                    </div>
                    <Switch
                      checked={customTheme.effects.glow}
                      onCheckedChange={(checked) => handleEffectChange("glow", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Particle Effects</Label>
                      <p className="text-xs text-white/60">Enable animated background particles</p>
                    </div>
                    <Switch
                      checked={customTheme.effects.particles}
                      onCheckedChange={(checked) => handleEffectChange("particles", checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Effects Preview */}
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-4">Effects Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backdropFilter: `blur(${customTheme.effects.blur})`,
                      boxShadow: customTheme.effects.shadow,
                      borderColor: customTheme.effects.glow
                        ? customTheme.colors[previewMode].primary
                        : customTheme.colors[previewMode].border,
                    }}
                  >
                    <div className="text-white text-sm">Blur & Shadow</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg border ${customTheme.effects.glow ? "animate-pulse" : ""}`}
                    style={{
                      borderColor: customTheme.colors[previewMode].primary,
                      boxShadow: customTheme.effects.glow
                        ? `0 0 20px ${customTheme.colors[previewMode].primary}40`
                        : "none",
                    }}
                  >
                    <div className="text-white text-sm">Glow Effect</div>
                  </div>
                  <div className="p-4 rounded-lg border border-white/20 relative overflow-hidden">
                    {customTheme.effects.particles && (
                      <div className="absolute inset-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full animate-bounce"
                            style={{
                              left: `${20 + i * 15}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: "2s",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="text-white text-sm relative z-10">Particles</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Theme Presets */}
            <div className="lg:col-span-2">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Theme Presets</CardTitle>
                  <CardDescription className="text-white/60">
                    Choose from pre-built themes or create your own
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {defaultThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          selectedTheme.id === theme.id
                            ? "border-blue-400 bg-blue-400/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => {
                          setSelectedTheme(theme)
                          setCustomTheme(theme)
                        }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold">{theme.name}</h3>
                            {selectedTheme.id === theme.id && <CheckIcon className="h-4 w-4 text-blue-400" />}
                          </div>
                          <p className="text-sm text-white/60">{theme.description}</p>
                          <div className="flex space-x-2">
                            {Object.values(theme.colors.dark)
                              .slice(0, 6)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <span>by {theme.author}</span>
                            <span>v{theme.version}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Theme Actions */}
            <div className="space-y-6">
              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Theme Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={saveTheme} className="w-full">
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Theme
                  </Button>

                  <Button onClick={exportTheme} variant="outline" className="w-full">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export Theme
                  </Button>

                  <Button
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = ".json"
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            const content = e.target?.result as string
                            importTheme(content)
                          }
                          reader.readAsText(file)
                        }
                      }
                      input.click()
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Import Theme
                  </Button>

                  <Button onClick={resetToDefault} variant="outline" className="w-full">
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>

                  <Button variant="outline" className="w-full">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Theme
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Theme Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Theme Name</Label>
                    <Input
                      value={customTheme.name}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="My Custom Theme"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white text-sm">Description</Label>
                    <Textarea
                      value={customTheme.description}
                      onChange={(e) => setCustomTheme((prev) => ({ ...prev, description: e.target.value }))}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="A beautiful custom theme..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
