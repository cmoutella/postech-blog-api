# School Blog

Este projeto foi desenvolvido com [Nest.JS](https://nestjs.com/) como trabalho final do módulo na [Pós Tech da FIAP](https://postech.fiap.com.br/).

### Integrantes do Grupo
Carolina,
Jéssica,
Thiago,
Arthur,



# Preparando o ambiente

Para rodar este projeto você deve ter a versão do node >18.

## Instalando as dependências

```yarn install```
ou
```npm i```

## Para rodar o projeto

```yarn start```
ou
```npm start```

## Docker
É necessário ter o ambiente docker rodando localmente.

```yarn docker:up```
ou
```npm run docker:up```


# Rotas
 _TODO_
Veja a documentação completa das rotas com Swagger
```yarn swagger```


## Rotas privadas
Algumas rotas da aplicação são privadas (ex.: criação de posts), para ter acesso a funcionalidade é necessário incluir o token da autenticação nos Headers da requisição.


Para gerar o token, faça o login pela rota ```users/login```

_(TODO)_ Utilize nosso usuário padrão:
```
username: admin
password: admin
```

Ou crie um novo usuário na rota ```/users```


Em seguida adicione o token retornado no header para requisições em rotas privadas.
A autenticação ficará válida por até 15 minutos.