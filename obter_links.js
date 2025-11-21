const puppeteer = require('puppeteer');
const fs = require('fs');

async function obterLinksGTA() {
  console.log('Iniciando o navegador...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    console.log('Acessando o site da GTA Wiki...');
    await page.goto('https://gta.fandom.com/wiki/Vehicles_in_GTA_Online', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Extraindo os links...');

    // Executa o script que você já criou
    const links = await page.evaluate(() => {
      const linkElements = document.querySelectorAll('.wiki-flexi-gallery a[href^="/wiki/"]');
      const listaLinks = [];

      linkElements.forEach(link => {
        listaLinks.push(link.href);
      });

      return listaLinks;
    });

    console.log(`\nTotal de links encontrados: ${links.length}\n`);

    // Exibe os links no console
    links.forEach((link, index) => {
      console.log(`${index + 1}. ${link}`);
    });

    // Salva os links em um arquivo JSON
    const dados = {
      total: links.length,
      data: new Date().toISOString(),
      links: links
    };

    fs.writeFileSync(
      'links_gta_vehicles.json',
      JSON.stringify(dados, null, 2),
      'utf-8'
    );

    console.log('\n✓ Links salvos em: links_gta_vehicles.json');

  } catch (error) {
    console.error('Erro ao obter links:', error.message);
    throw error;
  } finally {
    await browser.close();
    console.log('\nNavegador fechado.');
  }
}

// Executa a função
obterLinksGTA()
  .then(() => {
    console.log('\n✓ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Erro:', error);
    process.exit(1);
  });
