package com.faithtech.sms.data.entity;
import jakarta.persistence.*;
import lombok.Getter; 
import lombok.Setter;
@Entity @Table(name = "tenants") @Getter @Setter
public class Tenant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    private String slug;
    private String twilioPhoneNumber;
    private String timezone;
    private boolean isActive = true;
}
