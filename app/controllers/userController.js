const mongoose = require('mongoose');

const User= mongoose.model('User');

module.exports = {
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