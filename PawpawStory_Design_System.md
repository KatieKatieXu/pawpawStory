# PawpawStory Design System

> A comprehensive design system documentation for the PawpawStory mobile application—a children's story reading app with personalized voice narration.

---

## Table of Contents

1. [Design Tokens](#design-tokens)
   - [Color Palette](#color-palette)
   - [Typography](#typography)
   - [Spacing](#spacing)
   - [Border Radius](#border-radius)
   - [Shadows & Elevation](#shadows--elevation)
2. [Core Components](#core-components)
   - [Button](#button)
   - [Card](#card)
   - [Input](#input)
3. [Usage Guidelines](#usage-guidelines)
   - [Color Usage](#color-usage)
   - [Theme Transition](#theme-transition)
   - [Accessibility Considerations](#accessibility-considerations)

---

## Design Tokens

### Color Palette

PawpawStory features a dual-theme system: **Night Mode** (default) and **Day Mode**, each carefully crafted to provide optimal readability and ambiance for bedtime story experiences.

#### Night Mode (Default)

A dark navy theme with warm yellow accents, designed for low-light environments.

| Token Name | Hex Value | RGB | Usage |
|------------|-----------|-----|-------|
| `background` | `#1e2749` | `30, 39, 73` | Main screen background |
| `background-card` | `#2b3a67` | `43, 58, 103` | Cards, modals, elevated surfaces |
| `accent` | `#ffd166` | `255, 209, 102` | Primary buttons, links, highlights |
| `accent-dark` | `#e6b84d` | `230, 184, 77` | Button borders, pressed states |
| `text-primary` | `#f8f9fa` | `248, 249, 250` | Headings, body text |
| `text-secondary` | `#c4cfdb` | `196, 207, 219` | Subtitles, muted text, icons |
| `border` | `#7b8fb8` | `123, 143, 184` | Dividers, card borders |
| `logo-accent` | `#ffd166` | `255, 209, 102` | "pawpaw" wordmark |
| `logo-text` | `#f8f9fa` | `248, 249, 250` | "Story" wordmark |

#### Day Mode

A warm cream theme with orange accents, designed for daytime reading.

| Token Name | Hex Value | RGB | Usage |
|------------|-----------|-----|-------|
| `background` | `#f5ede6` | `245, 237, 230` | Main screen background |
| `background-card` | `#fdfbf8` | `253, 251, 248` | Cards, modals, elevated surfaces |
| `accent` | `#ff8c42` | `255, 140, 66` | Primary buttons, links, highlights |
| `accent-dark` | `#e67700` | `230, 119, 0` | Button borders, pressed states |
| `text-primary` | `#3d3630` | `61, 54, 48` | Headings, body text |
| `text-secondary` | `#8a7f75` | `138, 127, 117` | Subtitles, muted text, icons |
| `border` | `#e3d9cf` | `227, 217, 207` | Dividers, card borders |
| `logo-accent` | `#ff8c42` | `255, 140, 66` | "pawpaw" wordmark |
| `logo-text` | `#3d3630` | `61, 54, 48` | "Story" wordmark |

#### Semantic Colors

| Purpose | Night Mode | Day Mode |
|---------|------------|----------|
| Success | `#22c55e` | `#22c55e` |
| Error/Destructive | `#ef4444` | `#ef4444` |
| Recording indicator | `#ef4444` (red pulse) | `#ef4444` |

#### Quick Access Icon Colors

| Feature | Color | Hex |
|---------|-------|-----|
| Ready to Hear | Warm Brown | `#a89179` |
| Favorites | Soft Tan | `#c9a892` |
| Continue | Terracotta | `#b88a7b` |

---

### Typography

PawpawStory uses the **Nunito** typeface family for a friendly, rounded appearance that appeals to both children and parents.

#### Font Family

| Weight | Font Name | CSS Variable |
|--------|-----------|--------------|
| Regular (400) | `Nunito_400Regular` | `font-nunito` |
| Bold (700) | `Nunito_700Bold` | `font-nunito-bold` |
| Extra Bold (800) | `Nunito_800ExtraBold` | `font-nunito-extrabold` |

#### Type Scale

| Style Name | Font Size | Line Height | Weight | Usage |
|------------|-----------|-------------|--------|-------|
| **Display** | 44px | Auto | 800 | Brand wordmark |
| **Title Large** | 32px | 48px | 800 | Screen titles |
| **Title** | 24px | Auto | 800 | Section headings |
| **Headline** | 20px | Auto | 700 | Card titles, stats |
| **Body Large** | 18px | Auto | 800 | Story titles |
| **Body** | 16px | 24px | 400 | Body text, inputs |
| **Body Semibold** | 16px | 24px | 600 | Labels |
| **Caption** | 14px | Auto | 600/400 | Tags, metadata |
| **Caption Small** | 12px | Auto | 400 | Timestamps, hints |
| **Micro** | 10px | Auto | 400 | Badges |

#### Letter Spacing

| Context | Value |
|---------|-------|
| Brand wordmark | `-0.36px` (tighter) |
| Button text | `wide` tracking |
| Body text | Normal |

---

### Spacing

The spacing system follows a 4px base unit with semantic scales.

| Token | Value | Usage |
|-------|-------|-------|
| `px-6` | 24px | Screen horizontal padding |
| `py-4` | 16px | Header vertical padding |
| `gap-3` | 12px | Card grid spacing |
| `gap-6` | 24px | Form field spacing |
| `mb-4` | 16px | Section title margin |
| `mb-6` | 24px | Section spacing |
| `mb-8` | 32px | Major section spacing |
| `p-4` | 16px | Card internal padding |
| `p-5` | 20px | Large card padding |
| `p-6` | 24px | Modal padding |

#### Content Container Padding

| Area | Padding |
|------|---------|
| Screen content | `px-6` (24px horizontal) |
| Card content | `p-4` to `p-6` |
| Modal content | `p-6` with 40px bottom |
| Button | `py-[18px]` vertical |

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Circular buttons, avatars, toggles |
| `rounded-3xl` | 24px | Profile cards, large modals |
| `rounded-2xl` | 16px | Buttons, cards, inputs |
| `rounded-xl` | 12px | Small cards |

---

### Shadows & Elevation

#### Card Shadow (Standard)

```css
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 3,
elevation: 2
```

#### Card Shadow (Elevated)

```css
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 6,
elevation: 3
```

#### Button Shadow

```css
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 6,
elevation: 3
```

#### Recording Button Shadow

```css
shadowColor: [accent-color],
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.4,
shadowRadius: 16,
elevation: 12
```

#### Accent Glow (CTA Buttons)

```css
shadowColor: [accent-color],
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.3,
shadowRadius: 8,
elevation: 4
```

---

## Core Components

### Button

PawpawStory implements multiple button variants using React Native's `Pressable` component with NativeWind styling.

#### Primary Button

The main call-to-action button with accent background and bottom border for depth.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPress` | `() => void` | Required | Press handler |
| `disabled` | `boolean` | `false` | Disables interaction |
| `isLoading` | `boolean` | `false` | Shows ActivityIndicator |
| `children` | `ReactNode` | — | Button label |

**States:**

| State | Night Mode | Day Mode |
|-------|------------|----------|
| Default | `bg-pawpaw-yellow` | `bg-[#ff8c42]` |
| Border | `border-pawpaw-yellowDark` | `border-[#e67700]` |
| Text | `text-pawpaw-navy` | `text-white` |
| Pressed | `active:opacity-90` | `active:opacity-90` |
| Disabled | `opacity: 0.7` | `opacity: 0.7` |
| Loading | ActivityIndicator replaces text | ActivityIndicator replaces text |

**Styling Pattern:**

```tsx
<Pressable
  onPress={handleAction}
  disabled={isLoading}
  className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90`}
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    opacity: isLoading ? 0.7 : 1,
  }}
>
  <Text className={`${buttonText} text-base text-center tracking-wide`}>
    BUTTON TEXT
  </Text>
</Pressable>
```

---

#### Secondary Button (Outline)

Used for secondary actions like "Sign Out" or "Cancel".

**States:**

| State | Night Mode | Day Mode |
|-------|------------|----------|
| Background | Transparent | Transparent |
| Border | `border-pawpaw-border` | `border-[#e3d9cf]` |
| Text | `text-pawpaw-gray` | `text-[#8a7f75]` |
| Pressed | `active:opacity-70` | `active:opacity-70` |

**Styling Pattern:**

```tsx
<Pressable
  onPress={handleAction}
  className={`flex-row items-center justify-center py-4 rounded-2xl border-2 ${borderColor}`}
>
  <Ionicons name="log-out-outline" size={20} color={iconColor} />
  <Text className={`${secondaryText} text-base ml-2`}>
    Sign Out
  </Text>
</Pressable>
```

---

#### Ghost Button (Text Only)

Used for tertiary actions like "Skip" or "Forgot password?".

**States:**

| State | Visual |
|-------|--------|
| Default | Accent-colored text only |
| Pressed | `active:opacity-70` |

**Styling Pattern:**

```tsx
<Pressable onPress={handleAction} className="active:opacity-70">
  <Text className={`${accentColor} text-[15px]`}>
    Skip for now
  </Text>
</Pressable>
```

---

#### Icon Button

Used for circular actions like play/pause, back navigation, or delete.

**Variants:**

| Variant | Size | Usage |
|---------|------|-------|
| Large | 128px (`w-32 h-32`) | Recording button |
| Medium | 48px (`w-12 h-12`) | Play/pause in lists |
| Small | 44px (`w-11 h-11`) | Back navigation |
| Tiny | 24px (`w-6 h-6`) | Inline play icons |

**Styling Pattern (Back Button):**

```tsx
<Pressable
  onPress={() => router.back()}
  className={`w-11 h-11 rounded-full items-center justify-center ${cardBg} border-b-[3px] ${borderColor}`}
>
  <Ionicons name="arrow-back" size={20} color={iconColor} />
</Pressable>
```

---

#### Destructive Button

Used for irreversible actions like "Delete Account".

**Styling:**

```tsx
<Pressable
  onPress={handleDelete}
  disabled={isDeleting}
  className={`flex-row items-center justify-center py-4 rounded-2xl border-2 border-red-400`}
>
  <Ionicons name="trash-outline" size={20} color="#ef4444" />
  <Text className="text-red-400 text-base ml-2">
    Delete Account
  </Text>
</Pressable>
```

---

### Card

Cards are the primary content containers in PawpawStory, featuring consistent elevation and border treatments.

#### Standard Card

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onPress` | `() => void` | Optional press handler |
| `children` | `ReactNode` | Card content |

**Visual Characteristics:**

- Background: Card surface color
- Border: 4px bottom border for depth
- Border Radius: 16px (`rounded-2xl`)
- Shadow: Standard card shadow

**Styling Pattern:**

```tsx
<View
  className={`${cardBg} rounded-2xl p-4 border-b-4 ${borderColor}`}
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  }}
>
  {children}
</View>
```

---

#### Story Card

A horizontal card displaying story information with cover image.

**Structure:**

```
┌─────────────────────────────────────────┐
│ ┌────────┐                              │
│ │        │  Title (ExtraBold)           │
│ │ Cover  │  Description (Bold)          │
│ │ Image  │  ⏱ Duration    [Narrator] ▶ │
│ │ 96x96  │                              │
│ └────────┘                              │
└─────────────────────────────────────────┘
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `story` | `Story` | Story data object |
| `isNightMode` | `boolean` | Current theme state |
| `onPress` | `() => void` | Press handler |

---

#### Quick Access Card

A vertical card for feature shortcuts.

**Structure:**

```
┌─────────────────┐
│                 │
│      (○)        │  ← Icon in colored circle
│     Label       │
│                 │
└─────────────────┘
```

**Dimensions:** `flex-1` width, 108px height

---

#### Profile Card

A large centered card for user information.

**Structure:**

```
┌─────────────────────────────────────────┐
│                                         │
│              ┌─────────┐                │
│              │ Avatar  │                │
│              │  96x96  │                │
│              └─────────┘                │
│                                         │
│         Hello, [Username]               │
│       Joined since [Date]               │
│                                         │
└─────────────────────────────────────────┘
```

**Border Radius:** 24px (`rounded-3xl`)

---

#### Stat Card

A compact card for displaying metrics.

**Structure:**

```
┌───────────────┐
│      12       │  ← Accent color, ExtraBold
│  Stories Read │  ← Secondary text
└───────────────┘
```

---

### Input

Text inputs follow a consistent style with subtle borders and proper spacing.

#### Text Input

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Input value |
| `onChangeText` | `(text: string) => void` | Change handler |
| `placeholder` | `string` | Placeholder text |
| `secureTextEntry` | `boolean` | Password masking |
| `keyboardType` | `KeyboardType` | Keyboard configuration |
| `autoComplete` | `AutoComplete` | Autofill hints |
| `textContentType` | `TextContentType` | iOS autofill |
| `editable` | `boolean` | Disable during loading |

**Styling Pattern:**

```tsx
<View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
  <TextInput
    className="px-4 py-3 text-base"
    style={{ 
      fontFamily: 'Nunito_400Regular',
      color: isNightMode ? '#f8f9fa' : '#3d3630',
    }}
    placeholder="Enter value"
    placeholderTextColor={placeholderColor}
    value={value}
    onChangeText={onChange}
  />
</View>
```

#### Search Input

Includes search icon prefix and clear button.

```tsx
<View className={`flex-row items-center ${inputBg} rounded-2xl px-4 py-3 border-b-[3px] ${inputBorder}`}>
  <Ionicons name="search" size={20} color={placeholderColor} />
  <TextInput className="flex-1 ml-2" ... />
  {value.length > 0 && (
    <Pressable onPress={clearSearch}>
      <Ionicons name="close-circle" size={20} color={placeholderColor} />
    </Pressable>
  )}
</View>
```

---

## Usage Guidelines

### Color Usage

#### Primary vs. Secondary Colors

| Use Case | Color Choice | Rationale |
|----------|--------------|-----------|
| Main CTA buttons | **Accent** (`#ffd166` / `#ff8c42`) | Draws attention to primary actions |
| Navigation links | **Accent** | Indicates interactivity |
| Headings | **Text Primary** | Hierarchy and readability |
| Body text | **Text Primary** | Optimal contrast |
| Metadata, hints | **Text Secondary** | Visual hierarchy without distraction |
| Disabled states | **Text Secondary** at 50% opacity | Indicates non-interactivity |
| Destructive actions | **Red** (`#ef4444`) | Universal danger signal |

#### Contrast Considerations

- Primary text on backgrounds maintains minimum 4.5:1 contrast ratio
- Accent colors on backgrounds maintain minimum 3:1 contrast for large text
- Never place accent text directly on accent backgrounds

---

### Theme Transition

PawpawStory implements theme switching through React Context with CSS variable manipulation.

#### Implementation Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ThemeContext                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ theme state │  │ toggleTheme │  │  isDayMode  │ │
│  │ 'day'|'night'│  │  function   │  │   boolean   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│               CSS Variable Layer                    │
│  :root { --color-background: 30 39 73; }           │
│  .theme-day { --color-background: 245 237 230; }   │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│            Tailwind/NativeWind Classes              │
│  bg-background → rgb(var(--color-background))      │
└─────────────────────────────────────────────────────┘
```

#### Usage in Components

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { isDayMode, toggleTheme } = useTheme();
  const isNightMode = !isDayMode;
  
  // Define theme-aware colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  
  return (
    <View className={`flex-1 ${bg}`}>
      <Text className={primaryText}>Content</Text>
    </View>
  );
}
```

#### Theme Toggle Component

The `ThemeToggle` component provides an animated switch between modes:

- **Location:** Global header (top-right corner)
- **Animation:** Spring-based knob translation
- **Icons:** Sun (day) and Moon (night) indicators
- **Feedback:** Immediate visual + haptic

---

### Accessibility Considerations

1. **Color Contrast:** All text meets WCAG AA standards
2. **Touch Targets:** Minimum 44×44pt for interactive elements
3. **Hit Slop:** Extended touch areas on small icons (`hitSlop={10}`)
4. **Loading States:** ActivityIndicator with proper color contrast
5. **Disabled States:** Visual dimming (50% opacity) + `disabled` prop
6. **Text Scaling:** Uses system font scaling via Nunito configuration

---

## File Reference

| File | Purpose |
|------|---------|
| `constants/theme.ts` | Base color definitions |
| `global.css` | CSS variables for theming |
| `tailwind.config.js` | NativeWind theme extensions |
| `contexts/ThemeContext.tsx` | Theme state management |
| `components/ThemeToggle.tsx` | Animated theme switcher |
| `components/themed-view.tsx` | Theme-aware View wrapper |
| `components/themed-text.tsx` | Theme-aware Text with variants |
| `components/GlobalHeader.tsx` | App header with logo + toggle |

---

*Last updated: February 2026*  
*Design System Version: 1.0*
