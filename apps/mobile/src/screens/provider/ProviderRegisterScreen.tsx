import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { mobileApiFetch } from '../../services/api';

const MAIN_CATEGORIES = [
  { id: 'home-maintenance', name: 'Home Maintenance' },
  { id: 'vehicle-services', name: 'Vehicle Services' },
  { id: 'construction-and-labour', name: 'Construction & Labour' },
  { id: 'personal-and-lifestyle', name: 'Personal & Lifestyle' },
  { id: 'professional-and-technical', name: 'Technical & IT' },
  { id: 'other-services', name: 'Other Services' },
];

export const ProviderRegisterScreen = ({ navigation }: any) => {
  const { refreshUser, switchMode } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('home-maintenance');
  const [skills, setSkills] = useState('Plumbing, Pipe Fitting, Water Tank');
  const [baseRate, setBaseRate] = useState('500');
  const [docType, setDocType] = useState<'citizenship' | 'national_id' | 'driving_license'>('citizenship');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!bio || bio.length < 10) {
      Alert.alert('Bio Required', 'Please enter at least 10 characters describing your skills and experience.');
      return;
    }
    if (!docNumber) {
      Alert.alert('Identity Required', 'Please enter your document or citizenship number.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await mobileApiFetch('/providers/register', {
        method: 'POST',
        body: JSON.stringify({
          businessName: businessName || undefined,
          bio,
          categories: ['6639c0000000000000000001'], // Sample Category ObjectId
          subCategories: ['6639c0000000000000000002'], // Sample SubCategory ObjectId
          skills: skillsArray,
          experienceYears: 5,
          location: {
            type: 'Point',
            coordinates: [85.3582, 27.6715], // Lokanthali, Bhaktapur
          },
          address: {
            city: 'Bhaktapur',
            areaName: 'Lokanthali',
            formattedAddress: 'Lokanthali Chowk, Madhyapur Thimi',
          },
          serviceRadiusKm: 10,
          pricingModel: 'fixed',
          baseRate: parseInt(baseRate, 10) || 500,
          documents: {
            identityDocType: docType,
            identityNumber: docNumber,
            citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
          },
        }),
      });

      if (res.success) {
        Alert.alert(
          'Application Submitted!',
          'Your service provider registration has been submitted for verification. You can now access your provider dashboard.',
          [
            {
              text: 'Open Dashboard',
              onPress: async () => {
                await refreshUser();
                switchMode('provider');
                navigation.navigate('ProviderDashboard');
              },
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Ionicons name="shield-checkmark" size={32} color="#1e6fe8" />
        <Text style={styles.bannerTitle}>Join SEWANEXA Partner Network</Text>
        <Text style={styles.bannerSub}>
          Connect with thousands of local households in Nepal looking for skilled professionals.
        </Text>
      </View>

      {/* Basic Info */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>1. Professional Information</Text>

        <Text style={styles.label}>Business or Trade Name (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Sharma Plumbing Solutions"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.label}>Primary Service Category</Text>
        <View style={styles.categoryPills}>
          {MAIN_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === cat.id && styles.categoryPillTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Skills & Specializations (Comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Pipe repair, Sanitary, Water Tank, Taps"
          value={skills}
          onChangeText={setSkills}
        />

        <Text style={styles.label}>Professional Bio & Experience</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={3}
          placeholder="Describe your trade experience, customer commitment, and working hours..."
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Base Service Visit Fee (NPR)</Text>
        <TextInput
          style={styles.input}
          placeholder="500"
          keyboardType="numeric"
          value={baseRate}
          onChangeText={setBaseRate}
        />
      </View>

      {/* Verification Documents */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>2. Trust & Identity Verification</Text>
        <Text style={styles.helperText}>
          SEWANEXA requires a valid Nepali identity document to maintain high safety standards for customers.
        </Text>

        <Text style={styles.label}>Identity Document Type</Text>
        <View style={styles.docTypeRow}>
          {[
            { id: 'citizenship', label: 'Citizenship (नागरिकता)' },
            { id: 'driving_license', label: 'License' },
            { id: 'national_id', label: 'National ID' },
          ].map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[
                styles.docPill,
                docType === d.id && styles.docPillActive,
              ]}
              onPress={() => setDocType(d.id as any)}
            >
              <Text style={[styles.docPillText, docType === d.id && styles.docPillTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Document / Citizenship Number</Text>
        <TextInput
          style={styles.input}
          placeholder="27-01-70-12345"
          value={docNumber}
          onChangeText={setDocNumber}
        />

        <View style={styles.uploadBox}>
          <Ionicons name="cloud-upload-outline" size={28} color="#1e6fe8" />
          <Text style={styles.uploadText}>Identity Document Front Image</Text>
          <Text style={styles.uploadSub}>Tap to select or photograph (JPG, PNG)</Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitBtnText}>Submit Partner Application</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 8,
    textAlign: 'center',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryPillActive: {
    backgroundColor: '#1e6fe8',
    borderColor: '#1e6fe8',
  },
  categoryPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  docTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  docPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docPillActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#1e6fe8',
  },
  docPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  docPillTextActive: {
    color: '#1e6fe8',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#93c5fd',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginTop: 12,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e40af',
    marginTop: 6,
  },
  uploadSub: {
    fontSize: 10,
    color: '#60a5fa',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#1e6fe8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#1e6fe8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

