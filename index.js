let CATEGORIAS_HTML = [];

function getCategories() {
  const tunagem = document.getElementById("tunagem").value;

  return fetch("./carros_gta_online.json")
    .then((response) => response.json())
    .then(({ carros }) => {
      const categorias = [];

      carros?.forEach((carro) => {
        let carroFiltrado = carro;

        if (tunagem === "MAXIMA") {
          carroFiltrado = {
            ...carro,
            stats: {
              speed: Number(carro?.stats?.speed) * 1.02,
              acceleration: Number(carro?.stats?.acceleration) * 1.6,
              braking: Number(carro?.stats?.braking) * 1.4,
              traction: Number(carro?.stats?.traction) * 1.1,
            },
          };
        }

        const categoriaIndex = categorias.findIndex(
          (categoria) => categoria.nome === carroFiltrado.categoria
        );

        if (categoriaIndex === -1) {
          categorias.push({
            nome: carroFiltrado.categoria,
            carros: [carroFiltrado],
          });
        } else {
          categorias[categoriaIndex].carros.push(carroFiltrado);
        }
      });

      return categorias;
    });
}

function init() {
  getCategories().then((categorias) => {
    CATEGORIAS_HTML = categorias;
    render();
  });
}

function render() {
  const carsContainer = document.getElementById("cars");

  if (!carsContainer) {
    return;
  }

  carsContainer.innerHTML = "";

  CATEGORIAS_HTML?.forEach((categoria) => {
    carsContainer.insertAdjacentHTML("beforeend", gridVehicle(categoria));
  });
}

function gridVehicle(categoria) {
  return `<section class="grid-container" id="categoria-${categoria.nome}">
  
  <h2 class="nome-categoria">${categoria.nome}</h2>


  <div class="grid-items">

  ${categoria.carros?.map((carro, index) => vehicleCard(carro, index)).join("")}


  </div>
   

  
  
  </section>`;
}
function vehicleCard(carro, index) {
  return `<div class="card">

  

  ${
    carro?.imagem
      ? `<img src="${carro.imagem}" alt="${carro.nome}" />`
      : `<div class="no-image">Imagem não disponível</div>`
  }
  
  <div class="card-header">
   <h2 class="title">${carro.nome}</h2>
    <span class="position">Posição: ${index + 1}</span>

  </div/>

   
    <table class="specs-table">
    
    <tr>
    <th>Especificação</th>
    <th>Valor</th>
    </tr>

    <tr>
    <td>Velocidade</td>
    <td>${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(carro.stats.speed)}</td>
    </tr>
    <tr>
    <td>Aceleração</td>
    <td>${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(carro.stats.acceleration)}</td>
    </tr>

    <tr>
    <td>Frenagem</td>
    <td>${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(carro.stats.braking)}</td>
    </tr>

     <tr>
    <td>Tração</td>
    <td>${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 10,
    }).format(carro.stats.traction)}</td>
    </tr>


     <tr>
    <td>Pontuação</td>
    <td>${
      carro.stats.score
        ? new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 10,
          }).format(carro.stats.score)
        : "N/A"
    }</td>
    </tr>



    
    </table>
    <a href="${carro.url}" target="_blank" class="link">Mais detalhes</a>
  </div>`;
}

function filtrar() {
  getCategories().then((categorias) => {
    CATEGORIAS_HTML = categorias;

    const tipoOrdenacao = document.getElementById("tipoOrdenacao").value;
    const categoriaSelecionada = document.getElementById(
      "categoriaSelecionada"
    ).value;

    if (categoriaSelecionada !== "TODAS") {
      CATEGORIAS_HTML = CATEGORIAS_HTML.filter(
        (categoria) => categoria.nome === categoriaSelecionada
      );
    }

    if (tipoOrdenacao === "ALFABETICA") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'>Ordenado em ordem alfabética pelo nome do veículo.</span>";

      const newOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (a.nome < b.nome) return -1;
          if (a.nome > b.nome) return 1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "VELOCIDADE") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> Ordenado do veículo com maior VELOCIDADE para o veículo com menor VELOCIDADE.</span>";

      const newOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.speed) < Number(b.stats.speed)) return 1;
          if (Number(a.stats.speed) > Number(b.stats.speed)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "ACELERACAO") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> Ordenado do veículo com maior ACELERAÇÃO para o veículo com menor ACELERAÇÃO</span>";

      const newOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.acceleration) < Number(b.stats.acceleration))
            return 1;
          if (Number(a.stats.acceleration) > Number(b.stats.acceleration))
            return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "FRENAGEM") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> Ordenado do veículo com maior FRENAGEM para o veículo com menor FRENAGEM</span>";

      const newOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.braking) < Number(b.stats.braking)) return 1;
          if (Number(a.stats.braking) > Number(b.stats.braking)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "TRACAO") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> Ordenado do veículo com maior TRACAO para o veículo com menor TRACAO</span>";

      const newOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.traction) < Number(b.stats.traction)) return 1;
          if (Number(a.stats.traction) > Number(b.stats.traction)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "MELHOR_CARRO_CURVAS") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> (Velocidade * 1) + (Aceleração * 1.25) + (Frenagem * 1.3) + (Tração * 1.45) para definir o melhor carro em curvas</span>";

      const scoreOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].map((carro) => ({
          ...carro,
          stats: {
            ...carro.stats,
            score:
              Number(carro.stats.speed * 1) +
              Number(carro.stats.acceleration * 1.25) +
              Number(carro.stats.braking * 1.3) +
              Number(carro.stats.traction * 1.45),
          },
        }));

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      const newOrder = scoreOrder?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.score) < Number(b.stats.score)) return 1;
          if (Number(a.stats.score) > Number(b.stats.score)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "MELHOR_CARRO_RETAS") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> (Velocidade * 1.6) + (Aceleração * 1.4) + (Frenagem * 1) + (Tração * 1) para definir o melhor carro em retas</span>";

      const scoreOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].map((carro) => ({
          ...carro,
          stats: {
            ...carro.stats,
            score:
              Number(carro.stats.speed * 1.6) +
              Number(carro.stats.acceleration * 1.4) +
              Number(carro.stats.braking * 1) +
              Number(carro.stats.traction * 1),
          },
        }));

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      const newOrder = scoreOrder?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.score) < Number(b.stats.score)) return 1;
          if (Number(a.stats.score) > Number(b.stats.score)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "MELHOR_CARRO_DIRIGIBILIDADE") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> (Velocidade * 1) + (Aceleração * 1.25) + (Frenagem * 1.25) + (Tração * 1.5) para definir o melhor carro em dirigibilidade</span>";

      const scoreOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].map((carro) => ({
          ...carro,
          stats: {
            ...carro.stats,
            score:
              Number(carro.stats.speed * 1) +
              Number(carro.stats.acceleration * 1.25) +
              Number(carro.stats.braking * 1.25) +
              Number(carro.stats.traction * 1.5),
          },
        }));

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      const newOrder = scoreOrder?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.score) < Number(b.stats.score)) return 1;
          if (Number(a.stats.score) > Number(b.stats.score)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    if (tipoOrdenacao === "MELHOR_CARRO_EQUILIBRADO") {
      document.getElementById("formula").innerHTML =
        "Formula aplicada: <span class='link'> (Velocidade + Aceleração + Frenagem + Tração) / 4 para definir o melhor carro equilibrado</span>";

      const scoreOrder = CATEGORIAS_HTML?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].map((carro) => ({
          ...carro,
          stats: {
            ...carro.stats,
            score:
              (Number(carro.stats.speed * 1) +
                Number(carro.stats.acceleration * 1) +
                Number(carro.stats.braking * 1) +
                Number(carro.stats.traction * 1)) /
              4,
          },
        }));

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      const newOrder = scoreOrder?.map((categoria) => {
        const veiculosOrdenados = [...categoria.carros].sort((a, b) => {
          if (Number(a.stats.score) < Number(b.stats.score)) return 1;
          if (Number(a.stats.score) > Number(b.stats.score)) return -1;
          return 0;
        });

        return {
          ...categoria,
          carros: veiculosOrdenados,
        };
      });

      CATEGORIAS_HTML = newOrder;
    }

    render();
  });
}

// Expor a função no escopo global para o HTML poder acessar
window.filtrar = filtrar;
init();
