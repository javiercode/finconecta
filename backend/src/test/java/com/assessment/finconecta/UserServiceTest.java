package com.assessment.finconecta;

import com.assessment.finconecta.config.ResourceNotFoundException;
import com.assessment.finconecta.dto.UserDto;
import com.assessment.finconecta.dto.UserResponseDto;
import com.assessment.finconecta.entity.User;
import com.assessment.finconecta.repository.UserRepository;
import com.assessment.finconecta.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1)
                .nombre("Juan Pérez")
                .username("juanperez")
                .password("password123")
                .email("juan@example.com")
                .activo(true)
                .fechaCreacion(LocalDateTime.now())
                .fechaModificacion(LocalDateTime.now())
                .build();

        userDto = UserDto.builder()
                .nombre("Juan Pérez")
                .username("juanperez")
                .password("password123")
                .email("juan@example.com")
                .build();
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDto result = userService.createUser(userDto);

        assertNotNull(result);
        assertEquals(user.getNombre(), result.getNombre());
        assertEquals(user.getUsername(), result.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_UsernameExists_ThrowsException() {
        when(userRepository.existsByUsername(any())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(userDto);
        });

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        UserResponseDto result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        assertEquals(user.getNombre(), result.getNombre());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(1);
        });
    }

    @Test
    void getAllUsers_Success() {
        List<User> users = Arrays.asList(user);
        when(userRepository.findAll()).thenReturn(users);

        List<UserResponseDto> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(user.getNombre(), result.get(0).getNombre());
    }

    @Test
    void updateUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponseDto result = userService.updateUser(1, userDto);

        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        userService.deleteUser(1);

        assertFalse(user.getActivo());
        verify(userRepository, times(1)).save(user);
    }
}