package com.techcareer.app;

import com.techcareer.app.model.User;
import com.techcareer.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTests {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void whenFindByUsername_thenReturnUser() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        User found = userRepository.findByUsername("testuser").orElse(null);

        // then
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo(user.getUsername());
        assertThat(found.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public void whenFindByEmail_thenReturnUser() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        User found = userRepository.findByEmail("test@example.com").orElse(null);

        // then
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo(user.getUsername());
        assertThat(found.getEmail()).isEqualTo(user.getEmail());
    }

    @Test
    public void whenExistsByUsername_thenReturnTrue() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        boolean exists = userRepository.existsByUsername("testuser");

        // then
        assertThat(exists).isTrue();
    }

    @Test
    public void whenExistsByEmail_thenReturnTrue() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        entityManager.persist(user);
        entityManager.flush();

        // when
        boolean exists = userRepository.existsByEmail("test@example.com");

        // then
        assertThat(exists).isTrue();
    }
}
