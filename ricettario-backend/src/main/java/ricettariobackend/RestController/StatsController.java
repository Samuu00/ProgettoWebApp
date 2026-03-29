package ricettariobackend.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ricettariobackend.DTO.DifficultyStatsDTO;
import ricettariobackend.Service.StatsService;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService = new StatsService();

    @GetMapping("/difficulty")
    public ResponseEntity<List<DifficultyStatsDTO>> getDifficultyStats() {
        try {
            List<DifficultyStatsDTO> stats = statsService.getDifficultyStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}