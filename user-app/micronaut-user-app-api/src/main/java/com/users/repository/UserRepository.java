package com.users.repository;

import com.users.entity.User;
import io.micronaut.data.annotation.Join;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Join(value = "roles", type = Join.Type.LEFT_FETCH)
    Optional<User> findByUsername(String username);

}
