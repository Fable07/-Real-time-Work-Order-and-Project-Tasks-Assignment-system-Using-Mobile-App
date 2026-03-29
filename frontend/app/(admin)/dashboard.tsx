// ─────────────────────────────────────────
// ADMIN DASHBOARD SCREEN
// Shows stats, quick actions, team overview
// and recent tasks
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
import { styles } from "../../styles/admin/dashboard.styles";

// Status badge color map
const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  "in-progress": "#3b82f6",
  review: "#8b5cf6",
  completed: "#10b981",
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch Data ───────────────────────────
  const fetchData = async () => {
    try {
      const [tRes, uRes] = await Promise.all([
        fetch(ENDPOINTS.allTasks, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(ENDPOINTS.allUsers, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const tData = await tRes.json();
      const uData = await uRes.json();
      setTasks(Array.isArray(tData) ? tData : []);
      setUsers(Array.isArray(uData) ? uData : []);
    } catch {
      Alert.alert("Error", "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: count users by role
  const roleCount = (role: string) =>
    users.filter((u) => u.role === role).length;

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.fullName?.split(" ")[0] ?? user?.fullName}
          </Text>
          <Text style={styles.role}>System Administrator</Text>
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
            tintColor="#3b82f6"
          />
        }
      >
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "Total Users", value: users.length, color: "#3b82f6" },
            { label: "Total Tasks", value: tasks.length, color: "#8b5cf6" },
            {
              label: "Completed",
              value: tasks.filter((t) => t.status === "completed").length,
              color: "#10b981",
            },
            {
              label: "Pending",
              value: tasks.filter((t) => t.status === "pending").length,
              color: "#f59e0b",
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
              icon: "👤",
              label: "Create User",
              route: "/(admin)/create-user",
            },
            {
              icon: "📋",
              label: "Create Task",
              route: "/(admin)/create-task",
            },
            { icon: "👥", label: "All Users", route: "/(admin)/users" },
            { icon: "📊", label: "All Tasks", route: "/(admin)/tasks" },
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

        {/* Team Overview */}
        <Text style={styles.sectionTitle}>Team Overview</Text>
        <View style={styles.teamRow}>
          {["manager", "supervisor", "worker"].map((r) => (
            <View key={r} style={styles.teamCard}>
              <Text style={styles.teamCount}>{roleCount(r)}</Text>
              <Text style={styles.teamRole}>
                {r.charAt(0).toUpperCase() + r.slice(1)}s
              </Text>
            </View>
          ))}
        </View>

        {/* Recent Tasks */}
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
        {loading ? (
          <ActivityIndicator color="#3b82f6" style={{ marginTop: 20 }} />
        ) : tasks.length === 0 ? (
          <Text style={styles.empty}>No tasks yet</Text>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <View key={task._id} style={styles.taskCard}>
              <View style={styles.taskLeft}>
                <Text style={styles.taskName}>{task.taskName}</Text>
                <Text style={styles.taskBy}>
                  By: {task.assignedByName || "Admin"}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: statusColor[task.status] + "22" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: statusColor[task.status] },
                  ]}
                >
                  {task.status}
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
