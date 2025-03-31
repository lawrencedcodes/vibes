package com.techcareer.app.repository;

import com.techcareer.app.model.ForumTopic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopic, Long> {
    Page<ForumTopic> findByCategoryId(Long categoryId, Pageable pageable);
    List<ForumTopic> findTop5ByCategoryIdOrderByLastActivityAtDesc(Long categoryId);
    List<ForumTopic> findByIsPinnedOrderByLastActivityAtDesc(Boolean isPinned);
}
