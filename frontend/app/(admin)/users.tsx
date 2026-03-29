// ─────────────────────────────────────────
// ALL USERS SCREEN (Admin only)
// Displays all personnel with role filter
// ─────────────────────────────────────────

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/admin/users.styles";

// Color map per role
const roleColor: Record<string, string> = {
  admin: "#ef4444",
  manager: "#8b5cf6",
  supervisor: "#3b82f6",
  worker: "#10b981",
};

export default function AllUsers() {
  const { token } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ── Fetch Users ──────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(ENDPOINTS.allUsers, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        Alert.alert("Error", "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on selected role tab
  const filtered =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>All Personnel</Text>
        <Text style={styles.count}>{filtered.length}</Text>
      </View>

      {/* Role Filter Tabs */}
      <View style={styles.filters}>
        {["all", "manager", "supervisor", "worker"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      {loading ? (
        <ActivityIndicator color="#3b82f6" style={styles.loader} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Avatar */}
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: roleColor[item.role] + "33" },
                ]}
              >
                <Text
                  style={[styles.avatarText, { color: roleColor[item.role] }]}
                >
                  {item.firstName?.charAt(0)}
                </Text>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.id}>Employee No: {item.employeeNo}</Text>
              </View>

              {/* Role Badge + Status Dot */}
              <View style={styles.rightCol}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: roleColor[item.role] + "22" },
                  ]}
                >
                  <Text
                    style={[styles.badgeText, { color: roleColor[item.role] }]}
                  >
                    {item.role}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === "active" ? "#10b981" : "#ef4444",
                    },
                  ]}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
        />
      )}
    </View>
  );
}
