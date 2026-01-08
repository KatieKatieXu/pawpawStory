import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { usePlaybackProgress } from '@/contexts/PlaybackProgressContext';
import { useSavedVoices } from '@/contexts/SavedVoicesContext';
import { useTheme } from '@/contexts/ThemeContext';

// Profile menu items
const menuItems = [
  { icon: 'person-outline' as const, label: 'Edit Profile', route: '/edit-profile' },
];

export default function ProfileScreen() {
  const { isDayMode } = useTheme();
  const { user, isAuthenticated, signOut, deleteAccount } = useAuth();
  const { favorites } = useFavorites();
  const { savedVoices } = useSavedVoices();
  const { progress } = usePlaybackProgress();
  const isNightMode = !isDayMode;
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats counts
  const storiesReadCount = progress.length;
  const recordingsCount = savedVoices.length;
  const favoritesCount = favorites.length;

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

  // Get user avatar URL
  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || null;
  };

  const avatarUrl = getUserAvatar();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone. All your data including recordings, favorites, and progress will be permanently removed.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteAccount();
      if (error) {
        Alert.alert('Error', 'Failed to delete account. Please try again or contact support.');
        console.error('[Profile] Delete account error:', error);
      } else {
        Alert.alert(
          'Account Deleted',
          'Your account has been successfully deleted.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('[Profile] Delete account exception:', error);
    } finally {
      setIsDeleting(false);
    }
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
                className="w-24 h-24 rounded-full items-center justify-center mb-4 overflow-hidden"
                style={{ backgroundColor: iconBg }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: 96, height: 96 }}
                    contentFit="cover"
                  />
                ) : (
                  <Ionicons name="person" size={48} color={iconColor} />
                )}
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
                  {storiesReadCount}
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
                  {recordingsCount}
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
                  {favoritesCount}
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

          {/* Delete Account Button - Only show when authenticated */}
          {isAuthenticated && (
            <View className="px-6 mt-4 mb-8">
              <Pressable
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                className={`flex-row items-center justify-center py-4 rounded-2xl border-2 border-red-400 ${isDeleting ? 'opacity-50' : ''}`}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#ef4444"
                />
                <Text
                  className="text-red-400 text-base ml-2"
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
    </View>
  );
}

