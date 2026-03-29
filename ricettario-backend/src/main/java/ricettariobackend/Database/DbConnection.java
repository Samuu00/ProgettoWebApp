package ricettariobackend.Database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DbConnection {

    private static final String URL = ConfigManager.getProperty("db.url");
    private static final String USER = ConfigManager.getProperty("db.user");
    private static final String PASS = ConfigManager.getProperty("db.passw");

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Driver non trovato: " + e.getMessage());
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}