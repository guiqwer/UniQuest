package com.Uniquest.UniQuest.dto;

import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import lombok.Data;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Data
public class QuestionDTO {
    private Integer question;
    private String statement;
    private Map<String, String> options; // Mapa direto (ex: { "A": "...", "B": "...", ... })


}
