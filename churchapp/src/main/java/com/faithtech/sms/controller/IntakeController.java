package com.faithtech.sms.controller;

import com.faithtech.sms.data.entity.Visitor;
import com.faithtech.sms.data.repository.VisitorRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IntakeController {

    private final VisitorRepository visitorRepository;

    public IntakeController(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @GetMapping("/connect/{slug}")
    public String intakeForm(@PathVariable("slug") String slug) {
        // ideally we check if tenant exists, but for MVP just showing the form
        return "visitor-intake";
    }

    @PostMapping("/connect/submit")
    public String submitForm(@RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phoneNumber") String phoneNumber) {
        Visitor visitor = new Visitor();
        visitor.setFirstName(firstName);
        visitor.setLastName(lastName);
        visitor.setPhoneNumber(phoneNumber);
        // Tenant handling omitted for simplicity as per requirement implies basic
        // intake,
        // but realistic app would need tenant context.
        // We will default to null/empty tenant as per "Create a VisitorView... connect
        // to VisitorRepository"
        // and "Data Seeding... Default Workflow for that tenant"
        // The MVP requirements are simple.

        visitorRepository.save(visitor);
        return "redirect:/connect/welcome";
    }

    @GetMapping("/connect/welcome")
    public String welcome() {
        return "welcome";
    }

    @GetMapping("/connect/success")
    public String success() {
        return "redirect:/connect/welcome";
    }
}
