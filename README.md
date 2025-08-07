# 🕐 Sistema de Relógio e Temporizador

Um sistema web moderno para controle de tempo com relógio em tempo real, temporizador sincronizado e controle remoto via popup. Ideal para apresentações, eventos e qualquer situação que necessite de controle preciso de tempo.

## 🌟 Funcionalidades Principais

### ⏰ **Relógio em Tempo Real**

- Exibição de horas, minutos e segundos em tempo real
- Data atual formatada automaticamente
- Design moderno com números grandes e legíveis
- Layout responsivo para qualquer dispositivo

### ⏱️ **Temporizador Avançado**

- Controle via popup independente e sincronizado
- Entrada intuitiva com máscara automática (MM:SS)
- Controles completos: Iniciar, Pausar, Continuar, Zerar
- Efeitos visuais quando o tempo está acabando
- **Flash vermelho** nos números quando o tempo expira

### 🎛️ **Controle Remoto Inteligente**

- **Janela popup independente** para controle total
- **Sincronização em tempo real** entre tela principal e controle
- **Presets rápidos** disponíveis em dois locais:
  - **Menu principal** (acesso direto)
  - **Controle remoto** (interface completa)
- **Preenchimento automático** quando usar presets do menu

### 🚀 **Presets Pré-Configurados**

- **Avisos:** 3 minutos
- **Louvor:** 5 minutos
- **Ministração:** 4 minutos
- **Acesso rápido** direto do menu hambúrguer
- **Configuração automática** - clique e use

### 🎨 **Interface Moderna**

- **Design minimalista** com tema escuro elegante
- **Menu hambúrguer** discreto e funcional
- **Responsivo** - funciona em desktop, tablet e mobile
- **Animações suaves** e feedback visual
- **Tipografia otimizada** para máxima legibilidade
- **Cores vibrantes para o relógio**
  - **Combinações testadas para melhor contraste e legibilidade**
  - **Sistema de seleção visual com pré-visualização instantânea**
  - **Opções que se adaptam ao tema escuro (cores que não cansam a vista)**

## 🚀 Instalação Rápida

### **Método 1: Uso Direto (Recomendado)**

1. **Baixe** todos os arquivos do projeto
2. **Abra** `index.php` em qualquer navegador moderno
3. **Permita** notificações quando solicitado
4. **Permita** pop-ups para o controle remoto
5. **Pronto!** Sistema funcionando

### **Método 2: Servidor Local**

\`\`\`bash

# Clone o repositório

git clone https://github.com/eliasdossantos/relogio-temporizador-eventos.git
cd sistema-temporizador

# Inicie um servidor local (PHP)

php -S localhost:8000

# Acesse http://localhost:8000

## 📱 Como Usar

### **🕐 Visualizar Relógio**

1. Clique no **menu hambúrguer** (≡) no canto superior direito
2. Selecione **"Relógio"**
3. Visualize o tempo atual em tempo real

### **⏱️ Usar Temporizador - Método Rápido**

1. Clique no **menu hambúrguer** (≡)
2. Clique diretamente em **"Avisos"**, **"Louvor"** ou **"Ministração"**
3. A tela muda automaticamente para o temporizador
4. O **controle remoto abre** com o tempo já definido
5. Clique **"Iniciar"** no controle remoto

### **⏱️ Usar Temporizador - Método Manual**

1. Clique no **menu hambúrguer** (≡)
2. Selecione **"Controle Remoto"**
3. A tela muda para temporizador e abre o controle
4. **Digite o tempo** desejado (ex: 05:30)
5. Clique **"Iniciar"**

### **🎛️ Controles Disponíveis**

- **Iniciar:** Começa a contagem regressiva
- **Pausar:** Para temporariamente (mantém tempo)
- **Continuar:** Retoma contagem pausada
- **Zerar:** Reseta para 00:00

### **⚡ Presets Rápidos**

- **No menu principal:** Clique direto no preset desejado
- **No controle remoto:** Use os botões de preset
- **Ambos fazem:** Definir tempo + preparar para iniciar

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **HTML5** - Estrutura semântica moderna
- **CSS3** - Estilos avançados com Flexbox/Grid
- **JavaScript ES6+** - Lógica reativa e comunicação entre janelas
- **Google Fonts**

### **Backend (Opcional)**

- **PHP 7.4+** - Ou superior - Versão estável com suporte completo

### **Recursos**

- **PostMessage** - Comunicação entre janelas
- **LocalStorage** - Armazenamento local de preferências
- **Responsive Design** - Adaptação automática a dispositivos

## 📁 Estrutura do Projeto

\`\`\`
sistema-temporizador/
├── 📄 index.html # Página principal
├── 📄 remote.html # Controle remoto (popup)
├── 🎨 css/styles.css # Estilos da página principal
├── 🎨 css/remote-styles.css # Estilos do controle remoto
├── ⚙️ js/script.js # Lógica principal (TimerSystem)
├── ⚙️ js/remote-script.js # Lógica do controle remoto
├── 📚 README.md # Este arquivo - Documentação técnica completa

## 🔧 Requisitos do Sistema

### **Navegador (Obrigatório)**

- **Chrome 80+** ✅ Recomendado
- **Firefox 75+** ✅ Suportado
- **Safari 13+** ✅ Suportado
- **Edge 80+** ✅ Suportado

### **Permissões Necessárias**

- **Pop-ups:** Para abrir controle remoto
- **Notificações:** Para alertas quando tempo acabar

## 🐛 Solução de Problemas

### **❌ Pop-up Não Abre**

**Problema:** Controle remoto não aparece  
**Solução:**

1. Permita pop-ups para o site
2. Verifique se não há bloqueadores ativos
3. Tente em modo anônimo/privado

### **🔕 Notificações Não Funcionam**

**Problema:** Sem alerta quando tempo acaba  
**Solução:**

1. Permita notificações quando solicitado
2. Verifique configurações do navegador
3. Teste em outro navegador

### **⏸️ Botões Não Respondem**

**Problema:** Controles não funcionam  
**Solução:**

1. Verifique se o popup está conectado
2. Olhe o indicador de conexão (ponto verde)
3. Reabra o controle remoto

### **FAQ Rápido**

**P: Funciona offline?**  
R: Sim, após carregar uma vez, funciona sem internet.

**P: Posso usar em projetor?**  
R: Sim, é otimizado para projeção em tela grande.

**P: Tem app mobile?**  
R: Não, mas funciona perfeitamente no navegador mobile.

**P: Posso personalizar os presets?**  
R: Sim, editando os arquivos .js

## 🤝 Contribuição

### **Como Contribuir**

1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### **Diretrizes**

- **Código limpo:** Siga os padrões existentes
- **Documentação:** Comente funções complexas
- **Testes:** Teste em múltiplos navegadores
- **Responsividade:** Mantenha compatibilidade mobile

### **Reportar Bugs**

1. **Verifique** se o bug já foi reportado
2. **Crie** uma issue detalhada
3. **Inclua** passos para reproduzir
4. **Adicione** screenshots se relevante

---

**Desenvolvido com ❤️ para controle eficiente de tempo**

**Versão:** 2.0 | **Última Atualização:** Julho 2025 | **Status:** Ativo

---

_Se este projeto foi útil para você, considere dar uma ⭐ no repositório!_
