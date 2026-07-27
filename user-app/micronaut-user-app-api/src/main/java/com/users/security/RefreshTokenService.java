package com.users.security;

import com.users.exception.InvalidRefreshTokenException;
import io.lettuce.core.SetArgs;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import jakarta.inject.Singleton;
import lombok.RequiredArgsConstructor;

import java.time.Duration;
import java.util.UUID;

/*
    Opaque refresh tokens held in Redis.

    Port of the Spring RefreshTokenService, using Lettuce directly instead of
    StringRedisTemplate. The key scheme, TTL and single-active-session semantics
    are deliberately identical:

        RT:<token>          -> username
        RT_USER:<username>  -> token

    Issuing a new token for a user revokes the previous one, so a user has at most
    one live refresh token at a time.
 */
@Singleton
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final Duration TTL = Duration.ofDays(7);

    private static final String PREFIX = "RT:";
    private static final String USER_PREFIX = "RT_USER:";

    private final StatefulRedisConnection<String, String> redisConnection;

    public String create(String username) {

        RedisCommands<String, String> commands = redisConnection.sync();

        String oldToken = commands.get(USER_PREFIX + username);

        if (oldToken != null) {
            commands.del(PREFIX + oldToken);
        }

        String token = UUID.randomUUID().toString();

        commands.set(PREFIX + token, username, SetArgs.Builder.ex(TTL));
        commands.set(USER_PREFIX + username, token, SetArgs.Builder.ex(TTL));

        return token;
    }

    public String validate(String token) {

        String username = redisConnection.sync().get(PREFIX + token);

        if (username == null) {
            throw new InvalidRefreshTokenException("Invalid or expired refresh token");
        }

        return username;
    }

    public void revoke(String token) {

        RedisCommands<String, String> commands = redisConnection.sync();

        String key = PREFIX + token;
        String username = commands.get(key);

        if (username != null) {
            commands.del(key);
            commands.del(USER_PREFIX + username);
        }
    }

    public void revokeByUsername(String username) {

        RedisCommands<String, String> commands = redisConnection.sync();

        String token = commands.get(USER_PREFIX + username);

        if (token != null) {
            commands.del(PREFIX + token);
            commands.del(USER_PREFIX + username);
        }
    }
}
