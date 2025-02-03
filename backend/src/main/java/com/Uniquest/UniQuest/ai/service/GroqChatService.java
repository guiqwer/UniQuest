package com.Uniquest.UniQuest.ai.service;

import com.Uniquest.UniQuest.ai.client.GroqChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class GroqChatService {

    private final GroqChatClient groqChatClient;

    @Autowired
    public GroqChatService(GroqChatClient groqChatClient) {
        this.groqChatClient = groqChatClient;
    }

    public String getChatResponse(String prompt) {
        // Aqui você pode aplicar regras de negócio ou tratamento de exceções, se necessário
        return groqChatClient.generateResponse(prompt);
    }

}
