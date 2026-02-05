package com.faithtech.sms.data.entity;
import jakarta.persistence.*;
import lombok.Getter; 
import lombok.Setter;
@Entity @Table(name = "workflows") @Getter @Setter
public class Workflow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "tenant_id") private Tenant tenant;
    private String name;
    private boolean isDefault;
}
