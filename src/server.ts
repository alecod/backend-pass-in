import fastify from "fastify"
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { createEvent } from "./routes/createEvent"
import { registerForEvent } from "./routes/register-for-event";

// Corpo da requisição (requesty body)
// Parametros de busca (Search Params / Query Params) 'http://localhost/users?name=alessandro
//Parametros de rota (Route Params) -> identificação de recursos DELETE 'http://localhost/users/5'
// Cabeçalhos (Headers) -> Contexto

// 200 => Sucesso 
// 300 => Redirect
// 400 => Erro do client(Erro em alguma informação enviada por quem está fazendo a chamada para a api) 
// 500 => Erro do servidor (Um erro que está acontecendo INDEPENDENTE do que está sendo enviado para o servidor)

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)

app.listen({
  port: 3333
}).then(() => {console.log('Servidor Rodando')})