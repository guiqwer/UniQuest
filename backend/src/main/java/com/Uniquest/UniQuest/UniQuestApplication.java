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
			List<String> tags = new ArrayList<>();


			tags.add("FUTEBOL");
			tags.add("POO");
			tags.add("CAFE");
			tags.add("Java");
			tags.add("JABUTI");
//			List<String> tagsFiltradas = groqChatService.handleTagsForPrompt(tags);
//			String response = String.valueOf(tagsFiltradas);
//			System.out.println("\n--- Resposta do Groq ---");
//			System.out.println(response);
//			response = groqChatService.generateTest(tagsFiltradas, 3);
//			System.out.println("\n\n\n--- Prova do Groq ---");
//			System.out.println(response);
		};
	}
}