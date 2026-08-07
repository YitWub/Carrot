package com.carrot.backend.dto;

public record ReportRequest(
    String content,
    String type,
    Long targetId
) {}
