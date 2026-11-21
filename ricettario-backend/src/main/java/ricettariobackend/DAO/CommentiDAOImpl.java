package ricettariobackend.DAO;

import org.springframework.stereotype.Repository;
import ricettariobackend.Entity.Commento;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CommentiDAOImpl implements CommentiDAO {

    private final DataSource dataSource;

    public CommentiDAOImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public boolean save(Commento c) {
        String query = "INSERT INTO commenti (contenuto, autore, ricetta) VALUES (?, ?, ?) RETURNING id, datapub";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setString(1, c.getContenuto());
            ps.setInt(2, c.getAutore());
            ps.setInt(3, c.getRicetta());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    c.setId(rs.getInt("id"));
                    // Recuperiamo la data reale assegnata dal database
                    c.setDataPub(rs.getString("datapub"));
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Commento> findByRecipeId(int id) {
        List<Commento> commenti = new ArrayList<>();
        String sql = "SELECT c.id, c.contenuto, c.datapub, c.autore, c.ricetta, u.username " +
                "FROM commenti c JOIN utenti u ON c.autore = u.id " +
                "WHERE c.ricetta = ? ORDER BY c.datapub DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    commenti.add(mappaCommento(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return commenti;
    }

    @Override
    public Optional<Commento> findById(int id) {
        String sql = "SELECT c.id, c.contenuto, c.datapub, c.autore, c.ricetta, u.username " +
                "FROM commenti c JOIN utenti u ON c.autore = u.id WHERE c.id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaCommento(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM commenti WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Commento> findAll() {
        List<Commento> commenti = new ArrayList<>();
        String sql = "SELECT c.id, c.contenuto, c.datapub, c.autore, c.ricetta, u.username " +
                "FROM commenti c " +
                "JOIN utenti u ON c.autore = u.id " +
                "ORDER BY c.datapub DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                commenti.add(mappaCommento(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return commenti;
    }

    private Commento mappaCommento(ResultSet rs) throws SQLException {
        String dataStringa = "";
        Timestamp ts = rs.getTimestamp("datapub");
        if (ts != null) {
            dataStringa = ts.toLocalDateTime().toString();
        }

        Commento commento = new Commento(
                rs.getInt("id"),
                rs.getString("contenuto"),
                rs.getInt("autore"),
                dataStringa,
                rs.getInt("ricetta")
        );
        commento.setUsername(rs.getString("username"));
        return commento;
    }
}