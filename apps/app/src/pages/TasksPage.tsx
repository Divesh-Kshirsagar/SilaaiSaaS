import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonSkeletonText, IonBadge, IonButton, IonSpinner,
} from '@ionic/react';
import { useTasks, useCompleteTask } from '../hooks/useTasks';
import { TASK_TYPE } from '../constants/enums';

const taskTypeColors: Record<string, string> = {
  CUTTING: 'warning',
  STITCHING: 'tertiary',
  FINISHING: 'secondary',
};

const TasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  const completeMutation = useCompleteTask();

  const pendingTasks = tasks?.filter((t) => t.status !== 'COMPLETED') ?? [];
  const doneTasks = tasks?.filter((t) => t.status === 'COMPLETED') ?? [];

  return (
    <IonPage id="tasks-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>My Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading ? (
          <IonList>{Array.from({ length: 3 }).map((_, i) => (
            <IonItem key={i}><IonLabel><IonSkeletonText animated style={{ width: '65%' }} /></IonLabel></IonItem>
          ))}</IonList>
        ) : (
          <>
            {pendingTasks.length > 0 && (
              <>
                <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ion-color-medium)' }}>
                  Pending ({pendingTasks.length})
                </div>
                <IonList>
                  {pendingTasks.map((t) => (
                    <IonItem key={t.id}>
                      <IonLabel>
                        <h3>{t.order.orderNumber} — {t.order.customer.name}</h3>
                        <p>Due: {new Date(t.dueDate).toLocaleDateString('en-IN')} &nbsp;|&nbsp; Assigned to: {t.assignedTo?.name ?? 'Unassigned'}</p>
                      </IonLabel>
                      <IonBadge slot="end" color={taskTypeColors[t.taskType] ?? 'medium'} style={{ borderRadius: 6, marginRight: 8 }}>
                        {t.taskType}
                      </IonBadge>
                      <IonButton
                        id={`complete-task-${t.id}`}
                        slot="end"
                        size="small"
                        fill="outline"
                        color="success"
                        onClick={() => completeMutation.mutate(t.id)}
                        disabled={completeMutation.isPending}
                      >
                        {completeMutation.isPending ? <IonSpinner name="crescent" style={{ width: 16, height: 16 }} /> : 'Done'}
                      </IonButton>
                    </IonItem>
                  ))}
                </IonList>
              </>
            )}

            {doneTasks.length > 0 && (
              <>
                <div style={{ padding: '16px 16px 8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ion-color-medium)' }}>
                  Completed ({doneTasks.length})
                </div>
                <IonList>
                  {doneTasks.map((t) => (
                    <IonItem key={t.id} style={{ opacity: 0.5 }}>
                      <IonLabel><h3 style={{ textDecoration: 'line-through' }}>{t.order.orderNumber} — {t.taskType}</h3></IonLabel>
                      <IonBadge slot="end" color="success" style={{ borderRadius: 6 }}>Done</IonBadge>
                    </IonItem>
                  ))}
                </IonList>
              </>
            )}

            {!tasks?.length && (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--ion-color-medium)' }}>
                <p style={{ fontSize: '1.5rem' }}>✅</p>
                <p>No tasks assigned. All caught up!</p>
              </div>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TasksPage;
