package com.assessment.finconecta.repository;

import com.assessment.finconecta.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByNombreContainingIgnoreCase(String nombre);

    @Query("SELECT u FROM User u WHERE u.activo = true")
    List<User> findUsersActivos(Pageable pageable);


}
