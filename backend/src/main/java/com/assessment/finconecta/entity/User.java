package com.assessment.finconecta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")  // Nombre de tabla: users (no app_user)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String email;  // Este campo NO está en tu DDL, así que...
    // O lo agregas al DDL o lo quitas de la entidad

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;  // En español, como en tu DDL

    // Campos de auditoría - deben coincidir con tu DDL
    @Column(name = "usuario_creacion", length = 50)
    @Builder.Default
    private String usuarioCreacion = "SYSTEM";

    @Column(name = "usuario_modificacion", length = 50)
    private String usuarioModificacion;

    @Column(name = "fecha_creacion")
    @CreationTimestamp
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_modificacion")
    @UpdateTimestamp
    private LocalDateTime fechaModificacion;

    // Método para establecer valores por defecto
    @PrePersist
    protected void onCreate() {
        if (this.usuarioCreacion == null) {
            this.usuarioCreacion = "SYSTEM";
        }
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
        if (this.activo == null) {
            this.activo = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaModificacion = LocalDateTime.now();
    }
}