package ricettariobackend.DAO;

import ricettariobackend.Database.DbConnection;
import ricettariobackend.Entity.Favourites;
import ricettariobackend.Entity.Ricetta;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PreferitiDAOimpl implements PreferitiDAO {

    public PreferitiDAOimpl() {}

    @Override
    public boolean save(int UtenteId, int RicettaId) {
        String sql = "INSERT INTO favourites (utente, ricetta) VALUES (?, ?)";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, UtenteId);
            ps.setInt(2, RicettaId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            if ("23505".equals(e.getSQLState())) {
                return false;
            }
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean unsave(int UtenteId, int RicettaId) {
        String sql = "DELETE FROM favourites WHERE utente = ? AND ricetta = ?";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, UtenteId);
            ps.setInt(2, RicettaId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Ricetta> findByUserId(int id) {
        String sql = "SELECT r.* FROM ricette r JOIN favourites f ON r.id = f.ricetta WHERE f.utente = ?";
        List<Ricetta> ricette = new ArrayList<>();

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Ricetta r = new Ricetta();
                    r.setId(rs.getInt("id"));
                    r.setTitolo(rs.getString("titolo"));
                    r.setImmagineURL(rs.getString("immagine"));
                    r.setDescrizione(rs.getString("descrizione"));
                    r.setCategoria(rs.getString("categoria"));
                    r.setTempoCottura(rs.getInt("tempo"));
                    r.setDifficolta(rs.getString("difficolta"));
                    r.setIngredienti(rs.getString("ingredienti"));
                    r.setIstruzioni(rs.getString("istruzioni"));
                    r.setDataCreaz(rs.getDate("datacreazione"));
                    r.setStato(rs.getString("stato"));

                    ricette.add(r);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public boolean isFavourite(int userId, int recipeId) {
        String sql = "SELECT COUNT(*) FROM favourites WHERE utente = ? AND ricetta = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ps.setInt(2, recipeId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public int countFavoritesByUserId(int id){
        String sql = "SELECT COUNT(*) FROM favourites WHERE utente = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }
}