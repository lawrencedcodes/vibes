package com.techcareer.app.repository;

import com.techcareer.app.model.JobRole;
import com.techcareer.app.model.CareerPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    List<JobRole> findByCareerPath(CareerPath careerPath);
    List<JobRole> findByEntryLevelFriendly(Boolean entryLevelFriendly);
    List<JobRole> findByMarketDemand(String marketDemand);
    List<JobRole> findByTitleContainingIgnoreCase(String title);
}
