# Simple WEB History

Estrutura inicial para o minicurso de Node.js do CCTEC 2017

## Instalação

```sh
git clone https://github.com/EstevanLJ/simple-web-history-start
cd simple-web-history-start
npm install
cp database.sqlite.example database.sqlite
```

Queries

const query = `SELECT site.*, historico_site.status
    FROM site
    LEFT JOIN historico_site ON historico_site.site_id = site.id
    GROUP BY site.id ORDER BY site.id`;
   
    
const query = `SELECT * FROM historico_site WHERE site_id = ${id} ORDER BY id DESC LIMIT 10`;
    
    
INSERT INTO site (nome, url) VALUES ('${site.nome}', '${site.url}');
