package com.Uniquest.UniQuest.utils;

import jakarta.servlet.http.HttpServletRequest;

public class UrlUtil {
    public static String getAppUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() +
                (request.getServerPort() == 80 || request.getServerPort() == 443 ? "" : ":" + request.getServerPort()) +
                request.getContextPath();
    }
}