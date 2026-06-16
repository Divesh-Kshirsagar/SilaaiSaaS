// Typed constants mirroring backend enums

export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  CUTTING: 'CUTTING',
  STITCHING: 'STITCHING',
  QUALITY_CHECK: 'QUALITY_CHECK',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const TASK_TYPE = {
  CUTTING: 'CUTTING',
  STITCHING: 'STITCHING',
  FINISHING: 'FINISHING',
} as const;
export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE];

export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const USER_ROLE = {
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  TAILOR: 'TAILOR',
  ASSISTANT: 'ASSISTANT',
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  CONFIRMED: 'Confirmed',
  CUTTING: 'Cutting',
  STITCHING: 'Stitching',
  QUALITY_CHECK: 'Quality Check',
  READY: 'Ready for Pickup',
  DELIVERED: 'Delivered',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  DRAFT: 'medium',
  CONFIRMED: 'primary',
  CUTTING: 'warning',
  STITCHING: 'warning',
  QUALITY_CHECK: 'tertiary',
  READY: 'success',
  DELIVERED: 'success',
};
