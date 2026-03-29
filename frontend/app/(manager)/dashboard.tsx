// ─────────────────────────────────────────
// MANAGER DASHBOARD SCREEN
// Shows tasks assigned to manager
// Manager can assign tasks to supervisors
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
  FlatList,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ENDPOINTS } from "../../constants/api";
import { styles } from "../../styles/manager/dashboard.styles";

// Status badge color map
const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  "in-progress": "#3b82f6",
  review: "#8b5cf6",
  completed: "#10b981",
};

export default function ManagerDashboard() {
  const { user, token, logout } = useAuth();

  // ── Local State ──────────────────────────
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [assigning, setAssigning] = useState(false);

  // ── Fetch Data ───────────────────────────
  const fetchData = async () => {
    try {
      const [tRes, uRes] = await Promise.all([
        fetch(ENDPOINTS.tasksByUser(user!.id), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(ENDPOINTS.allUsers, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const tData = await tRes.json();
      const uData = await uRes.json();
      setMyTasks(Array.isArray(tData) ? tData : []);
      // Filter only supervisors from all users
      setSupervisors(
        Array.isArray(uData)
          ? uData.filter((u: any) => u.role === "supervisor")
          : [],
      );
    } catch {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Assign Task to Supervisor ────────────
  const assignToSupervisor = async (supervisor: any) => {
    if (!selectedTask) return;
    setAssigning(true);
    try {
      const res = await fetch(ENDPOINTS.createTask, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskName: selectedTask.taskName,
          description: selectedTask.description,
          assignedTo: supervisor._id,
          assignedByName: user?.fullName,
        }),
      });
      if (!res.ok) throw new Error("Assignment failed");
      Alert.alert("✅ Assigned!", `Task sent to ${supervisor.fullName}`);
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setAssigning(false);
    }
  };

  // ── Render ───────────────────────────────
  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.fullName?.split(" ")[0]} 👋
          </Text>
          <Text style={styles.role}>Manager</Text>
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
            { label: "My Tasks", value: myTasks.length, color: "#3b82f6" },
            {
              label: "Pending",
              value: myTasks.filter((t) => t.status === "pending").length,
              color: "#f59e0b",
            },
            {
              label: "In Progress",
              value: myTasks.filter((t) => t.status === "in-progress").length,
              color: "#8b5cf6",
            },
            {
              label: "Done",
              value: myTasks.filter((t) => t.status === "completed").length,
              color: "#10b981",
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

        {/* Task List */}
        <Text style={styles.sectionTitle}>
          My Tasks — Tap to assign to supervisor
        </Text>
        {loading ? (
          <ActivityIndicator color="#3b82f6" />
        ) : myTasks.length === 0 ? (
          <Text style={styles.empty}>No tasks assigned yet</Text>
        ) : (
          myTasks.map((task) => (
            <TouchableOpacity
              key={task._id}
              style={styles.taskCard}
              onPress={() => {
                setSelectedTask(task);
                setModalVisible(true);
              }}
            >
              <View style={styles.taskLeft}>
                <Text style={styles.taskName}>{task.taskName}</Text>
                {task.description ? (
                  <Text style={styles.taskDesc}>{task.description}</Text>
                ) : null}
                <Text style={styles.taskMeta}>
                  From: {task.assignedByName || "Admin"}
                </Text>
              </View>
              <View style={styles.taskRight}>
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
                <Text style={styles.assignHint}>Assign →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Assign to Supervisor Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign to Supervisor</Text>
            <Text style={styles.modalSub}>Task: {selectedTask?.taskName}</Text>
            {supervisors.length === 0 ? (
              <Text style={styles.empty}>No supervisors available</Text>
            ) : (
              <FlatList
                data={supervisors}
                keyExtractor={(item) => item._id}
                style={styles.modalList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.personCard}
                    onPress={() => assignToSupervisor(item)}
                    disabled={assigning}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.fullName.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.personName}>{item.fullName}</Text>
                    {assigning && (
                      <ActivityIndicator color="#3b82f6" size="small" />
                    )}
                  </TouchableOpacity>
                )}
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
