import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { mobileApiFetch } from '../../services/api';

export const ProviderDashboardScreen = ({ navigation }: any) => {
  const { providerProfile, switchMode } = useAuth();

  const [isOnline, setIsOnline] = useState(providerProfile?.isOnline ?? true);
  const [walletBalance, setWalletBalance] = useState(providerProfile?.wallet?.currentBalance || 0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProviderJobs = async () => {
    setLoading(true);
    try {
      const res = await mobileApiFetch('/bookings/my?role=provider');
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      // Mock demo jobs
      setJobs([
        {
          _id: 'job1',
          bookingCode: 'SWX-2026-10492',
          customerId: { name: 'Sajan Kafle', phoneNumber: '9841234567' },
          subCategoryId: { name: 'Plumbing Services' },
          status: 'requested',
          address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
          description: 'Bathroom pipe joint is leaking water onto floor. Need immediate repair.',
          payment: { totalAmount: 500, method: 'cash' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderJobs();
  }, []);

  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    try {
      await mobileApiFetch('/providers/toggle-online', {
        method: 'PUT',
        body: JSON.stringify({ isOnline: value }),
      });
    } catch (err) {
      console.warn('Failed to update online status:', err);
    }
  };

  const handleUpdateJobStatus = async (jobId: string, status: string) => {
    try {
      const res = await mobileApiFetch(`/bookings/${jobId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      if (res.success) {
        Alert.alert('Status Updated', `Job marked as ${status}.`);
        fetchProviderJobs();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update job status.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Switch to Customer Mode */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Provider Control Hub</Text>
          <Text style={styles.headerSub}>SEWANEXA Partner Nepal</Text>
        </View>

        <TouchableOpacity
          style={styles.switchModeBtn}
          onPress={() => switchMode('customer')}
        >
          <Ionicons name="swap-horizontal" size={16} color="#331E6A" />
          <Text style={[styles.switchModeText, { color: '#331E6A' }]}>Customer Mode</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Availability Radar Card */}
        <View style={[styles.card, isOnline ? styles.cardOnline : styles.cardOffline]}>
          <View style={styles.availabilityRow}>
            <View style={styles.statusInfo}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? '#10b981' : '#94a3b8' }]} />
              <View>
                <Text style={styles.statusTitle}>
                  {isOnline ? 'You Are Online & Discoverable' : 'You Are Offline'}
                </Text>
                <Text style={styles.statusSubtitle}>
                  {isOnline
                    ? 'Receiving nearby customer job alerts within your radius'
                    : 'Turn on availability to receive service requests'}
                </Text>
              </View>
            </View>

            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
              thumbColor={isOnline ? '#1e6fe8' : '#f1f5f9'}
            />
          </View>
        </View>

        {/* Provider Wallet & Commission Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View>
              <Text style={styles.walletLabel}>Earnings & Commission Ledger</Text>
              <Text style={styles.walletBalance}>NPR {walletBalance}</Text>
            </View>
            <View style={styles.walletBadge}>
              <Ionicons name="wallet-outline" size={20} color="#15803d" />
            </View>
          </View>

          <View style={styles.walletFooter}>
            <View style={styles.walletCol}>
              <Text style={styles.colLabel}>Platform Fee Rate</Text>
              <Text style={styles.colValue}>10%</Text>
            </View>
            <View style={styles.walletCol}>
              <Text style={styles.colLabel}>Status</Text>
              <Text style={[styles.colValue, { color: '#15803d' }]}>Good Standing</Text>
            </View>
            <View style={styles.walletCol}>
              <Text style={styles.colLabel}>Rating</Text>
              <Text style={styles.colValue}>
                ★ {providerProfile?.ratings?.average || 4.9}
              </Text>
            </View>
          </View>
        </View>

        {/* Incoming & Active Jobs Queue */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incoming & Active Jobs</Text>
          <TouchableOpacity onPress={fetchProviderJobs}>
            <Ionicons name="refresh" size={18} color="#1e6fe8" />
          </TouchableOpacity>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="radio-outline" size={40} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Radar Active</Text>
            <Text style={styles.emptySub}>
              Waiting for new customer bookings nearby. Keep your phone notifications on!
            </Text>
          </View>
        ) : (
          jobs.map((job) => (
            <View key={job._id} style={styles.jobCard}>
              <View style={styles.jobTopRow}>
                <View>
                  <Text style={styles.jobCode}>{job.bookingCode}</Text>
                  <Text style={styles.jobService}>{job.subCategoryId?.name}</Text>
                </View>
                <Text style={styles.jobPrice}>NPR {job.payment?.totalAmount}</Text>
              </View>

              <Text style={styles.jobDesc}>{job.description}</Text>

              <View style={styles.jobMeta}>
                <Ionicons name="location" size={14} color="#64748b" />
                <Text style={styles.jobAddress}>
                  {job.address?.areaName}, {job.address?.city}
                </Text>
                <Text style={styles.dotSeparator}>•</Text>
                <Ionicons name="person" size={14} color="#64748b" />
                <Text style={styles.jobCustomer}>{job.customerId?.name || 'Customer'}</Text>
              </View>

              {/* ── Client Live Location & Navigation HUD for Provider ── */}
              {(job.status === 'accepted' ||
                job.status === 'en_route' ||
                job.status === 'in_progress') && (
                <View style={styles.clientTrackingHud}>
                  <View style={styles.clientTrackingHeader}>
                    <View style={styles.liveNavPill}>
                      <View style={styles.liveNavDot} />
                      <Text style={styles.liveNavText}>
                        {job.status === 'accepted'
                          ? 'स्वीकृत • यात्रा सुरु गर्नुहोस्'
                          : job.status === 'en_route'
                          ? 'बाटोमा • प्रत्यक्ष नेभिगेसन'
                          : 'स्थानमा पुग्नुभयो • कार्य सुरु'}
                      </Text>
                    </View>
                    <Text style={styles.clientEtaText}>दूरी: ~१.८ कि.मि. (७ मि.)</Text>
                  </View>

                  <View style={styles.clientLocRow}>
                    <Ionicons name="location" size={18} color="#E52E2E" />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.clientLocTitle}>ग्राहकको ठेगाना (Customer Destination):</Text>
                      <Text style={styles.clientLocVal}>
                        {job.address?.formattedAddress ||
                          `${job.address?.areaName || 'Lokanthali'}, ${
                            job.address?.city || 'Bhaktapur'
                          }`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.clientActionRow}>
                    <TouchableOpacity
                      style={styles.openNavBtn}
                      onPress={() => {
                        const lat = job.jobLocation?.coordinates?.[1] || 27.671;
                        const lng = job.jobLocation?.coordinates?.[0] || 85.3587;
                        const url = Platform.select({
                          ios: `maps:0,0?q=${lat},${lng}`,
                          android: `geo:0,0?q=${lat},${lng}`,
                          default: `https://maps.google.com/?q=${lat},${lng}`,
                        });
                        Linking.openURL(url as string);
                      }}
                    >
                      <Ionicons name="navigate-circle" size={18} color="#FFFFFF" />
                      <Text style={styles.openNavBtnText}>Google Maps नेभिगेसन</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.callClientBtn}
                      onPress={() => {
                        const phone = job.customerId?.phoneNumber || '9841122334';
                        Linking.openURL(`tel:${phone}`);
                      }}
                    >
                      <Ionicons name="call" size={16} color="#16A34A" />
                      <Text style={styles.callClientBtnText}>कल</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Action Buttons depending on job status */}
              {job.status === 'requested' && (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleUpdateJobStatus(job._id, 'rejected')}
                  >
                    <Text style={styles.rejectBtnText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleUpdateJobStatus(job._id, 'accepted')}
                  >
                    <Text style={styles.acceptBtnText}>Accept Job</Text>
                  </TouchableOpacity>
                </View>
              )}

              {job.status === 'accepted' && (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleUpdateJobStatus(job._id, 'en_route')}
                  >
                    <Ionicons name="navigate" size={16} color="#ffffff" />
                    <Text style={styles.actionBtnText}>Start Journey (En Route)</Text>
                  </TouchableOpacity>
                </View>
              )}

              {job.status === 'en_route' && (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleUpdateJobStatus(job._id, 'in_progress')}
                  >
                    <Ionicons name="construct" size={16} color="#ffffff" />
                    <Text style={styles.actionBtnText}>Arrived & Start Work</Text>
                  </TouchableOpacity>
                </View>
              )}

              {job.status === 'in_progress' && (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#16a34a' }]}
                    onPress={() => handleUpdateJobStatus(job._id, 'completed')}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#ffffff" />
                    <Text style={styles.actionBtnText}>Service Completed & Collect Fee</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  switchModeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  cardOnline: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  cardOffline: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  walletLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  walletBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  walletCol: {
    alignItems: 'center',
  },
  colLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  colValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e6fe8',
  },
  jobService: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#15803d',
  },
  jobDesc: {
    fontSize: 12,
    color: '#475569',
    marginVertical: 10,
    lineHeight: 18,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  jobAddress: {
    fontSize: 11,
    color: '#64748b',
  },
  dotSeparator: {
    color: '#cbd5e1',
    marginHorizontal: 4,
  },
  jobCustomer: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc2626',
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center',
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#331E6A',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  clientTrackingHud: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  clientTrackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  liveNavDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16a34a',
  },
  liveNavText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  clientEtaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  clientLocRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  clientLocTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  clientLocVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 1,
  },
  clientActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  openNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d4ed8',
    paddingVertical: 9,
    borderRadius: 12,
    gap: 6,
  },
  openNavBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  callClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 4,
  },
  callClientBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
});

