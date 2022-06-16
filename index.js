const readline = require('readline');
const urlExist = url => new Promise(r=>import('url-exist').then(e=>r(e.default(url))));

const { readFileSync, writeFileSync } = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask() {
  return new Promise((e) => {
    rl.question(arguments[0], e)
  })
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * (this.length - 0) + 0)]
};

const repeat = (times, func, domains = []) => {
  return new Promise(async (e) => {
    for (var x = 0;x<times;x++) {
      var a = await func()
      console.log(a, 'Checked: #'+(x+1))
      domains.push(a)
    }
    e(domains)
  })
}

function empty() {
  
}

;(async () => {
  var extensions = await ask('Enter your preffered domain extensions seperated by commas.\nEX: ".com,.net,.xyz"\n');
  var number = await ask('Enter your preffered number of extensions to generate.');
  
  extensions = eval(`[${extensions.split(',').map(e=>`"${e.replace(' ','')}"`)}]`)
  var one = ['hub','space','academy','club','school','learning','blog','help', 'algebra', 'physical', 'physics', 'home', 'cheap', 'facts']
  var two = JSON.parse(readFileSync('./index.json'))

  var domains = [];

  repeat(parseInt(number)||1, async function() {
    return new Promise(async (e) => {
      var domain = 'https://'+two.random()+one.random()+extensions.random();

      if (!(await urlExist(domain))) e(domain)

      var int = setInterval(async function() {
        domain = domain.split('.')[0]+extensions.random();
        if (!(await urlExist(domain))){clearInterval(int);e(domain)}
        
      }, 100)
      
    
    })
  }).then(e => {
    writeFileSync('./found.json', JSON.stringify(e))
    console.log('Results Logged to found.json')
  })
})()