import type { AppData } from "../types";
import { parseStoredString, serializeAppData } from "./storage";

export function exportSubscriptionsJson(data: AppData, filename = "subtracker-backup.json") {
  const pretty = JSON.stringify(JSON.parse(serializeAppData(data)), null, 2);
  const blob = new Blob([pretty], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSubscriptionsJson(rawJson: string): AppData | null {
  return parseStoredString(rawJson);
}
