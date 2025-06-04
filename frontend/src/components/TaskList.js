const TaskList = ({ tasks, onUpdate }) => {
  return (
    <div>
      <h3>Tasks</h3>
      {tasks.length === 0 && <p>No tasks available</p>}
      {tasks.map((task) => (
        <div key={task.id} style={{ border: '1px solid #aaa', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Due: {new Date(task.due_date).toLocaleString()}</p>
          <p>Priority: <strong>{task.priority}</strong></p>
          <p>Status: <strong>{task.status}</strong></p>
          {task.status !== 'Completed' && (
            <button onClick={() => onUpdate(task.id)}>Mark Next Stage</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
