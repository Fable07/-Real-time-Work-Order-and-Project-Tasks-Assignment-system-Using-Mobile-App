// ─────────────────────────────────────────
// MANAGER DASHBOARD STYLES
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
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  taskLeft: {
    flex: 1,
    marginRight: 10,
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
  taskRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  assignHint: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "600",
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
  modalList: {
    maxHeight: 300,
  },
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  personName: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  cancelBtn: {
    marginTop: 12,
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