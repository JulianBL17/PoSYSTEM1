package com.pos.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.pos.service.UsuarioService;

@Configuration
public class SecurityConfig {

    private final UsuarioService usuarioService;

    public SecurityConfig(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Nota: Para producción, se recomienda cambiar NoOpPasswordEncoder por BCryptPasswordEncoder
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(usuarioService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())   // Usa el bean corsConfigurationSource de abajo
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                // Login tradicional y recursos estáticos (Acceso público)
                .requestMatchers(
                    "/login",
                    "/css/**",
                    "/api/auth/**"
                ).permitAll()

                // Restricciones por jerarquía de roles (Soporta autoridades con y sin prefijo ROLE_)
                .requestMatchers("/api/usuarios/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                .requestMatchers("/api/descuentos/**").hasAnyAuthority("ADMIN", "ROLE_ADMIN")
                .requestMatchers("/api/mesas/**").hasAnyAuthority("ADMIN", "MESERO", "ROLE_ADMIN", "ROLE_MESERO")
                .requestMatchers("/api/productos/**").hasAnyAuthority("ADMIN", "INVENTARIO", "ROLE_ADMIN", "ROLE_INVENTARIO")
                .requestMatchers("/api/proveedores/**").hasAnyAuthority("ADMIN", "INVENTARIO", "ROLE_ADMIN", "ROLE_INVENTARIO")
                .requestMatchers("/api/ventas/**").hasAnyAuthority("ADMIN", "CAJERO", "MESERO", "ROLE_ADMIN", "ROLE_CAJERO", "ROLE_MESERO")

                // Cualquier otra solicitud requiere estar autenticado
                .anyRequest().authenticated()
            )

            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )

            .logout(logout -> logout
                .permitAll()
            );

        return http.build();
    }

    /**
     * CORS global: Lee los orígenes permitidos desde el archivo application.properties
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${pos.cors.allowed-origins}") String[] origenesPermitidos) {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(origenesPermitidos));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}