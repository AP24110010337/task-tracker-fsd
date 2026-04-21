import { useEffect, useState } from "react";

const defaultValues = {
  title: "",
  description: "",
  priority: "Medium",
  status: "Pending"
};

const TaskForm = ({
  initialValues = defaultValues,
  onSubmit,
  onCancel,
  submitText,
  showStatus = false,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues
  });

  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialValues
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await onSubmit(formData);
    } catch (error) {
      // The parent already shows the error message.
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__grid">
        <div className="task-form__field task-form__field--full">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="task-form__field task-form__field--full">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input form-input--multiline"
            placeholder="Describe the task"
            required
          />
        </div>

        <div className="task-form__field">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {showStatus && (
          <div className="task-form__field">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}
      </div>

      <div className="task-form__actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitText}
        </button>

        {onCancel && (
          <button
            type="button"
            className="button button--secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
