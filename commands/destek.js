const Discord = require('discord.js');
const db = require('orio.db');
const ayarlar = require('../config.js')

exports.run = async(client, message, args) => {

    var prefix = ayarlar.prefix
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
    const kanal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) 
    if (!args[0]) return message.channel.send(new Discord.MessageEmbed() .setDescription(`Örnek kullanım: \`${prefix}destek #Destek_kanalı @Yetkili_rol\``))
    if(!rol) return message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(":x: Kurulum Başarısız!")
      .setDescription("Lütfen bir rol etiketle!")
      .setColor("RED")
    )
    const embed = new Discord.MessageEmbed()
    .setTitle('Destek Sistemi')
    .setDescription(`Destek sistemi başarıyla açıldı!\n\nDestek Kanalı: ${kanal}\n\nYetkili Rol: ${rol}`)
    .setColor('RANDOM')
    db.set("novadesteksystem"+message.guild.id, {kanal: kanal.id, rol: rol.id})
    message.react('✔️')
    message.channel.send(embed)
}

exports.conf = {
    aliases: [],
};

exports.help = {
    name: "destek",
};