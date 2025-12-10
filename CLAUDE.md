# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native application built with Expo, named "munti-crime-map". The project uses TypeScript with strict mode enabled and is configured to use React Native's new architecture (`newArchEnabled: true` in [app.json](app.json)).

**Stack:**

- Expo SDK ~54.0.27
- React Native 0.81.5
- React 19.1.0
- TypeScript ~5.9.2 (strict mode)

## Development Commands

**Start development server:**

```bash
npm start
# or
expo start
```

**Run on specific platforms:**

```bash
npm run android    # Launch on Android device/emulator
npm run ios        # Launch on iOS simulator (macOS only)
npm run web        # Launch in web browser
```

**Platform-specific development:**

```bash
expo start --android    # Start with Android
expo start --ios        # Start with iOS
expo start --web        # Start with web
```

## Project Structure

The project follows a flat structure with the main application entry points at the root level:

- [index.ts](index.ts) - Application entry point that registers the root component
- [App.tsx](App.tsx) - Main application component
- [app.json](app.json) - Expo configuration file
- [tsconfig.json](tsconfig.json) - TypeScript configuration (extends expo/tsconfig.base, strict mode enabled)
- `assets/` - Application assets (icons, splash screens)

## Configuration Details

### Expo Configuration ([app.json](app.json))

- **New Architecture:** Enabled (`newArchEnabled: true`)
- **Android:** Edge-to-edge enabled, predictive back gesture disabled
- **iOS:** Tablet support enabled
- **Orientation:** Locked to portrait mode
- **UI Style:** Light mode only (currently)

### TypeScript

The project uses strict TypeScript configuration, inheriting from Expo's base config with strict mode enabled. All type errors must be resolved before committing code.

## Development Notes

- This is an Expo managed workflow project
- The project uses the new React Native architecture; be aware of potential compatibility issues with older libraries
- When adding new dependencies, ensure they are compatible with React Native 0.81.5 and Expo SDK 54
- The project is currently in an initial state with minimal code structure

# React Native Expo Development Rules & Best Practices

## Project Context

Building an AI-Powered Geolocation Crime Mapping and Real-Time Emergency Alert System using React Native with Expo, NativeWind (Tailwind), TypeScript, and Supabase.

## Core Technologies

- **React Native + Expo SDK 52+**
- **TypeScript** (strict mode)
- **NativeWind** for styling (Tailwind CSS for React Native)
- **Expo Router** for navigation (file-based routing)
- **Supabase** for backend/database
- **Expo Location, Maps, Notifications**

## Critical Rules

### 1. Component Structure

- Always use functional components with TypeScript
- Use `.tsx` extension for all component files
- Follow this file structure:

```
app/
  ├── (tabs)/           # Tab navigation routes
  ├── (auth)/           # Auth-related screens
  ├── _layout.tsx       # Root layout
components/
  ├── ui/               # Reusable UI components
  ├── maps/             # Map-related components
  ├── crime/            # Crime-specific components
lib/
  ├── supabase.ts       # Supabase client
  ├── types.ts          # TypeScript types
  ├── utils.ts          # Utility functions
```

### 2. Styling with NativeWind

- **ALWAYS use NativeWind's className prop**, never StyleSheet
- Use Tailwind utility classes: `className="flex-1 bg-white p-4"`
- For custom styles, extend tailwind.config.js
- **DO NOT** use `style={}` prop - use `className` instead
- Platform-specific styles: `className="ios:pt-2 android:pt-4"`

**Good:**

```tsx
<View className="flex-1 items-center justify-center bg-gray-50">
  <Text className="text-2xl font-bold text-gray-900">Crime Map</Text>
</View>
```

**Bad:**

```tsx
<View style={{ flex: 1, alignItems: "center" }}>
  {" "}
  // ❌ Don't use style prop
  <Text style={styles.title}>Crime Map</Text> // ❌ Don't use StyleSheet
</View>
```

### 3. Expo Router Navigation

- Use file-based routing (Expo Router)
- Create screens in `app/` directory
- Use `<Link>` for navigation, not `navigation.navigate()`
- Dynamic routes: `app/crime/[id].tsx`
- Layouts: `_layout.tsx` for nested layouts

```tsx
import { Link, useRouter } from "expo-router";

// Navigation
<Link href="/crime/details" className="...">
  View Details
</Link>;

// Programmatic navigation
const router = useRouter();
router.push("/crime/123");
```

### 4. TypeScript Best Practices

- **Always** define types for props, state, and API responses
- Use interfaces for objects, types for unions/primitives
- Never use `any` - use `unknown` if type is truly unknown
- Define shared types in `lib/types.ts`

```tsx
interface CrimeRecord {
  id: string;
  crime_type: string;
  location_lat: number;
  location_lng: number;
  incident_date: string;
}

interface CrimeCardProps {
  crime: CrimeRecord;
  onPress: (id: string) => void;
}

export function CrimeCard({ crime, onPress }: CrimeCardProps) {
  // Component implementation
}
```

### 5. Supabase Integration

- Initialize Supabase client with AsyncStorage
- Use real-time subscriptions for live updates
- Always handle loading and error states
- Implement Row Level Security (RLS)

```tsx
import { supabase } from "@/lib/supabase";

// Fetching data
const { data, error, isLoading } = await supabase
  .from("crime_records")
  .select("*")
  .eq("visibility", "public");

// Real-time subscription
useEffect(() => {
  const channel = supabase
    .channel("crime_updates")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "crime_records" },
      (payload) => {
        // Handle real-time updates
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 6. State Management

- Use React hooks (useState, useEffect, useContext)
- For global state: Context API or Zustand (lightweight)
- Keep state close to where it's used
- Avoid prop drilling - use context for deeply nested data

```tsx
// Good: Local state
const [crimes, setCrimes] = useState<CrimeRecord[]>([]);

// Good: Global auth state
const { user, signOut } = useAuth(); // from AuthContext
```

### 7. Expo Modules & Permissions

- **Always request permissions before using device features**
- Handle permission denials gracefully
- Use Expo modules, not React Native equivalents

```tsx
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

// Location
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== "granted") {
  Alert.alert("Permission denied", "Location access is required");
  return;
}

// Notifications
const { status } = await Notifications.requestPermissionsAsync();
```

### 8. Maps Integration

- Use `react-native-maps` with Expo
- Always set initial region for MapView
- Use Marker for crime locations
- Implement clustering for many markers

```tsx
import MapView, { Marker, Heatmap } from "react-native-maps";

<MapView
  className="flex-1"
  initialRegion={{
    latitude: 14.3832, // Muntinlupa
    longitude: 121.0409,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {crimes.map((crime) => (
    <Marker
      key={crime.id}
      coordinate={{
        latitude: crime.location_lat,
        longitude: crime.location_lng,
      }}
      title={crime.crime_type}
    />
  ))}
</MapView>;
```

### 9. Performance Optimization

- Use `React.memo()` for expensive components
- Implement `FlatList` for long lists, never `ScrollView` with `.map()`
- Use `useMemo` and `useCallback` appropriately
- Lazy load images with `expo-image`
- Optimize re-renders by memoizing callbacks

```tsx
import { FlashList } from "@shopify/flash-list"; // Better than FlatList

<FlashList
  data={crimes}
  renderItem={({ item }) => <CrimeCard crime={item} />}
  estimatedItemSize={100}
  keyExtractor={(item) => item.id}
/>;
```

### 10. Error Handling & Loading States

- Always show loading indicators
- Handle errors gracefully with user-friendly messages
- Use try-catch for async operations
- Provide fallback UI for errors

```tsx
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

try {
  const { data, error } = await supabase.from("crime_records").select("*");
  if (error) throw error;
  setCrimes(data);
} catch (err) {
  setError(err instanceof Error ? err.message : "An error occurred");
} finally {
  setIsLoading(false);
}

if (isLoading) return <ActivityIndicator className="flex-1" />;
if (error) return <ErrorMessage message={error} />;
```

### 11. Environment Variables

- Use `.env` files with Expo
- Access via `process.env.EXPO_PUBLIC_*`
- Never commit sensitive keys

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx
```

```tsx
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
```

### 12. Code Organization

- One component per file
- Group related components in folders
- Use barrel exports (index.ts) for cleaner imports
- Keep components small (< 200 lines)

```tsx
// components/crime/index.ts
export { CrimeCard } from "./CrimeCard";
export { CrimeList } from "./CrimeList";
export { CrimeMap } from "./CrimeMap";

// Usage
import { CrimeCard, CrimeList } from "@/components/crime";
```

### 13. Naming Conventions

- Components: PascalCase (`CrimeCard.tsx`)
- Files: kebab-case for non-components (`crime-utils.ts`)
- Functions/variables: camelCase (`fetchCrimes`)
- Constants: UPPER_SNAKE_CASE (`MAX_RADIUS_KM`)
- Interfaces: PascalCase with 'I' prefix optional (`CrimeRecord`)

### 14. Testing

- Write tests for utility functions
- Test critical user flows (auth, emergency alerts)
- Use Jest + React Native Testing Library
- Mock Supabase calls in tests

### 15. Security

- Never store sensitive data in AsyncStorage unencrypted
- Use Supabase RLS for data access control
- Validate user input before submission
- Sanitize data before displaying
- Use HTTPS for all API calls

### 16. Accessibility

- Add `accessibilityLabel` to interactive elements
- Support screen readers
- Ensure touch targets are at least 44x44
- Use semantic HTML-like components

```tsx
<TouchableOpacity
  accessibilityLabel="Report crime incident"
  accessibilityRole="button"
  className="min-h-[44px] min-w-[44px]"
>
  <Text>Report</Text>
</TouchableOpacity>
```

## Common Pitfalls to Avoid

❌ **DON'T:**

- Use `StyleSheet.create()` - use NativeWind className
- Import from `react-native` when Expo has an equivalent
- Use `var` - always use `const` or `let`
- Mutate state directly - use setState
- Forget to unsubscribe from real-time listeners
- Skip error handling on async operations
- Use inline functions in render (causes re-renders)
- Hardcode API keys in code

✅ **DO:**

- Use NativeWind for all styling
- Use Expo modules (expo-location, expo-notifications)
- Use TypeScript strictly
- Handle loading, error, and success states
- Clean up subscriptions in useEffect cleanup
- Memoize expensive computations
- Extract reusable components
- Use environment variables

## Project-Specific Rules

### Crime Data

- Always check `visibility` field before displaying crimes
- Cache crime data locally for offline access
- Implement pull-to-refresh for crime list
- Show relative time (e.g., "2 hours ago") for incidents

### Geolocation

- Request location permission on first app launch
- Show user's current location on map
- Calculate distance from crime incidents
- Respect user's location privacy settings

### Notifications

- Request notification permission after user signs up
- Use local notifications for nearby crimes
- Implement notification channels (Android)
- Handle notification taps to open relevant screen

### Emergency Alerts

- Show prominent UI for emergency alerts
- Use red color scheme for critical alerts
- Play sound/vibration for urgent notifications
- Allow users to acknowledge alerts

## Development Workflow

1. **Start development server:**

```bash
   npx expo start
```

2. **Run on device:**

   - Scan QR code with Expo Go app
   - Or press `i` for iOS simulator, `a` for Android emulator

3. **Clear cache if issues:**

```bash
   npx expo start -c
```

4. **Type checking:**

```bash
   npx tsc --noEmit
```

5. **Build for production:**

```bash
   eas build --platform android
   eas build --platform ios
```

## Resources

- Expo Docs: https://docs.expo.dev
- NativeWind: https://www.nativewind.dev
- React Native: https://reactnative.dev
- Supabase: https://supabase.com/docs
