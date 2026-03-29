package ricettariobackend.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Proxy.UtenteDAOProxy;
import ricettariobackend.Service.RicetteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.Utility.JwtUtil;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:4200")
public class RicettaController {

    private RicetteService ricettaService = new RicetteService();

    @Autowired
    private JwtUtil jwtUtil;

    private UtenteDAO utenteDAO = new UtenteDAOProxy();

    @GetMapping("/{id}")
    public ResponseEntity<RicettaDTO> getRicettaById(@PathVariable int id) {
        try {
            RicettaDTO ricetta = ricettaService.getRicettaDetailById(id);
            return ResponseEntity.ok(ricetta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/recipe-list")
    public ResponseEntity<List<RicettaDTO>> getAllRicette(
            @RequestParam(required = false) String title,
            @RequestParam(required = false, name = "difficulty") String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String tempoCottura) {

        RecipeFilterDTO filters = new RecipeFilterDTO();
        filters.setTitle(title);
        filters.setDifficolta(difficulty);
        filters.setCategory(category);
        filters.setAuthor(author);

        Integer maxTime = null;
        if (tempoCottura != null && !tempoCottura.isBlank()) {
            try {
                maxTime = Integer.valueOf(tempoCottura.trim());
                if (maxTime < 0) {
                    return ResponseEntity.badRequest().build();
                }
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        filters.setMaxTime(maxTime);

        List<RicettaDTO> ricette = ricettaService.filterRicette(filters);
        return ResponseEntity.ok(ricette);
    }

    @PostMapping("/recipe-create")
    public ResponseEntity<Boolean> saveFromForm(@RequestBody RicettaDTO dto) {
        try {
            boolean salvata = ricettaService.saveRicettaFromForm(dto);
            return ResponseEntity.ok(salvata);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/recipe-edit/{id}")
    public ResponseEntity<Boolean> updateRecipe(@RequestBody RicettaDTO dto) {
        try {
            boolean salvata = ricettaService.updateRicetta(dto);
            return ResponseEntity.ok(salvata);
        } catch (Exception e) {
            System.err.println("Messaggio: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RicettaDTO>> getFavorites(@RequestHeader("Authorization") String token) {
        Integer userId = getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<RicettaDTO> preferiti = ricettaService.getFavorites(userId);
        return ResponseEntity.ok(preferiti);
    }

    @GetMapping("/{id}/favorite/check")
    public ResponseEntity<Boolean> isFavourite(@PathVariable int id, @RequestHeader("Authorization") String token) {
        Integer userId = getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
        boolean isFav = ricettaService.isRecipeInFavorites(userId, id);
        return ResponseEntity.ok(isFav);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> toggleFavorite(@PathVariable int id, @RequestHeader("Authorization") String token) {
        Integer userId = getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<RicettaDTO> favorites = ricettaService.getFavorites(userId);

        boolean isAlreadyFavorite = favorites.stream()
                .anyMatch(r -> r.getId().equals(id));

        if (isAlreadyFavorite) {
            ricettaService.removeFromFavorites(userId, id);
        } else {
            ricettaService.addToFavorites(userId, id);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/favorite/count")
    public ResponseEntity<Integer> getFavoritesCount(@RequestHeader("Authorization") String token) {
        Integer userId = getUserIdFromToken(token);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(0);
        }

        int count = ricettaService.countFavoritesByUserId(userId);
        return ResponseEntity.ok(count);
    }

    private Integer getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            String email = jwtUtil.extractEmail(jwt);
            return utenteDAO.findByEmail(email)
                    .map(u -> u.getId())
                    .orElse(null);
        }
        return null;
    }
}
