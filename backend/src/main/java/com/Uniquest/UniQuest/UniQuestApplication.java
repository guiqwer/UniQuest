package com.Uniquest.UniQuest;

import com.Uniquest.UniQuest.ai.service.GroqChatService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

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
			ArrayList<String> tags = new ArrayList<>();


			tags.add("Maçã");
			tags.add("POO");
			tags.add("IFCE");
			tags.add("Ciência da Computação");
			tags.add("Java");
            String response = String.valueOf(groqChatService.handleTagsForPrompt(tags));
			System.out.println("\n--- Resposta do Groq ---");
			System.out.println(response);
		};
	}
}