// UserService.java
package com.assessment.finconecta.service;

import com.assessment.finconecta.config.ResourceNotFoundException;
import com.assessment.finconecta.dto.UserDto;
import com.assessment.finconecta.dto.UserResponseDto;
import com.assessment.finconecta.entity.User;
import com.assessment.finconecta.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public UserResponseDto createUser(UserDto userDto) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso");
        }

        User user = new User();
        user.setNombre(userDto.getNombre());
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setActivo(true);

        User savedUser = userRepository.save(user);
        return mapToResponseDto(savedUser);
    }

    public UserResponseDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return mapToResponseDto(user);
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // Actualizar usuario
    public UserResponseDto updateUser(Integer id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        if (!user.getUsername().equals(userDto.getUsername()) &&
                userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("El username ya está en uso");
        }

        user.setNombre(userDto.getNombre());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setFechaModificacion(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return mapToResponseDto(updatedUser);
    }

    public void updatePassword(Integer id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setPassword(newPassword);
        user.setFechaModificacion(LocalDateTime.now());
        userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setActivo(false);
        user.setFechaModificacion(LocalDateTime.now());
        userRepository.save(user);
    }

    public void permanentDeleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<UserResponseDto> searchUsersByName(String nombre) {
        return userRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    private UserResponseDto mapToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .username(user.getUsername())
                .email(user.getEmail())
                .active(user.getActivo())
                .createdAt(user.getFechaCreacion())
                .updatedAt(user.getFechaModificacion())
                .build();
    }
}