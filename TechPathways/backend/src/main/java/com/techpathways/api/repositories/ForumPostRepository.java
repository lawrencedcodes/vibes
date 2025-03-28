package com.techpathways.api.repositories;

import com.techpathways.api.models.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findByTopicId(Long topicId);
    List<ForumPost> findByTopicIdOrderByCreatedAtAsc(Long topicId);
    List<ForumPost> findByUserId(Long userId);
}
