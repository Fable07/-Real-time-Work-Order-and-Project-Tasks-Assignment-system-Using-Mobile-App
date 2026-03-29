// ─────────────────────────────────────────
// WORKER DASHBOARD STYLES
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
    color: "#10b981",
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

  // ── Progress Card ─────────────────────
  progressCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  progressPct: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "800",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#0f172a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressSub: {
    color: "#475569",
    fontSize: 12,
    marginTop: 8,
  },

  // ── Stats Row ─────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderTopWidth: 3,
    borderColor: "#334155",
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },

  // ── Section Title ─────────────────────
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: 12,
  },

  // ── Task Cards ────────────────────────
  taskCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  taskIcon: {
    fontSize: 22,
  },
  taskLeft: {
    flex: 1,
  },
  taskName: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: 15,
  },
  taskDesc: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  taskMeta: {
    color: "#475569",
    fontSize: 11,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // ── Modal ─────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 20,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusBtn: {
    width: "47%",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  statusBtnIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  statusBtnText: {
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
  currentLabel: {
    fontSize: 10,
    marginTop: 2,
    opacity: 0.7,
  },
  updatingIndicator: {
    marginTop: 10,
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: "center",
    padding: 14,
  },
  cancelText: {
    color: "#ef4444",
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