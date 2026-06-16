package com.silaaisaas.task;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<Task>> list() {
        return ResponseEntity.ok(taskService.listForCurrentUser());
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Task> complete(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.complete(id));
    }
}
