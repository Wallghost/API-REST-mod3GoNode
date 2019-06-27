const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

/**
 * A função promisify do util do NodeJS, ela recebe uma função que
 * recebe o padrão antigo de callback e devolve uma função com o novo padrão  
 */
const { promisify } = require('util'); 

module.exports = async (req, res, next) => {
    // A numeração do nosso token, fica na parte de headers da requisição
    const authHeader = req.headers.authorization;

    console.log(authHeader);

    // Verificamos se o token veio está junto da requisição 
    if (!authHeader) {
        // O erro 400 é o Bad Request
        return res.status(400).json({ error: 'No token provided' });
    }

    // Aqui dividimos o token, pois ele vem como Bearer: "numero do token"
    const parts = authHeader.split(' ');

    // Verificamos se o nosso array do token possui duas partes
    if (!parts.length === 2) {

        // O erro 401 é o Unauthorized
        return res.status(401).json({ error: 'Token error' });
    }
    
    const [ scheme, token ] = parts;

    // Verificamos se o scheme realmente saiu como Bearer
    if (scheme !== 'Bearer') {
        return res.status(401).json({ error: 'Token malformatted' });
    }

    try {
        // Aqui mandamos a função verify do jwt para o promisify
        // Primeiros parenteses a funcão à ser "transformada",
        // Os próximos parenteses são os parametros da função "transformada"         
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        
        /**
         * O decoded trará três registros em um objeto:
         * id, iat e exp.
         * 
         * O id será o id do usuário que está logando, esse id está vindo do model,
         * no método generateToken, quando passamos o id do usuário.
         * 
         * O iat é quando o token foi criado e o exp a data de expiração do mesmo
         */
        //console.log(decoded);

        // Assim daremos acesso ao id
        req.userId = decoded.id;

        return next();

    } catch (err) {
        return res.status(401).json({ error: 'Error Token Invalid '});
    }
};