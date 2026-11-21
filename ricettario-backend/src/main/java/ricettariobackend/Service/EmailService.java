package ricettariobackend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String from;
    private final String frontendUrl;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.from}") String from,
                        @Value("${app.frontend-url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.from = from;
        this.frontendUrl = frontendUrl;
    }

    public void sendResetLink(String email, String token){

        String resetLink = frontendUrl + "/reset-password/" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email);
        message.setSubject("Richiesta Ripristino Password");
        message.setText("Ciao,\n\nHai richiesto di reimpostare la password." +
                "\nClicca qui per procedere (il link scade tra 30 minuti):\n" + resetLink +
                "\n\nSe non sei stato tu, ignora questa email.");

        mailSender.send(message);
    }
}
