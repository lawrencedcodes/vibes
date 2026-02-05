package com.faithtech.sms;

import com.faithtech.sms.data.entity.Tenant;
import com.faithtech.sms.data.entity.Workflow;
import com.faithtech.sms.data.repository.TenantRepository;
import com.faithtech.sms.data.repository.WorkflowRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FaithTechSmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(FaithTechSmsApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(TenantRepository tenantRepository,
            WorkflowRepository workflowRepository,
            com.faithtech.sms.data.repository.UserRepository userRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return (args) -> {
            Tenant tenant = new Tenant();
            tenant.setName("Ebenezer Baptist");
            tenant.setSlug("ebenezer");
            tenantRepository.save(tenant);

            Workflow workflow = new Workflow();
            workflow.setTenant(tenant);
            workflow.setName("Default Workflow");
            workflow.setDefault(true);
            workflowRepository.save(workflow);

            // Seed Admin
            com.faithtech.sms.data.entity.User admin = new com.faithtech.sms.data.entity.User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);

            // Seed Member
            com.faithtech.sms.data.entity.User member = new com.faithtech.sms.data.entity.User();
            member.setUsername("member");
            member.setPassword(passwordEncoder.encode("password"));
            member.setRole("ROLE_USER");
            userRepository.save(member);

            System.out.println("SYSTEM READY: Go to http://localhost:8080/connect/ebenezer");
            System.out.println("LOGINS: admin/admin or member/password");
        };
    }
}
