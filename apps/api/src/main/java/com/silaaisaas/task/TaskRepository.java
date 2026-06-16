package com.silaaisaas.task;

import com.silaaisaas.common.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByOrderId(Long orderId);

    List<Task> findByAssignedToId(Long userId);

    List<Task> findByAssignedToIdAndStatus(Long userId, TaskStatus status);

    List<Task> findByOrderIdAndStatus(Long orderId, TaskStatus status);
}
