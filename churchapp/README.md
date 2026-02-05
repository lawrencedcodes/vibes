# FaithTech SMS

## Prerequisites
- Java 17+
- Maven 3.6+

## Running the Application
1. Ensure Maven is installed and in your PATH.
2. Navigate to the project root.
3. Run:
   ```bash
   mvn spring-boot:run
   ```

## Verification
- **Console Output**: Look for "SYSTEM READY: Go to http://localhost:8080/connect/ebenezer"
- **Admin UI**: Access `http://localhost:8080/visitors`
- **Public Intake**: Access `http://localhost:8080/connect/ebenezer`

## Database
- H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:faithtechdb`
- User: `sa`
- Password: `password`
