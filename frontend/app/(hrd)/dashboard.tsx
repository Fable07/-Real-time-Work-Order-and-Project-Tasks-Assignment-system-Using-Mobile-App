// ─────────────────────────────────────────
// HRD DASHBOARD SCREEN
// Employee management and HR overview
// ─────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/hrd/dashboard.styles";

const statusColor: Record<string, string> = {
  active: "#10b981",
  inactive: "#ef4444",
};

export default function HRDDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch Data ───────────────────────────
  const fetchData = async () => {
    try {
      const res = await fetch(ENDPOINTS.allUsers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Error", "Failed to fetch employee data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: count employees by status
  const statusCount = (status: string) =>
    employees.filter((e) => e.status === status).length;

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.fullName?.split(" ")[0] ?? user?.fullName}
          </Text>
          <Text style={styles.role}>HR Department</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }}
            tintColor="#8b5cf6"
          />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            {
              label: "Total Employees",
              value: employees.length,
              color: "#8b5cf6",
            },
            {
              label: "Active",
              value: statusCount("active"),
              color: "#10b981",
            },
            {
              label: "Inactive",
              value: statusCount("inactive"),
              color: "#ef4444",
            },
          ].map((s) => (
            <View
              key={s.label}
              style={[styles.statCard, { borderTopColor: s.color }]}
            >
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {[
            {
              icon: "➕",
              label: "Add Employee",
              route: "/(admin)/create-user",
            },
            {
              icon: "👥",
              label: "All Employees",
              route: "/(admin)/users",
            },
          ].map((a) => (
            <TouchableOpacity
              key={a.label}
              style={styles.actionBtn}
              onPress={() => router.push(a.route as any)}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionText}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Employees */}
        <Text style={styles.sectionTitle}>Recent Employees</Text>
        {loading ? (
          <ActivityIndicator color="#8b5cf6" style={{ marginTop: 20 }} />
        ) : employees.length === 0 ? (
          <Text style={styles.empty}>No employees yet</Text>
        ) : (
          employees.slice(0, 8).map((emp) => (
            <View key={emp._id} style={styles.employeeCard}>
              <Text style={styles.employeeName}>
                {emp.firstName} {emp.lastName}
              </Text>
              <Text style={styles.employeeInfo}>ID: {emp.employeeNo}</Text>
              <Text style={styles.employeeInfo}>Email: {emp.email}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor[emp.status] + "22" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor[emp.status] },
                  ]}
                >
                  {emp.status?.toUpperCase()}
                </Text>
              </View>
            </View>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}
