package com.Uniquest.UniQuest.ai.service;

import java.util.ArrayList;
import java.util.List;

public class TagProcessor {
    //Métodos para tratamento das tags após serem filtradas pelo LLM.

    public static String getJsonFromList(String text) {
        // Localiza a última ocorrência de '[' e ']'
        int posInicio = text.lastIndexOf('[');
        int posFim = text.lastIndexOf(']');
        if (posInicio >= 0 && posFim > posInicio) {
            // Retorna o trecho que vai de '[' até ']'
            return text.substring(posInicio, posFim + 1);
        }
        throw new RuntimeException();
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
