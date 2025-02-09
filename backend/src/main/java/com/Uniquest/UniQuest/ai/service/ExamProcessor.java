package com.Uniquest.UniQuest.ai.service;

import com.Uniquest.UniQuest.dto.question.QuestionDTO;
import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

public class ExamProcessor {
    public static String sanitizeJson(String json) {
        // Exemplo: substituir "\*" por "*" para corrigir o escape inválido.
        return json.replace("\\*", "*");
    }
    /**
     * Método que converte o JSON retornado pelo GroqChatService para uma lista de QuestionDTO.
     * O JSON esperado possui o seguinte formato:
     *
     * [
     *   {
     *     "question": <número sequencial>,
     *     "statement": "<enunciado>",
     *     "options": [
     *       {
     *         "a": "<primeira opcao>",
     *         "b": "<segunda opcao>",
     *         "c": "<terceira opcao>",
     *         "d": "<quarta opcao>"
     *       }
     *     ]
     *   },
     *   ...
     * ]
     */
    public static List<QuestionDTO> parseJsonToQuestionDTO(String jsonResponse) {
        jsonResponse = sanitizeJson(jsonResponse);
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(jsonResponse, new TypeReference<List<QuestionDTO>>() {});
        } catch (IOException e) {
            throw new ServerErrorException("Error to convert JSON to QuestionDTO", e);
        }
    }
}
