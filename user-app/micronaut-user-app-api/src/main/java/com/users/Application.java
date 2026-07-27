package com.users;

import io.micronaut.context.env.Environment;
import io.micronaut.runtime.Micronaut;

public class Application {

    static void main(String[] args) {
        // Mirrors the Spring app's spring.profiles.active=dev: 'dev' applies unless
        // overridden via MICRONAUT_ENVIRONMENTS / -Dmicronaut.environments.
        Micronaut.build(args)
                .mainClass(Application.class)
                .defaultEnvironments(Environment.DEVELOPMENT)
                .start();
    }
}
