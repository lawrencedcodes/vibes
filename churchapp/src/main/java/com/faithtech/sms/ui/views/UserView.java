package com.faithtech.sms.ui.views;

import com.faithtech.sms.data.entity.User;
import com.faithtech.sms.data.repository.UserRepository;
import com.faithtech.sms.ui.MainLayout;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.context.annotation.Role;

@PageTitle("Users | FaithTech SMS")
@Route(value = "users", layout = MainLayout.class)
public class UserView extends VerticalLayout {

    private final UserRepository repository;
    private final Grid<User> grid = new Grid<>(User.class, false);

    public UserView(UserRepository repository) {
        this.repository = repository;
        addClassName("user-view");
        setSizeFull();
        setPadding(true);
        setSpacing(true);

        configureGrid();

        add(grid);
        updateList();
    }

    private void configureGrid() {
        grid.addClassName("user-grid");
        grid.setSizeFull();
        grid.addColumn(User::getUsername).setHeader("Username");
        grid.addColumn(User::getRole).setHeader("Role");
        grid.getColumns().forEach(col -> col.setAutoWidth(true));
    }

    private void updateList() {
        grid.setItems(repository.findAll());
    }
}
