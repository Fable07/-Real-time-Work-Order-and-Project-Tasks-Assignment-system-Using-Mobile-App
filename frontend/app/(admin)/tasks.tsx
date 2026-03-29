// ─────────────────────────────────────────
// ALL TASKS SCREEN (Admin only)
// Shows all tasks with status filter tabs
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
import { styles } from "../../styles/admin/tasks.styles";

// Status badge color map
const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  "in-progress": "#3b82f6",
  review: "#8b5cf6",
  completed: "#10b981",
};

export default function AllTasks() {
  const { token } = useAuth();
  const router = useRouter();

  // ── Local State ──────────────────────────
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ── Fetch Tasks ──────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(ENDPOINTS.allTasks, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch {
        Alert.alert("Error", "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Filter tasks based on selected status tab
  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>All Tasks</Text>
        <Text style={styles.count}>{filtered.length}</Text>
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.filters}>
        {["all", "pending", "in-progress", "review", "completed"].map((f) => (
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
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
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
              <View style={styles.cardTop}>
                <Text style={styles.taskName}>{item.taskName}</Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: statusColor[item.status] + "22",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: statusColor[item.status] },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
              {/* Optional description */}
              {item.description ? (
                <Text style={styles.desc}>{item.description}</Text>
              ) : null}
              <Text style={styles.meta}>
                By: {item.assignedByName || "Admin"}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No tasks found</Text>}
        />
      )}
    </View>
  );
}
