// ─────────────────────────────────────────
// CREATE USER SCREEN STYLES
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
    marginBottom: 16,
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
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 24,
    lineHeight: 20,
  },

  // ── Card ──────────────────────────────
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 32,
  },

  // ── Section Labels ────────────────────
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b82f6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
    marginTop: 8,
  },

  // ── Form Fields ───────────────────────
  field: {
    marginBottom: 16,
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

  // ── Role Selector ─────────────────────
  roleRow: {
    flexDirection: "row",
    gap: 10,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#3b82f6",
  },
  roleBtnText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  roleBtnTextActive: {
    color: "#fff",
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
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});