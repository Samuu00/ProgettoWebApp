package ricettariobackend.RestController;

import ricettariobackend.DTO.RecipeFilterDTO;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Service.RicetteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.Utility.CurrentUser;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RicettaController {

    private final RicetteService ricettaService;
    private final CurrentUser currentUser;

    public RicettaController(RicetteService ricettaService, CurrentUser currentUser) {
        this.ricettaService = ricettaService;
        this.currentUser = currentUser;
    }

    @GetMapping("/{id}")
    public ResponseEntity<RicettaDTO> getRicettaById(@PathVariable int id) {
        return ResponseEntity.ok(ricettaService.getRicettaDetailById(id));
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
    public ResponseEntity<Boolean> saveFromForm(@RequestBody RicettaDTO dto,
                                                @RequestHeader(value = "Authorization", required = false) String token) {
        int userId = currentUser.require(token).getId();
        try {
            boolean salvata = ricettaService.saveRicettaFromForm(dto, userId);
            return ResponseEntity.ok(salvata);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/recipe-edit/{id}")
    public ResponseEntity<Boolean> updateRecipe(@PathVariable int id, @RequestBody RicettaDTO dto,
                                                @RequestHeader(value = "Authorization", required = false) String token) {
        return ResponseEntity.ok(ricettaService.updateRicetta(id, dto, currentUser.require(token)));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RicettaDTO>> getFavorites(@RequestHeader(value = "Authorization", required = false) String token) {
        int userId = currentUser.require(token).getId();

        List<RicettaDTO> preferiti = ricettaService.getFavorites(userId);
        return ResponseEntity.ok(preferiti);
    }

    @GetMapping("/{id}/favorite/check")
    public ResponseEntity<Boolean> isFavourite(@PathVariable int id, @RequestHeader(value = "Authorization", required = false) String token) {
        int userId = currentUser.require(token).getId();
        boolean isFav = ricettaService.isRecipeInFavorites(userId, id);
        return ResponseEntity.ok(isFav);
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> toggleFavorite(@PathVariable int id, @RequestHeader(value = "Authorization", required = false) String token) {
        int userId = currentUser.require(token).getId();

        if (ricettaService.isRecipeInFavorites(userId, id)) {
            ricettaService.removeFromFavorites(userId, id);
        } else {
            ricettaService.addToFavorites(userId, id);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/favorite/count")
    public ResponseEntity<Integer> getFavoritesCount(@RequestHeader(value = "Authorization", required = false) String token) {
        int userId = currentUser.require(token).getId();

        int count = ricettaService.countFavoritesByUserId(userId);
        return ResponseEntity.ok(count);
    }
}
