package ricettariobackend.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.DTO.CommentDTO;
import ricettariobackend.Entity.Commento;
import ricettariobackend.Service.CommentiService;

import java.util.List;

@RestController
@RequestMapping("/api/commenti")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentiController {

    private CommentiService commentiService = new CommentiService();

    @GetMapping("/ricetta/{id}")
    public ResponseEntity<List<CommentDTO>> getCommenti(@PathVariable int id) {
        return ResponseEntity.ok(commentiService.getCommentiByRicetta(id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCommento(@RequestBody CommentDTO commentoDto) {
        CommentDTO salvato = commentiService.addCommentoAndReturn(commentoDto);

        if (salvato != null) {
            return ResponseEntity.ok(salvato);
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCommento(@PathVariable int id) {
        boolean successo = commentiService.deleteCommento(id);
        if (successo) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
//aa
    @GetMapping("/all")
    public ResponseEntity<List<CommentDTO>> getCommenti() {
        List<CommentDTO> commenti= commentiService.getAllComments();
        return ResponseEntity.ok(commenti);
    }
}