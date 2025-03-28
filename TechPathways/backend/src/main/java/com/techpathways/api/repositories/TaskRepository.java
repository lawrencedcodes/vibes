package com.techpathways.api.repositories;

import com.techpathways.api.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByMilestoneId(Long milestoneId);
    List<Task> findByMilestoneIdOrderByOrderIndex(Long milestoneId);
}
