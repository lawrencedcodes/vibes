package com.faithtech.sms.ui.views;

import com.faithtech.sms.data.entity.Visitor;
import com.faithtech.sms.data.repository.VisitorRepository;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.grid.GridVariant;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.binder.Binder;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;
import org.springframework.security.core.context.SecurityContextHolder;

@Route("visitors")
@StyleSheet("/css/church-theme.css")
public class VisitorView extends VerticalLayout {

    private final VisitorRepository repository;
    private final Grid<Visitor> grid = new Grid<>(Visitor.class, false);
    private final VisitorForm form;

    public VisitorView(VisitorRepository repository) {
        this.repository = repository;
        this.form = new VisitorForm();

        addClassName("visitor-view");
        setSizeFull();
        setPadding(true);
        setSpacing(true);

        // Header
        HorizontalLayout header = createHeader();
        add(header);

        configureGrid();
        configureForm();

        add(getToolbar(), getContent());
        updateList();
        closeEditor();
    }

    private HorizontalLayout createHeader() {
        H2 logo = new H2("FaithTech Management");
        logo.addClassNames(LumoUtility.TextColor.PRIMARY, LumoUtility.Margin.Bottom.MEDIUM);
        logo.getStyle().set("font-family", "var(--font-heading)");
        logo.getStyle().set("color", "var(--primary-purple)");

        Button logout = new Button("Sign Out");
        logout.addClickListener(e -> {
            SecurityContextHolder.clearContext();
            UI.getCurrent().getPage().setLocation("/logout");
        });
        logout.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
        logout.getStyle().set("color", "var(--error-red)");

        HorizontalLayout header = new HorizontalLayout(logo, logout);
        header.setWidthFull();
        header.setJustifyContentMode(JustifyContentMode.BETWEEN);
        header.setAlignItems(Alignment.CENTER);
        return header;
    }

    private HorizontalLayout getContent() {
        HorizontalLayout content = new HorizontalLayout(grid, form);
        content.setFlexGrow(2, grid);
        content.setFlexGrow(1, form);
        content.addClassNames("content");
        content.setSizeFull();
        return content;
    }

    private void configureGrid() {
        grid.addClassName("visitor-grid");
        grid.setSizeFull();
        grid.addColumn(Visitor::getFirstName).setHeader("First Name");
        grid.addColumn(Visitor::getLastName).setHeader("Last Name");
        grid.addColumn(Visitor::getPhoneNumber).setHeader("Phone");
        grid.addColumn(Visitor::getEmail).setHeader("Email");
        grid.addColumn(Visitor::getStatus).setHeader("Status");

        grid.getColumns().forEach(col -> col.setAutoWidth(true));
        grid.addThemeVariants(GridVariant.LUMO_ROW_STRIPES);

        grid.asSingleSelect().addValueChangeListener(event -> editVisitor(event.getValue()));
    }

    private void configureForm() {
        form.setWidth("25em");
        form.addListener(VisitorForm.SaveEvent.class, this::saveVisitor);
        form.addListener(VisitorForm.CloseEvent.class, e -> closeEditor());
    }

    private HorizontalLayout getToolbar() {
        TextField filterText = new TextField();
        filterText.setPlaceholder("Filter by name...");
        filterText.setClearButtonVisible(true);

        Button addVisitorButton = new Button("Add Visitor");
        addVisitorButton.addClickListener(click -> addVisitor());

        // Apply custom theme colors manually to match non-Shadow DOM elements
        addVisitorButton.getStyle().set("background-color", "var(--primary-purple)");
        addVisitorButton.getStyle().set("color", "white");

        HorizontalLayout toolbar = new HorizontalLayout(filterText, addVisitorButton);
        toolbar.addClassName("toolbar");
        return toolbar;
    }

    private void saveVisitor(VisitorForm.SaveEvent event) {
        repository.save(event.getVisitor());
        updateList();
        closeEditor();
    }

    private void addVisitor() {
        grid.asSingleSelect().clear();
        editVisitor(new Visitor());
    }

    private void editVisitor(Visitor visitor) {
        if (visitor == null) {
            closeEditor();
        } else {
            form.setVisitor(visitor);
            form.setVisible(true);
            addClassName("editing");
        }
    }

    private void closeEditor() {
        form.setVisitor(null);
        form.setVisible(false);
        removeClassName("editing");
    }

    private void updateList() {
        grid.setItems(repository.findAll());
    }

    public static class VisitorForm extends com.vaadin.flow.component.formlayout.FormLayout {
        TextField firstName = new TextField("First Name");
        TextField lastName = new TextField("Last Name");
        TextField phoneNumber = new TextField("Phone Number");
        TextField email = new TextField("Email");

        Button save = new Button("Save");
        Button cancel = new Button("Cancel");

        Binder<Visitor> binder = new Binder<>(Visitor.class);
        private Visitor visitor;

        public VisitorForm() {
            addClassName("visitor-form");
            binder.bindInstanceFields(this);

            // Styling buttons
            save.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
            save.getStyle().set("background-color", "var(--primary-purple)");

            cancel.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

            add(firstName,
                    lastName,
                    phoneNumber,
                    email,
                    createButtonsLayout());
        }

        private HorizontalLayout createButtonsLayout() {
            save.addClickListener(event -> validateAndSave());
            cancel.addClickListener(event -> fireEvent(new CloseEvent(this)));
            return new HorizontalLayout(save, cancel);
        }

        public void setVisitor(Visitor visitor) {
            this.visitor = visitor;
            binder.readBean(visitor);
        }

        private void validateAndSave() {
            try {
                binder.writeBean(visitor);
                fireEvent(new SaveEvent(this, visitor));
            } catch (com.vaadin.flow.data.binder.ValidationException e) {
                e.printStackTrace();
            }
        }

        // Events
        public static abstract class VisitorFormEvent extends com.vaadin.flow.component.ComponentEvent<VisitorForm> {
            private Visitor visitor;

            protected VisitorFormEvent(VisitorForm source, Visitor visitor) {
                super(source, false);
                this.visitor = visitor;
            }

            public Visitor getVisitor() {
                return visitor;
            }
        }

        public static class SaveEvent extends VisitorFormEvent {
            SaveEvent(VisitorForm source, Visitor visitor) {
                super(source, visitor);
            }
        }

        public static class CloseEvent extends VisitorFormEvent {
            CloseEvent(VisitorForm source) {
                super(source, null);
            }
        }

        public <T extends com.vaadin.flow.component.ComponentEvent<?>> com.vaadin.flow.shared.Registration addListener(
                Class<T> eventType,
                com.vaadin.flow.component.ComponentEventListener<T> listener) {
            return getEventBus().addListener(eventType, listener);
        }
    }
}
