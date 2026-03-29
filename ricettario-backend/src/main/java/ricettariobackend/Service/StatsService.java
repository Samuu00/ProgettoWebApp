package ricettariobackend.Service;

import org.springframework.stereotype.Service;
import ricettariobackend.DAO.StatsDAO;
import ricettariobackend.DAO.StatsDAOImpl;
import ricettariobackend.DTO.DifficultyStatsDTO;
import ricettariobackend.Proxy.StatsDAOProxy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private StatsDAO statsDAO = new StatsDAOProxy();

    public List<DifficultyStatsDTO> getDifficultyStats() {

        Map<String, Integer> stats = statsDAO.distribuzioneDifficolta();

        List<DifficultyStatsDTO> statsList = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : stats.entrySet()) {
            String level = (entry.getKey() == null || entry.getKey().trim().isEmpty()) ? "Non specificato" : entry.getKey();

            statsList.add(new DifficultyStatsDTO(level, entry.getValue()));
        }

        return statsList;
    }

}
