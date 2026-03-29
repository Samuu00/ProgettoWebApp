package ricettariobackend.Service;

import ricettariobackend.DAO.CommentiDAO;
import ricettariobackend.DAO.UtenteDAO;
import ricettariobackend.DTO.CommentDTO;
import ricettariobackend.Entity.Commento;
import ricettariobackend.Entity.Utenti;
import ricettariobackend.Proxy.CommentiDAOProxy;
import ricettariobackend.Proxy.UtenteDAOProxy;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CommentiService {

    private CommentiDAO commentiDAO = new CommentiDAOProxy();
    private UtenteDAO utenteDAO = new UtenteDAOProxy();

    public List<CommentDTO> getCommentiByRicetta(int idRicetta) {
        List<Commento> entities = commentiDAO.findByRecipeId(idRicetta);

        return entities.stream().map(c -> {
            CommentDTO dto = new CommentDTO();
            dto.setId(c.getId());
            dto.setContent(c.getContenuto());
            dto.setAuthUsername(c.getUsername());
            dto.setCreateDate(String.valueOf(c.getDatapub()));
            dto.setRecipeID(c.getRicetta());
            return dto;
        }).toList();
    }

    public boolean deleteCommento(int id) {
        return commentiDAO.delete(id);
    }

    public CommentDTO addCommentoAndReturn(CommentDTO dto) {
        Commento c = new Commento();
        c.setContenuto(dto.getContent());
        c.setRicetta(dto.getRecipeID());

        try {
            Optional<Utenti> utenteOpt = utenteDAO.findByUsername(dto.getAuthUsername());

            if (utenteOpt.isPresent()) {
                c.setAutore(utenteOpt.get().getId());

                if (commentiDAO.save(c)) {

                    dto.setId(c.getId());
                    dto.setCreateDate(c.getDatapub());
                    return dto;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
//af
    public List<CommentDTO> getAllComments() {
        List<Commento> commenti = commentiDAO.findAll();
        List<CommentDTO> commentiDTO = new ArrayList<>();
        for(Commento c:commenti)
        {
            CommentDTO cDTO = new CommentDTO(c);
            commentiDTO.add(cDTO);
        }
        return commentiDTO;
    }
}