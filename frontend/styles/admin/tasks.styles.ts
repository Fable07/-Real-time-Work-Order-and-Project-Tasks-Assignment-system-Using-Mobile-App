// ─────────────────────────────────────────
// ALL TASKS SCREEN STYLES
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
  count: {
    color: "#3b82f6",
    fontWeight: "700",
    fontSize: 16,
  },

  // ── Filter Tabs ───────────────────────
  filters: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterBtnActive: {
    backgroundColor: "#1d4ed8",
    borderColor: "#3b82f6",
  },
  filterText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },

  // ── Task Cards ────────────────────────
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  taskName: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: 15,
    flex: 1,
    marginRight: 10,
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
  desc: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 6,
  },
  meta: {
    color: "#475569",
    fontSize: 12,
  },

  // ── Misc ──────────────────────────────
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 32,
  },
  empty: {
    color: "#475569",
    textAlign: "center",
    marginTop: 40,
  },
});