package ricettariobackend.DAO;

import ricettariobackend.Database.DbConnection;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class StatsDAOImpl implements StatsDAO {

    public StatsDAOImpl() {}

    @Override
    public Map<String, Integer> distribuzioneDifficolta() {
        Map<String, Integer> result = new HashMap<>();
        String sql = "SELECT difficolta, COUNT(*) AS tot FROM ricette GROUP BY difficolta";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                result.put(rs.getString("difficolta"), rs.getInt("tot"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public Map<String, Object> getFullDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        String sql = "SELECT " +
                "(SELECT COUNT(*) FROM utenti) as total_users, " +
                "(SELECT COUNT(*) FROM ricette) as total_recipes, " +
                "(SELECT difficolta FROM ricette GROUP BY difficolta ORDER BY COUNT(*) DESC LIMIT 1) as common_diff, " +
                "(SELECT COUNT(*) FROM ricette WHERE difficolta = 'FACILE') as count_facile, " +
                "(SELECT COUNT(*) FROM ricette WHERE difficolta = 'MEDIO') as count_medio, " +
                "(SELECT COUNT(*) FROM ricette WHERE difficolta = 'DIFFICILE') as count_difficile";

        try (Connection conn = DbConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                stats.put("users", rs.getInt("total_users"));
                stats.put("recipes", rs.getInt("total_recipes"));
                stats.put("mostCommonDiff", rs.getString("common_diff"));
                stats.put("facile", rs.getInt("count_facile"));
                stats.put("medio", rs.getInt("count_medio"));
                stats.put("difficile", rs.getInt("count_difficile"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stats;
    }
}