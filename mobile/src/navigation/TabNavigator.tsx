import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Home, Search, PenLine, User } from 'lucide-react-native'
import { colors } from '../theme'
import HomeScreen from '../screens/home/HomeScreen'
import ExploreScreen from '../screens/explore/ExploreScreen'
import CreateScreen from '../screens/create/CreateScreen'
import ProfileScreen from '../screens/profile/ProfileScreen'

const Tab = createBottomTabNavigator()

type LucideIcon = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>

function TabIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      {/* Top bar indicator — appears above icon when active */}
      <View style={[styles.bar, focused && styles.barActive]} />
      <Icon
        size={22}
        color={focused ? colors.primary : colors.gray400}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  )
}

function TabBackground() {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.tabBg,
        { paddingBottom: insets.bottom },
      ]}
    />
  )
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // Explicit background replaces React Navigation's default blur layer
        tabBarBackground: () => <TabBackground />,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Search} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={PenLine} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  // Transparent — TabBackground handles color + border
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBg: {
    backgroundColor: colors.white,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 2,
  },
  tabItem: {
    alignItems: 'center',
    gap: 8,
  },
  // Placeholder space always present so layout doesn't shift
  bar: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'transparent',
  },
  barActive: {
    backgroundColor: colors.primary,
  },
})
