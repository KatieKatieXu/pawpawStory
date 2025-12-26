import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

function TabBarIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons name={name} size={24} color={color} />;
}

function TabBarLabel({ label, focused, isNightMode }: { label: string; focused: boolean; isNightMode: boolean }) {
  const activeColor = isNightMode ? '#ffd166' : '#ff8c42';
  const inactiveColor = isNightMode ? '#c4cfdb' : '#8a7f75';

  return (
    <Text
      style={{
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 10,
        marginTop: 2,
        color: focused ? activeColor : inactiveColor,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const { isDayMode } = useTheme();
  const isNightMode = !isDayMode;

  const activeColor = isNightMode ? '#ffd166' : '#ff8c42';
  const inactiveColor = isNightMode ? '#c4cfdb' : '#8a7f75';
  const tabBarBg = isNightMode ? 'rgba(43, 58, 103, 0.95)' : 'rgba(253, 251, 248, 0.95)';
  const borderColor = isNightMode ? '#7b8fb8' : '#e3d9cf';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 24,
          height: 80,
        },
      }}
    >
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="Browse" focused={focused} isNightMode={isNightMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: 'Record',
          tabBarIcon: ({ color }) => <TabBarIcon name="mic-outline" color={color} />,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="Record" focused={focused} isNightMode={isNightMode} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="Profile" focused={focused} isNightMode={isNightMode} />
          ),
        }}
      />
      {/* Hide index and explore from tab bar - they're legacy screens */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
          tabBarStyle: { display: 'none' }, // Hide entire tab bar on this screen
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
