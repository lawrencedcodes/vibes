package com.faithtech.sms.data.repository;
import com.faithtech.sms.data.entity.VisitorWorkflowState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorWorkflowStateRepository extends JpaRepository<VisitorWorkflowState, Long> {
}
