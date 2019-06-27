const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
    async follow(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            // Primeiramente, fazemos uma verificação se o usuário existe
            if (!user){
                return res.status(400).json({ error: 'User does not exists'});
            }

            // Se existir, vemos se o usuário que quer seguir, já segue o outro usuário
            if (user.followers.indexOf(req.userId) !== -1) {
                return res.status(400).json({ error: `You're already following ${user.username}`});
            }

            // Passando por todas as verificações, inserimos o id do user logado no array de 
            // seguidores do usuário requerido
            user.followers.push(req.userId);
            await user.save();

            // Como o MongoDB, não tem a parte de relacionamento bem definida,
            // inserimos aqui o id do usuário à ser seguido no array de following 
            // do usuário logado, fazendo um apontamento entre os IDs
            const me = await User.findById(req.userId);
            me.following.push(user.id);
            await me.save();

            return res.json(me);

        } catch (err) {
            return next(err); 
        } 
    },

    async unfollow(req, res, next) {
        try {
            const user = await User.findById(req.params.id);

            // Primeiramente, fazemos uma verificação se o usuário existe
            if (!user){
                return res.status(400).json({ error: 'User does not exists'});
            }

            const following = user.followers.indexOf(req.userId);

            // Se existir, vemos se o usuário que quer parar de seguir, já não segue o outro usuário
            if (following === -1) {
                return res.status(400).json({ error: `You're not following ${user.username}`});
            }

            user.followers.splice(following, 1);
            await user.save();

            const me = await User.findById(req.userId);
            me.following.splice(me.following.indexOf(user.id), 1);
            await me.save();

            return res.json(me);
        } catch (err) {
            return next(err); 
        } 
    }
}