package com.faithtech.sms.data.entity;
import jakarta.persistence.*;
import lombok.Getter; 
import lombok.Setter;
import java.time.LocalDateTime;
import com.faithtech.sms.data.enums.WorkflowStatus;
@Entity @Table(name = "visitor_workflow_states") @Getter @Setter
public class VisitorWorkflowState {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "visitor_id") private Visitor visitor;
    @ManyToOne @JoinColumn(name = "workflow_id") private Workflow workflow;
    private int currentStepOrder;
    private LocalDateTime startedAt;
    private LocalDateTime nextExecutionAt;
    @Enumerated(EnumType.STRING) private WorkflowStatus status;
}
