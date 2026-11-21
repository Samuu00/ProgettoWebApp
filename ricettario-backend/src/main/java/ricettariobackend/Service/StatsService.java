package ricettariobackend.Service;

import org.springframework.stereotype.Service;
import ricettariobackend.DAO.StatsDAO;
import ricettariobackend.DTO.DifficultyStatsDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StatsService {

    private final StatsDAO statsDAO;

    public StatsService(StatsDAO statsDAO) {
        this.statsDAO = statsDAO;
    }

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
