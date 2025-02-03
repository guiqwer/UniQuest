package com.Uniquest.UniQuest.ai.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ai.chat.client.ChatClient;

@Component
public class GroqChatClient {

    private final ChatClient chatClient;

    //O Spring pode injetar o builder (já configurado via properties ou manualmente)
    @Autowired
    public GroqChatClient(ChatClient.Builder builder) {
        //O builder já pode ter sido configurado (por exemplo, via application.properties)
        //o Spring AI já aplica as configurações definidas no application.properties
        this.chatClient = builder.build();
    }

    //Método para enviar prompts e obter respostas
    public String generateResponse(String message) {
        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }

}
