const Discord = require("discord.js")     
const client = new Discord.Client();      
const ayarlar = require("./config.js")   
const fs = require("fs");                
require('./util/Loader.js')(client);    

client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection();  
fs.readdir('./commands/', (err, files) => { 
  if (err) console.error(err);               
  console.log(`${files.length} komut yüklenecek.`); 
  files.forEach(f => {                       
    let props = require(`./commands/${f}`);   
    console.log(`${props.config.name} komutu yüklendi.`); 
     
    client.commands.set(props.config.name, props); 
    props.config.aliases.forEach(alias => {          
      client.aliases.set(alias, props.config.name);  
    });
  });
})

client.on("message", async message => {
  const cdb = require("orio.db");
  const data = cdb.get(`novadesteksystem${message.guild.id}`)
  const { MessageEmbed } = require('discord.js')
  if (message.author.bot) return;
  var rprefix = ayarlar.prefix
  const prefix = rprefix;
  if(!data.kanal) return
  const channel = message.guild.channels.cache.get(data.kanal)
  const destekRole = data.rol;

  const destekSystem = cdb.get(`destek.${message.guild.id}`) || 0;

  var online = [];
  message.guild.members.cache.forEach(member => {
      if (member.presence.status !== 'offline') {
          if (member.roles.cache.has(destekRole)) {
              online.push(member.user)
          }
      }
  });

  if (message.channel.id === channel.id) {
  
  message.delete();
      var category = message.guild.channels.cache.find(x => x.name === "Destek-Sistemi");
      var everyoneRole = message.guild.roles.cache.find(x => x.name === "@everyone");

      if (message.guild.channels.cache.find(x => x.name == "Destek-Sistemi")) {
          message.guild.channels.create(`destek-talep-${destekSystem}`, {
              type: "text",
              parent: category.id,
              permissionOverwrites: [
                  {
                      id: everyoneRole.id,
                      deny: ['VIEW_CHANNEL'],
                  },
                  {
                      id: message.author.id,
                      allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
                      deny: ["ADD_REACTIONS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "MENTION_EVERYONE", "MANAGE_MESSAGES", "SEND_TTS_MESSAGES", "USE_EXTERNAL_EMOJIS"]
                  },
                  {
                      id: destekRole,
                      allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES"],
                      deny: ["ADD_REACTIONS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "MENTION_EVERYONE", "SEND_TTS_MESSAGES", "USE_EXTERNAL_EMOJIS"]
                  },
              ]
          }).then(nova => {
              let embeds = new MessageEmbed()
                  .setAuthor(`${message.guild.name} Destek Sistemi`, message.guild.iconURL({ dynamic: true }))
                  .setColor("RANDOM")
                  .setDescription(`Kullanıcının sorunu: ${message.content}\nMerhaba aktif olan yetkililer seninle ilgilenecektir!`)
                  .setFooter(`Destek Açılma Zamanı:`)
                  .setTimestamp()
              nova.send(`Heyy! ${message.author} \n\nÇevrimiçi Yetkililer: ${online.join(", ") || `Hiç bir yetkili aktif durumda değil.`}`, embeds)
          });
      } else {
          message.guild.channels.create('Destek-Sistemi', {
              type: "category",
              permissionOverwrites: [
                  {
                      id: everyoneRole.id,
                      deny: ['VIEW_CHANNEL'],
                  },
              ]
          }).then(x => {
              message.guild.channels.create(`destek-talep-${destekSystem}`, {
                  type: "text",
                  parent: x.id,
                  permissionOverwrites: [
                      {
                          id: everyoneRole.id,
                          deny: ['VIEW_CHANNEL'],
                      },
                      {
                          id: message.author.id,
                          allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
                          deny: ["ADD_REACTIONS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "MENTION_EVERYONE", "MANAGE_MESSAGES", "SEND_TTS_MESSAGES", "USE_EXTERNAL_EMOJIS"]
                      },
                      {
                          id: destekRole,
                          allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES"],
                          deny: ["ADD_REACTIONS", "MANAGE_CHANNELS", "MANAGE_WEBHOOKS", "CREATE_INSTANT_INVITE", "MENTION_EVERYONE", "SEND_TTS_MESSAGES", "USE_EXTERNAL_EMOJIS"]
                      },
                  ],
              }).then(nova => {
                  let embeds = new MessageEmbed()
                      .setAuthor(`${message.guild.name} Destek Sistemi`, message.guild.iconURL({ dynamic: true }))
                      .setColor("RANDOM")
                      .setDescription(`Kullanıcının sorunu: ${message.content}\nMerhaba aktif olan yetkililer seninle ilgilenecektir!`)
                      .setFooter(`Destek Açılma Zamanı:`)
                      .setTimestamp()
                  nova.send(`Heyy! ${message.author} \n\nÇevrimiçi Yetkililer: ${online.join(", ") || `Hiç bir yetkili aktif durumda değil.`}`, embeds)
              })
          })
      }
  }
})


client.login(config.token)
