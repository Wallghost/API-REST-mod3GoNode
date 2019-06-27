const mongoose = require('mongoose');


const Tweet = mongoose.model('Tweet');
const User= mongoose.model('User');

module.exports = {
    async me(req, res, next){
        try {
            const user = await User.findById(req.userId);
            const tweetsCount = await Tweet.find({ user: user.id }).count();

            return res.json({
                user,
                tweetsCount,
                followersCount: user.followers.length,
                followingCount: user.following.length,
            });

        } catch (err){
            return next(err);
        }
    },

    async feed(req, res, next) {
        try {
            const user = await User.findById(req.userId);
            const { following } = user;

            const tweets = await Tweet.find({
                user: { $in: [user.id, ...following] },
            })
            .limit(50)
            .sort('-createdAt'); // -createdAt é similar ao DESC no SQL

            return res.json(tweets);
        } catch(err) {
            return next(err);
        }
    },

    async update(req, res, next) {
        try{
            const id = req.userId;

            const { 
                name, 
                username, 
                password, 
                confirmPassword } = req.body;

            if (password && password !== confirmPassword) {
                return res.status(400).json({ error: 'Passwords does not match'});
            }

            // Por que estou colocando o new: true ali?
            // Pois iremos retornar o objeto user com o name e username já atualizado,
            // Se passarmos o new: false, o objeto não irá vir com os dados atualizados
            const user = await User.findByIdAndUpdate(id, { name, username }, { new: true });

            // Aqui forçamos o hook para criptografar a senha, pois se só inserirmos o campo de senha
            // Simplesmente no objeto, ele não fará a criptografia.  
            if (password) {
                user.password = password;
                await user.save();
            }

            return res.json(user);
        } catch (err){
            return next(err);
        }
    },
}