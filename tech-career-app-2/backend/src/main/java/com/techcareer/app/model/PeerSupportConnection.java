package com.techcareer.app.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "peer_support_connections")
public class PeerSupportConnection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;
    
    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, DECLINED, COMPLETED
    
    @Column(length = 1000)
    private String requestMessage;
    
    @Column(length = 1000)
    private String supportArea;
    
    @Column
    private Date acceptedAt;
    
    @Column
    private Date completedAt;
    
    @Column(nullable = false)
    private Date createdAt;
    
    @Column
    private Date updatedAt;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRequestMessage() {
        return requestMessage;
    }

    public void setRequestMessage(String requestMessage) {
        this.requestMessage = requestMessage;
    }

    public String getSupportArea() {
        return supportArea;
    }

    public void setSupportArea(String supportArea) {
        this.supportArea = supportArea;
    }

    public Date getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(Date acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
