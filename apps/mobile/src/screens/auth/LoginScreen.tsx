import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const BRAND_PURPLE = '#331E6A';
const BRAND_GOLD = '#F59E0B';
const BRAND_DARK = '#111827';

const NEPAL_MOUNTAIN_BG =
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1080&auto=format&fit=crop';

export const LoginScreen = ({ navigation }: any) => {
  const { loginWithPassword, signupWithPassword, sendOtp, verifyOtp } = useAuth();

  // Mode: 'login' | 'signup' | 'phone_otp'
  const [mode, setMode] = useState<'login' | 'signup' | 'phone_otp'>('login');

  // Form states for Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [optionalPhone, setOptionalPhone] = useState('');

  // Form states for Phone OTP
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('CustomerRoot');
    }
  };

  // Submit Login with Email & Password
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('कृपया इमेल र पासवर्ड प्रविष्ट गर्नुहोस् (Email and password required)');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await loginWithPassword(email.trim(), password);
      handleRedirect();
    } catch (err: any) {
      setError(err.message || 'लगइन असफल भयो। कृपया इमेल वा पासवर्ड जाँच्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  // Submit Signup with Email & Password
  const handleEmailSignup = async () => {
    if (!name || !email || password.length < 6) {
      setError('कृपया नाम, इमेल र कम्तिमा ६ अक्षरको पासवर्ड राख्नुहोस्');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await signupWithPassword({
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: optionalPhone.trim() || undefined,
        role,
      });
      handleRedirect();
    } catch (err: any) {
      setError(err.message || 'दर्ता असफल भयो। पुनः प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  // Submit Phone OTP
  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('कृपया १० अङ्कको सही मोबाइल नम्बर राख्नुहोस् (Valid 10-digit number required)');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(phoneNumber);
      if (res && res.devOtp) {
        setDevOtp(res.devOtp);
      }
      setPhoneStep('otp');
    } catch (err: any) {
      setError(err.message || 'ओटीपी कोड पठाउन असफल भयो। पुनः प्रयास गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('कृपया ६ अङ्कको प्रमाणीकरण कोड प्रविष्ट गर्नुहोस्।');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(phoneNumber, otp);
      handleRedirect();
    } catch (err: any) {
      setError(err.message || 'अमान्य प्रमाणीकरण कोड। (Invalid OTP)');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (num: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(num);
      const code = res?.devOtp || '123456';
      await verifyOtp(num, code);
      handleRedirect();
    } catch {
      setMode('phone_otp');
      setPhoneNumber(num);
      setPhoneStep('otp');
      setOtp('123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: NEPAL_MOUNTAIN_BG }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      {/* Dark Translucent Overlay */}
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Close / Back Button to browse as guest */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (navigation?.canGoBack && navigation.canGoBack()) {
                  navigation.goBack();
                } else if (navigation?.navigate) {
                  navigation.navigate('CustomerRoot');
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Brand Logo & Welcome Heading */}
            <View style={styles.brandContainer}>
              <View style={styles.logoBadge}>
                <Image
                  source={require('../../../assets/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>SEWANEXA</Text>
              <Text style={styles.brandSubtitle}>
                {mode === 'login' && 'इमेल र पासवर्ड मार्फत लगइन गर्नुहोस्'}
                {mode === 'signup' && 'नयाँ खाता खोल्नुहोस् (Create Account)'}
                {mode === 'phone_otp' && 'नेपाली मोबाइल नम्बर OTP मार्फत लगइन'}
              </Text>
            </View>

            {/* Auth Card */}
            <View style={styles.card}>
              {/* Tab Selector: Login vs Sign Up */}
              {mode !== 'phone_otp' && (
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
                    onPress={() => {
                      setMode('login');
                      setError(null);
                    }}
                  >
                    <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                      लगइन (Log In)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
                    onPress={() => {
                      setMode('signup');
                      setError(null);
                    }}
                  >
                    <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                      दर्ता (Sign Up)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Error Message */}
              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ── MODE 1: Email & Password Login ── */}
              {mode === 'login' && (
                <View style={styles.formContainer}>
                  <Text style={styles.inputLabel}>इमेल ठेगाना (Email Address)</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="name@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>

                  <Text style={styles.inputLabel}>पासवर्ड (Password)</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.buttonDisabled]}
                    onPress={handleEmailLogin}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>लगइन गर्नुहोस् (Log In)</Text>
                        <Ionicons name="arrow-forward" size={18} color={BRAND_GOLD} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* ── MODE 2: Email & Password Signup ── */}
              {mode === 'signup' && (
                <View style={styles.formContainer}>
                  <Text style={styles.inputLabel}>पूरा नाम (Full Name)</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="e.g. Sajan Sharma"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <Text style={styles.inputLabel}>इमेल ठेगाना (Email Address)</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="mail-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="name@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>

                  <Text style={styles.inputLabel}>पासवर्ड (Password - min 6 chars)</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  <Text style={styles.inputLabel}>मोबाइल नम्बर (Phone - ऐच्छिक/Optional)</Text>
                  <View style={styles.inputRow}>
                    <Text style={styles.prefixText}>🇳🇵 +977</Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="98XXXXXXXX"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={optionalPhone}
                      onChangeText={(t) => setOptionalPhone(t.replace(/[^0-9]/g, ''))}
                    />
                  </View>

                  {/* Role Selection */}
                  <Text style={styles.inputLabel}>खाता प्रकार (Account Type)</Text>
                  <View style={styles.roleRow}>
                    <TouchableOpacity
                      style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
                      onPress={() => setRole('customer')}
                    >
                      <Ionicons
                        name="person"
                        size={16}
                        color={role === 'customer' ? BRAND_PURPLE : '#6B7280'}
                      />
                      <Text
                        style={[styles.roleText, role === 'customer' && styles.roleTextActive]}
                      >
                        ग्राहक (Customer)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleBtn, role === 'provider' && styles.roleBtnActive]}
                      onPress={() => setRole('provider')}
                    >
                      <Ionicons
                        name="briefcase"
                        size={16}
                        color={role === 'provider' ? BRAND_PURPLE : '#6B7280'}
                      />
                      <Text
                        style={[styles.roleText, role === 'provider' && styles.roleTextActive]}
                      >
                        सेवा प्रदायक (Provider)
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.buttonDisabled]}
                    onPress={handleEmailSignup}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>दर्ता गर्नुहोस् (Create Account)</Text>
                        <Ionicons name="arrow-forward" size={18} color={BRAND_GOLD} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* ── MODE 3: Phone OTP ── */}
              {mode === 'phone_otp' && (
                <View style={styles.formContainer}>
                  {devOtp && phoneStep === 'otp' && (
                    <TouchableOpacity
                      style={styles.devOtpBanner}
                      onPress={() => setOtp(devOtp)}
                    >
                      <Ionicons name="key" size={16} color="#1D4ED8" />
                      <Text style={styles.devOtpText}>
                        Dev OTP: <Text style={{ fontWeight: '800' }}>{devOtp}</Text> (Tap to Auto Fill)
                      </Text>
                    </TouchableOpacity>
                  )}

                  {phoneStep === 'phone' ? (
                    <>
                      <Text style={styles.inputLabel}>नेपाली मोबाइल नम्बर (Nepali Mobile Number)</Text>
                      <View style={styles.inputRow}>
                        <Text style={styles.prefixText}>🇳🇵 +977</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="98XXXXXXXX"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="phone-pad"
                          maxLength={10}
                          value={phoneNumber}
                          onChangeText={(t) => setPhoneNumber(t.replace(/[^0-9]/g, ''))}
                        />
                      </View>

                      <TouchableOpacity
                        style={[styles.primaryButton, loading && styles.buttonDisabled]}
                        onPress={handleSendOtp}
                        disabled={loading}
                        activeOpacity={0.85}
                      >
                        {loading ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <>
                            <Text style={styles.primaryButtonText}>OTP कोड पठाउनुहोस्</Text>
                            <Ionicons name="arrow-forward" size={18} color={BRAND_GOLD} />
                          </>
                        )}
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.inputLabel}>६ अङ्कको कोड (6-Digit OTP Code)</Text>
                      <TextInput
                        style={styles.otpInputField}
                        placeholder="123456"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, ''))}
                      />

                      <TouchableOpacity
                        style={[styles.primaryButton, loading && styles.buttonDisabled]}
                        onPress={handleVerifyOtp}
                        disabled={loading}
                        activeOpacity={0.85}
                      >
                        {loading ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <Text style={styles.primaryButtonText}>पुष्टि गर्नुहोस् (Verify & Log In)</Text>
                        )}
                      </TouchableOpacity>

                      <View style={styles.otpActions}>
                        <TouchableOpacity onPress={() => setPhoneStep('phone')}>
                          <Text style={styles.linkText}>← नम्बर फेर्नुहोस्</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSendOtp}>
                          <Text style={styles.linkText}>पुनः पठाउनुहोस् (Resend)</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => {
                      setMode('login');
                      setError(null);
                    }}
                  >
                    <Text style={styles.backLinkText}>← इमेल र पासवर्ड लगइनमा फर्कनुहोस्</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Option to toggle Phone OTP when in email mode */}
              {mode !== 'phone_otp' && (
                <View style={styles.alternativeSection}>
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>अथवा (OR)</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity
                    style={styles.phoneOptionBtn}
                    onPress={() => {
                      setMode('phone_otp');
                      setError(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="phone-portrait-outline" size={18} color={BRAND_PURPLE} />
                    <Text style={styles.phoneOptionText}>
                      मोबाइल नम्बर OTP मार्फत लगइन (Phone OTP)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Fast 1-Click Role Login Demo */}
              <View style={styles.demoSection}>
                <Text style={styles.demoHeading}>द्रुत परीक्षण लगइन (1-Click Demo)</Text>
                <View style={styles.demoGrid}>
                  <TouchableOpacity
                    style={styles.demoChip}
                    onPress={() => handleQuickDemo('9800000000')}
                  >
                    <Ionicons name="shield-checkmark" size={14} color="#7C3AED" />
                    <Text style={styles.demoChipText}>Admin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.demoChip}
                    onPress={() => handleQuickDemo('9841000000')}
                  >
                    <Ionicons name="briefcase" size={14} color="#059669" />
                    <Text style={styles.demoChipText}>Provider</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.demoChip}
                    onPress={() => handleQuickDemo('9841122334')}
                  >
                    <Ionicons name="person" size={14} color="#2563EB" />
                    <Text style={styles.demoChipText}>Customer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 10, 35, 0.75)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
  },
  logoImage: {
    width: 140,
    height: 42,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabTextActive: {
    color: BRAND_PURPLE,
    fontWeight: '900',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  formContainer: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  prefixText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    marginRight: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputField: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  otpInputField: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#111827',
    height: 52,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    gap: 6,
    backgroundColor: '#F9FAFB',
  },
  roleBtnActive: {
    borderColor: BRAND_PURPLE,
    backgroundColor: '#FAF5FF',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  roleTextActive: {
    color: BRAND_PURPLE,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: BRAND_PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
    gap: 8,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  devOtpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 10,
    gap: 6,
  },
  devOtpText: {
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '600',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  linkText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  backLinkText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  alternativeSection: {
    marginTop: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  phoneOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 11,
    borderRadius: 14,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  phoneOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_DARK,
  },
  demoSection: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  demoHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  demoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  demoChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
});
