package com.assessment.finconecta.config;

import com.assessment.finconecta.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    // IMPORTANTE: Configuración para excluir recursos estáticos de Swagger
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers(
                "/finconecta/swagger-ui/**",
                "/finconecta/swagger-ui.html",
                "/finconecta/v3/api-docs/**",
                "/finconecta/api-docs/**",
                "/finconecta/webjars/**",
                "/finconecta/swagger-resources/**",
                "/finconecta/configuration/ui",
                "/finconecta/configuration/security",

                // También sin context path para compatibilidad
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/api-docs/**",
                "/webjars/**"
        );
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Rutas públicas de autenticación - CON CONTEXT PATH
                        .requestMatchers("/finconecta/api/auth/**").permitAll()

                        // También sin context path
                        .requestMatchers("/api/auth/**").permitAll()

                        // Permitir creación de usuarios
                        .requestMatchers(
                                "/finconecta/api/users",
                                "/api/users"
                        ).permitAll()

                        // Todas las demás rutas requieren autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. Orígenes permitidos EXPLÍCITOS
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173"
        ));

        // 2. TODOS los métodos necesarios
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));

        // 3. TODOS los headers necesarios
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Cache-Control"
        ));

        // 4. Headers expuestos (IMPORTANTE)
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        // 5. Permitir credenciales
        configuration.setAllowCredentials(true);

        // 6. Tiempo de cache (1 hora)
        configuration.setMaxAge(3600L);

        // 7. Aplicar a TODAS las rutas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, authService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ========== FILTRO JWT  ==========
    public static class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtUtil jwtUtil;
        private final AuthService authService;

        public JwtAuthenticationFilter(JwtUtil jwtUtil, AuthService authService) {
            this.jwtUtil = jwtUtil;
            this.authService = authService;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain chain) throws IOException, ServletException {

            String requestURI = request.getRequestURI();
            String servletPath = request.getServletPath();
            String method = request.getMethod();

            // Debug info
            System.out.println("=== JWT FILTER DEBUG ===");
            System.out.println("Request URI: " + requestURI);
            System.out.println("Servlet Path: " + servletPath);
            System.out.println("Context Path: " + request.getContextPath());
            System.out.println("Method: " + method);
            System.out.println("=========================");

            // 1. Permitir rutas de Swagger/OpenAPI
            if (isSwaggerPath(requestURI) || isSwaggerPath(servletPath)) {
                System.out.println("Es ruta de Swagger - permitiendo acceso");
                chain.doFilter(request, response);
                return;
            }

            // 2. Si es ruta pública de API, permitir sin validación
            if (isPublicApiPath(requestURI, method) || isPublicApiPath(servletPath, method)) {
                System.out.println("Es ruta pública de API - permitiendo acceso");
                chain.doFilter(request, response);
                return;
            }

            // 3. Obtener token del header
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization Header: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                sendError(response, "Token JWT requerido. Use: Authorization: Bearer <token>", 401);
                return;
            }

            String token = authHeader.substring(7);

            try {
                // 4. Validar token
                if (!authService.validateToken(token)) {
                    sendError(response, "Token inválido o expirado", 401);
                    return;
                }

                // 5. Extraer username y autenticar
                String username = jwtUtil.extractUsername(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, null);

                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 6. Continuar con la cadena
                chain.doFilter(request, response);

            } catch (Exception e) {
                e.printStackTrace();
                sendError(response, "Error: " + e.getMessage(), 401);
            }
        }

        private boolean isSwaggerPath(String path) {
            if (path == null) return false;

            // Lista de patrones Swagger/OpenAPI
            String[] swaggerPatterns = {
                    "/swagger-ui",
                    "/swagger-ui/",
                    "/swagger-ui.html",
                    "/v3/api-docs",
                    "/api-docs",
                    "/webjars",
                    "/swagger-resources",
                    "/configuration/ui",
                    "/configuration/security"
            };

            // Verificar con y sin context path
            for (String pattern : swaggerPatterns) {
                if (path.startsWith("/finconecta" + pattern) || path.startsWith(pattern)) {
                    return true;
                }
            }

            return false;
        }

        private boolean isPublicApiPath(String path, String method) {
            if (path == null) return false;

            // Rutas públicas de la API
            return
                    // Autenticación
                    (path.startsWith("/finconecta/api/auth") || path.startsWith("/api/auth")) ||

                            // Creación de usuarios (solo POST)
                            ((path.equals("/finconecta/api/users") || path.equals("/api/users")) && "POST".equals(method)) ||

                            // CORS preflight
                            "OPTIONS".equals(method);
        }

        private void sendError(HttpServletResponse response, String message, int status) throws IOException {
            response.setStatus(status);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            String jsonResponse = String.format(
                    "{\"success\": false, \"message\": \"%s\", \"status\": %d}",
                    message, status
            );
            response.getWriter().write(jsonResponse);
            System.out.println("Error enviado: " + jsonResponse);
        }
    }
}