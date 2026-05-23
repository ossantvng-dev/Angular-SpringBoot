package com.users.security;

import com.users.service.JwtService;
import com.users.service.JpaUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtValidationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final JpaUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. SIN TOKEN → dejar pasar (Spring decidirá si es público o no)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7);

            // 2. EXTRAER USERNAME (puede fallar si token es basura)
            String username = jwtService.extractUsername(token);

            // 3. SOLO CONTINUAR SI NO HAY AUTH YA EN CONTEXTO
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                var userDetails = userDetailsService.loadUserByUsername(username);

                // 4. VALIDACIÓN REAL DEL TOKEN
                boolean isValid = jwtService.isTokenValid(token, userDetails.getUsername());

                if (!isValid) {

                    SecurityContextHolder.clearContext();

                    authenticationEntryPoint.commence(
                            request,
                            response,
                            new BadCredentialsException("Invalid or expired JWT token")
                    );
                    return; // CORTA EL FLUJO COMPLETAMENTE
                }

                // 5. ROLES
                List<SimpleGrantedAuthority> authorities =
                        jwtService.extractRoles(token)
                                .stream()
                                .map(SimpleGrantedAuthority::new)
                                .toList();

                // 6. CREAR AUTH CONTEXT
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                authorities
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

            // 7. CONTINUAR CADENA NORMAL
            filterChain.doFilter(request, response);

        } catch (Exception ex) {

            // CUALQUIER ERROR DE TOKEN → 401 DIRECTO
            SecurityContextHolder.clearContext();

            authenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException("Invalid JWT token", ex)
            );
        }
    }
}