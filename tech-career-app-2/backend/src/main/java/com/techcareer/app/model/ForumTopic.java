package com.techcareer.app.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "forum_topics")
public class ForumTopic {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private ForumCategory category;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;
    
    @Column(nullable = false)
    private Boolean isPinned = false;
    
    @Column(nullable = false)
    private Boolean isLocked = false;
    
    @Column(nullable = false)
    private Integer viewCount = 0;
    
    @Column(nullable = false)
    private Integer replyCount = 0;
    
    @Column(nullable = false)
    private Date createdAt;
    
    @Column
    private Date updatedAt;
    
    @Column
    private Date lastActivityAt;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ForumCategory getCategory() {
        return category;
    }

    public void setCategory(ForumCategory category) {
        this.category = category;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Boolean getIsPinned() {
        return isPinned;
    }

    public void setIsPinned(Boolean isPinned) {
        this.isPinned = isPinned;
    }

    public Boolean getIsLocked() {
        return isLocked;
    }

    public void setIsLocked(Boolean isLocked) {
        this.isLocked = isLocked;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getReplyCount() {
        return replyCount;
    }

    public void setReplyCount(Integer replyCount) {
        this.replyCount = replyCount;
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

    public Date getLastActivityAt() {
        return lastActivityAt;
    }

    public void setLastActivityAt(Date lastActivityAt) {
        this.lastActivityAt = lastActivityAt;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        lastActivityAt = createdAt;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
