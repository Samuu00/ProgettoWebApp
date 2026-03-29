package ricettariobackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import ricettariobackend.DAO.RicettaDAOImpl;
import ricettariobackend.Entity.Ricetta;

@SpringBootApplication
public class RicettarioBackendApplication {
    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(RicettarioBackendApplication.class, args);
    }
}