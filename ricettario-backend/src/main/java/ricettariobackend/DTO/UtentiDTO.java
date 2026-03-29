package ricettariobackend.DTO;

public class UtentiDTO {
        private Integer id;
        private String username;
        private String email;
        private String ruolo;
        private Boolean stato;

    public UtentiDTO() {}

    public UtentiDTO(String ruolo, String username, String email, Boolean stato) {
        this.ruolo = ruolo;
        this.username = username;
        this.email = email;
        this.stato = stato;
    }

    public UtentiDTO(Integer id, String ruolo, String username, String email, Boolean stato) {
        this.id = id;
        this.ruolo = ruolo;
        this.username = username;
        this.email = email;
        this.stato = stato;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getRuolo() {
        return ruolo;
    }
    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getStato() {
        return stato;
    }
    public void setStato(Boolean stato) {
        this.stato = stato;
    }

}
