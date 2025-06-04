const TaskFilters = ({ onFilter }) => {
  return (
    <div style={{ margin: '20px 0' }}>
      <strong>Filters: </strong>
      <button onClick={() => onFilter({})}>All</button>
      <button onClick={() => onFilter({ priority: 'High' })}>High Priority</button>
      <button onClick={() => onFilter({ dueSoon: true })}>Due in 3 Days</button>
    </div>
  );
};

export default TaskFilters;
