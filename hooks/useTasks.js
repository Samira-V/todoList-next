// hooks/useTasks.js

export const useTodos = () => {
  const updateTodo = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // اینجا باید حتماً به صورت { isCompleted: newStatus } ارسال شود
        body: JSON.stringify({ isCompleted: newStatus }), 
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }
      
      return await res.json();
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  };

  return { updateTodo };
};
