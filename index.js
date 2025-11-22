let CATEGORIAS_HTML = [];

function getCategories() {
  return fetch("./carros_gta_online.json")
    .then((response) => response.json())
    .then(({ carros }) => {
      const categorias = [];

      carros?.forEach((carro) => {
        const categoriaIndex = categorias.findIndex(
          (categoria) => categoria.nome === carro.categoria
        );

        if (categoriaIndex === -1) {
          categorias.push({
            nome: carro.categoria,
            carros: [carro],
          });
        } else {
          categorias[categoriaIndex].carros.push(carro);
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
    console.error("Elemento #cars não encontrado!");
    return;
  }

  carsContainer.innerHTML = "";

  console.log("Renderizando categorias:", CATEGORIAS_HTML);

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

  <div class="card-header">
   <h2>${carro.nome}</h2>
    <span>Colocação: ${index + 1}</span>
  </div/>

  
 <img src="${carro.imagem}" alt="${carro.nome}" />


   
    <table>
    
    <tr>
    <th>Especificação</th>
    <th>Valor</th>
    </tr>

    <tr>
    <td>Velocidade</td>
    <td>${carro.stats.speed}</td>
    </tr>

    <tr>
    <td>Aceleração</td>
    <td>${carro.stats.acceleration}</td>
    </tr>

    <tr>
    <td>Frenagem</td>
    <td>${carro.stats.braking}</td>
    </tr>

     <tr>
    <td>Tração</td>
    <td>${carro.stats.traction}</td>
    </tr>


     <tr>
    <td>Pontuação</td>
    <td>${carro.stats.score || "N/A"}</td>
    </tr>



    
    </table>
    <a href="${carro.url}" target="_blank">Mais detalhes</a>
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
        "Formula aplicada: Ordenado em ordem alfabética pelo nome do veículo.";

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
        "Formula aplicada: Ordenado do veículo com maior VELOCIDADE para o veículo com menor VELOCIDADE.";

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
        "Formula aplicada: Ordenado do veículo com maior ACELERAÇÃO para o veículo com menor ACELERAÇÃO.";

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
        "Formula aplicada: Ordenado do veículo com maior FRENAGEM para o veículo com menor FRENAGEM.";

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
        "Formula aplicada: Ordenado do veículo com maior TRACAO para o veículo com menor TRACAO.";

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
        "Formula aplicada: (Velocidade * 1) + (Aceleração * 1.25) + (Frenagem * 1.3) + (Tração * 1.45) para definir o melhor carro em curvas.";

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
        "Formula aplicada: (Velocidade * 1.6) + (Aceleração * 1.4) + (Frenagem * 1) + (Tração * 1) para definir o melhor carro em retas.";

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
        "Formula aplicada: (Velocidade * 1) + (Aceleração * 1.25) + (Frenagem * 1.25) + (Tração * 1.5) para definir o melhor carro em dirigibilidade.";

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
        "Formula aplicada: (Velocidade + Aceleração + Frenagem + Tração) / 4 para definir o melhor carro equilibrado.";

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
