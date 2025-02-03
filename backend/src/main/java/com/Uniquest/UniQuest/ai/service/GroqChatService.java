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

    public String generateTest(List<String> tags, Integer numQuestions){
        String tagsForTest = String.valueOf(tags);
        String prompt = """
        Gere um JSON rigorosamente estruturado com EXATAMENTE %d questões de avaliação de alto nível técnico seguindo ESTES CRITÉRIOS CRÍTICOS:
        
        1. Contexto Técnico:
        - Combinação obrigatória dos conceitos: %s
        
        - 40%% das questões devem integrar múltiplos tópicos simultaneamente
        
        2. Engenharia de Questões:
        - Enunciados com problemas aplicados ao desenvolvimento de sistemas reais
        - Alternativas plausíveis com nuances técnicas
        - Mantenha coerência entre enunciado complexo e alternativas técnicas
        - Cada questão deve ter entre 3 e 5 opções de resposta
        - Elas devem ser de nível difícil e adequadas para vestibulares/avaliações/concursos públicos
        - Priorize situações-problema que exijam aplicação conjunta dos conceitos.
        
        3. Estrutura Imutável:
        Formato ABSOLUTO:
        [
          {
            "questao": (número sequencial),
            "enunciado": ("enunciado"),
            "opcoes": [
              {
                "ordem": (número sequencial),
                "enunciado": ("enunciado")
              },...
            ]
          },...
        ]
        
        4. Regras Estritas:
        - Nenhum markdown ou texto extra fora do JSON
        - Não invente informações.
        
        5. Otimização para Reuso:
        - Padronização terminológica
        - Variação sistemática de domínios de problema (gestão acadêmica, sistemas embarcados, etc)
        
        Saída EXCLUSIVA: APENAS o JSON válido, pronto para desserialização imediata, sem comentários.
        """.formatted(numQuestions, tagsForTest);
        return this.getChatResponse(prompt);
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
