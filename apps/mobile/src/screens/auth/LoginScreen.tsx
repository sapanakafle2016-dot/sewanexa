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

// Majestic Nepal Himalayas mountain landscape (Mount Ama Dablam / Everest region)
const NEPAL_MOUNTAIN_BG =
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1080&auto=format&fit=crop';

export const LoginScreen = ({ navigation }: any) => {
  const { sendOtp, verifyOtp, loginWithGoogle } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGmail, setCustomGmail] = useState('');

  const handleGoogleLogin = async (email?: string, name?: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      const selectedEmail = (email || customGmail).toLowerCase().trim();
      if (!selectedEmail || !selectedEmail.includes('@')) {
        throw new Error('कृपया सही Gmail ठेगाना प्रविष्ट गर्नुहोस् (Valid Gmail required)');
      }
      const selectedName = name || selectedEmail.split('@')[0];
      await loginWithGoogle({
        email: selectedEmail,
        name: selectedName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedName)}`,
      });
      setShowGoogleModal(false);
      if (navigation?.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation?.navigate) {
        navigation.navigate('CustomerRoot');
      }
    } catch (err: any) {
      setError(err.message || 'गुगल लगइन गर्न सकिएन। पुनः प्रयास गर्नुहोस्।');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('कृपया १० अङ्कको सही मोबाइल नम्बर राख्नुहोस् (Valid 10-digit number required)');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(phoneNumber);
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
      setStep('otp');
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
      if (navigation?.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation?.navigate) {
        navigation.navigate('CustomerRoot');
      }
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
      const code = res.devOtp || '123456';
      await verifyOtp(num, code);
      if (navigation?.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation?.navigate) {
        navigation.navigate('CustomerRoot');
      }
    } catch (err: any) {
      setPhoneNumber(num);
      setStep('otp');
      setOtp('123456');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDevOtp = () => {
    if (devOtp) {
      setOtp(devOtp);
    }
  };

  return (
    <ImageBackground
      source={{ uri: NEPAL_MOUNTAIN_BG }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      {/* Dark Translucent Atmosphere Overlay */}
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
              style={styles.guestCloseBtn}
              onPress={() => {
                if (navigation?.canGoBack && navigation.canGoBack()) {
                  navigation.goBack();
                } else if (navigation?.navigate) {
                  navigation.navigate('CustomerRoot');
                }
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.guestCloseText}>Explore Services</Text>
            </TouchableOpacity>

            {/* ── Brand Header with Official Logo & Nepal Mountain Backdrop ── */}
            <View style={styles.header}>
              <View style={styles.logoBadgeContainer}>
                <Image
                  source={require('../../../assets/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              {/* Slogan Banner */}
              <View style={styles.sloganContainer}>
                <Text style={styles.sloganText}>एप एक, सेवा अनेक।</Text>
              </View>

              <Text style={styles.brandSub}>
                घर-दैलोमै दक्ष प्राविधिक र स्थानीय सेवाहरू
              </Text>
            </View>

            {/* ── Form Card (Glassmorphism + High Contrast) ── */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {step === 'phone' ? 'लगइन वा दर्ता' : 'ओटीपी प्रमाणीकरण'}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {step === 'phone'
                    ? 'सेवा बुक गर्न वा सेवा दिन आफ्नो मोबाइल नम्बर राख्नुहोस्।'
                    : `+977 ${phoneNumber} मा प्राप्त भएको ६-अङ्कको सुरक्षा कोड: `}
                </Text>
              </View>

              {/* Error Notice */}
              {error && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#DC2626" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Dev Mode OTP Quick-Fill helper */}
              {devOtp && step === 'otp' && (
                <TouchableOpacity
                  style={styles.devOtpBox}
                  onPress={handleAutoFillDevOtp}
                  activeOpacity={0.7}
                >
                  <Ionicons name="flash" size={16} color="#1D4ED8" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.devOtpText}>
                      डेमो कोड: <Text style={styles.bold}>{devOtp}</Text>
                    </Text>
                    <Text style={styles.devOtpSub}>यहाँ थिचेर कोड तुरुन्त भर्नुहोस् (Tap to fill)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#1D4ED8" />
                </TouchableOpacity>
              )}

              {/* Step 1: Mobile Phone Input */}
              {step === 'phone' ? (
                <View style={styles.form}>
                  <Text style={styles.label}>मोबाइल नम्बर (Mobile Number)</Text>
                  <View style={styles.phoneInputRow}>
                    <View style={styles.countryCodeBadge}>
                      <Text style={styles.flagIcon}>🇳🇵</Text>
                      <Text style={styles.countryCodeText}>+977</Text>
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="98XXXXXXXX"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={(val) => {
                        setPhoneNumber(val.replace(/[^0-9]/g, ''));
                        if (error) setError(null);
                      }}
                      autoFocus
                    />
                    {phoneNumber.length > 0 && (
                      <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => setPhoneNumber('')}
                      >
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      phoneNumber.length < 10 && styles.buttonDisabled,
                    ]}
                    disabled={loading || phoneNumber.length < 10}
                    onPress={handleSendOtp}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>ओटीपी कोड पठाउनुहोस्</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Or Social Gmail Login Divider */}
                  <View style={styles.orDividerContainer}>
                    <View style={styles.orDividerLine} />
                    <Text style={styles.orDividerText}>वा Gmail मार्फत लगइन</Text>
                    <View style={styles.orDividerLine} />
                  </View>

                  {/* Google / Gmail Sign In Button */}
                  <TouchableOpacity
                    style={styles.googleLoginBtn}
                    onPress={() => setShowGoogleModal(true)}
                    activeOpacity={0.85}
                    disabled={googleLoading}
                  >
                    <Ionicons name="logo-google" size={18} color="#EA4335" />
                    <Text style={styles.googleLoginBtnText}>
                      {googleLoading ? 'लगइन हुँदैछ...' : 'Continue with Google / Gmail'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Step 2: 6-Digit OTP Input */
                <View style={styles.form}>
                  <Text style={styles.label}>६-अङ्कको सुरक्षा कोड (OTP Code)</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="••••••"
                    placeholderTextColor="#CBD5E1"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={(val) => {
                      setOtp(val.replace(/[^0-9]/g, ''));
                      if (error) setError(null);
                    }}
                    autoFocus
                  />

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      otp.length !== 6 && styles.buttonDisabled,
                    ]}
                    disabled={loading || otp.length !== 6}
                    onPress={handleVerifyOtp}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>पुष्टि गरी अगाडि बढ्नुहोस्</Text>
                        <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                      </>
                    )}
                  </TouchableOpacity>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => {
                        setStep('phone');
                        setOtp('');
                        setError(null);
                      }}
                    >
                      <Text style={styles.linkText}>← नम्बर परिवर्तन गर्नुहोस्</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSendOtp}>
                      <Text style={[styles.linkText, styles.boldLink]}>पुनः कोड पठाउनुहोस्</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── 1-Click Fast Login / Demo Switcher ── */}
              <View style={styles.fastLoginBox}>
                <View style={styles.fastLoginHeader}>
                  <Ionicons name="flash-outline" size={13} color="#6B7280" />
                  <Text style={styles.fastLoginHeading}>१-क्लिक द्रुत लगइन (FAST DEMO)</Text>
                </View>

                {/* Service Provider */}
                <TouchableOpacity
                  style={styles.fastLoginBtnProvider}
                  onPress={() => handleQuickDemo('9841000000')}
                  activeOpacity={0.8}
                >
                  <View style={styles.providerBadgeIcon}>
                    <Ionicons name="construct" size={18} color="#15803D" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.fastLoginBtnTitle}>सेवा प्रदायक (Provider Mode)</Text>
                      <View style={styles.verifiedChip}>
                        <Text style={styles.verifiedChipText}>प्रमाणित</Text>
                      </View>
                    </View>
                    <Text style={styles.fastLoginBtnSub}>
                      ९८४१०००००० • रमेश श्रेष्ठ (प्लम्बर / इलेक्ट्रिशियन)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#15803D" />
                </TouchableOpacity>

                {/* Customer / Client */}
                <TouchableOpacity
                  style={styles.fastLoginBtnCustomer}
                  onPress={() => handleQuickDemo('9841122334')}
                  activeOpacity={0.8}
                >
                  <View style={styles.customerBadgeIcon}>
                    <Ionicons name="person" size={18} color="#1D4ED8" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.fastLoginBtnTitle}>ग्राहक (Customer / Client Mode)</Text>
                      <View style={styles.clientChip}>
                        <Text style={styles.clientChipText}>उपभोक्ता</Text>
                      </View>
                    </View>
                    <Text style={styles.fastLoginBtnSub}>
                      ९८४११२२३३४ • साजन काफ्ले (लोकन्थली, भक्तपुर)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#1D4ED8" />
                </TouchableOpacity>
              </View>

              {/* Trust & Guarantee assurance */}
              <View style={styles.trustBadgeRow}>
                <View style={styles.trustItem}>
                  <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                  <Text style={styles.trustText}>eSewa & Khalti सुरक्षित</Text>
                </View>
                <Text style={styles.trustDivider}>•</Text>
                <View style={styles.trustItem}>
                  <Ionicons name="ribbon" size={14} color="#F59E0B" />
                  <Text style={styles.trustText}>प्रमाणित प्राविधिक</Text>
                </View>
              </View>
            </View>

            {/* Footer Notice */}
            <Text style={styles.disclaimer}>
              जारी राख्दा तपाईं SEWANEXA को सेवाका सर्तहरूसँग सहमत हुनुहुन्छ।{'\n'}
              सांगालो टेक प्रा. लि., लोकन्थली, भक्तपुर द्वारा सञ्चालित।
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ── Interactive Gmail / Google Dialog Modal ── */}
        {showGoogleModal && (
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.modalTitle}>Sign in with Google</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowGoogleModal(false)}
                  style={styles.modalCloseBtn}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                तपाईंको Google / Gmail खाता प्रविष्ट गर्नुहोस्:
              </Text>

              {/* Dynamic Gmail Input */}
              <View style={styles.customEmailBox}>
                <Text style={styles.customEmailLabel}>Gmail / Google Email:</Text>
                <View style={styles.customEmailRow}>
                  <TextInput
                    style={styles.customEmailInput}
                    placeholder="yourname@gmail.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoFocus
                    value={customGmail}
                    onChangeText={setCustomGmail}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { marginTop: 14 },
                    (!customGmail || !customGmail.includes('@')) && styles.buttonDisabled,
                  ]}
                  disabled={!customGmail || !customGmail.includes('@') || googleLoading}
                  onPress={() => handleGoogleLogin(customGmail)}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Continue with Google</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
    backgroundColor: 'rgba(10, 15, 30, 0.65)',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 36,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadgeContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
  },
  logoImage: {
    width: 200,
    height: 52,
  },
  sloganContainer: {
    backgroundColor: 'rgba(51, 30, 106, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  sloganText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  guestCloseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  guestCloseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: BRAND_DARK,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    flex: 1,
    fontWeight: '600',
    lineHeight: 16,
  },
  devOtpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
  },
  devOtpText: {
    fontSize: 13,
    color: '#1E40AF',
  },
  devOtpSub: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '600',
    marginTop: 1,
  },
  bold: {
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 14,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    gap: 5,
  },
  flagIcon: {
    fontSize: 15,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_DARK,
    letterSpacing: 1,
  },
  clearBtn: {
    paddingRight: 12,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 14,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 12,
    color: BRAND_DARK,
    backgroundColor: '#F9FAFB',
  },
  primaryButton: {
    backgroundColor: BRAND_PURPLE,
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: BRAND_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  boldLink: {
    color: BRAND_PURPLE,
    fontWeight: '800',
  },
  fastLoginBox: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  fastLoginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  fastLoginHeading: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  fastLoginBtnProvider: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    padding: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  providerBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fastLoginBtnCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 10,
    borderRadius: 16,
  },
  customerBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fastLoginBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: BRAND_DARK,
  },
  verifiedChip: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  verifiedChipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  clientChip: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  clientChipText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  fastLoginBtnSub: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '500',
    marginTop: 2,
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  trustDivider: {
    color: '#D1D5DB',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 18,
    lineHeight: 16,
    paddingHorizontal: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Social Google / Gmail Styles */
  orDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orDividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  googleLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleLoginBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },

  /* Google Dialog Modal */
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 10,
    marginBottom: 12,
    lineHeight: 16,
  },
  googleAccountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  accountName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  accountEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  customEmailBox: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  customEmailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  customEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customEmailInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  customEmailSubmit: {
    backgroundColor: BRAND_PURPLE,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  customEmailSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
