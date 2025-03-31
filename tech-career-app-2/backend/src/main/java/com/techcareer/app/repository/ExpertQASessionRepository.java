package com.techcareer.app.repository;

import com.techcareer.app.model.ExpertQASession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ExpertQASessionRepository extends JpaRepository<ExpertQASession, Long> {
    Page<ExpertQASession> findByIsActiveAndScheduledDateAfter(Boolean isActive, Date currentDate, Pageable pageable);
    List<ExpertQASession> findTop5ByIsActiveAndScheduledDateAfterOrderByScheduledDateAsc(Boolean isActive, Date currentDate);
    List<ExpertQASession> findByExpertId(Long expertId);
}
