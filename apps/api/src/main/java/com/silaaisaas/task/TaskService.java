package com.silaaisaas.task;

import com.silaaisaas.auth.User;
import com.silaaisaas.auth.UserRepository;
import com.silaaisaas.common.enums.OrderStatus;
import com.silaaisaas.common.enums.TaskStatus;
import com.silaaisaas.common.enums.TaskType;
import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.common.notification.NotificationService;
import com.silaaisaas.order.Order;
import com.silaaisaas.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    public List<Task> listForCurrentUser() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long shopId = user.getShop().getId();

        // OWNER/MANAGER sees all tasks in THEIR shop; TAILOR sees only their own
        return switch (user.getRole()) {
            case OWNER, MANAGER -> taskRepository.findByOrderShopId(shopId);
            default -> taskRepository.findByAssignedToId(user.getId());
        };
    }

    public Task start(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    /**
     * Mark task COMPLETED → auto-create the next task in the pipeline,
     * and update order status accordingly.
     * Pipeline: CUTTING → STITCHING → FINISHING → order READY
     */
    @Transactional
    public Task complete(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

        task.setStatus(TaskStatus.COMPLETED);
        taskRepository.save(task);

        Order order = task.getOrder();

        switch (task.getTaskType()) {
            case CUTTING -> {
                order.setStatus(OrderStatus.STITCHING);
                orderRepository.save(order);
                createNextTask(order, task.getAssignedTo(), TaskType.STITCHING);
            }
            case STITCHING -> {
                order.setStatus(OrderStatus.QUALITY_CHECK);
                orderRepository.save(order);
                createNextTask(order, task.getAssignedTo(), TaskType.FINISHING);
            }
            case FINISHING -> {
                order.setStatus(OrderStatus.READY);
                orderRepository.save(order);
                // Notify customer that order is ready
                String phone = order.getCustomer().getPhone();
                if (phone != null) notificationService.sendDeliveryReady(order, phone);
            }
        }

        notificationService.sendOrderStatusUpdate(order, order.getCustomer().getPhone());
        return task;
    }

    private void createNextTask(Order order, User assignedTo, TaskType type) {
        taskRepository.save(Task.builder()
                .order(order)
                .assignedTo(assignedTo)
                .taskType(type)
                .status(TaskStatus.PENDING)
                .dueDate(order.getDeliveryDate())
                .build());
    }
}
