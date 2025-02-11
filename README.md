# UniQuest

## Descrição
O **UniQuest** é uma plataforma online que funciona como uma rede social acadêmica, permitindo que estudantes compartilhem provas, questões e materiais de estudo. A plataforma facilita a organização promovendo a colaboração e a troca de conhecimento entre os usuários.

---

## Funcionalidades
- **Compartilhamento de Provas e Questões:** Os usuários podem compartilhar provas e questões, classificando-as por disciplina e nível de dificuldade.
- **Avaliação de Conteúdo:** Os usuários podem avaliar o conteúdo publicado por outros, ajudando a identificar materiais de qualidade.
- **Integração com IA:** Utiliza um modelo de linguagem avançado para gerar questões personalizadas.
- **Comentários e Curtidas:** Os usuários podem interagir com os materiais publicados, deixando comentários e curtindo os conteúdos.
- **Redefinição de Senha e Alteração de Email:** Funcionalidades de segurança para gerenciamento de conta.
- **Upload de Materiais:** Suporte para upload de provas em formato de texto, PDF e imagem.

---

## Tecnologias Utilizadas
- **Backend:** Spring Boot
- **Banco de Dados:** PostgreSQL
- **Frontend:** React com Material-UI
- **Containerização:** Docker
- **Autenticação e Segurança:** Spring Security
- **Integração com IA:** GroqChatService (para geração de questões personalizadas)
- **Email Service:** JavaMailSender (para envio de emails de redefinição de senha e confirmação de email)

---

## Como Instalar e Executar o Projeto

### Pré-requisitos
- Java 17 (ou superior)
- Node.js (para o frontend)
- Docker (para containerização)
- PostgreSQL (banco de dados)

### Passos para Configuração

#### Clone o repositório:
```bash
git clone https://github.com/seu-usuario/UniQuest.git
cd UniQuest
```

#### Configuração do Banco de Dados:
Crie um banco de dados PostgreSQL e configure as credenciais no arquivo `application.properties` do Spring Boot:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/uniquest
spring.datasource.username=seu-usuario
spring.datasource.password=sua-senha
```

#### Executando o Backend:
```bash
cd backend
./mvnw spring-boot:run
```

#### Executando o Frontend:
```bash
cd frontend
npm install
npm start
```

#### Executando com Docker:
```bash
docker-compose up --build
```

---

## Como Usar

### Cadastro e Login:
- Crie uma conta ou faça login para acessar as funcionalidades da plataforma.

### Compartilhamento de Provas:
- Na página de upload, selecione o tipo de prova (texto, PDF ou imagem) e insira os detalhes necessários (título, descrição, tags).

### Interação com Conteúdos:
- Explore as provas compartilhadas, deixe comentários e curta os materiais que achar úteis.

### Geração de Questões com IA:
- Utilize a funcionalidade de geração de questões personalizadas com base nas tags das provas.

### Redefinição de Senha:
- Caso precise redefinir sua senha, utilize a opção "Esqueci minha senha" e siga as instruções enviadas por email.

---

## Estrutura do Projeto

### Backend:
- `com.Uniquest.UniQuest.service`: Contém os serviços de negócio (usuários, provas, interações, etc.).
- `com.Uniquest.UniQuest.domain`: Contém as entidades do banco de dados (usuários, provas, comentários, etc.).
- `com.Uniquest.UniQuest.dto`: Contém os objetos de transferência de dados (DTOs).
- `com.Uniquest.UniQuest.repositories`: Contém os repositórios para acesso ao banco de dados.

### Frontend:
- `src/components`: Componentes React reutilizáveis.
- `src/pages`: Páginas da aplicação.
- `src/services`: Chamadas à API do backend.
---

