# 🏎️ Best Cars - GTA Online Vehicle Database

Uma aplicação web moderna e interativa para explorar e comparar todos os veículos do GTA Online, com sistema avançado de filtragem e ordenação baseado em estatísticas de performance.

## ✨ Visão Geral

Best Cars é uma plataforma completa que permite aos jogadores de GTA Online descobrir os melhores veículos para cada situação - seja para dominar curvas fechadas, acelerar em retas longas ou ter o carro mais equilibrado do jogo.

## 🎯 Funcionalidades

### Sistema de Ordenação Inteligente

- **Alfabética**: Organização simples por nome do veículo
- **Por Estatística Individual**:
  - Velocidade máxima
  - Aceleração
  - Frenagem
  - Tração
- **Fórmulas Especializadas**:
  - **Melhor em Curvas**: `(Velocidade × 1) + (Aceleração × 1.25) + (Frenagem × 1.3) + (Tração × 1.45)`
  - **Melhor em Retas**: `(Velocidade × 1.6) + (Aceleração × 1.4) + (Frenagem × 1) + (Tração × 1)`
  - **Melhor em Dirigibilidade**: `(Velocidade × 1) + (Aceleração × 1.25) + (Frenagem × 1.25) + (Tração × 1.5)`
  - **Carro Equilibrado**: `(Velocidade + Aceleração + Frenagem + Tração) / 4`

### Filtros por Categoria

Suporte completo para todas as categorias de veículos do GTA Online:

- 🏁 **Performance**: Open-wheel, Super, Sports, Sports Classics
- 🚗 **Utilitários**: Sedans, Coupes, Compacts, SUVs
- 🏍️ **Especiais**: Motorcycles, Cycles
- 🚚 **Trabalho**: Commercial, Industrial, Service, Vans, Utility
- 🚁 **Aviação**: Helicopters, Planes
- ⛴️ **Náuticos**: Boats
- 🚂 **Outros**: Trains, Military, Emergency, Off-Road, Muscle

## 🎨 Design

### Tipografia Personalizada

- **SignPainter House Script**: Fonte customizada para títulos e elementos visuais, criando uma identidade única e moderna
- **Inter**: Fonte clean e legível para tabelas de estatísticas, garantindo fácil leitura de dados numéricos

### Interface Visual

- Background personalizado com textura repetida
- Layout responsivo com grid flexível
- Cards de veículos com imagens e especificações detalhadas
- Sistema de cores otimizado para leitura

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Estilização avançada com custom fonts e layouts flexíveis
- **JavaScript (ES6+)**:
  - Manipulação dinâmica do DOM
  - Fetch API para carregamento de dados
  - Arrow functions e operadores modernos
  - Template literals para renderização
- **JSON**: Base de dados estruturada de veículos

## 📊 Estrutura de Dados

Cada veículo contém:

```javascript
{
  "nome": "Nome do Veículo",
  "categoria": "Categoria",
  "imagem": "URL da imagem",
  "url": "Link para detalhes",
  "stats": {
    "speed": 0.0,
    "acceleration": 0.0,
    "braking": 0.0,
    "traction": 0.0,
    "score": 0.0 // Calculado dinamicamente
  }
}
```

## 🚀 Como Usar

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/best-cars.git
```

2. Navegue até a pasta do projeto:
```bash
cd best-cars
```

3. Abra o arquivo `index.html` em seu navegador ou use um servidor local:
```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server
```

### Navegação

1. **Selecione o tipo de ordenação** no primeiro dropdown
2. **Escolha uma categoria** no segundo dropdown (ou deixe em "TODAS")
3. **Visualize os resultados** organizados automaticamente
4. **Veja a fórmula aplicada** exibida logo abaixo dos filtros

## 📁 Estrutura do Projeto

```
best-cars/
│
├── index.html              # Estrutura principal da aplicação
├── index.css               # Estilos e design
├── index.js                # Lógica e funcionalidades
├── carros_gta_online.json  # Base de dados de veículos
├── bg-repeat.png           # Background pattern
├── SignPainter-HouseScript2.woff2  # Fonte customizada
└── README.md               # Este arquivo
```

## 🧮 Algoritmos de Ordenação

### Ordenação por Estatística Simples

```javascript
veiculosOrdenados.sort((a, b) => {
  if (Number(a.stats.speed) < Number(b.stats.speed)) return 1;
  if (Number(a.stats.speed) > Number(b.stats.speed)) return -1;
  return 0;
});
```

### Cálculo de Score Ponderado

```javascript
const score =
  Number(carro.stats.speed * peso1) +
  Number(carro.stats.acceleration * peso2) +
  Number(carro.stats.braking * peso3) +
  Number(carro.stats.traction * peso4);
```

## 🎓 Aprendizados e Destaques Técnicos

- **Gerenciamento de Estado**: Variável global `CATEGORIAS_HTML` para controle de dados
- **Renderização Dinâmica**: Template strings para criação de HTML
- **Programação Funcional**: Uso extensivo de `map()`, `filter()` e `sort()`
- **Performance**: Renderização otimizada com `insertAdjacentHTML`
- **Internacionalização**: Formatação de números com `Intl.NumberFormat` (pt-BR)
- **Modularização**: Separação clara de responsabilidades entre funções

## 🔄 Fluxo de Dados

```
JSON (carros_gta_online.json)
    ↓
Fetch API (getCategories)
    ↓
Agrupamento por Categoria
    ↓
Aplicação de Filtros
    ↓
Cálculo de Scores (se aplicável)
    ↓
Ordenação
    ↓
Renderização (DOM)
```

## 🌟 Diferenciais do Projeto

1. **Fórmulas Customizadas**: Algoritmos especializados para diferentes estilos de corrida
2. **Interface Intuitiva**: Navegação simples e clara
3. **Performance Visual**: Design atraente com fontes customizadas
4. **Dados Completos**: Informações detalhadas sobre centenas de veículos
5. **Código Limpo**: JavaScript moderno e bem estruturado

## 📝 Melhorias Futuras

- [ ] Sistema de busca por nome de veículo
- [ ] Comparação lado a lado de veículos
- [ ] Gráficos de performance
- [ ] Modo escuro/claro
- [ ] Salvamento de favoritos (localStorage)
- [ ] PWA (Progressive Web App)
- [ ] Filtros combinados avançados
- [ ] API própria com backend

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commitar suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Fazer push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👤 Autor

Desenvolvido como projeto de portfólio para demonstrar habilidades em:
- Frontend Development
- JavaScript Vanilla
- Manipulação de Dados
- Design de Interface
- Algoritmos de Ordenação

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!**

*Nota: Este projeto não é afiliado à Rockstar Games ou Take-Two Interactive. GTA Online é uma marca registrada da Rockstar Games.*
