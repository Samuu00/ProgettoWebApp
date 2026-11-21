package ricettariobackend.Proxy;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;
import ricettariobackend.DAO.StatsDAO;
import ricettariobackend.DAO.StatsDAOImpl;
import java.util.Collections;
import java.util.Map;

/**
 * Caching proxy: implementa StatsDAO, delega a StatsDAOImpl e tiene in cache per 60s
 * la distribuzione per difficoltà (query aggregata, letta da pagine pubbliche).
 * Le statistiche della dashboard admin non sono in cache: devono essere sempre aggiornate.
 * E' @Primary, quindi chi inietta StatsDAO riceve il proxy e non il DAO reale.
 */
@Repository
@Primary
public class StatsDAOProxy implements StatsDAO {
    private static final long CACHE_DURATION = 60000;

    private final StatsDAO realDAO;
    private Map<String, Integer> cacheDistribuzione;
    private long lastUpdate = 0;

    public StatsDAOProxy(StatsDAOImpl realDAO) {
        this.realDAO = realDAO;
    }

    @Override
    public synchronized Map<String, Integer> distribuzioneDifficolta() {
        long currentTime = System.currentTimeMillis();

        if (cacheDistribuzione == null || (currentTime - lastUpdate) > CACHE_DURATION) {
            cacheDistribuzione = Collections.unmodifiableMap(realDAO.distribuzioneDifficolta());
            lastUpdate = currentTime;
        }
        return cacheDistribuzione;
    }

    @Override
    public Map<String, Object> getFullDashboardStats() { return realDAO.getFullDashboardStats(); }
}
