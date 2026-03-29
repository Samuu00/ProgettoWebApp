package ricettariobackend.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.DTO.RatingDTO;
import ricettariobackend.Entity.Ratings;
import ricettariobackend.Service.RatingService;
import ricettariobackend.Utility.JwtUtil;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.Proxy.UtenteDAOProxy;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:4200")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private JwtUtil jwtUtil;

    private UtenteDAO utenteDAO = new UtenteDAOProxy();

    private Integer getUserIdFromToken(String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                String email = jwtUtil.extractEmail(jwt);
                return utenteDAO.findByEmail(email).map(u -> u.getId()).orElse(null);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }


    @PostMapping("/rating/{id}")
    public ResponseEntity<?> addRating(@PathVariable int id, @RequestBody RatingDTO ratingData, @RequestHeader("Authorization") String token) {

        Integer userId = getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer voto = ratingData.getRating();

        Ratings rating = new Ratings(userId, id, voto);
        boolean success = ratingService.addRating(rating);

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Hai già votato questa ricetta!");
        }
    }
    @GetMapping("/check-rating/{id}")
    public ResponseEntity<Boolean> hasUserVoted(@PathVariable int id, @RequestHeader("Authorization") String token) {
        Integer userId = getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        return ResponseEntity.ok(ratingService.hasUserVoted(userId, id));
    }

    @GetMapping("/ratings/{id}")
    public ResponseEntity<Double> getAverageRating(@PathVariable int id) {
        return ResponseEntity.ok(ratingService.getAverageRating(id));
    }
}