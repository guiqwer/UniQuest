package com.Uniquest.UniQuest.ai.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TagProcessor {
    public static String getJsonFromList(String texto) {
        // Localiza a última ocorrência de '[' e ']'
        int posInicio = texto.lastIndexOf('[');
        int posFim = texto.lastIndexOf(']');
        if (posInicio >= 0 && posFim > posInicio) {
            // Retorna o trecho que vai de '[' até ']', inclusive
            return texto.substring(posInicio, posFim + 1);
        }
        return "";
    }

    public static List<String> convertJsonToList(String jsonList) {
        List<String> result = new ArrayList<>();
        // Remove os colchetes do início e do fim
        String content = jsonList.substring(1, jsonList.length() - 1).trim();
        if (content.isEmpty()) {
            return result;
        }
        // Divide o conteúdo pela vírgula
        String[] items = content.split(",");
        for (String item : items) {
            // Remove as aspas (no início e fim) e espaços extras
            String value = item.trim().replaceAll("^\"|\"$", "");
            result.add(value);
        }
        return result;
    }

    public static List<String> getTagsFromResponse(String response) {
        String jsonList = getJsonFromList(response);
        return convertJsonToList(jsonList);
    }
}
