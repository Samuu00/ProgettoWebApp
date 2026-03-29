package ricettariobackend.Proxy;

import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DAO.UtenteDAOImpl;
import ricettariobackend.Entity.Utenti;

import java.util.List;
import java.util.Optional;

public class UtenteDAOProxy implements UtenteDAO {

    private final UtenteDAO realDAO = new UtenteDAOImpl();

    @Override
    public boolean delete(Utenti utente) {
        if ("ADMIN".equalsIgnoreCase(utente.getRuolo())) { return false; }
        return realDAO.delete(utente);
    }

    @Override
    public void updateStatus(int id, boolean status) {
        realDAO.updateStatus(id, status);
    }

    @Override
    public Optional<Utenti> findByUsername(String username) { return realDAO.findByUsername(username); }

    @Override
    public Optional<Utenti> findById(int id) { return realDAO.findById(id); }

    @Override
    public List<Utenti> findByStatus(boolean status) { return realDAO.findByStatus(status); }

    @Override
    public Optional<Utenti> findByEmail(String email) { return realDAO.findByEmail(email); }

    @Override
    public List<Utenti> findAll() { return realDAO.findAll(); }

    @Override
    public boolean existsByUsername(String username) { return realDAO.existsByUsername(username); }

    @Override
    public boolean save(Utenti utente) { return realDAO.save(utente); }

    @Override
    public boolean update(Utenti utente) { return realDAO.update(utente); }

    @Override
    public boolean updateUsername(String username, int id) { return realDAO.updateUsername(username, id); }

    @Override
    public boolean userStatus(int id) { return realDAO.userStatus(id); }

    @Override
    public boolean updateRole(int id, String role) { return realDAO.updateRole(id, role); }

    @Override
    public int countAll() { return realDAO.countAll(); }
}