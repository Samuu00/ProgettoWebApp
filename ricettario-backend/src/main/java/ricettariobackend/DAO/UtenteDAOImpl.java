package ricettariobackend.DAO;

import ricettariobackend.Database.DbConnection;
import ricettariobackend.Entity.Utenti;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UtenteDAOImpl implements UtenteDAO {

    public UtenteDAOImpl() {}

    @Override
    public boolean save(Utenti utente) {
        String sql = "INSERT INTO utenti (username, email, password) VALUES (?, ?, ?) RETURNING id, ruolo, stato";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, utente.getUsername());
            ps.setString(2, utente.getEmail());
            ps.setString(3, utente.getPassword());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    utente.setId(rs.getInt("id"));
                    utente.setRuolo(rs.getString("ruolo"));
                    utente.setStato(rs.getBoolean("stato"));
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public Optional<Utenti> findByUsername(String username) {
        String sql = "SELECT id, username, email, password, ruolo, stato FROM utenti WHERE username = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaUtente(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public Optional<Utenti> findById(int id) {
        String sql = "SELECT id, username, email, password, ruolo, stato FROM utenti WHERE id = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaUtente(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public boolean existsByUsername(String username) {
        String sql = "SELECT 1 FROM utenti WHERE username = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean update(Utenti utente) {
        String sql = "UPDATE utenti SET username = ?, password = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, utente.getUsername());
            ps.setString(2, utente.getPassword());
            ps.setInt(3, utente.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean updateUsername(String username, int id) {
        String sql = "UPDATE utenti SET username = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean delete(Utenti utente) {
        String sql = "DELETE FROM utenti WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, utente.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public int countAll() {
        String sql = "SELECT COUNT(*) FROM utenti";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    @Override
    public List<Utenti> findByStatus(boolean status) {
        List<Utenti> utenti = new ArrayList<>();
        String sql = "SELECT id, username, email, password, ruolo, stato FROM utenti WHERE stato = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, status);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) utenti.add(mappaUtente(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return utenti;
    }

    @Override
    public void updateStatus(int id, boolean status) {
        String sql = "UPDATE utenti SET stato = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setBoolean(1, status);
            ps.setInt(2, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean updateRole(int id, String nuovoRuolo) {
        String sql = "UPDATE utenti SET ruolo = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, nuovoRuolo.toUpperCase());
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Utenti> findAll() {
        List<Utenti> utenti = new ArrayList<>();
        String sql = "SELECT id, username, email, password, ruolo, stato FROM utenti ORDER BY username ASC";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) utenti.add(mappaUtente(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return utenti;
    }

    @Override
    public Optional<Utenti> findByEmail(String email) {
        String sql = "SELECT id, username, email, password, ruolo, stato FROM utenti WHERE email = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaUtente(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public boolean userStatus(int id) {
        String sql = "SELECT stato FROM utenti WHERE id = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getBoolean(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Utenti mappaUtente(ResultSet rs) throws SQLException {
        Utenti u = new Utenti();
        u.setId(rs.getInt("id"));
        u.setUsername(rs.getString("username"));
        u.setEmail(rs.getString("email"));
        u.setPassword(rs.getString("password"));
        u.setRuolo(rs.getString("ruolo"));
        u.setStato(rs.getBoolean("stato"));
        return u;
    }
}