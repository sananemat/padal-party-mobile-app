// components/Breadcrumbs.jsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSegments } from 'expo-router';

const BREADCRUMB_LABELS = {
  cadashboard: 'Dashboard',
  caprofile: 'Club Profile',
  cacourts: 'Court Management',
  cabookings: 'Booking Management',
  caanalytics: 'Analytics',
  catournaments: 'Tournaments',
  cacomms: 'Communications',
};

export default function CABreadcrumbs() {
  const segments = useSegments();
  const currentPage = segments[segments.length - 1];
  const title = BREADCRUMB_LABELS[currentPage] || currentPage;

  return (
    <Text style={styles.breadcrumbs}>
      Dashboard &gt; <Text style={{color: "#eee"}}>{title}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  breadcrumbs: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
    marginLeft: "2.5%",
  },
});