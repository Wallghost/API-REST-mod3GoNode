const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    following:[{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

// Usando um hook para criptografar a senha do usuário antes de salvar no MongoDB
userSchema.pre('save', async function hashPassword(next){
    if (!this.isModified('password')) next();

    this.password = await bcrypt.hash(this.password, 8);
});

userSchema.methods = {
    compareHash(password) {
        return bcrypt.compare(password, this.password);
    },

    generateToken(){
        return jwt.sign({ id: this.id }, authConfig.secret,{
            expiresIn: 86400, // expirará em 1 dia, o date tem que ser em segundo e não milisegundos        
        });
    }
};

mongoose.model('User',userSchema);