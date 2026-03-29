// ─────────────────────────────────────────
// WORKER DASHBOARD SCREEN
// Shows worker's own tasks
// Worker can update task status
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
  Modal,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/worker/dashboard.styles";

// All possible task statuses
const STATUSES = ["pending", "in-progress", "review", "completed"];

// Status badge color map
const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  "in-progress": "#3b82f6",
  review: "#8b5cf6",
  completed: "#10b981",
};

// Status icon map
const statusIcon: Record<string, string> = {
  pending: "⏳",
  "in-progress": "🔨",
  review: "🔍",
  completed: "✅",
};

export default function WorkerDashboard() {
  const { user, token, logout } = useAuth();

  // ── Local State ──────────────────────────
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  // ── Fetch Tasks ──────────────────────────
  const fetchTasks = async () => {
    try {
      const res = await fetch(ENDPOINTS.myTasks, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Error", "Failed to fetch tasks");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ── Update Task Status ───────────────────
  const updateStatus = async (status: string) => {
    if (!selectedTask) return;
    setUpdating(true);
    try {
      const res = await fetch(ENDPOINTS.updateTaskStatus(selectedTask._id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");

      // Update task status locally without refetching
      setTasks((prev) =>
        prev.map((t) => (t._id === selectedTask._id ? { ...t, status } : t)),
      );
      Alert.alert("✅ Updated!", `Status changed to ${status}`);
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setUpdating(false);
    }
  };

  // ── Progress Calculation ─────────────────
  const completed = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length > 0 ? completed / tasks.length : 0;

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.fullName?.split(" ")[0]} 👋
          </Text>
          <Text style={styles.role}>Worker</Text>
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
              fetchTasks();
            }}
            tintColor="#10b981"
          />
        }
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPct}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` as any },
              ]}
            />
          </View>
          <Text style={styles.progressSub}>
            {completed} of {tasks.length} tasks completed
          </Text>
        </View>

        {/* Status Summary */}
        <View style={styles.statsRow}>
          {STATUSES.map((s) => (
            <View
              key={s}
              style={[styles.statCard, { borderTopColor: statusColor[s] }]}
            >
              <Text style={styles.statIcon}>{statusIcon[s]}</Text>
              <Text style={[styles.statValue, { color: statusColor[s] }]}>
                {tasks.filter((t) => t.status === s).length}
              </Text>
              <Text style={styles.statLabel}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Task List */}
        <Text style={styles.sectionTitle}>My Tasks — Tap to update status</Text>
        {loading ? (
          <ActivityIndicator color="#10b981" />
        ) : tasks.length === 0 ? (
          <Text style={styles.empty}>No tasks assigned to you yet</Text>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task._id}
              style={styles.taskCard}
              onPress={() => {
                setSelectedTask(task);
                setModalVisible(true);
              }}
            >
              <Text style={styles.taskIcon}>{statusIcon[task.status]}</Text>
              <View style={styles.taskLeft}>
                <Text style={styles.taskName}>{task.taskName}</Text>
                {task.description ? (
                  <Text style={styles.taskDesc}>{task.description}</Text>
                ) : null}
                <Text style={styles.taskMeta}>From: {task.assignedByName}</Text>
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
            </TouchableOpacity>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Update Status Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Task Status</Text>
            <Text style={styles.modalSub}>{selectedTask?.taskName}</Text>

            {/* Status Options Grid */}
            <View style={styles.statusGrid}>
              {STATUSES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    { borderColor: statusColor[s] },
                    selectedTask?.status === s && {
                      backgroundColor: statusColor[s] + "33",
                    },
                  ]}
                  onPress={() => updateStatus(s)}
                  disabled={updating}
                >
                  <Text style={styles.statusBtnIcon}>{statusIcon[s]}</Text>
                  <Text
                    style={[styles.statusBtnText, { color: statusColor[s] }]}
                  >
                    {s}
                  </Text>
                  {/* Indicate current status */}
                  {selectedTask?.status === s && (
                    <Text
                      style={[styles.currentLabel, { color: statusColor[s] }]}
                    >
                      current
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {updating && (
              <ActivityIndicator
                color="#10b981"
                style={styles.updatingIndicator}
              />
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
