package com.techcareer.app.repository;

import com.techcareer.app.model.UserSkill;
import com.techcareer.app.model.User;
import com.techcareer.app.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserAndIsStrength(User user, Boolean isStrength);
    List<UserSkill> findByUserAndIsInterest(User user, Boolean isInterest);
    List<UserSkill> findByUserAndIsWeakness(User user, Boolean isWeakness);
    Optional<UserSkill> findByUserAndSkill(User user, Skill skill);
}
