package ricettariobackend.DAO;

import ricettariobackend.Entity.Utenti;

import java.util.List;
import java.util.Optional;

public interface UtenteDAO {

    Optional<Utenti> findByUsername(String username);
    Optional<Utenti> findById(int id);
    List<Utenti> findByStatus(boolean status);
    Optional<Utenti> findByEmail(String email);
    List<Utenti> findAll();
    boolean existsByUsername(String username);
    boolean save(Utenti utente);
    boolean update(Utenti utente);
    boolean updateUsername(String username, int id);
    void updateStatus(int id, boolean status);
    boolean userStatus(int id);
    boolean delete(Utenti utente);
    boolean updateRole(int id, String role);
    int countAll();
}
