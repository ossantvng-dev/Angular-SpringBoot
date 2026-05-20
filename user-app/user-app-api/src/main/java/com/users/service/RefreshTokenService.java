package com.users.service;

import com.users.exception.InvalidRefreshTokenException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redisTemplate;

    private static final Duration TTL = Duration.ofDays(7);

    private static final String PREFIX = "RT:";
    private static final String USER_PREFIX = "RT_USER:";

    public String create(String username) {

        String oldToken = redisTemplate.opsForValue().get(USER_PREFIX + username);

        if (oldToken != null) {
            redisTemplate.delete(PREFIX + oldToken);
        }

        String token = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(PREFIX + token, username, TTL);

        redisTemplate.opsForValue().set(USER_PREFIX + username, token, TTL);

        return token;
    }

    public String validate(String token) {
        String username = redisTemplate.opsForValue().get(PREFIX + token);

        if (username == null) {
            throw new InvalidRefreshTokenException("Invalid or expired refresh token");
        }

        return username;
    }

    public void revoke(String token) {
        String key = PREFIX + token;

        String username = redisTemplate.opsForValue().get(key);

        if (username != null) {
            redisTemplate.delete(key);
            redisTemplate.delete(USER_PREFIX + username);
        }
    }

    public void revokeByUsername(String username) {
        String token = redisTemplate.opsForValue().get(USER_PREFIX + username);

        if (token != null) {
            redisTemplate.delete(PREFIX + token);
            redisTemplate.delete(USER_PREFIX + username);
        }
    }
}