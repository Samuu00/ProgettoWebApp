package ricettariobackend.DAO;

import java.util.Map;

public interface StatsDAO {

    Map<String, Integer> distribuzioneDifficolta();
    Map<String, Object> getFullDashboardStats();

}
