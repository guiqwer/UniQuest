package com.Uniquest.UniQuest;

import com.Uniquest.UniQuest.ai.service.GroqChatService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UniQuestApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniQuestApplication.class, args);
	}

	// Adicione este Bean para executar o teste
	@Bean
	public CommandLineRunner demo(GroqChatService groqChatService) {
		return args -> {
			// Teste simples
			String prompt = "Me conte uma piada bem engraçada. Sobre programação ou ciência da computação.";
			String response = groqChatService.getChatResponse(prompt);
			System.out.println("\n--- Resposta do Groq ---");
			System.out.println(response);
		};
	}
}