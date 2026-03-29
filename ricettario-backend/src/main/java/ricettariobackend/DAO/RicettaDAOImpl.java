package ricettariobackend.DAO;

import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.Database.DbConnection;
import ricettariobackend.Entity.Ricetta;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class RicettaDAOImpl implements RicettaDAO {

    public RicettaDAOImpl() {}

    @Override
    public boolean save(Ricetta r) {
        String query = "INSERT INTO richieste_ricette (titolo, descrizione, autore, ingredienti, istruzioni, tempo, difficolta, immagine, categoria) " +
                "VALUES (?, ?, ?, ?::lista_ingredienti[], ?, ?, ?, ?, ?) RETURNING id, datacreazione, stato";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, r.getTitolo());
            ps.setString(2, r.getDescrizione());
            if (r.getAutore() != null) ps.setInt(3, r.getAutore()); else ps.setNull(3, Types.INTEGER);
            ps.setString(4, ingrString(r.getIngredienti()));
            ps.setString(5, r.getIstruzioni());
            if (r.getTempoCottura() != null) ps.setInt(6, r.getTempoCottura()); else ps.setNull(6, Types.INTEGER);
            ps.setString(7, r.getDifficolta());
            ps.setString(8, r.getImmagineURL());
            ps.setString(9, r.getCategoria().toUpperCase());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    r.setId(rs.getInt("id"));
                    r.setDataCreaz(rs.getDate("datacreazione"));
                    r.setStato(rs.getString("stato"));
                    return true;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean update(Ricetta r) {
        String query = "UPDATE ricette SET titolo = ?, descrizione = ?, ingredienti = ?::lista_ingredienti[], istruzioni = ?, tempo = ?, difficolta = ?, immagine = ?, categoria = ? WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, r.getTitolo());
            ps.setString(2, r.getDescrizione());
            ps.setString(3, ingrString(r.getIngredienti()));
            ps.setString(4, r.getIstruzioni());
            ps.setInt(5, r.getTempoCottura());
            ps.setString(6, r.getDifficolta());
            ps.setString(7, r.getImmagineURL());
            ps.setString(8, r.getCategoria());
            ps.setInt(9, r.getId());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public void updateStatus(int id, String status) {
        String sql = "APPROVATA".equals(status) ?
                "UPDATE richieste_ricette SET stato = 'APPROVATA' WHERE id = ?" :
                "DELETE FROM richieste_ricette WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean delete(int id) {
        String sql = "DELETE FROM ricette WHERE id = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Ricetta> findByTitle(String title) {
        String query = "SELECT r.*, u.username AS nome_autore FROM ricette r LEFT JOIN utenti u ON r.autore = u.id WHERE r.titolo ILIKE ?";
        List<Ricetta> ricette = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, "%" + title + "%");
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) ricette.add(mappaRicetta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public Optional<Ricetta> findById(int id) {
        String query = "SELECT r.*, u.username AS nome_autore FROM ricette r LEFT JOIN utenti u ON r.autore = u.id WHERE r.id = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaRicetta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public boolean existsById(int id) {
        String query = "SELECT 1 FROM ricette WHERE id = ? LIMIT 1";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            return false;
        }
    }

    @Override
    public List<Ricetta> findByAuthorId(int authorId) {
        String query = "SELECT r.*, u.username AS nome_autore FROM ricette r LEFT JOIN utenti u ON r.autore = u.id WHERE r.autore = ?";
        List<Ricetta> ricette = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, authorId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) ricette.add(mappaRicetta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public List<Ricetta> getAllApprovedRecipes() {
        String query = "SELECT r.*, u.username AS nome_autore FROM ricette r LEFT JOIN utenti u ON r.autore = u.id ORDER BY r.datacreazione DESC";
        List<Ricetta> ricette = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) ricette.add(mappaRicetta(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public List<Ricetta> findByFilters(RecipeFilterDTO filters) {
        StringBuilder query = new StringBuilder(
                "SELECT r.*, u.username AS nome_autore " +
                        "FROM ricette r " +
                        "LEFT JOIN utenti u ON r.autore = u.id " +
                        "WHERE 1=1"
        );

        List<Object> params = new ArrayList<>();
        if (filters.getTitle() != null && !filters.getTitle().isBlank()) {

            query.append(" AND r.titolo ILIKE ?");
            params.add("%" + filters.getTitle() + "%");

        }

        if (filters.getDifficolta() != null && !filters.getDifficolta().isBlank()) {

            query.append(" AND r.difficolta = ?");
            params.add(filters.getDifficolta());

        }

        if (filters.getAuthor() != null && !filters.getAuthor().isBlank()) {

            query.append(" AND u.username = ?");
            params.add(filters.getAuthor());

        }

        if (filters.getMaxTime() != null && filters.getMaxTime() > 0) {

            query.append(" AND r.tempo <= ?");
            params.add(filters.getMaxTime());

        }

        if (filters.getCategory() != null && !filters.getCategory().isBlank()) {

            query.append(" AND r.categoria = ?");
            params.add(filters.getCategory().toUpperCase());

        }

        try {

            List<String> ingredienti = filters.getIngredienti();
            if (ingredienti != null && !ingredienti.isEmpty()) {
                for (String ingrediente : ingredienti) {

                    query.append(" AND r.ingredienti::text ILIKE ?");
                    params.add("%" + ingrediente + "%");
                }
            }
        } catch (Exception e) {}

        query.append(" ORDER BY r.datacreazione DESC");
        List<Ricetta> ricette = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query.toString())) {

            for (int i = 0; i < params.size(); i++) { ps.setObject(i + 1, params.get(i)); }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) { ricette.add(mappaRicetta(rs)); }

            }

        } catch (SQLException e) {
            System.err.println("Errore query filtri: " + e.getMessage());
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public int countAll() {
        String sql = "SELECT COUNT(id) FROM ricette";
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
    public List<Ricetta> findByStatus(String status) {
        String query = "SELECT r.*, u.username AS nome_autore FROM richieste_ricette r LEFT JOIN utenti u ON r.autore = u.id WHERE r.stato = ?";
        List<Ricetta> ricette = new ArrayList<>();
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, status);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) ricette.add(mappaRicetta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ricette;
    }

    @Override
    public Optional<Ricetta> getPendingRecipeById(int id){
        String query = "SELECT r.*, u.username AS nome_autore FROM richieste_ricette r LEFT JOIN utenti u ON r.autore = u.id WHERE r.id = ?";
        Ricetta ricetta = null;
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return Optional.of(mappaRicetta(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.ofNullable(ricetta);
    }

    @Override
    public int countByAuthor(int id) {
        String sql = "SELECT COUNT(id) FROM ricette WHERE autore = ?";
        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    private Ricetta mappaRicetta(ResultSet rs) throws SQLException {
        Ricetta r = new Ricetta();
        r.setId(rs.getInt("id"));
        r.setTitolo(rs.getString("titolo"));
        r.setDescrizione(rs.getString("descrizione"));
        r.setAutore(rs.getInt("autore"));
        try { r.setNomeAutore(rs.getString("nome_autore")); } catch (SQLException e) { r.setNomeAutore("Chef Anonimo"); }
        r.setIngredienti(rs.getString("ingredienti"));
        r.setIstruzioni(rs.getString("istruzioni"));
        r.setTempoCottura(rs.getInt("tempo"));
        r.setDifficolta(rs.getString("difficolta"));
        r.setImmagineURL(rs.getString("immagine"));
        r.setDataCreaz(rs.getDate("datacreazione"));
        r.setStato(rs.getString("stato"));
        r.setCategoria(rs.getString("categoria"));
        return r;
    }

    private String ingrString(String ingr) {
        if (ingr == null || ingr.isBlank()) return "{}";
        if (ingr.startsWith("{")) return ingr;
        StringBuilder q = new StringBuilder("{");
        String[] items = ingr.split(",");
        for (int i = 0; i < items.length; i++) {
            q.append("\"(1,qb,").append(items[i].trim().replace("\"", "")).append(")\"");
            if (i < items.length - 1) q.append(",");
        }
        return q.append("}").toString();
    }
}