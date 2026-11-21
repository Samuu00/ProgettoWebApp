package ricettariobackend.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ricettariobackend.DTO.CommentDTO;
import ricettariobackend.Service.CommentiService;
import ricettariobackend.Utility.CurrentUser;

import java.util.List;

@RestController
@RequestMapping("/api/commenti")
public class CommentiController {

    private final CommentiService commentiService;
    private final CurrentUser currentUser;

    public CommentiController(CommentiService commentiService, CurrentUser currentUser) {
        this.commentiService = commentiService;
        this.currentUser = currentUser;
    }

    @GetMapping("/ricetta/{id}")
    public ResponseEntity<List<CommentDTO>> getCommenti(@PathVariable int id) {
        return ResponseEntity.ok(commentiService.getCommentiByRicetta(id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCommento(@RequestBody CommentDTO commentoDto,
                                         @RequestHeader(value = "Authorization", required = false) String auth) {
        CommentDTO salvato = commentiService.addCommentoAndReturn(commentoDto, currentUser.require(auth));

        if (salvato != null) {
            return ResponseEntity.ok(salvato);
        } else {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCommento(@PathVariable int id,
                                               @RequestHeader(value = "Authorization", required = false) String auth) {
        commentiService.deleteCommento(id, currentUser.require(auth));
        return ResponseEntity.ok().build();
    }

    // Solo ADMIN: vedi interceptor in Utility/WebConfig.
    @GetMapping("/all")
    public ResponseEntity<List<CommentDTO>> getCommenti() {
        return ResponseEntity.ok(commentiService.getAllComments());
    }
}
