package ricettariobackend.Service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ricettariobackend.DAO.CommentiDAO;
import ricettariobackend.DTO.CommentDTO;
import ricettariobackend.Entity.Commento;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Utility.CurrentUser;

import java.util.List;

@Service
public class CommentiService {

    private final CommentiDAO commentiDAO;

    public CommentiService(CommentiDAO commentiDAO) {
        this.commentiDAO = commentiDAO;
    }

    public List<CommentDTO> getCommentiByRicetta(int idRicetta) {
        return commentiDAO.findByRecipeId(idRicetta).stream().map(CommentDTO::new).toList();
    }

    /** Solo l'autore del commento o un admin possono eliminarlo. */
    public void deleteCommento(int id, Utenti utente) {
        Commento c = commentiDAO.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        CurrentUser.requireOwnerOrAdmin(utente, c.getAutore());
        commentiDAO.delete(id);
    }

    /** L'autore è sempre l'utente autenticato, mai quello indicato nel body. */
    public CommentDTO addCommentoAndReturn(CommentDTO dto, Utenti autore) {
        if (dto == null || dto.getRecipeID() == null || dto.getContent() == null || dto.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Commento vuoto");
        }
        Commento c = new Commento();
        c.setContenuto(dto.getContent());
        c.setRicetta(dto.getRecipeID());
        c.setAutore(autore.getId());

        if (!commentiDAO.save(c)) return null;

        dto.setId(c.getId());
        dto.setCreateDate(c.getDatapub());
        dto.setAuthUsername(autore.getUsername());
        return dto;
    }

    public List<CommentDTO> getAllComments() {
        return commentiDAO.findAll().stream().map(CommentDTO::new).toList();
    }
}
