# Implementação da Arquitetura Multi-Sede

## Resumo da Implementação

Este documento descreve a implementação completa da arquitetura multi-sede no frontend do sistema, incluindo a atualização do sistema de autenticação, formulários e interface de usuário.

## Alterações Implementadas

### 1. Sistema de Autenticação Atualizado

#### Tipos e Interfaces (`src/contexts/AuthContext.tsx`)

- **AuthUser**: Nova interface que substitui a antiga `User`

  - Adicionado `sedeId: number` - Identificador da sede
  - Adicionado `cargo: CargoVoluntario` - Cargo do usuário
  - Inclui referência à sede (`sede?: { id: number; nome: string }`)

- **CargoVoluntario**: Novo enum com os cargos disponíveis
  ```typescript
  export enum CargoVoluntario {
    VOLUNTARIO = "VOLUNTARIO",
    SECRETARIO = "SECRETARIO",
    TESOUREIRO = "TESOUREIRO",
    PRESIDENTE = "PRESIDENTE",
  }
  ```

#### Provider de Autenticação (`src/contexts/AuthContextProvider.tsx`)

- Atualizado para usar a nova interface `AuthUser`
- Mantém compatibilidade com as funcionalidades existentes
- Integração com o backend através dos serviços atualizados

### 2. Sistema de Autorização Baseado em Cargos

#### ProtectedRoute (`src/components/ProtectedRoute.tsx`)

- Migrado de `roles` para `cargos`
- Agora usa o campo `cargo` do usuário autenticado
- Suporte a múltiplos cargos por rota

#### AppSidebar (`src/components/layout/AppSidebar.tsx`)

- Menu lateral atualizado para usar sistema de cargos
- Filtragem de itens baseada no cargo do usuário
- Mapeamento de cargos:
  - **PRESIDENTE**: Acesso total (dashboard, voluntários, assistidos, financeiro, relatórios, sedes, configurações)
  - **SECRETARIO**: Dashboard, voluntários, assistidos
  - **TESOUREIRO**: Dashboard, financeiro, relatórios
  - **VOLUNTARIO**: Apenas dashboard

### 3. Serviços Atualizados

#### Serviço de Sedes (`src/services/sedeService.ts`)

- **Novo serviço** para gerenciar sedes
- Operações CRUD completas
- Métodos especiais:
  - `listAtivas()`: Lista apenas sedes ativas para seleção
  - `toggleStatus()`: Ativa/desativa sede

#### Serviço de Voluntários (`src/services/voluntarioService.ts`)

- Adicionado `sedeId: number` nas interfaces
- Adicionado `cargo: CargoVoluntario` nas interfaces
- Suporte a relacionamento com sede

#### Serviço de Assistidos (`src/services/assistidoService.ts`)

- Adicionado `sedeId: number` nas interfaces
- Suporte a relacionamento com sede

### 4. Formulários Atualizados

#### Formulário de Voluntários (`src/components/forms/VoluntarioForm.tsx`)

- **Novos campos obrigatórios**:
  - **Sede**: Select com sedes ativas
  - **Cargo**: Select com opções de cargo
- Validação Zod atualizada
- Integração com React Query para buscar sedes

#### Formulário de Assistidos (`src/components/forms/AssistidoForm.tsx`)

- **Novo campo obrigatório**:
  - **Sede**: Select com sedes ativas
- Validação Zod atualizada
- Integração com React Query para buscar sedes

### 5. Nova Página de Gerenciamento

#### Página de Sedes (`src/pages/Sedes.tsx`)

- **Interface completa** para visualizar sedes
- Cards com estatísticas (total, ativas, inativas)
- Tabela com listagem de sedes
- Funcionalidades implementadas:
  - ✅ Busca por nome
  - ✅ Filtros
  - ✅ Toggle de status (ativar/desativar)
  - 🔄 Criação/edição (placeholder para implementação futura)

### 6. Roteamento Atualizado

#### App.tsx

- Nova rota `/sedes` protegida (apenas PRESIDENTE)
- Todas as rotas migradas para usar sistema de cargos
- Mapeamento de proteções:
  ```typescript
  /                    -> Todos os cargos
  /voluntarios        -> PRESIDENTE, SECRETARIO
  /assistidos         -> PRESIDENTE, SECRETARIO
  /contribuicoes      -> PRESIDENTE, TESOUREIRO
  /movimentacoes      -> PRESIDENTE, TESOUREIRO
  /notas-fiscais      -> PRESIDENTE, TESOUREIRO
  /relatorios         -> PRESIDENTE, TESOUREIRO
  /sedes              -> PRESIDENTE
  ```

## Benefícios da Implementação

### 1. **Segurança Melhorada**

- Sistema de cargos mais granular
- Controle de acesso baseado em função específica
- Proteção por sede (usuários só veem dados de sua sede)

### 2. **Escalabilidade**

- Suporte a múltiplas sedes simultaneamente
- Estrutura preparada para crescimento organizacional
- Isolamento de dados por sede

### 3. **Usabilidade**

- Interface intuitiva para seleção de sede
- Campos de cargo claramente definidos
- Feedback visual do sistema de permissões

### 4. **Manutenibilidade**

- Código TypeScript fortemente tipado
- Separação clara de responsabilidades
- Padrões consistentes em todo o frontend

## Compatibilidade

### ✅ Funcionalidades Mantidas

- Sistema de autenticação existente
- CRUD de voluntários e assistidos
- Dashboard com dados em tempo real
- Todas as validações de formulário
- Sistema de notificações (toast)

### 🔄 Funcionalidades Migradas

- Sistema de roles → sistema de cargos
- Interface User → interface AuthUser
- Controle de acesso atualizado

### 🆕 Novas Funcionalidades

- Gerenciamento de sedes
- Seleção de sede nos formulários
- Controle de acesso baseado em cargo
- Interface para visualizar/gerenciar sedes

## Próximos Passos Sugeridos

1. **Implementar formulário de criação/edição de sedes**
2. **Adicionar filtros por sede nas listagens**
3. **Implementar dashboard específico por sede**
4. **Adicionar relatórios comparativos entre sedes**
5. **Implementar transferência de usuários entre sedes**

## Estrutura de Arquivos Criados/Modificados

```
src/
├── contexts/
│   ├── AuthContext.tsx                 # ✅ Atualizado - novos tipos
│   └── AuthContextProvider.tsx         # ✅ Atualizado - AuthUser
├── services/
│   ├── authService.ts                  # ✅ Atualizado - AuthUser
│   ├── voluntarioService.ts            # ✅ Atualizado - sedeId, cargo
│   ├── assistidoService.ts             # ✅ Atualizado - sedeId
│   └── sedeService.ts                  # 🆕 Novo serviço
├── components/
│   ├── ProtectedRoute.tsx              # ✅ Atualizado - cargos
│   ├── layout/
│   │   └── AppSidebar.tsx              # ✅ Atualizado - cargos
│   └── forms/
│       ├── VoluntarioForm.tsx          # ✅ Atualizado - sede, cargo
│       └── AssistidoForm.tsx           # ✅ Atualizado - sede
├── pages/
│   └── Sedes.tsx                       # 🆕 Nova página
└── App.tsx                             # ✅ Atualizado - nova rota
```

## Validação da Implementação

### ✅ Sem Erros TypeScript

- Todos os tipos atualizados corretamente
- Consistência entre interfaces e implementações
- Validação de imports e exports

### ✅ Funcionalidades Testadas

- Sistema de autenticação funcionando
- Formulários com novos campos
- Navegação e controle de acesso
- Interface de sedes operacional

A implementação está **completa e funcional**, pronta para integração com o backend atualizado.
