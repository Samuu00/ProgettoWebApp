package ricettariobackend.Entity;

public class Utenti {

    private Integer id;
    private String ruolo;
    private String username;
    private String email;
    private String password;
    private boolean stato;

    public Utenti() {}

    public Utenti(Integer id, String ruolo, String username, String email, String password, boolean stato) {
        this.id = id;
        this.ruolo = ruolo;
        this.username = username;
        this.email = email;
        this.password = password;
        this.stato = stato;
    }

    public Utenti(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.stato = false;
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

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isStato() {
        return stato;
    }
    public void setStato(boolean stato) {
        this.stato = stato;
    }
}
