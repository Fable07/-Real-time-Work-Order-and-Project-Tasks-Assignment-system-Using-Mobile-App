// ─────────────────────────────────────────
// HRD DASHBOARD STYLES
// ─────────────────────────────────────────

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ── Root ──────────────────────────────
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 54,
    paddingHorizontal: 20,
  },

  // ── Header ────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  role: {
    fontSize: 13,
    color: "#8b5cf6",
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Stats ─────────────────────────────
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    borderTopWidth: 3,
    borderColor: "#334155",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  // ── Section Title ─────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 12,
  },

  // ── Quick Actions ─────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
  },

  // ── Employee Cards ────────────────────
  employeeCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  employeeInfo: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // ── Misc ──────────────────────────────
  empty: {
    color: "#475569",
    textAlign: "center",
    marginTop: 20,
  },
  bottomSpacer: {
    height: 32,
  },
});
