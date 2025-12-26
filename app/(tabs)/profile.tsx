import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Profile menu items
const menuItems = [
  { icon: 'person-outline' as const, label: 'Edit Profile', route: '/edit-profile' },
];

export default function ProfileScreen() {
  const { isDayMode } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const isNightMode = !isDayMode;

  // Format the join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get user display name (prioritize Apple name, then full_name, then email)
  const getUserName = () => {
    // Check for Apple name first (stored during Apple Sign-In)
    if (user?.user_metadata?.apple_name) {
      return user.user_metadata.apple_name;
    }
    // Then check for full_name (from signup or Apple)
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    // Fallback to email prefix
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const iconBg = isNightMode ? '#2b3a67' : '#e3d9cf';
  const iconColor = isNightMode ? '#ffd166' : '#ff8c42';

  return (
    <View className={`flex-1 ${bg}`}>
      <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Card */}
          <View className="px-6 mt-4">
            <View
              className={`${cardBg} rounded-3xl p-6 border-b-4 ${borderColor} items-center`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              {/* Avatar */}
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: iconBg }}
              >
                <Ionicons name="person" size={48} color={iconColor} />
              </View>

              {isAuthenticated && user ? (
                <>
                  <Text
                    className={`${primaryText} text-2xl`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    Hello, {getUserName()}
                  </Text>
                  <Text
                    className={`${secondaryText} text-base mt-1`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Joined since {formatJoinDate(user.created_at)}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    className={`${primaryText} text-2xl`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    Guest User
                  </Text>
                  <Text
                    className={`${secondaryText} text-base mt-1`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                  >
                    Sign in to save your progress
                  </Text>

                  {/* Sign In Button */}
                  <Pressable
                    onPress={() => router.push('/login')}
                    className={`mt-6 px-8 py-3 rounded-full ${isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]'}`}
                    style={{
                      shadowColor: isNightMode ? '#ffd166' : '#ff8c42',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text
                      className={`text-base ${isNightMode ? 'text-pawpaw-navy' : 'text-white'}`}
                      style={{ fontFamily: 'Nunito_700Bold' }}
                    >
                      Sign In
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Stats Section */}
          <View className="px-6 mt-8">
            <Text
              className={`${primaryText} text-lg mb-3`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              Your Stats
            </Text>
            <View className="flex-row gap-3">
              <View
                className={`flex-1 ${cardBg} rounded-2xl p-4 border-b-4 ${borderColor} items-center`}
              >
                <Text
                  className={`${accentColor} text-3xl`}
                  style={{ fontFamily: 'Nunito_800ExtraBold' }}
                >
                  0
                </Text>
                <Text
                  className={`${secondaryText} text-sm mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Stories Read
                </Text>
              </View>
              <View
                className={`flex-1 ${cardBg} rounded-2xl p-4 border-b-4 ${borderColor} items-center`}
              >
                <Text
                  className={`${accentColor} text-3xl`}
                  style={{ fontFamily: 'Nunito_800ExtraBold' }}
                >
                  0
                </Text>
                <Text
                  className={`${secondaryText} text-sm mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Recordings
                </Text>
              </View>
              <View
                className={`flex-1 ${cardBg} rounded-2xl p-4 border-b-4 ${borderColor} items-center`}
              >
                <Text
                  className={`${accentColor} text-3xl`}
                  style={{ fontFamily: 'Nunito_800ExtraBold' }}
                >
                  0
                </Text>
                <Text
                  className={`${secondaryText} text-sm mt-1`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Favorites
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-6 mt-8">
            <Text
              className={`${primaryText} text-lg mb-3`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              Settings
            </Text>
            <View className="gap-3">
              {menuItems.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => item.route && router.push(item.route as any)}
                  className={`flex-row items-center ${cardBg} rounded-2xl p-4 border-b-4 ${borderColor}`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: iconBg }}
                  >
                    <Ionicons name={item.icon} size={20} color={iconColor} />
                  </View>
                  <Text
                    className={`flex-1 ${primaryText} text-base`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    {item.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isNightMode ? '#c4cfdb' : '#8a7f75'}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Logout Button - Only show when authenticated */}
          {isAuthenticated && (
            <View className="px-6 mt-8">
              <Pressable
                onPress={handleSignOut}
                className={`flex-row items-center justify-center py-4 rounded-2xl border-2 ${borderColor}`}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={isNightMode ? '#c4cfdb' : '#8a7f75'}
                />
                <Text
                  className={`${secondaryText} text-base ml-2`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Sign Out
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
    </View>
  );
}

