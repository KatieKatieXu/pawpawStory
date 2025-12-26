import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  ScrollView, 
  Text, 
  TextInput, 
  View 
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ForgotPasswordScreen() {
  const { isDayMode } = useTheme();
  const { resetPassword } = useAuth();
  const isNightMode = !isDayMode;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Theme colors
  const bg = isNightMode ? 'bg-pawpaw-navy' : 'bg-[#f5ede6]';
  const accentColor = isNightMode ? 'text-pawpaw-yellow' : 'text-[#ff8c42]';
  const primaryText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const secondaryText = isNightMode ? 'text-pawpaw-gray' : 'text-[#8a7f75]';
  const inputBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const inputBorder = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const inputText = isNightMode ? 'text-pawpaw-white' : 'text-[#3d3630]';
  const placeholderColor = isNightMode ? 'rgba(248,249,250,0.5)' : 'rgba(61,54,48,0.5)';
  const buttonBg = isNightMode ? 'bg-pawpaw-yellow' : 'bg-[#ff8c42]';
  const buttonBorder = isNightMode ? 'border-pawpaw-yellowDark' : 'border-[#e67700]';
  const buttonText = isNightMode ? 'text-pawpaw-navy' : 'text-white';
  const cardBg = isNightMode ? 'bg-pawpaw-navyLight' : 'bg-[#fdfbf8]';
  const borderColor = isNightMode ? 'border-pawpaw-border' : 'border-[#e3d9cf]';
  const successColor = isNightMode ? '#4ade80' : '#22c55e';

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <View className={`flex-1 ${bg}`}>
        <View className="flex-1 px-6 justify-center items-center">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${successColor}20` }}
          >
            <Ionicons name="mail" size={40} color={successColor} />
          </View>
          
          <Text
            className={`${primaryText} text-2xl text-center`}
            style={{ fontFamily: 'Nunito_800ExtraBold' }}
          >
            Check Your Email
          </Text>
          
          <Text
            className={`${secondaryText} text-base text-center mt-3 px-4`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            We sent a password reset link to{'\n'}
            <Text style={{ fontFamily: 'Nunito_700Bold' }}>{email}</Text>
          </Text>

          <Text
            className={`${secondaryText} text-sm text-center mt-6 px-8`}
            style={{ fontFamily: 'Nunito_400Regular' }}
          >
            Didn't receive the email? Check your spam folder or try again.
          </Text>

          <Pressable
            onPress={() => router.replace('/login')}
            className={`${buttonBg} rounded-2xl py-[18px] px-12 border-b-4 ${buttonBorder} active:opacity-90 mt-8`}
          >
            <Text
              className={`${buttonText} text-base text-center`}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              BACK TO LOGIN
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setEmailSent(false)}
            className="mt-4 active:opacity-70"
          >
            <Text
              className={`${accentColor} text-sm`}
              style={{ fontFamily: 'Nunito_700Bold' }}
            >
              Try a different email
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${bg}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <View className="px-6 pt-2">
            <Pressable
              onPress={() => router.back()}
              className={`w-11 h-11 rounded-full items-center justify-center ${cardBg} border-b-[3px] ${borderColor}`}
            >
              <Ionicons name="arrow-back" size={20} color={isNightMode ? '#f8f9fa' : '#3d3630'} />
            </Pressable>
          </View>

          {/* Content */}
          <View className="flex-1 px-6">
            {/* Title Section */}
            <View className="mt-8 mb-6">
              <Text
                className={`${primaryText} text-[32px] leading-[48px]`}
                style={{ fontFamily: 'Nunito_800ExtraBold' }}
              >
                Forgot Password?
              </Text>
              <Text
                className={`${secondaryText} text-base mt-1`}
                style={{ fontFamily: 'Nunito_400Regular' }}
              >
                No worries! Enter your email and we'll send you a reset link.
              </Text>
            </View>

            {/* Form Section */}
            <View className="gap-6">
              {/* Email Input */}
              <View className="gap-2">
                <Text
                  className={`${primaryText} text-sm`}
                  style={{ fontFamily: 'Nunito_700Bold' }}
                >
                  Email
                </Text>
                <View className={`${inputBg} rounded-2xl border-[1.5px] ${inputBorder}`}>
                  <TextInput
                    className={`px-4 py-3 ${inputText} text-base`}
                    style={{ fontFamily: 'Nunito_400Regular' }}
                    placeholder="Enter your email"
                    placeholderTextColor={placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Reset Button */}
              <Pressable
                onPress={handleResetPassword}
                disabled={isLoading}
                className={`${buttonBg} rounded-2xl py-[18px] border-b-4 ${buttonBorder} active:opacity-90 mt-4`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color={isNightMode ? '#1e2749' : '#ffffff'} />
                ) : (
                  <Text
                    className={`${buttonText} text-base text-center tracking-wide`}
                    style={{ fontFamily: 'Nunito_800ExtraBold' }}
                  >
                    SEND RESET LINK
                  </Text>
                )}
              </Pressable>

              {/* Back to Login Link */}
              <View className="flex-row justify-center items-center">
                <Text
                  className={`${secondaryText} text-[15px]`}
                  style={{ fontFamily: 'Nunito_400Regular' }}
                >
                  Remember your password?
                </Text>
                <Pressable 
                  onPress={() => router.push('/login')} 
                  className="active:opacity-70"
                  disabled={isLoading}
                >
                  <Text
                    className={`${accentColor} text-[15px] ml-1`}
                    style={{ fontFamily: 'Nunito_700Bold' }}
                  >
                    Log in
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

