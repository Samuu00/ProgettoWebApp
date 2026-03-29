package ricettariobackend.DTO;

public class AuthResponseDTO {
    private String token;
    private UtentiDTO user;

    public AuthResponseDTO(String token, UtentiDTO user) {
        this.token = token;
        this.user = user;
    }

    public AuthResponseDTO() {}

    public String getToken() {
        return token;
    }
    public UtentiDTO getUser() {
        return user;
    }

    public void setToken(String token) {
        this.token = token;
    }
    public void setUser(UtentiDTO user) {
        this.user = user;
    }
}
