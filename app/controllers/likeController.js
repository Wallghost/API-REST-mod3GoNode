const mongoose = require('mongoose');

const Tweet = mongoose.model('Tweet');

module.exports = {
    async toggle(req, res, next) {
        try {
            const tweet = await Tweet.findById(req.params.id);

            if (!tweet) {
                return res.status(400).json({ error: 'Tweet does not exist'});            
            }

            // Aqui verificamos se o usuário que está logado na sessão, já 
            // Deu like no tweet, o indexOf busca a posição de um elemento em um array
            const liked = tweet.likes.indexOf(req.userId);

            /**
             * O indexOf se não encontrar o elemento no vetor, ele irá retornar -1.
             * Nessa verificação, caso o id não esteja no array, iremos inseri-lo lá,
             * porém se já existe, iremos remove-lo do array.
             * 
             * Usando o splice(): aqui passamos o índice que virá na variável tweet e no próximo
             * parâmetro falamos quantos elementos queremos remover, nesse caso somente 1
             */
            if (liked === -1) {
                tweet.likes.push(req.userId);
            } else {
                tweet.likes.splice(liked, 1);
            }

            await tweet.save();

            return res.json(tweet);

        } catch (err) {
            return next(err);
        }
    }
};