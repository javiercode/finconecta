// UserController.java
package com.assessment.finconecta.web;

import com.assessment.finconecta.dto.*;
import com.assessment.finconecta.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<Response<String>> test() {
        return ResponseEntity.ok(
                Response.<String>builder()
                        .success(true)
                        .message("API funcionando correctamente")
                        .data("Hola mundo!!")
                        .build()
        );
    }

    @PostMapping("")
    public ResponseEntity<Response<UserResponseDto>> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            UserResponseDto createdUser = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Response.<UserResponseDto>builder()
                            .success(true)
                            .message("Usuario creado exitosamente")
                            .data(createdUser)
                            .build()
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Response.<UserResponseDto>builder()
                            .success(false)
                            .message(e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<UserResponseDto>> getUserById(@PathVariable Integer id) {
        try {
            UserResponseDto user = userService.getUserById(id);
            return ResponseEntity.ok(
                    Response.<UserResponseDto>builder()
                            .success(true)
                            .data(user)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Response.<UserResponseDto>builder()
                            .success(false)
                            .message("Usuario no encontrado")
                            .build()
            );
        }
    }

    @GetMapping("/all/{pagina}/{limite}")
    public ResponseEntity<Response<List<UserResponseDto>>> getAllUsers(
            @PathVariable(name="pagina", required = false) Integer pagina,
            @PathVariable(name="limite", required = false) Integer limite
    ) {
        int page = (pagina != null) ? pagina : 0;
        int size = (limite != null) ? limite : 10;
        List<UserResponseDto> users = userService.getAllUsers(pagina, limite);
        return ResponseEntity.ok(
                Response.<List<UserResponseDto>>builder()
                        .success(true)
                        .data(users)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<UserResponseDto>> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserDto userDto) {
        try {
            UserResponseDto updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(
                    Response.<UserResponseDto>builder()
                            .success(true)
                            .message("Usuario actualizado exitosamente")
                            .data(updatedUser)
                            .build()
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Response.<UserResponseDto>builder()
                            .success(false)
                            .message(e.getMessage())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Response.<UserResponseDto>builder()
                            .success(false)
                            .message("Usuario no encontrado")
                            .build()
            );
        }
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Response<Void>> updatePassword(
            @PathVariable Integer id,
            @RequestBody PasswordUpdateDto passwordUpdateDto) {
        try {
            userService.updatePassword(id, passwordUpdateDto.getNewPassword());
            return ResponseEntity.ok(
                    Response.<Void>builder()
                            .success(true)
                            .message("Contraseña actualizada exitosamente")
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Response.<Void>builder()
                            .success(false)
                            .message("Usuario no encontrado")
                            .build()
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(
                    Response.<Void>builder()
                            .success(true)
                            .message("Usuario eliminado exitosamente")
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Response.<Void>builder()
                            .success(false)
                            .message("Usuario no encontrado")
                            .build()
            );
        }
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Response<Void>> permanentDeleteUser(@PathVariable Integer id) {
        try {
            userService.permanentDeleteUser(id);
            return ResponseEntity.ok(
                    Response.<Void>builder()
                            .success(true)
                            .message("Usuario eliminado permanentemente")
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Response.<Void>builder()
                            .success(false)
                            .message("Usuario no encontrado")
                            .build()
            );
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Response<List<UserResponseDto>>> searchUsersByName(
            @RequestParam String nombre) {
        List<UserResponseDto> users = userService.searchUsersByName(nombre);
        return ResponseEntity.ok(
                Response.<List<UserResponseDto>>builder()
                        .success(true)
                        .data(users)
                        .build()
        );
    }

    @GetMapping("/check-username")
    public ResponseEntity<Response<Boolean>> checkUsernameExists(
            @RequestParam String username) {
        boolean exists = userService.usernameExists(username);
        return ResponseEntity.ok(
                Response.<Boolean>builder()
                        .success(true)
                        .data(exists)
                        .build()
        );
    }
}