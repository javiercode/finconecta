package com.assessment.finconecta.web;

import com.assessment.finconecta.dto.LoginRequest;
import com.assessment.finconecta.dto.LoginResponse;
import com.assessment.finconecta.dto.Response;
import com.assessment.finconecta.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Login simple con JWT")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica usuario y devuelve JWT")
    public ResponseEntity<Response<LoginResponse>> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse loginResponse = authService.login(request);
            return ResponseEntity.ok(
                    Response.<LoginResponse>builder()
                            .success(true)
                            .message("Login exitoso")
                            .data(loginResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Response.<LoginResponse>builder()
                            .success(false)
                            .message("Error: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/validate/{token}")
    @Operation(summary = "Validar token", description = "Verifica si un token JWT es válido")
    public ResponseEntity<Response<Boolean>> validateToken(@PathVariable String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(
                Response.<Boolean>builder()
                        .success(true)
                        .data(isValid)
                        .build()
        );
    }
}