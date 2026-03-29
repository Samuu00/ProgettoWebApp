package ricettariobackend.DAO;

import ricettariobackend.Database.DbConnection;
import ricettariobackend.Entity.Ratings;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RatingDAOImpl implements RatingDAO {

    public RatingDAOImpl() {
    }

    @Override
    public boolean save(Ratings rating) {
        if (gaveRating(rating.getUtente(), rating.getRicetta())) {
            System.out.println("Utente " + rating.getUtente() + " ha già votato la ricetta " + rating.getRicetta());
            return false;
        }
        String sql = "INSERT INTO ratings (utente, ricetta, voto) VALUES (?, ?, ?)";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, rating.getUtente());
            ps.setInt(2, rating.getRicetta());
            ps.setInt(3, rating.getVoto());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Ratings> findByRecipeId(int id) {
        List<Ratings> ratingsList = new ArrayList<>();
        String sql = "SELECT * FROM ratings WHERE ricetta = ?";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Ratings rating = new Ratings(
                            rs.getInt("utente"),
                            rs.getInt("ricetta"),
                            rs.getInt("voto")
                    );
                    ratingsList.add(rating);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ratingsList;
    }

    @Override
    public double averageRating(int id) {
        String sql = "SELECT AVG(voto) as media FROM ratings WHERE ricetta = ?";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    double media = rs.getDouble("media");
                    return rs.wasNull() ? 0.0 : media;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0.0;
    }

    @Override
    public boolean gaveRating(int utenteId, int ricettaId) {
        String sql = "SELECT 1 FROM ratings WHERE utente = ? AND ricetta = ?";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, utenteId);
            ps.setInt(2, ricettaId);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}