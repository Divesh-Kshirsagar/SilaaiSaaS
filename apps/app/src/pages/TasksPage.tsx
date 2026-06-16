import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton,
  IonButtons, IonList, IonItem, IonLabel, IonBadge, IonButton, IonSpinner,
  IonAccordionGroup, IonAccordion, IonSelect, IonSelectOption, IonTextarea
} from '@ionic/react';
import { useTasks, useCompleteTask } from '../hooks/useTasks';
import { TASK_TYPE, TaskType } from '../constants/enums';

const getTaskTypeColor = (type: TaskType) => {
  if (type === 'CUTTING') return 'warning';
  if (type === 'STITCHING') return 'primary';
  return 'success';
};

const TasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useTasks();
  const completeMutation = useCompleteTask();

  const [notes, setNotes] = useState<Record<number, string>>({});

  const pending = tasks?.filter(t => t.status === 'PENDING') ?? [];
  const completed = tasks?.filter(t => t.status === 'COMPLETED') ?? [];

  const handleComplete = (id: number) => {
    // Note: API complete endpoint doesn't currently take notes, but we send it anyway
    completeMutation.mutate(id);
  };

  return (
    <IonPage id="tasks-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Tasks Pipeline</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Pending Tasks</h2>
        {isLoading && <IonSpinner />}
        {!isLoading && pending.length === 0 && <p>No pending tasks! 🎉</p>}

        <IonAccordionGroup>
          {pending.map(t => (
            <IonAccordion value={t.id.toString()} key={t.id}>
              <IonItem slot="header" color="light">
                <IonLabel>
                  <h3>{t.order.orderNumber}</h3>
                  <p>Assignee: {t.assignedTo?.name ?? 'Unassigned'}</p>
                </IonLabel>
                <IonBadge color={getTaskTypeColor(t.taskType)}>{t.taskType}</IonBadge>
              </IonItem>

              <div className="ion-padding" slot="content">
                <IonItem>
                  <IonLabel position="stacked">Task Type</IonLabel>
                  <IonSelect value={t.taskType} disabled>
                    {Object.values(TASK_TYPE).map(type => (
                      <IonSelectOption key={type} value={type}>{type}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Notes</IonLabel>
                  <IonTextarea
                    placeholder="Add optional notes here..."
                    value={notes[t.id] || ''}
                    onIonInput={e => setNotes(prev => ({ ...prev, [t.id]: e.detail.value! }))}
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  color="success"
                  className="ion-margin-top"
                  onClick={() => handleComplete(t.id)}
                  disabled={completeMutation.isPending}
                >
                  Mark Complete
                </IonButton>
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>

        <h2 className="ion-margin-top">Recently Completed</h2>
        <IonList>
          {completed.slice(0, 10).map(t => (
            <IonItem key={t.id}>
              <IonLabel>
                <h3 style={{ textDecoration: 'line-through' }}>{t.order.orderNumber}</h3>
                <p>Completed by {t.assignedTo?.name ?? 'System'}</p>
              </IonLabel>
              <IonBadge color="medium">{t.taskType}</IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TasksPage;
