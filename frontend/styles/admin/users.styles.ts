// ─────────────────────────────────────────
// ALL USERS SCREEN STYLES
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
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
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

  // ── User Cards ────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: "#f1f5f9",
    fontWeight: "600",
    fontSize: 15,
  },
  id: {
    color: "#475569",
    fontSize: 12,
    marginTop: 2,
  },
  rightCol: {
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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