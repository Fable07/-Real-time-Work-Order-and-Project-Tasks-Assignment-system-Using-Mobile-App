// ─────────────────────────────────────────
// LOGIN SCREEN STYLES
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
    justifyContent: "center",
    padding: 24,
  },

  // ── Header / Logo ─────────────────────
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: "#1e3a5f",
  },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },

  // ── Card ──────────────────────────────
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 28,
  },

  // ── Form Fields ───────────────────────
  field: {
    marginBottom: 18,
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
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#f1f5f9",
    fontSize: 15,
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

  // ── Footer ────────────────────────────
  hint: {
    textAlign: "center",
    color: "#475569",
    fontSize: 12,
    marginTop: 20,
  },
  footer: {
    textAlign: "center",
    color: "#334155",
    fontSize: 11,
    marginTop: 32,
  },
});