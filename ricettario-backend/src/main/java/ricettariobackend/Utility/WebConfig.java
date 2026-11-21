package ricettariobackend.Utility;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ricettariobackend.Entity.Utenti;

/** CORS globale (origini da configurazione) e controllo ruolo ADMIN su /api/admin/**. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final CurrentUser currentUser;
    private final String[] allowedOrigins;

    public WebConfig(CurrentUser currentUser, @Value("${app.cors.allowed-origins}") String[] allowedOrigins) {
        this.currentUser = currentUser;
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
                if (CorsUtils.isPreFlightRequest(req)) return true;
                Utenti u = currentUser.from(req.getHeader("Authorization")).orElse(null);
                if (u == null) {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return false;
                }
                if (!CurrentUser.isAdmin(u)) {
                    res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return false;
                }
                return true;
            }
        }).addPathPatterns("/api/admin/**", "/api/commenti/all");
    }
}
