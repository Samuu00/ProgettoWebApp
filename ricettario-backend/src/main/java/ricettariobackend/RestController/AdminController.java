package ricettariobackend.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.DTO.RicettaDTO;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Service.AdminService;
import ricettariobackend.Service.StatsService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private AdminService adminService = new AdminService();

    @GetMapping("/users")
    public ResponseEntity<List<Utenti>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<Void> changeUserStatus(@PathVariable int id) {
        adminService.changeUserStatus(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable int id, @RequestParam String ruolo) {
        adminService.updateUserRole(id, ruolo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/moderation")
    public ResponseEntity<List<RicettaDTO>> getPendingRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "BOZZA") String status,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tempoCottura) {

        try {

            List<RicettaDTO> lista = adminService.getPendingRecipes();
            return ResponseEntity.ok(lista);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/moderation/{id}")
    public ResponseEntity<RicettaDTO> getPendingRecipesById(@PathVariable("id") int id) {
        try{
            RicettaDTO ricetta = adminService.getPendingRecipeById(id);
            return ResponseEntity.ok(ricetta);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/moderation/{id}/approve")
    public ResponseEntity<Void> approveRecipe(@PathVariable int id) {
        adminService.approveRecipe(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/moderation/{id}/reject")
    public ResponseEntity<Void> rejectRecipe(@PathVariable int id) {
        adminService.rejectRecipe(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/moderation/{id}/delete")
    public ResponseEntity<Void> deleteRecipe(@PathVariable int id) {
        try {
            adminService.deleteRecipe(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}