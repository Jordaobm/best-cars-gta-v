const puppeteer = require('puppeteer');
const fs = require('fs');

// Categorias válidas de veículos do GTA Online
const CATEGORIAS_VALIDAS = [
  'Open-wheel car',
  'Super',
  'Sports',
  'Sports Classics',
  'Sedans',
  'Muscle',
  'Coupes',
  'Coupe',
  'Compacts',
  'SUVs',
  'Motorcycles',
  'Emergency',
  'Off-Road',
  'Commercial',
  'Industrial',
  'Service',
  'Vans',
  'Utility',
  'Cycles',
  'Military',
  'Trains',
  'Boats',
  'Helicopters',
  'Planes'
];

function validarCategoria(categoriaExtraida) {
  if (!categoriaExtraida) {
    return 'NAO_ENCONTRADO';
  }

  // Verifica se a categoria extraída está na lista de categorias válidas
  const categoriaEncontrada = CATEGORIAS_VALIDAS.find(
    cat => cat.toLowerCase() === categoriaExtraida.toLowerCase()
  );

  return categoriaEncontrada || 'NAO_ENCONTRADO';
}

async function extrairEspecificacoesCarro(page, url) {
  try {
    console.log(`  Acessando: ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Aguarda um pouco para garantir que o conteúdo carregou
    await page.waitForTimeout(1000);

    // Extrai as especificações usando os seletores fornecidos
    const especificacoes = await page.evaluate(() => {
      const nome = document.querySelectorAll(".mw-page-title-main")?.[0]?.innerText || null;
      const categoriaPosicao3 = document.querySelectorAll('.pi-data-value.pi-font')?.[3]?.children?.[0]?.innerText || null;
      const categoriaPosicao4 = document.querySelectorAll('.pi-data-value.pi-font')?.[4]?.children?.[0]?.innerText || null;
      const imagem = document.querySelectorAll('.pi-image-thumbnail')?.[1]?.src || null;
      const speed = document.querySelectorAll(".rssc-stats-data1.grid-item")?.[0]?.children?.[0]?.title || null;
      const acceleration = document.querySelectorAll(".rssc-stats-data2.grid-item")?.[0]?.children?.[0]?.title || null;
      const braking = document.querySelectorAll(".rssc-stats-data3.grid-item")?.[0]?.children?.[0]?.title || null;
      const traction = document.querySelectorAll(".rssc-stats-data4.grid-item")?.[0]?.children?.[0]?.title || null;

      return {
        nome,
        categoriaPosicao3,
        categoriaPosicao4,
        imagem,
        stats: {
          speed,
          acceleration,
          braking,
          traction
        }
      };
    });

    // Valida a categoria extraída com fallback
    let categoriaValidada = validarCategoria(especificacoes.categoriaPosicao3);
    let categoriaExtraida = especificacoes.categoriaPosicao3;

    // Se não encontrou na posição 3, tenta na posição 4
    if (categoriaValidada === 'NAO_ENCONTRADO') {
      categoriaValidada = validarCategoria(especificacoes.categoriaPosicao4);
      categoriaExtraida = especificacoes.categoriaPosicao4;
    }

    console.log(`  ✓ Extraído: ${especificacoes.nome || 'Nome não encontrado'} - Categoria: ${categoriaValidada}`);

    return {
      nome: especificacoes.nome,
      categoria: categoriaValidada,
      categoriaOriginal: categoriaExtraida,
      imagem: especificacoes.imagem,
      stats: especificacoes.stats
    };

  } catch (error) {
    console.error(`  ✗ Erro ao extrair ${url}:`, error.message);
    return {
      erro: error.message,
      url: url
    };
  }
}

async function extrairTodosCarros() {
  console.log('=== EXTRAÇÃO DE ESPECIFICAÇÕES DOS CARROS GTA ONLINE ===\n');

  // Lê o arquivo com os links
  let linksData;
  try {
    const conteudo = fs.readFileSync('links_gta_vehicles.json', 'utf-8');
    linksData = JSON.parse(conteudo);
  } catch (error) {
    console.error('Erro ao ler o arquivo links_gta_vehicles.json:', error.message);
    console.error('Execute primeiro o script obter_links.js para gerar o arquivo de links.');
    process.exit(1);
  }

  const links = linksData.links;
  console.log(`Total de links a processar: ${links.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Configura o user agent para evitar bloqueios
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const carros = [];
    let sucesso = 0;
    let erros = 0;
    let categoriasNaoEncontradas = 0;

    // Processa cada link
    for (let i = 0; i < links.length; i++) {
      console.log(`\n[${i + 1}/${links.length}]`);

      const especificacoes = await extrairEspecificacoesCarro(page, links[i]);

      if (especificacoes.nome) {
        carros.push({
          url: links[i],
          ...especificacoes
        });
        sucesso++;

        // Conta quantas categorias não foram encontradas
        if (especificacoes.categoria === 'NAO_ENCONTRADO') {
          categoriasNaoEncontradas++;
        }
      } else {
        carros.push({
          url: links[i],
          ...especificacoes
        });
        erros++;
      }

      // Pequeno delay entre requisições para não sobrecarregar o servidor
      if (i < links.length - 1) {
        await page.waitForTimeout(500);
      }

      // Salva progresso a cada 10 carros
      if ((i + 1) % 10 === 0) {
        salvarProgresso(carros, i + 1);
      }
    }

    // Salva o resultado final
    const resultado = {
      total: carros.length,
      sucesso: sucesso,
      erros: erros,
      categoriasNaoEncontradas: categoriasNaoEncontradas,
      dataExtracao: new Date().toISOString(),
      carros: carros
    };

    fs.writeFileSync(
      'especificacoes_carros.json',
      JSON.stringify(resultado, null, 2),
      'utf-8'
    );

    console.log('\n\n=== RESUMO ===');
    console.log(`Total processado: ${carros.length}`);
    console.log(`Sucesso: ${sucesso}`);
    console.log(`Erros: ${erros}`);
    console.log(`Categorias não encontradas: ${categoriasNaoEncontradas}`);
    console.log('\n✓ Arquivo salvo: especificacoes_carros.json');

  } catch (error) {
    console.error('\n✗ Erro durante a extração:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('\nNavegador fechado.');
  }
}

function salvarProgresso(carros, quantidade) {
  const progresso = {
    processados: quantidade,
    data: new Date().toISOString(),
    carros: carros
  };
}

// Executa a extração
extrairTodosCarros()
  .then(() => {
    console.log('\n✓ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Erro:', error);
    process.exit(1);
  });
