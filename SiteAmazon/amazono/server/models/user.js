const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

//eviter les erreurs passwords encoder
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const UserSchema = new Schema(
    {
        email: {type: String, unique:true, 
            lowercase: true},
            name:String,
            password: String,
            picture: String,
            isSeller: {type: Boolean,default: false},
            address: {
                addr1: String,
                addr2:String,
                city:String,
                state: String,
                country: String,
                postalCode: String
            },
            created: {type: Date, default: Date.now }
    });
    //cryptage du mot de passe
    UserSchema.pre('save',function(next){
        var user =this;
        if(!user.isModified('password')) return next();

        bcrypt.hash(user.password,null,null, function(err,hash){
            if(err) return next (err);
            user.password=hash;
            next();
        });
    });
    //comparaison password entré avec celui qu serveur

    UserSchema.methods.comparePassword=function(password){
        return bcrypt.compareSync(password, this.password);
    };
    //fonction qui permet de générer un avatar lorsqu'un utilisateur se connectera gravatar est une api qui permet de générer les imaages

    UserSchema.methods.gravatar= function(size){
        if(!this.size) size=200;
        if(!this.email){
            return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
        } else{
            var md5 = crypto.createHash('md5').update(this.email).digest('hex'); 
            return 'https://gravatar.com/avatar/' + md5 + '?s'+ size + '&d=retro';
        }
       
    }
    module.exports =mongoose.model('User',UserSchema);