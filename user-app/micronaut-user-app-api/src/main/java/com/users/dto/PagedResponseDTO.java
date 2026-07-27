package com.users.dto;

import io.micronaut.data.model.Page;
import io.micronaut.serde.annotation.Serdeable;

import java.util.List;
import java.util.function.Function;

/*
    Pins the paged JSON contract instead of leaking a framework type onto the wire.

    Neither framework's native Page matches what the Angular app reads in
    users.effects.ts (content / totalPages / totalElements / pageNumber / pageSize):

      - Spring's Page emits totalElements and totalPages, but 'number'/'size'
        rather than pageNumber/pageSize.
      - Micronaut's Page emits pageNumber, but 'totalSize' rather than totalElements.

    totalElements and totalPages are the two the UI actually renders, so serializing
    Micronaut's Page directly would have silently broken the pagination display.
    This record emits all five, flat, exactly as the frontend interface declares them.
 */
@Serdeable
public record PagedResponseDTO<T>(
        List<T> content,
        int totalPages,
        long totalElements,
        int pageNumber,
        int pageSize
) {

    public static <E, T> PagedResponseDTO<T> from(Page<E> page, Function<E, T> mapper) {
        return new PagedResponseDTO<>(
                page.getContent().stream().map(mapper).toList(),
                page.getTotalPages(),
                page.getTotalSize(),
                page.getPageNumber(),
                page.getSize()
        );
    }
}
