package com.example.ewate.Repository;

import com.example.ewate.Entity.Role;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRoleName(String roleName);
    Optional<Role> findByRoleNameIgnoreCase(String roleName);
}
