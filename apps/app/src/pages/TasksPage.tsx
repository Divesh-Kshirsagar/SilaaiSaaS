import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  InlineLoading,
  Tag,
  TextInput,
  Stack,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell
} from '@carbon/react';
import { useTasks, useCompleteTask } from '../hooks/useTasks';
import { TASK_TYPE, TaskType } from '../constants/enums';

const getTaskTypeColor = (type: TaskType) => {
  if (type === 'CUTTING') return 'warm-gray';
  if (type === 'STITCHING') return 'blue';
  return 'green';
};

const TasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  const completeMutation = useCompleteTask();

  const [notes, setNotes] = useState<Record<number, string>>({});

  const pending = tasks?.filter(t => t.status === 'PENDING') ?? [];
  const completed = tasks?.filter(t => t.status === 'COMPLETED') ?? [];

  const handleComplete = (id: number) => {
    completeMutation.mutate(id);
  };

  const completedHeaders = [
    { key: 'order', header: 'Order Number' },
    { key: 'type', header: 'Task Type' },
    { key: 'assignee', header: 'Completed By' }
  ];

  const completedRows = completed.slice(0, 10).map(t => ({
    id: t.id.toString(),
    order: t.order.orderNumber,
    type: t.taskType,
    assignee: t.assignedTo?.name ?? 'System'
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Pending Tasks</h2>
      
      {isLoading && <InlineLoading description="Loading tasks..." />}
      {!isLoading && pending.length === 0 && <p>No pending tasks! 🎉</p>}

      <div style={{ marginBottom: '3rem' }}>
        <Accordion>
          {pending.map(t => (
          <AccordionItem
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span><strong>{t.order.orderNumber}</strong> - Assignee: {t.assignedTo?.name ?? 'Unassigned'}</span>
                <Tag type={getTaskTypeColor(t.taskType)}>{t.taskType}</Tag>
              </div>
            }
            key={t.id}
          >
            <Stack gap={5}>
              <TextInput
                id={`task-type-${t.id}`}
                labelText="Task Type"
                value={t.taskType}
                readOnly
              />
              <TextInput
                id={`notes-${t.id}`}
                labelText="Notes"
                placeholder="Add optional notes here..."
                value={notes[t.id] || ''}
                onChange={e => setNotes(prev => ({ ...prev, [t.id]: e.target.value }))}
              />
              <Button
                kind="primary"
                onClick={() => handleComplete(t.id)}
                disabled={completeMutation.isPending}
              >
                Mark Complete
              </Button>
            </Stack>
          </AccordionItem>
        ))}
        </Accordion>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Recently Completed</h2>
      {completedRows.length > 0 ? (
        <DataTable rows={completedRows} headers={completedHeaders}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'type' ? <Tag type="gray">{cell.value}</Tag> : cell.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      ) : (
        <p>No completed tasks yet.</p>
      )}
    </div>
  );
};

export default TasksPage;
