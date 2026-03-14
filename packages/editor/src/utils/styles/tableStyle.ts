import storage from "../storage";

// ── Table Style ──────────────────────────────────────────────────────

export const TABLE_STYLE_KEY = "ds-table-style";

export interface TableStyleState {
  preset: "default" | "striped" | "bordered" | "minimal" | "custom";
  borderRadius: number;
  borderWidth: number;
  cellPaddingX: number;
  cellPaddingY: number;
  headerWeight: "normal" | "medium" | "semibold" | "bold";
  striped: boolean;
  hoverable: boolean;
  compact: boolean;
}

export const DEFAULT_TABLE_STYLE: TableStyleState = {
  preset: "default",
  borderRadius: 8,
  borderWidth: 1,
  cellPaddingX: 16,
  cellPaddingY: 12,
  headerWeight: "semibold",
  striped: false,
  hoverable: true,
  compact: false,
};

export const TABLE_PRESETS: Record<string, TableStyleState> = {
  default: { ...DEFAULT_TABLE_STYLE },
  striped: {
    preset: "striped",
    borderRadius: 8,
    borderWidth: 1,
    cellPaddingX: 16,
    cellPaddingY: 12,
    headerWeight: "semibold",
    striped: true,
    hoverable: true,
    compact: false,
  },
  bordered: {
    preset: "bordered",
    borderRadius: 0,
    borderWidth: 2,
    cellPaddingX: 16,
    cellPaddingY: 12,
    headerWeight: "bold",
    striped: false,
    hoverable: false,
    compact: false,
  },
  minimal: {
    preset: "minimal",
    borderRadius: 0,
    borderWidth: 0,
    cellPaddingX: 12,
    cellPaddingY: 8,
    headerWeight: "medium",
    striped: false,
    hoverable: true,
    compact: true,
  },
};

export function applyTableStyle(state: TableStyleState, root: HTMLElement = document.documentElement) {
  root.style.setProperty("--table-radius", `${state.borderRadius}px`);
  root.style.setProperty("--table-border-width", `${state.borderWidth}px`);
  root.style.setProperty("--table-cell-px", `${state.cellPaddingX}px`);
  root.style.setProperty("--table-cell-py", `${state.cellPaddingY}px`);
  storage.set(TABLE_STYLE_KEY, state);
}

export function removeTableStyleProperties(root: HTMLElement = document.documentElement) {
  for (const prop of ["--table-radius", "--table-border-width", "--table-cell-px", "--table-cell-py"]) {
    root.style.removeProperty(prop);
  }
}

export function applyStoredTableStyle(root: HTMLElement = document.documentElement): TableStyleState | null {
  const saved = storage.get<TableStyleState>(TABLE_STYLE_KEY);
  if (saved) {
    applyTableStyle(saved, root);
    return saved;
  }
  return null;
}
