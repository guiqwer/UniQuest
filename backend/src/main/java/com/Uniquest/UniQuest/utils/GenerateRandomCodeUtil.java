package com.Uniquest.UniQuest.utils;

public class GenerateRandomCodeUtil {

    public static String generateRandomCode() {
        int code = (int) (Math.random() * 900000) + 100000; // Gera um código de 6 dígitos
        return String.valueOf(code);
    }
}
