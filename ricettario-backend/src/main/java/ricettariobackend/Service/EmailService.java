package ricettariobackend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetLink(String email, String token){

        String resetLink = "http://localhost:4200/reset-password/" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("ricettefacili2026@gmail.com");
        message.setTo(email);
        message.setSubject("Richiesta Ripristino Password");
        message.setText("Ciao,\n\nHai richiesto di reimpostare la password." +
                "\nClicca qui per procedere:\n" + resetLink +
                "\n\nSe non sei stato tu, ignora questa email.");

        mailSender.send(message);
    }
}
