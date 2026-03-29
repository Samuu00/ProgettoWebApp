package ricettariobackend.Proxy;

import ricettariobackend.DAO.StatsDAO;
import ricettariobackend.DAO.StatsDAOImpl;
import java.util.Map;

public class StatsDAOProxy implements StatsDAO {
    private final StatsDAO realDAO = new StatsDAOImpl();
    private Map<String, Integer> cacheDistribuzione;
    private long lastUpdate = 0;
    private static final long CACHE_DURATION = 60000;

    @Override
    public Map<String, Integer> distribuzioneDifficolta() {
        long currentTime = System.currentTimeMillis();

        if (cacheDistribuzione == null || (currentTime - lastUpdate) > CACHE_DURATION) {
            cacheDistribuzione = realDAO.distribuzioneDifficolta();
            lastUpdate = currentTime;
        }
        return cacheDistribuzione;
    }

    @Override
    public Map<String, Object> getFullDashboardStats() { return realDAO.getFullDashboardStats(); }
}