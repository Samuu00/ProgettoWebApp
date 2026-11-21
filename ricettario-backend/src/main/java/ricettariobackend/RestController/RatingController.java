package ricettariobackend.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.DTO.RatingDTO;
import ricettariobackend.Entity.Ratings;
import ricettariobackend.Service.RatingService;
import ricettariobackend.Utility.CurrentUser;

@RestController
@RequestMapping("/api/stats")
public class RatingController {

    private final RatingService ratingService;
    private final CurrentUser currentUser;

    public RatingController(RatingService ratingService, CurrentUser currentUser) {
        this.ratingService = ratingService;
        this.currentUser = currentUser;
    }

    @PostMapping("/rating/{id}")
    public ResponseEntity<?> addRating(@PathVariable int id, @RequestBody RatingDTO ratingData,
                                       @RequestHeader(value = "Authorization", required = false) String auth) {
        int userId = currentUser.require(auth).getId();

        Integer voto = ratingData == null ? null : ratingData.getRating();
        if (!RatingService.isValidVote(voto)) {
            return ResponseEntity.badRequest().body("Il voto deve essere tra 1 e 5");
        }

        if (ratingService.addRating(new Ratings(userId, id, voto))) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Hai già votato questa ricetta!");
        }
    }

    @GetMapping("/check-rating/{id}")
    public ResponseEntity<Boolean> hasUserVoted(@PathVariable int id,
                                                @RequestHeader(value = "Authorization", required = false) String auth) {
        return ResponseEntity.ok(ratingService.hasUserVoted(currentUser.require(auth).getId(), id));
    }

    @GetMapping("/ratings/{id}")
    public ResponseEntity<Double> getAverageRating(@PathVariable int id) {
        return ResponseEntity.ok(ratingService.getAverageRating(id));
    }
}
