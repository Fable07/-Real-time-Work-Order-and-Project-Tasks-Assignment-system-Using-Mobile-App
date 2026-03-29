// ─────────────────────────────────────────
// CREATE TASK SCREEN STYLES
// ─────────────────────────────────────────

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ── Root & Scroll ─────────────────────
  root: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 54,
  },

  // ── Top Navigation Bar ────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  back: {
    color: "#3b82f6",
    fontSize: 15,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  topBarSpacer: {
    width: 60,
  },

  // ── Card ──────────────────────────────
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },

  // ── Form Fields ───────────────────────
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
    height: 52,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#f1f5f9",
    fontSize: 15,
  },
  textArea: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    color: "#f1f5f9",
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },

  // ── Manager Selection Cards ───────────
  managerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  managerCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#1e3a5f",
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
  managerInfo: {
    flex: 1,
  },
  managerName: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: 14,
  },
  managerRole: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 2,
  },
  checkmark: {
    color: "#3b82f6",
    fontWeight: "700",
    fontSize: 16,
  },

  // ── Button ────────────────────────────
  btn: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  // ── Misc ──────────────────────────────
  empty: {
    color: "#475569",
    fontSize: 13,
  },
});