package com.Uniquest.UniQuest.dto;

import com.Uniquest.UniQuest.exceptions.ServerErrorException;
import lombok.Data;

import java.io.IOException;
import java.util.List;
import java.util.Map;


public record QuestionDTO(Integer order, String statement, Map<String, String> options) {
}
