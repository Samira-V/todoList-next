import { Suspense } from "react";
import TaskListClient from "./TaskListClient";

export default function TaskListPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "var(--text-muted, #94a3b8)",
            fontSize: 13,
          }}
        >
          در حال بارگذاری...
        </div>
      }
    >
      <TaskListClient />
    </Suspense>
  );
}