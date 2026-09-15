# ReviewQR — Desenvolvimento do MVP

Você é o desenvolvedor responsável por implementar o MVP frontend do **ReviewQR**, um sistema simples para gerenciamento de placas físicas com QR Codes dinâmicos.

## 1. Contexto do produto

Eu vendo placas físicas para empresas utilizarem para receber avaliações no Google.

Cada placa física possui um QR Code único.

O QR Code NÃO aponta diretamente para o Google.

Ele aponta para uma URL do nosso sistema:

```text
https://qr.meudominio.com/q/QR001
```

O sistema posteriormente consulta qual destino está configurado para esse QR Code e redireciona o usuário para o link correspondente.

Exemplo:

```text
QR001
    ↓
https://qr.meudominio.com/q/QR001
    ↓
destino configurado
    ↓
Google Reviews da empresa
```

A principal vantagem é que a placa física pode ser padronizada.

Se o cliente trocar o link do Google, não precisamos trocar a placa física. Basta alterar o destino no sistema.

---

# 2. Objetivo deste projeto

Construir o **MVP do painel administrativo**.

O MVP deve permitir:

* visualizar um dashboard
* visualizar todas as placas
* pesquisar placas
* filtrar por status
* gerar placas em lote
* configurar uma placa
* editar uma placa
* visualizar detalhes da placa
* visualizar o QR Code
* copiar a URL do QR Code
* baixar o QR Code
* ativar/desativar uma placa
* visualizar configurações básicas

Neste momento o foco é o **frontend**.

---

# 3. Regra importante

NÃO implemente ainda:

* Supabase
* autenticação real
* pagamentos
* assinaturas
* multi-tenant
* CRM
* WhatsApp
* Instagram
* Google Business Profile API
* integrações externas
* n8n
* planos
* cobrança
* portal do cliente
* API pública

Não invente funcionalidades adicionais.

Primeiro precisamos ter um frontend MVP sólido e bem estruturado.

---

# 4. Stack

Utilize:

* Next.js
* TypeScript
* React
* Tailwind CSS
* Lucide React
* biblioteca de QR Code adequada

Caso o projeto ainda não exista, inicialize um projeto Next.js moderno utilizando TypeScript e Tailwind.

Use App Router.

---

# 5. Arquitetura

Organize o projeto de maneira que posteriormente seja fácil conectar o Supabase.

Sugestão:

```text
src/
├── app/
│   ├── dashboard/
│   ├── plates/
│   ├── plates/[id]/
│   ├── settings/
│   └── ...
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── plates/
│   ├── ui/
│   └── shared/
│
├── data/
│   └── mock/
│
├── lib/
│   └── ...
│
├── types/
│   └── ...
│
└── ...
```

Se a estrutura existente do projeto for diferente, preserve o que já estiver funcionando e adapte de maneira organizada.

Não faça refatorações desnecessárias.

---

# 6. Tipos principais

Criar tipos TypeScript bem definidos.

Exemplo:

```typescript
export type PlateStatus = 'available' | 'active' | 'disabled'

export interface Plate {
  id: string
  code: string
  clientName: string | null
  destinationUrl: string | null
  status: PlateStatus
  scans: number
  createdAt: string
  updatedAt: string
}
```

Também criar tipos para:

```text
User
Scan
DashboardStats
```

Não espalhar objetos anônimos pelo código.

---

# 7. Dados mockados

Criar uma camada de mock separada.

Por enquanto NÃO utilizar banco de dados.

Criar pelo menos 20 placas fictícias.

Deve existir uma mistura de:

```text
available
active
disabled
```

Exemplo:

```text
QR001 — Barbearia João — active
QR002 — Clínica Maria — active
QR003 — null — available
QR004 — Restaurante Central — active
QR005 — null — available
QR006 — Salão da Ana — disabled
```

As informações devem parecer reais, mas não utilizar dados pessoais reais.

Criar também dados mockados para:

* quantidade de scans
* datas
* dashboard
* usuário

A camada de mock deve ser fácil de substituir futuramente por chamadas ao Supabase.

---

# 8. Layout geral

Criar um layout administrativo.

Desktop:

```text
┌────────────────────────────────────────────┐
│ Sidebar        │ Header                    │
│                ├───────────────────────────┤
│ Dashboard      │                           │
│ Placas         │       Conteúdo             │
│ Configurações  │                           │
│                │                           │
│                │                           │
│ Usuário        │                           │
└────────────────┴───────────────────────────┘
```

Sidebar com:

* Logo/nome ReviewQR
* Dashboard
* Placas
* Configurações

Na parte inferior:

* usuário
* email
* sair

No mobile:

* adaptar a navegação
* utilizar menu apropriado
* não deixar a sidebar ocupar espaço excessivo

---

# 9. Dashboard

Rota:

```text
/dashboard
```

Título:

**Dashboard**

Subtítulo:

**Visão geral das suas placas**

Cards:

### Total de placas

Exemplo:

100

### Placas ativas

73

### Disponíveis

27

Abaixo:

### Acessos aos QR Codes

Criar gráfico dos últimos 30 dias.

Pode utilizar uma biblioteca de gráficos adequada, como Recharts, caso necessário.

Utilizar dados mockados.

Abaixo:

### Placas recentemente configuradas

Tabela:

```text
Código
Cliente
Status
Atualizado em
Ação
```

---

# 10. Página de placas

Rota:

```text
/plates
```

Título:

**Placas**

Subtítulo:

**Gerencie suas placas e QR Codes**

Botão:

**+ Gerar placas**

Adicionar:

* campo de pesquisa
* filtro de status
* tabela
* paginação

Tabela:

```text
Código
Cliente
Status
Atualizado em
Ações
```

Status:

```text
Ativa
Disponível
Desativada
```

Utilizar badges visuais.

Ações:

Para placa disponível:

```text
Configurar
```

Para placa ativa:

```text
Ver
```

Para placa desativada:

```text
Ver
```

---

# 11. Pesquisa e filtros

A pesquisa deve funcionar no frontend utilizando os dados mockados.

Pesquisar por:

* código
* nome do cliente

Filtros:

```text
Todos
Disponíveis
Ativas
Desativadas
```

Combinar pesquisa + filtro.

Mostrar empty state quando nenhum resultado for encontrado.

---

# 12. Gerar placas

Botão:

**+ Gerar placas**

Abrir modal.

Título:

**Gerar novas placas**

Campo:

```text
Quantidade
```

Exemplo:

```text
100
```

Mostrar:

```text
Serão criadas 100 novas placas.
```

Botões:

```text
Cancelar
Gerar placas
```

Ao confirmar:

* gerar registros mockados
* criar códigos sequenciais
* adicionar as placas ao estado/local mock
* status inicial `available`

Exemplo:

```text
QR001
QR002
QR003
```

Se já existirem QR001–QR100, a próxima geração deve continuar:

```text
QR101
QR102
...
```

Não duplicar códigos.

---

# 13. Configurar placa

Para placas disponíveis:

```text
/plates/[id]/configure
```

ou uma solução equivalente bem organizada.

Mostrar:

```text
Configurar placa

Código da placa

QR001
```

Mostrar QR Code.

Formulário:

```text
Nome da empresa
[________________________]

Link de avaliação do Google
[________________________]
```

Validar:

* empresa obrigatória
* URL obrigatória
* URL válida

Texto auxiliar:

> Esse é o endereço para onde o usuário será direcionado ao escanear o QR Code.

Botão:

**Salvar configuração**

Após salvar:

* atualizar o mock
* mudar status para `active`
* atualizar `updatedAt`
* mostrar feedback de sucesso
* redirecionar para detalhes da placa ou lista

---

# 14. Detalhes da placa

Rota:

```text
/plates/[id]
```

Mostrar:

```text
Placa QR001
[Ativa]
```

Criar card de QR Code.

QR Code deve representar:

```text
https://qr.meudominio.com/q/QR001
```

Não usar o link do Google no QR.

Mostrar:

```text
URL do QR Code

https://qr.meudominio.com/q/QR001
```

Botão:

**Copiar URL**

Ao clicar:

* copiar para clipboard
* mostrar toast de sucesso

Botão:

**Baixar QR Code**

Gerar/download do QR Code em PNG.

---

# 15. Informações da placa

Mostrar:

```text
Cliente
Barbearia João

Destino
https://g.page/r/xxxxx/review

Status
Ativa

Scans
123

Criada em
14/09/2026

Atualizada em
15/09/2026
```

Botões:

```text
Editar
Desativar placa
```

---

# 16. Regra fundamental do QR Code

O código da placa é permanente.

Exemplo:

```text
QR001
```

Sua URL:

```text
https://qr.meudominio.com/q/QR001
```

NUNCA deve mudar quando o cliente alterar o link de destino.

Se o cliente mudar:

```text
Google antigo
```

para:

```text
Google novo
```

somente:

```text
destinationUrl
```

deve ser alterado.

O QR continua:

```text
QR001
```

e:

```text
https://qr.meudominio.com/q/QR001
```

---

# 17. Editar placa

Permitir editar:

* nome da empresa
* link de destino
* status

Não permitir editar o código da placa.

O código deve aparecer como informação somente leitura.

---

# 18. Desativar placa

Ao clicar:

**Desativar placa**

abrir confirmação.

Título:

**Desativar esta placa?**

Texto:

> Essa placa deixará de redirecionar para o link configurado. Você poderá ativá-la novamente depois.

Botões:

```text
Cancelar
Desativar
```

Depois:

```text
status = disabled
```

Permitir posteriormente reativar.

---

# 19. Configurações

Rota:

```text
/settings
```

Título:

**Configurações**

Seção:

### Informações da conta

```text
Nome
Rhuan

Email
email@exemplo.com
```

Seção:

### Sistema

```text
Nome do sistema
ReviewQR

Domínio dos QR Codes
qr.meudominio.com.br
```

Por enquanto esses dados podem ser mockados.

Não criar autenticação real.

---

# 20. QR Code

Utilizar uma biblioteca confiável para gerar QR Codes reais.

O QR Code precisa ser:

* escaneável
* nítido
* com bom contraste
* adequado para impressão

Permitir visualizar o QR Code em tamanho grande.

Permitir baixar em PNG.

---

# 21. Responsividade

Essa parte é muito importante.

O sistema será utilizado no celular durante a instalação da placa no cliente.

O fluxo mobile deve ser extremamente simples:

```text
Abrir placa
    ↓
Configurar
    ↓
Nome da empresa
    ↓
Link Google
    ↓
Salvar
```

Evitar formulários excessivamente longos.

No mobile:

* cards devem ocupar largura disponível
* tabelas podem virar cards/listas
* botões devem ter área de toque adequada
* modais devem funcionar corretamente
* não criar scroll horizontal desnecessário

---

# 22. UX

Implementar estados:

* loading
* sucesso
* erro
* empty
* confirmação
* formulário inválido

Utilizar Toasts para ações como:

```text
QR Code copiado!
Placa configurada com sucesso.
Placa desativada.
Placas geradas com sucesso.
```

Não utilizar `alert()` nativo do navegador.

---

# 23. Design

Quero uma interface:

* profissional
* minimalista
* moderna
* SaaS B2B
* limpa
* elegante
* fácil de usar

Evitar:

* gradientes exagerados
* excesso de cores
* sombras muito fortes
* animações desnecessárias
* excesso de cards
* textos longos

Priorizar:

* tipografia
* espaçamento
* hierarquia
* consistência
* acessibilidade

Usar uma cor principal consistente para ações primárias.

Utilizar Lucide Icons.

---

# 24. Acessibilidade

Garantir:

* labels nos inputs
* foco visível
* navegação por teclado
* contraste adequado
* botões com nomes claros
* aria-label quando necessário

---

# 25. Código

Escreva código limpo e organizado.

Evite:

* componentes gigantes
* lógica duplicada
* valores hardcoded espalhados
* tipos `any` desnecessários
* dependências desnecessárias

Criar componentes reutilizáveis.

Exemplos:

```text
StatCard
StatusBadge
PlateTable
PlateCard
PlateForm
QRCodePreview
SearchInput
StatusFilter
ConfirmDialog
EmptyState
```

---

# 26. Preparação para Supabase

Embora NÃO vamos conectar o Supabase agora, a arquitetura deve facilitar essa integração.

Não espalhe os dados mockados diretamente pelos componentes.

Preferir algo como:

```text
data/mock/plates.ts
```

e funções/repositórios separados.

Exemplo conceitual:

```typescript
getPlates()
getPlateById(id)
createPlates(quantity)
updatePlate(id, data)
```

Hoje essas funções utilizam mock data.

Futuramente poderão utilizar Supabase sem precisar reescrever toda a interface.

---

# 27. Importante sobre o futuro backend

Posteriormente teremos:

```text
Supabase
```

com uma tabela semelhante a:

```text
plates

id
code
client_name
destination_url
status
created_at
updated_at
```

E:

```text
scans

id
plate_id
created_at
user_agent
```

Não implemente essas tabelas agora.

Somente mantenha a arquitetura preparada.

---

# 28. Antes de começar

Primeiro analise o projeto atual.

Se já existir código:

* preserve o que estiver funcionando
* identifique a estrutura atual
* não recrie o projeto desnecessariamente
* não apague arquivos sem necessidade

Se for um projeto vazio:

* inicialize a estrutura necessária

Depois implemente o MVP em etapas.

---

# 29. Ordem de implementação

Siga esta ordem:

### Etapa 1

Estrutura base:

* layout
* sidebar
* header
* responsividade
* componentes base

### Etapa 2

Dashboard.

### Etapa 3

Lista de placas.

### Etapa 4

Geração de placas.

### Etapa 5

Configuração de placa.

### Etapa 6

Detalhes da placa.

### Etapa 7

Edição/desativação.

### Etapa 8

Configurações.

### Etapa 9

QR Code + download.

### Etapa 10

Polimento geral e responsividade.

---

# 30. Critério de conclusão

Considere o MVP concluído quando eu conseguir:

```text
Abrir o sistema
    ↓
Dashboard
    ↓
Placas
    ↓
Gerar 10 placas
    ↓
Ver as novas placas como "Disponível"
    ↓
Abrir uma placa
    ↓
Configurar cliente + link Google
    ↓
Salvar
    ↓
Placa passa para "Ativa"
    ↓
Visualizar QR Code
    ↓
Copiar URL
    ↓
Baixar QR Code
    ↓
Editar destino
    ↓
Desativar placa
    ↓
Reativar placa
```

Tudo isso deve funcionar utilizando apenas dados mockados.

---

# 31. Regra final

Não tente transformar esse projeto em um produto gigante.

O objetivo é:

> **Um gerenciador simples e bonito de placas QR Code que eu consiga usar no meu dia a dia para cadastrar, configurar e administrar minhas placas.**

Quando o frontend estiver funcionando perfeitamente, o próximo passo será integrar o **Supabase**.

Comece analisando o projeto atual e, depois, implemente o MVP seguindo as etapas acima.
