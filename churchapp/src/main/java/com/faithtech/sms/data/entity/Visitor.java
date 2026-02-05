package com.faithtech.sms.data.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter; 
import lombok.Setter;
@Entity @Table(name = "visitors") @Getter @Setter
public class Visitor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "tenant_id") private Tenant tenant;
    private String firstName;
    private String lastName;
    @NotEmpty private String phoneNumber;
    @Email private String email;
    private String status = "ACTIVE";
    @Transient public void setTenantId(Long id) { if(tenant==null) tenant=new Tenant(); tenant.setId(id); }
}
