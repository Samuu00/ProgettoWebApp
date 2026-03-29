package ricettariobackend.DTO;

public class LoginDTO {

    private String username;
    private String password;

    public LoginDTO(String u, String p) {
        this.username = u;
        this.password = p;
    }

    public LoginDTO() {}

    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String p) {
        this.password = p;
    }
    public void setUsername(String u) {
        this.username = u;
    }
}
