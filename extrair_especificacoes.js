const puppeteer = require('puppeteer');
const fs = require('fs');

// Categorias válidas de veículos do GTA Online
const CATEGORIAS_VALIDAS = [
  'Open-wheel car', 'Super', 'Sports', 'Sports Classics',
  'Sedans', 'Muscle', 'Coupes', 'Coupe', 'Compacts', 'SUVs',
  'Motorcycles', 'Emergency', 'Off-Road', 'Commercial',
  'Industrial', 'Service', 'Vans', 'Utility', 'Cycles',
  'Military', 'Trains', 'Boats', 'Helicopters', 'Planes'
];

// Configurações para evitar banimento
const CONFIG = {
  delayMin: 2000,        // Delay mínimo entre requisições (2s)
  delayMax: 5000,        // Delay máximo entre requisições (5s)
  timeout: 45000,        // Timeout por página (45s)
  maxRetries: 3,         // Tentativas máximas por veículo
  saveInterval: 20,      // Salvar progresso a cada X veículos
  userAgents: [          // Rodar user agents para parecer mais natural
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ]
};

function validarCategoria(categoriaExtraida) {
  if (!categoriaExtraida) return null;

  const categoriaEncontrada = CATEGORIAS_VALIDAS.find(
    cat => cat.toLowerCase() === categoriaExtraida.toLowerCase()
  );

  return categoriaEncontrada || null;
}

// Delay randomizado para parecer comportamento humano
function delayAleatorio(min = CONFIG.delayMin, max = CONFIG.delayMax) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// User agent aleatório
function getUserAgentAleatorio() {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

async function extrairEspecificacoesCarro(page, url, tentativa = 1) {
  try {
    console.log(`  [Tentativa ${tentativa}] Acessando: ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout
    });

    await delayAleatorio(500, 1000);

    const especificacoes = await page.evaluate(() => {
      const nome = document.querySelector('.mw-page-title-main')?.innerText || null;
      const categoriaPosicao3 = document.querySelectorAll('.pi-data-value.pi-font')?.[3]?.children?.[0]?.innerText || null;
      const categoriaPosicao4 = document.querySelectorAll('.pi-data-value.pi-font')?.[4]?.children?.[0]?.innerText || null;
      const imagem = document.querySelectorAll('.pi-image-thumbnail')?.[1]?.src || null;
      const speed = document.querySelector('.rssc-stats-data1.grid-item')?.children?.[0]?.title || null;
      const acceleration = document.querySelector('.rssc-stats-data2.grid-item')?.children?.[0]?.title || null;
      const braking = document.querySelector('.rssc-stats-data3.grid-item')?.children?.[0]?.title || null;
      const traction = document.querySelector('.rssc-stats-data4.grid-item')?.children?.[0]?.title || null;

      return {
        nome,
        categoriaPosicao3,
        categoriaPosicao4,
        imagem,
        stats: { speed, acceleration, braking, traction }
      };
    });

    // Valida a categoria com fallback
    let categoria = validarCategoria(especificacoes.categoriaPosicao3);
    if (!categoria) {
      categoria = validarCategoria(especificacoes.categoriaPosicao4);
    }

    console.log(`  ✓ Sucesso: ${especificacoes.nome || 'Desconhecido'} - Categoria: ${categoria || 'Não encontrada'}`);

    return {
      nome: especificacoes.nome,
      categoria: categoria,
      imagem: especificacoes.imagem,
      url: url,
      stats: especificacoes.stats
    };

  } catch (error) {
    console.error(`  ✗ Erro na tentativa ${tentativa}: ${error.message}`);

    // Retry automático se não excedeu o limite
    if (tentativa < CONFIG.maxRetries) {
      console.log(`  ⟳ Aguardando antes de tentar novamente...`);
      await delayAleatorio(3000, 6000);
      return await extrairEspecificacoesCarro(page, url, tentativa + 1);
    }

    // Se esgotou as tentativas, retorna objeto de erro mas não interrompe
    console.error(`  ✗ Falha após ${CONFIG.maxRetries} tentativas: ${url}`);
    return {
      nome: null,
      categoria: null,
      imagem: null,
      url: url,
      stats: { speed: null, acceleration: null, braking: null, traction: null },
      erro: error.message,
      tentativas: CONFIG.maxRetries
    };
  }
}

function salvarCarros(carros, nomeArquivo = 'carros_gta_online.json') {
  const estatisticas = {
    sucesso: carros.filter(c => c.nome && !c.erro).length,
    erros: carros.filter(c => c.erro).length,
    semCategoria: carros.filter(c => c.nome && !c.categoria && !c.erro).length
  };

  const resultado = {
    total: carros.length,
    estatisticas: estatisticas,
    dataExtracao: new Date().toISOString(),
    carros: carros
  };

  fs.writeFileSync(nomeArquivo, JSON.stringify(resultado, null, 2), 'utf-8');
  console.log(`\n💾 Progresso salvo: ${nomeArquivo}`);
  console.log(`   Sucesso: ${estatisticas.sucesso} | Erros: ${estatisticas.erros} | Sem categoria: ${estatisticas.semCategoria}`);
}

async function extrairTodosCarros() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  EXTRAÇÃO SEGURA DE ESPECIFICAÇÕES - GTA ONLINE VEHICLES ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // Lê o arquivo com os links
  let linksData;
  try {
    const conteudo = fs.readFileSync('links_gta_vehicles.json', 'utf-8');
    linksData = JSON.parse(conteudo);
  } catch (error) {
    console.error('❌ Erro ao ler links_gta_vehicles.json:', error.message);
    console.error('Execute primeiro: npm run obter-links\n');
    process.exit(1);
  }

  const links = linksData.links;
  console.log(`📊 Total de veículos para processar: ${links.length}`);
  console.log(`⚙️  Configurações de segurança:`);
  console.log(`   • Delay entre requisições: ${CONFIG.delayMin}ms - ${CONFIG.delayMax}ms`);
  console.log(`   • Máximo de tentativas por veículo: ${CONFIG.maxRetries}`);
  console.log(`   • Salvamento automático a cada: ${CONFIG.saveInterval} veículos`);
  console.log(`   • User agents rotativos: ${CONFIG.userAgents.length} diferentes\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  let carros = [];

  try {
    const page = await browser.newPage();

    // Remove sinais de automação
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const horaInicio = Date.now();

    // Processa cada link com tratamento de erro individual
    for (let i = 0; i < links.length; i++) {
      console.log(`\n[${ i + 1 }/${links.length}] ━━━━━━━━━━━━━━━━━━━━━━━`);

      // Alterna user agent a cada 50 requisições
      if (i % 50 === 0) {
        await page.setUserAgent(getUserAgentAleatorio());
        console.log(`  🔄 User agent alternado`);
      }

      try {
        const especificacoes = await extrairEspecificacoesCarro(page, links[i]);
        carros.push(especificacoes);
      } catch (error) {
        // Garante que mesmo erros críticos não parem a execução
        console.error(`  💥 Erro crítico inesperado: ${error.message}`);
        carros.push({
          nome: null,
          categoria: null,
          imagem: null,
          url: links[i],
          stats: { speed: null, acceleration: null, braking: null, traction: null },
          erro: `Erro crítico: ${error.message}`
        });
      }

      // Salvamento automático incremental
      if ((i + 1) % CONFIG.saveInterval === 0 || i === links.length - 1) {
        salvarCarros(carros, 'carros_gta_online.json');
      }

      // Delay entre requisições (não aplica no último)
      if (i < links.length - 1) {
        const delay = Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin + 1)) + CONFIG.delayMin;
        console.log(`  ⏳ Aguardando ${(delay / 1000).toFixed(1)}s...`);
        await delayAleatorio(CONFIG.delayMin, CONFIG.delayMax);
      }
    }

    const tempoTotal = ((Date.now() - horaInicio) / 1000 / 60).toFixed(2);

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMO FINAL                           ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`📊 Total processado: ${carros.length}`);
    console.log(`✅ Sucesso: ${carros.filter(c => c.nome && !c.erro).length}`);
    console.log(`❌ Erros: ${carros.filter(c => c.erro).length}`);
    console.log(`⚠️  Sem categoria: ${carros.filter(c => c.nome && !c.categoria && !c.erro).length}`);
    console.log(`⏱️  Tempo total: ${tempoTotal} minutos`);
    console.log(`\n✅ Arquivo final salvo: carros_gta_online.json\n`);

  } catch (error) {
    console.error('\n💥 Erro fatal durante a extração:', error);
    // Mesmo com erro fatal, salva o que foi coletado até agora
    if (carros.length > 0) {
      salvarCarros(carros, 'carros_gta_online_recuperacao.json');
      console.log('💾 Dados parciais salvos em: carros_gta_online_recuperacao.json');
    }
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Navegador fechado com segurança.\n');
  }
}

// Executa a extração
extrairTodosCarros()
  .then(() => {
    console.log('✅ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro final:', error.message);
    process.exit(1);
  });
