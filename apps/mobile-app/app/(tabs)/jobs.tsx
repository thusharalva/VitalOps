import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function JobsScreen() {
  const jobs = [
    { id: '1', title: 'Installation - CPAP Machine', customer: 'John Doe', time: '10:00 AM', status: 'pending' },
    { id: '2', title: 'Pickup - Oxygen Concentrator', customer: 'Jane Smith', time: '2:00 PM', status: 'pending' },
    { id: '3', title: 'Service - Sleep Study Device', customer: 'Bob Johnson', time: '4:00 PM', status: 'completed' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ScrollView>
    </View>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <TouchableOpacity style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: job.status === 'completed' ? '#10b981' : '#f59e0b' }
        ]}>
          <Text style={styles.statusText}>{job.status}</Text>
        </View>
      </View>
      <Text style={styles.jobCustomer}>{job.customer}</Text>
      <Text style={styles.jobTime}>{job.time}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobTime: {
    fontSize: 14,
    color: '#14a2a2',
    fontWeight: '500',
  },
});



