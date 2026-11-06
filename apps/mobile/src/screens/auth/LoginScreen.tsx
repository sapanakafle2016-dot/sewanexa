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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
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
      setError(err.message || 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(phoneNumber, otp);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Banner */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="build" size={32} color="#ffffff" />
          </View>
          <Text style={styles.brandTitle}>SEWANEXA</Text>
          <Text style={styles.brandTagline}>Your Local Services, Connected.</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {step === 'phone' ? 'Mobile Sign In' : 'Verification Code'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {step === 'phone'
              ? 'Enter your Nepali phone number to receive an SMS verification code.'
              : `Enter the 6-digit OTP sent to +977 ${phoneNumber}`}
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {devOtp && step === 'otp' && (
            <View style={styles.devOtpBox}>
              <Ionicons name="checkmark-circle" size={16} color="#1d4ed8" />
              <Text style={styles.devOtpText}>
                Dev Mode Code: <Text style={styles.bold}>{devOtp}</Text>
              </Text>
            </View>
          )}

          {step === 'phone' ? (
            <View style={styles.form}>
              <Text style={styles.label}>Nepali Mobile Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.countryCodeText}>🇳🇵 +977</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="98XXXXXXXX"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, phoneNumber.length < 10 && styles.buttonDisabled]}
                disabled={loading || phoneNumber.length < 10}
                onPress={handleSendOtp}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Send Code</Text>
                    <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>6-Digit OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="123456"
                placeholderTextColor="#cbd5e1"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />

              <TouchableOpacity
                style={[styles.primaryButton, otp.length !== 6 && styles.buttonDisabled]}
                disabled={loading || otp.length !== 6}
                onPress={handleVerifyOtp}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Proceed</Text>
                )}
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => setStep('phone')}>
                  <Text style={styles.linkText}>Change Number</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={[styles.linkText, styles.boldLink]}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.disclaimer}>
          By continuing, you agree to SEWANEXA's Terms & Conditions and Safety Guidelines.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 24,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1e6fe8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1e6fe8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#b91c1c',
    flex: 1,
  },
  devOtpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  devOtpText: {
    fontSize: 12,
    color: '#1e40af',
  },
  bold: {
    fontWeight: '700',
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  phoneInputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  countryCodeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  primaryButton: {
    backgroundColor: '#1e6fe8',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#1e6fe8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#64748b',
  },
  boldLink: {
    color: '#1e6fe8',
    fontWeight: '700',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 24,
    lineHeight: 16,
    paddingHorizontal: 12,
  },
});

