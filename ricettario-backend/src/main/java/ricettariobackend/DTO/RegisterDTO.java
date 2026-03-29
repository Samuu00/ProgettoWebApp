package ricettariobackend.DTO;

public class RegisterDTO {

    private String username;
    private String password;
    private String email;

    public RegisterDTO(String u, String p, String e) {
        this.username = u;
        this.password = p;
        this.email = e;
    }

    public RegisterDTO() {}

    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return password;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String e) {
        this.email = e;
    }
    public void setPassword(String p) {
        this.password = p;
    }
    public void setUsername(String u) {
        this.username = u;
    }
}
