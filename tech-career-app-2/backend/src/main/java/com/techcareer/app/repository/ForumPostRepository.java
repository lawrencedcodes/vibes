package com.techcareer.app.repository;

import com.techcareer.app.model.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    Page<ForumPost> findByTopicId(Long topicId, Pageable pageable);
    List<ForumPost> findByTopicIdAndIsAnswer(Long topicId, Boolean isAnswer);
    List<ForumPost> findTop10ByOrderByLikeCountDesc();
}
