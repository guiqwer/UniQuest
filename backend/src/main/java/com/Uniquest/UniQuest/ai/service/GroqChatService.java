package com.Uniquest.UniQuest.ai.service;

import com.Uniquest.UniQuest.ai.client.GroqChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static com.Uniquest.UniQuest.ai.service.TagProcessor.*;

@Service
public class GroqChatService {

    private final GroqChatClient groqChatClient;

    @Autowired
    public GroqChatService(GroqChatClient groqChatClient) {
        this.groqChatClient = groqChatClient;
    }

    public String getChatResponse(String prompt) {
        //Aqui você pode aplicar regras de negócio ou tratamento de exceções, se necessário
        return groqChatClient.generateResponse(prompt);
    }


    public List<String> handleTagsForPrompt(ArrayList<String> tags) {
        String prompt = """
                Você é um especialista em análise de dados acadêmicos
                e seleção de conteúdo relevante para elaboração de provas.
                Sua tarefa é filtrar, de uma lista de tags fornecida,
                apenas os elementos diretamente relacionados ao meio acadêmico
                ou à criação de avaliações formais.
                Critérios de Inclusão:
                
                Disciplinas acadêmicas (ex: Matemática, Física, Biologia).
                Provas/Exames reconhecidos (ex: ENEM, ENCCEJA, vestibulares).
                Instituições de ensino ou bancas organizadoras (ex: UFC, Fuvest, Cesgranrio).
                Tópicos específicos de estudo (ex: Equação do Segundo Grau, Cálculo Integral).
                Habilidades acadêmicas (ex: Interpretação de Texto, Raciocínio Lógico).
                
                Critérios de Exclusão:
                
                Itens de entretenimento, hobbies, objetos cotidianos ou termos genéricos sem contexto educacional 
                (ex: Futebol, Prato, Pia).
                Palavras ambíguas que não estejam claramente vinculadas a um contexto acadêmico.
                
                Formato de Saída:
                Retorne APENAS a lista filtrada, em formato JSON, contendo os 
                elementos válidos.
                Caso nenhum item seja relevante, retorne: [].
                
                Exemplo:
                Input: ["UFC", "MATEMÁTICA", "ENEM", "EQUAÇÃO SEGUNDO GRAU", "FUTEBOL", "PRATO", "PIA"]
                Output: {["UFC", "MATEMÁTICA", "ENEM", "EQUAÇÃO SEGUNDO GRAU"]}
                
                Instrução Final:
                Priorize precisão em vez de quantidade. Sua seleção será usada para gerar questões de prova,
                portanto, cada tag deve ter utilidade prática nesse contexto. Analise a lista fornecida agora e
                aplique os critérios rigorosamente:"
                """ + tags;

        String response = this.getChatResponse(prompt);

        return getTagsFromResponse(response);
    }






}
